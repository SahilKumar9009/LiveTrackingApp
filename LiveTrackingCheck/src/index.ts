import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ status: "Server is running", timestamp: new Date().toISOString() });
});

// HTTP endpoint to receive location from mobile app
app.post("/location", (req, res) => {
  const locationData = req.body;
  console.log("📍 Received location:", locationData);

  // Broadcast to all connected Socket.io clients (web dashboard)
  io.emit("receive-location", locationData);

  res.json({ success: true, timestamp: Date.now() });
});

// Socket.io for web clients (dashboard)
io.on("connection", (socket) => {
  console.log("🌐 Web client connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("Web client disconnected");
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📱 Mobile app should POST to: http://192.168.0.54:${PORT}/location`);
  console.log(`🌐 Web clients can connect via Socket.io`);
});
