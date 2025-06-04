import express from 'express';
import mongoose from 'mongoose';
import UserModel from './models/user.model.js';

const app = express();
const PORT = 8080;

// Middleware definitions
app.use(express.json());

// Connection to mongodb
const connectToDB = async () => {
  try {
    const URI = `mongodb://localhost:27017/facebook-clone`;
    await mongoose.connect(URI);
    console.log('Database connected successfully!!!');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

//**** CRUD API for users ****

// POST
// Create new user
app.post('/users', async (req, res) => {
  const { username, email, fullname, address, gender } = req.body;

  const user = new UserModel({
    username,
    email,
    fullname,
    address,
    gender,
  });

  try {
    const createdUser = await user.save(); //insert user to db
    res.status(201).json(createdUser);
  } catch (error) {
    console.error(`[ERROR] - `, error?.message);
    res.status(400).json({
      message: error.message,
    });
  }
});

// GET
// Get all users
app.get('/users', async (req, res) => {
  try {
    const users = await UserModel.find();
    res.json(users);
  } catch (error) {
    console.error(`[ERROR] - `, error?.message);
    res.status(400).json({
      message: error.message,
    });
  }
});

// GET
// Get single user
app.get('/users/:id', async (req, res) => {
  const userId = req.params.id;

  try {
    const user = await UserModel.findById(userId);

    if (!user) {
      return res.status(400).json({
        message: 'User not found',
      });
    }
    res.json(user);
  } catch (error) {
    console.error(`[ERROR] - `, error?.message);
    res.status(400).json({
      message: error.message,
    });
  }
});

// Start the server after connecting to the database
const startServer = async () => {
  await connectToDB();
  app.listen(PORT, () => {
    console.log(`Server is running at PORT ${PORT}`);
  });
};

startServer();