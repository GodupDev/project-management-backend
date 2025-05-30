import express from "express";
import setupRoutes from "./routes/index.js";
import { notFound, errorHandler } from "./middlewares/error.mdw.js";
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Internal Server Error" });
});

app.get("/", (req, res) => {
  res.send("Welcome to Project Management System server");
});
// Import các middleware và routes
setupRoutes(app);
// Middleware xử lý route không tồn tại (luôn luôn đặt sau tất cả routes)
app.use(notFound);

// Middleware xử lý lỗi chung (luôn luôn đặt cuối cùng)
app.use(errorHandler);
export default app;