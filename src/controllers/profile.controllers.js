// Profile APIs
// GET /profile/:profileId – Lấy thông tin hồ sơ người dùng theo userId
// Phân quyền: là thành viên của một project bất kì


// PATCH /profile – Cập nhật hồ sơ cá nhân
// PATCH /profile/password – Đổi mật khẩu

import UsersModel from "../models/users.js";

dotenv.config();

const postController = {
  createNewPost: async (req, res) => {
    try {
      const { apiKey } = req.query;
      const { userId, content } = req.body;

      // Kiểm tra bắt buộc các trường
      if (!apiKey || !userId || !content) {
        return res.status(400).json({
          message:
            "Missing required fields: apiKey (query), userId, content (body)",
        });
      }

      const userIdFromApiKey = await getUserId(apiKey);

      const user = await UsersModel.findById(userIdFromApiKey);
      if (!user) {
        return res
          .status(403)
          .json({ message: "Unauthorized: Invalid apiKey or user" });
      }

      if (!user._id.equals(userId)) {
        return res
          .status(403)
          .json({ message: "You only be posted your post" });
      }
      // Tạo post mới
      const newPost = await PostModel.create({
        userId,
        content,
      });

      return res.status(201).json({
        message: "Post created successfully",
        data: newPost,
      });
    } catch (error) {
      return res.status(500).json({
        message: "Internal Server Error",
        error: error.message,
      });
    }
  },

  editPost: async (req, res) => {
    try {
      const { apiKey } = req.query;
      const postId = req.params.id;
      const { content } = req.body;
      console.log(apiKey, postId, content);

      // Kiểm tra bắt buộc các trường
      if (!apiKey || !postId || !content) {
        return res.status(400).json({
          message:
            "Missing required fields: apiKey (query), postId (params), content (body)",
        });
      }

      const post = await PostModel.findById(postId);
      if (!post) {
        return res.status(404).json({ message: "Post not found" });
      }

      const userIdFromApiKey = await getUserId(apiKey);
      const user = await UsersModel.findById(userIdFromApiKey);
      if (!user) {
        return res
          .status(403)
          .json({ message: "Invalid apiKey or user not found" });
      }

      if (!user._id.equals(post.userId)) {
        return res
          .status(403)
          .json({ message: "You are not authorized to edit this post" });
      }

      //Chỉnh sửa bài post
      post.content = content;
      post.updatedAt = new Date();

      await post.save();

      return res.status(200).json({
        message: "Post updated successfully",
        data: post,
      });
    } catch (error) {
      return res.status(500).json({
        message: "Internal Server Error",
        error: error.message,
      });
    }
  },
};

export default postController;
