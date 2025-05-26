import express from "express";
import dotenv from "dotenv";
import mainRoute from "./src/routes/index.js";
import connectDB from "./src/config/db.js";
import app from "./src/index.js";


dotenv.config();
app.use('/', mainRoute)
connectDB();

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running 
    at ${process.env.ENV || "development"} mode
    on port ${PORT}`);
});
