import UserModel from "../models/main/users.model.js";

export const userController = {
    // Lấy tất cả user
    // GET http://localhost:8000/users
    getAllUsers: async (req, res, next) => {
        try {
            const { page = 1, limit = 20, sortBy = 'createdAt', sortOrder = 'desc', q } = req.query;
            const pageNum = parseInt(page);
            const limitNum = parseInt(limit);

            let query = {};
            if (q) {
                // Tìm theo tên hoặc email (nếu có)
                query.$or = [
                    { fullName: { $regex: q, $options: "i" } },
                    { name: { $regex: q, $options: "i" } },
                    { email: { $regex: q, $options: "i" } }
                ];
            }

            const totalUsers = await UserModel.countDocuments(query);
            const totalPages = Math.ceil(totalUsers / limitNum);

            const users = await UserModel.find(query)
                .select("-password") // Không trả về password
                .skip((pageNum - 1) * limitNum)
                .limit(limitNum)
                .sort({ [sortBy]: sortOrder === 'desc' ? -1 : 1 });

            res.status(200).json({
                success: true,
                message: "Get all users successfully",
                data: users,
                pagination: {
                    limit: limitNum,
                    page: pageNum,
                    totalPages: totalPages,
                    totalItems: totalUsers,
                    hasPreviousPage: pageNum > 1,
                    hasNextPage: pageNum < totalPages
                }
            });
        } catch (err) {
            res.status(500).json({
                success: false,
                message: "Failed to get users",
                error: err.message
            });
            next(err);
        }
    },

    // (Có thể bổ sung các controller khác nếu cần)
    // Lấy user theo id
    getUserById: async (req, res, next) => {
        try {
            const userId = req.params.id;
            const user = await UserModel.findById(userId).select("-password");
            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: "User not found"
                });
            }
            res.status(200).json({
                success: true,
                message: "Get user successfully",
                data: user
            });
        } catch (err) {
            res.status(500).json({
                success: false,
                message: "Failed to get user",
                error: err.message
            });
            next(err);
        }
    }
};