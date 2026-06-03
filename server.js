const express = require("express");
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http, {
  cors: { origin: "*" }
});

io.on("connection", (socket) => {
  // L'Hôte crée la salle
  socket.on("create_room", (roomCode) => {
    socket.join(roomCode);
  });

  // L'Invité rejoint la salle et prévient l'Hôte
  socket.on("join_room", (roomCode) => {
    socket.join(roomCode);
    socket.to(roomCode).emit("guest_joined");
  });

  // Le Serveur relaie les actions de jeu (attaques, soins...)
  socket.on("game_message", (data) => {
    socket.to(data.room).emit("game_message", data.message);
  });
});

const PORT = process.env.PORT || 3000;
http.listen(PORT, () => {
  console.log("Le Serveur du Bestiario est en ligne !");
});
