import UserProfileModel from "../models/main/userProfiles.model.js";
import { validationResult } from "express-validator";

const userProfileController = {
  // Get user profile by userId
  getUserProfile: async (req, res) => {
    try {
      const { userId } = req.params;

      const profile = await UserProfileModel.findOne({ userId }).populate(
        "userId",
        "email username",
      );

      if (!profile) {
        return res.status(404).json({
          success: false,
          message: "User profile not found",
        });
      }

      return res.status(200).json({
        success: true,
        data: profile,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Failed to get user profile",
        error: error.message,
      });
    }
  },

  // Create or update user profile
  updateUserProfile: async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const userId = req.user._id;
      const {
        fullName,
        bestPosition,
        location,
        contactNumber,
        avatarUrl,
        bio,
        socialLinks,
      } = req.body;

      // Find existing profile or create new one
      let profile = await UserProfileModel.findOne({ userId });

      if (profile) {
        // Update existing profile
        profile = await UserProfileModel.findOneAndUpdate(
          { userId },
          {
            fullName,
            bestPosition,
            contactNumber,
            avatarUrl,
            bio,
            socialLinks,
            location,
          },
          { new: true, runValidators: true },
        );
      } else {
        // Create new profile
        profile = await UserProfileModel.create({
          userId,
          fullName,
          position,
          contactNumber,
          avatarUrl,
          bio,
          socialLinks,
        });
      }

      return res.status(200).json({
        success: true,
        message: "User profile updated successfully",
        data: profile,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Failed to update user profile",
        error: error.message,
      });
    }
  },

  // Update notification settings
  updateNotificationSettings: async (req, res) => {
    try {
      const userId = req.user._id;
      const { notificationSettings } = req.body;
      
      console.log("API được gọi với userId:", userId);
      console.log("Request body:", req.body);
      console.log("Notification settings:", notificationSettings);
      
      if (!notificationSettings) {
        return res.status(400).json({
          success: false,
          message: "Thiếu dữ liệu cài đặt thông báo"
        });
      }
      
      // Tìm hoặc tạo hồ sơ người dùng
      let userProfile = await UserProfileModel.findOne({ userId });
      
      if (!userProfile) {
        // Tạo hồ sơ mới nếu chưa tồn tại
        userProfile = new UserProfileModel({
          userId,
          notificationSettings,
          fullName: req.user.username // Mặc định sử dụng username làm fullName
        });
        
        await userProfile.save();
        
        return res.status(201).json({
          success: true,
          message: "Tạo cài đặt thông báo thành công",
          data: userProfile
        });
      }
      
      // Cập nhật cài đặt thông báo cho hồ sơ đã tồn tại
      userProfile.notificationSettings = notificationSettings;
      await userProfile.save();
      
      return res.status(200).json({
        success: true,
        message: "Cập nhật cài đặt thông báo thành công",
        data: userProfile
      });
    } catch (error) {
      console.error("Error:", error);
      return res.status(500).json({
        success: false,
        message: error.message || "Lỗi server khi cập nhật cài đặt thông báo"
      });
    }
  },

  // Lưu cài đặt thông báo tuong tu update ben tren
//   saveNotificationSettings: async (req, res) => {
//     try {
//       const userId = req.user._id;
//       const { settings } = req.body;

//       if (!settings) {
//         return res.status(400).json({
//           success: false,
//           message: "Settings object is required"
//         });
//       }

//       // Cập nhật settings trong profile
//       const updatedProfile = await UserProfileModel.findOneAndUpdate(
//         { userId },
//         { notificationSettings: settings },
//         { new: true, runValidators: true }
//       );

//       if (!updatedProfile) {
//         return res.status(404).json({
//           success: false,
//           message: "User profile not found"
//         });
//       }

//       return res.status(200).json({
//         success: true,
//         message: "Notification settings saved successfully",
//         data: updatedProfile
//       });
//     } catch (error) {
//       return res.status(500).json({
//         success: false,
//         message: "Failed to save notification settings",
//         error: error.message
//       });
//     }
//   },
};

export default userProfileController;
