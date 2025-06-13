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
};

export default userProfileController;