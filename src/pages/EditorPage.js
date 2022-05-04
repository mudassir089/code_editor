import React, { useState, useRef, useEffect } from "react";
import ACTIONS from "../Actions";
import Client from "../components/Client";
import Editor from "../components/Editor";
import { initSocket } from "../socket";
import {
  useLocation,
  useParams,
  useNavigate,
  Navigate,
} from "react-router-dom";
import toast from "react-hot-toast";

const EditorPage = () => {
  const socketRef = useRef(null);
  const codeRef = useRef(null);
  const location = useLocation();
  const { roomId } = useParams();
  const reactNavigator = useNavigate();

  const [clients, setClients] = useState([]);
  const [check, setCheck] = useState(false);

  const init = async () => {
    socketRef.current = await initSocket();
    socketRef.current.on("connect_failed", (err) => handleErrors(err));
    socketRef.current.on("connect_error", (err) => handleErrors(err));

    const handleErrors = (e) => {
      toast.error("Socket connection failed, try again later.");
      reactNavigator("/");
    };

    socketRef.current.emit(ACTIONS.JOIN, {
      roomId,
      username: location.state?.username,
    });

    //Listening for joined event
    socketRef.current.on(ACTIONS.JOINED, ({ clients, username, socketId }) => {
      if (username !== location.state?.username) {
        toast.success(`${username} joined the room`);
      }
      setClients(clients);
      socketRef.current.emit(ACTIONS.SYNC_CODE, {
        socketId,
        code: codeRef.current,
      });
    });

    //Listening for Disconnected event
    socketRef.current.on(ACTIONS.DISCONNECTED, ({ socketId, username }) => {
      toast.success(`${username} left the room`);
      setClients((pre) => {
        return pre.filter((client) => client.socketId !== socketId);
      });
    });
  };
  useEffect(() => {
    setCheck(true);
    if (check) {
      init();

      return () => {
        socketRef.current.disconnect();
        socketRef.current.off(ACTIONS.JOINED);
        socketRef.current.off(ACTIONS.DISCONNECTED);
      };
    }
  }, [check]);

  const copyRoomId = async () => {
    try {
      await navigator.clipboard.writeText(roomId);
      toast.success("Room ID has been copied to your clipboard");
    } catch (error) {
      toast.error("Could not copy the room ID");
      console.error(error);
    }
  };

  const leaveRoom = () => {
    reactNavigator("/", { replace: true });
  };
  if (!location.state) {
    <Navigate to={"/"} />;
  }

  return (
    <div className="mainWrap">
      <div className="aside">
        <div className="asideInner">
          <div className="logo">
            <img className="logoImage" src="/code-sync.png" alt="logo"></img>
          </div>
          <h3>Connected : 🟢</h3>
          <div className="clientList">
            {clients
              .filter((v) => v.username != location.state?.username)
              .map((client) => (
                <Client key={client.socketId} username={client.username} />
              ))}
          </div>
        </div>

        <button onClick={copyRoomId} className="btn copyBtn">
          Copy ROOM ID
        </button>
        <button onClick={leaveRoom} className="btn leaveBtn">
          LEAVE
        </button>
      </div>
      <div className="editorWrap">
        <Editor
          roomId={roomId}
          socketRef={socketRef}
          onCodeChange={(code) => {
            codeRef.current = code;
          }}
        />
      </div>
    </div>
  );
};

export default EditorPage;
