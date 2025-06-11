import express from "express";
import cors from "cors";
import mainRoutes from "./routes/index.routes.js";

const app = express();

// Middleware
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api", mainRoutes);
// Health check route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to Project Management System server" });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: "Internal Server Error",
    error: process.env.NODE_ENV === "development" ? err.message : undefined,
  });
});

export default app;
