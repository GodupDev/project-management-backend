import express from "express";

import dotenv from "dotenv";
import jwt from "jsonwebtoken";

import UsersModel from "../models/main/users.model.js";

dotenv.config();

const router = express.Router();
/*
  decs: đăng kí users mới với username, email(unique), password
  route: POST /users/register
  access: Public
*/
router.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({
        message: "All fields are required!. Include: username, email, password",
      });
    }

    const existedUser = await UsersModel.findOne({ email: email });
    if (existedUser) {
      return res.status(400).json({ message: "Email already exists!" });
    }

    const newUser = new UsersModel({
      userName: username,
      email: email,
      password: password,
    });

    await newUser.save();
    return res
      .status(201)
      .json({ message: "User registered successfully!", data: newUser });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal Server Error", errorLog: error.message });
  }
});

/*
  decs: đăng nhập với  email, password
  route: POST /users/login
  access: Public
*/
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        message: "All fields are required!. Include: email, password",
      });
    }

    const user = await UsersModel.findOne({ email: email });
    if (!user || (await user.comparePassword(password)) === false) {
      return res.status(400).json({ message: "Invalid email or password!" });
    }

    const token = jwt.sign(user.toJSON(), process.env.JWT_SECRET_KEY, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });

    const apiKey = `mern-$${user._id}$-$${user.email}$-$${token}$`;
    return res.status(200).json({
      message: "Login successful!",
      data: {
        userId: user._id,
        userName: user.userName,
        email: user.email,
        apiKey: apiKey,
      },
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Internal Server Error", errorLog: error.message });
  }
});

export default router;
