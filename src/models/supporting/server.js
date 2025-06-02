import express from "express";
import dotenv from "dotenv";

import connectDB from "./src/config/db.js";
import app from "./src/index.js";

dotenv.config();
connectDB();

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`Server is running 
    at ${process.env.ENV || "development"} mode
    on port ${PORT}`);
});