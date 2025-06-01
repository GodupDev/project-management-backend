import express from "express";
import mainRoutes from "./routes/index.routes.js";
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/", mainRoutes);

app.get("/", (req, res) => {
  res.send("Welcome to Project Management System server");
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Internal Server Error" });
});

export default app;
