import React, { useEffect, useRef, useState } from "react";
import CodeMirror from "codemirror";
import "codemirror/lib/codemirror.css";
import "codemirror/mode/javascript/javascript";
import "codemirror/theme/dracula.css";
import "codemirror/addon/edit/closetag";
import "codemirror/addon/edit/closebrackets";
import ACTIONS from "../Actions";

const Editor = ({ roomId, socketRef, onCodeChange }) => {
  const editorRef = useRef(null);

  const [check, setCheck] = useState(false);
  const init = async () => {
    editorRef.current = CodeMirror.fromTextArea(
      document.getElementById("realtimeEditor"),
      {
        mode: { name: "javascript", json: true },
        theme: "dracula",
        autoCloseTags: true,
        autoCloseBrackets: true,
        lineNumbers: true,
      }
    );

    editorRef.current.on("change", (instance, changes) => {
      const { origin } = changes;
      const code = instance.getValue();
      onCodeChange(code);
      if (origin !== "setValue") {
        socketRef.current.emit(ACTIONS.CODE_CHANGE, {
          roomId,
          code,
        });
      }
    });
  };
  useEffect(() => {
    setCheck(true);
    if (check) {
      init();
    }
  }, [check]);

  socketRef?.current?.on(ACTIONS.CODE_CHANGE, ({ code }) => {
    if (code !== null) {
      editorRef.current.setValue(code);
    }
  });

  return (
    <>
      <textarea id="realtimeEditor"></textarea>
    </>
  );
};

export default Editor;
