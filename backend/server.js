const express = require("express");
const http = require("http");
const path = require("path");
const app = express();
const { Server } = require("socket.io");
const ACTIONS = require("./Actions");

const server = http.createServer(app);
const io = new Server(server);

app.use(express.static("./view/build"));
app.use((req, res, next) => {
  res.sendFile(path.join(__dirname, "./view/build", "index.html"));
});
const userSocketMap = {};
const getAllConnectedClients = (roomId) => {
  return Array.from(io.sockets.adapter.rooms.get(roomId) || []).map(
    (socketId) => {
      return {
        socketId,
        username: userSocketMap[socketId],
        roomId,
      };
    }
  );
};

io.on("connection", (socket) => {
  console.log("socket connected", socket.id);
  //get users and join room
  socket.on(ACTIONS.JOIN, ({ roomId, username }) => {
    // console.log(roomId, username);
    userSocketMap[socket.id] = username;
    socket.join(roomId);
    const clients = getAllConnectedClients(roomId);
    clients.forEach(({ socketId }) => {
      io.to(socketId).emit(ACTIONS.JOINED, {
        clients: clients,
        username: username,
        socketId: socket.id,
      });
    });
  });

  //liseting & send code
  socket.on(ACTIONS.CODE_CHANGE, ({ roomId, code }) => {
    // console.log(code);
    socket.in(roomId).emit(ACTIONS.CODE_CHANGE, { code });
  });

  socket.on(ACTIONS.SYNC_CODE, ({ socketId, code }) => {
    // console.log(code);
    io.to(socketId).emit(ACTIONS.CODE_CHANGE, { code });
  });

  // disconnect
  socket.on("disconnecting", () => {
    const rooms = [...socket.rooms];

    rooms.forEach((roomId) => {
      socket.in(roomId).emit(ACTIONS.DISCONNECTED, {
        socketId: socket.id,
        username: userSocketMap[socket.id],
      });
    });

    delete userSocketMap[socket.id];
    socket.leave();
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Listening on port ${PORT}`));
