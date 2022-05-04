import React, { useState, useEffect } from "react";
import { v4 as uuid } from "uuid";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
const LoinPage = () => {
  const navigate = useNavigate();
  const [roomId, setRoomId] = useState("");
  const [userName, setUserName] = useState("");

  //   const createNewRoom = (e) => {
  //     e.preventDefault();
  //     const id = uuid();
  //     setRoomId(id);
  //     toast.success("Created a new room");
  //   };
  //   const joinRoom = () => {
  //     if (!roomId || !userName) {
  //       toast.error("ROOM ID & username is required");
  //       return;
  //     } else if (userName.length <= 5) {
  //       toast.error("username min length is five");
  //       return;
  //     }

  //     navigate(`/editor/${roomId}`, {
  //       replace: true,
  //       state: {
  //         username: userName,
  //       },
  //     });
  //   };

  const handleInputEnter = (e) => {
    if (e.code === "Enter") {
      // joinRoom();
    }
  };
  return (
    <div className="homePageWrapper">
      <div className="formWrapper">
        <img className="homePageLogo" src="/code-sync.png" alt="logo" />
        <h4 className="mainLabel">Pase invitation ROOM ID</h4>
        <div className="inputGroup">
          <input
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
            type="text"
            className="inputBox"
            placeholder="Email"
            onKeyUp={handleInputEnter}
          />

          <input
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            type="password"
            className="inputBox"
            placeholder="Password"
            onKeyUp={handleInputEnter}
          />
          <button className="btn joinBtn">Join</button>
          <span className="createInfo">
            If you don't have an invite then create &nbsp;
            <a href="" className="createNewBtn">
              New Room
            </a>
          </span>
        </div>
      </div>
      <footer>
        <h4>
          Built with 💛 by{" "}
          <a href="https://github.com/mudassir089">Muhammad Mudassir</a>
        </h4>
      </footer>
    </div>
  );
};

export default LoinPage;
