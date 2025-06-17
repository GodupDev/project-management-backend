import express from "express";
import cors from "cors";
import mainRoutes from "./routes/index.routes.js";

const app = express();

// Middleware
// In your main server file (usually app.js or index.js)
// Enable CORS with specific options
app.use(
  cors({
    origin: "*", // or '*' to allow all origins
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
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
