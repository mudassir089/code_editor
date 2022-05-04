import React from "react";
import Avatar from "react-avatar";
const Client = ({ username }) => {
  // const userName = [];
  // username.split(" ").forEach((v, i) => {
  //   userName.push(v.slice(0, 1));
  // });

  return (
    <div className="client">
      <Avatar name={username ? username : "Unknown"} size={50} round="14px" />
      <span className="userName">{username ? username : "U N"}</span>
    </div>
  );
};

export default Client;
