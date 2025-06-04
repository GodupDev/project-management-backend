import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import { users } from './data.js';

const app = express();
const PORT = 3000;

app.use(express.json());

app.get('/users', (req, res) => {
    res.json(users);
  });
  
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });

// 1. API lấy thông tin user theo id
app.get("/users/:id", (req, res) => {
  const user = users.find(u => u.id === req.params.id);
  if (!user) return res.status(404).json({ message: "User not found" });
  res.json(user);
});

// 2. API tạo user (email phải duy nhất)
app.post("/users", (req, res) => {
  const { name, email } = req.body;
  const emailExists = users.some(u => u.email === email);
  if (emailExists) return res.status(400).json({ message: "Email already exists" });

  const newUser = { id: uuidv4(), name, email };
  users.push(newUser);
  res.status(201).json(newUser);
});

// 3. API lấy bài post của user theo userId
app.get("/users/:userId/posts", (req, res) => {
  const userPosts = posts.filter(p => p.userId === req.params.userId);
  res.json(userPosts);
});

// 4. API tạo post theo userId
app.post("/users/:userId/posts", (req, res) => {
  const { content, isPublic } = req.body;
  const userExists = users.some(u => u.id === req.params.userId);
  if (!userExists) return res.status(404).json({ message: "User not found" });

  const newPost = {
    id: uuidv4(),
    userId: req.params.userId,
    content,
    isPublic: !!isPublic,
  };
  posts.push(newPost);
  res.status(201).json(newPost);
});

// 5. API cập nhật bài post, chỉ cho phép user tạo mới được sửa
app.put("/posts/:postId", (req, res) => {
  const { postId } = req.params;
  const { userId, content, isPublic } = req.body;

  const post = posts.find(p => p.id === postId);
  if (!post) return res.status(404).json({ message: "Post not found" });

  if (post.userId !== userId)
    return res.status(403).json({ message: "Not allowed to update this post" });

  post.content = content ?? post.content;
  post.isPublic = isPublic ?? post.isPublic;

  res.json(post);
});

// 6. API xoá bài post, chỉ user tạo mới được xoá
app.delete("/posts/:postId", (req, res) => {
  const { postId } = req.params;
  const { userId } = req.body;

  const postIndex = posts.findIndex(p => p.id === postId);
  if (postIndex === -1) return res.status(404).json({ message: "Post not found" });

  if (posts[postIndex].userId !== userId)
    return res.status(403).json({ message: "Not allowed to delete this post" });

  posts.splice(postIndex, 1);
  res.json({ message: "Post deleted" });
});

// 7. API tìm kiếm bài post theo content
app.get("/posts/search", (req, res) => {
  const { content } = req.query;
  const result = posts.filter(p => p.content.toLowerCase().includes(content.toLowerCase()));
  res.json(result);
});

// 8. API lấy tất cả bài post có isPublic === true
app.get("/posts", (req, res) => {
  const publicPosts = posts.filter(p => p.isPublic);
  res.json(publicPosts);
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
