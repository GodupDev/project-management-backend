import { createServer } from "http";
import { Server } from "socket.io";
import dotenv from "dotenv";
import connectDB from "./src/config/db.config.js";
import app from "./src/index.src.js";

dotenv.config();
connectDB();

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*", // Cho phép tất cả các origin trong môi trường development
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  },
});

// Store io instance in app for use in controllers
app.set("io", io);

// Socket.IO connection handling
io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

const PORT = process.env.PORT || 8000;
httpServer.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});
