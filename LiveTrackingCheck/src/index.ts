import express from "express";
import http from "http";
import { Server } from "socket.io";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.get("/", (req, res) => {});

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  socket.on("send-location", (data) => {
    console.log("in teh data", data);
    io.emit("receive-location", { id: socket.id, ...data });
  });

  socket.on("receive-location", (data) => {
    console.log("Received location:", data);
  });
  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log("the Serveer is Runninon th eport", PORT);
});
