import express from "express";
import taskModel from "../models/main/tasks.model.js";

export const taskController = {
  // lấy tất cả task
  // get http://localhost:8000/tasks
  getAllTask: async (req, res, next) => {
    try {
      const {
        page = 1,
        limit = 10,
        sortBy = "createdAt",
        sortOrder = "desc",
        q,
        assignee,
      } = req.query;
      const pageNum = parseInt(page);
      const limitNum = parseInt(limit);

      let query = {};

      if (assignee) {
        query.taskAssign = assignee;
      }

      const tasks = await taskModel
        .find(query)
        .populate("projectId", "projectName") // projectId chứa _id và projectName
        .skip((pageNum - 1) * limitNum)
        .limit(limitNum)
        .sort({ [sortBy]: sortOrder === "desc" ? -1 : 1 });

      const totalTasks = await taskModel.countDocuments(query);
      const totalPages = Math.ceil(totalTasks / limitNum);

      // Tạo danh sách allProjects duy nhất dựa trên populated projectId
      const allProjects = [
        ...new Map(
          tasks
            .filter((task) => task.projectId) // loại bỏ null
            .map((task) => [
              task.projectId._id.toString(), // key
              {
                projectId: task.projectId._id,
                projectName: task.projectId.projectName,
              },
            ]),
        ).values(),
      ];

      res.status(200).json({
        success: true,
        message: "Get all tasks successfully",
        data: tasks,
        allProjects,
        pagination: {
          limit: limitNum,
          page: pageNum,
          totalPages,
          totalItems: totalTasks,
          hasPreviousPage: pageNum > 1,
          hasNextPage: pageNum < totalPages,
        },
      });
    } catch (err) {
      res.status(500).json({
        success: false,
        message: "Failed to get tasks",
        error: err.message,
      });
      next(err);
    }
  },
  // get all tasks by userId
  // get http://localhost:8000/tasks/user/:userId
  getTasksByUserId: async (req, res, next) => {
    try {
      const userId = req.params.userId;

      // Lấy page và limit từ query params, default page=1, limit=10
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const skip = (page - 1) * limit;

      // Tổng số task theo userId (để tính tổng trang)
      const totalTasks = await taskModel.countDocuments({ taskAssign: userId });

      if (totalTasks === 0) {
        return res.status(404).json({
          success: false,
          message: "No tasks found for this user",
        });
      }

      // Truy vấn có pagination + populate
      const tasks = await taskModel
        .find({ taskAssign: userId })
        .skip(skip)
        .limit(limit);

      res.status(200).json({
        success: true,
        message: "Get tasks by user ID successfully",
        data: tasks,
        pagination: {
          totalItems: totalTasks,
          totalPages: Math.ceil(totalTasks / limit),
          currentPage: page,
          pageSize: limit,
        },
      });
    } catch (err) {
      res.status(500).json({
        success: false,
        message: "Failed to get tasks by user ID",
        error: err.message,
      });
      next(err);
    }
  },

  // get task by id
  // get http://localhost:8000/tasks/:id
  getTask: async (req, res, next) => {
    try {
      const { id: taskId } = req.params;

      const task = await taskModel
        .findById(taskId)
        .populate({
          path: "projectId",
          select: "projectName",
          model: "projects",
        })
        .populate({
          path: "taskAssign", // chính xác là populate trực tiếp từ `users`
          select: "username avatarUrl",
          model: "users",
        });

      if (!task) {
        return res.status(404).json({
          success: false,
          message: "Task not found",
        });
      }

      // Format assigned users
      const assignedUsers = (task.taskAssign || []).map((user) => ({
        _id: user._id,
        username: user.username,
        avatarUrl: user.avatarUrl || null,
      }));

      // Trả về dữ liệu đã format
      return res.status(200).json({
        success: true,
        message: "Task retrieved successfully",
        data: {
          _id: task._id,
          title: task.taskTitle,
          description: task.taskDescription,
          priority: task.taskPriority,
          status: task.taskStatus,
          attachment: task.taskAttachment || "",
          startDate: task.taskStartDate,
          dueDate: task.taskEndDate,
          project: {
            _id: task.projectId?._id,
            name: task.projectId?.projectName,
          },
          assignedUsers,
          createdAt: task.createdAt,
          updatedAt: task.updatedAt,
        },
      });
    } catch (err) {
      console.error("Error in getTask:", err);
      if (!res.headersSent) {
        return res.status(500).json({
          success: false,
          message: "Failed to retrieve task",
          error: err.message,
        });
      }
      next(err);
    }
  },
  // tạo task mới
  // post http://localhost:8000/tasks
  createTask: async (req, res, next) => {
    try {
      const {
        projectId,
        taskTitle,
        taskType,
        taskDescription,
        taskAttachment,
        taskStartDate,
        taskEndDate,
        taskAssign,
        taskTag,
      } = req.body;
      if (!taskTitle) {
        return res.status(400).json({
          success: false,
          message: "Missing required fields",
        });
      }
      const userId = req.user._id;
      console.log(userId);
      const newTask = new taskModel(req.body);
      newTask.taskAssign.push(userId);
      const savedTask = await newTask.save();
      res.status(201).json({
        success: true,
        message: "Task created successfully",
        data: savedTask,
      });
    } catch (err) {
      res.status(500).json({
        success: false,
        message: "Failed to create task",
        error: err.message,
      });
      next(err);
    }
  },

  // cập nhật task
  // patch http://localhost:8000/tasks/:id
  // ...existing code...
  // cập nhật task
  // patch http://localhost:8000/tasks/:id
  updateTask: async (req, res, next) => {
    try {
      const taskId = req.params.id;
      const updateData = { ...req.body };

      // Kiểm tra task tồn tại
      const existingTask = await taskModel.findById(taskId);
      if (!existingTask) {
        return res.status(404).json({
          success: false,
          message: "Task not found",
        });
      }

      // Nếu có truyền taskAssign, đảm bảo đó là mảng ObjectId hợp lệ
      if (Array.isArray(updateData.taskAssign)) {
        // Loại bỏ các phần tử trùng nhau và chuyển thành chuỗi
        const uniqueAssignees = [
          ...new Set(updateData.taskAssign.map((id) => id.toString())),
        ];
        updateData.taskAssign = uniqueAssignees;
      } else {
        // Không truyền taskAssign thì giữ nguyên (không xóa đi)
        delete updateData.taskAssign;
      }

      const updatedTask = await taskModel.findByIdAndUpdate(
        taskId,
        { $set: updateData },
        { new: true, runValidators: true },
      );

      return res.status(200).json({
        success: true,
        message: "Task updated successfully",
        data: updatedTask,
      });
    } catch (err) {
      console.error("Error updating task:", err);
      if (!res.headersSent) {
        return res.status(500).json({
          success: false,
          message: "Failed to update task",
          error: err.message,
        });
      }
      next(err);
    }
  },

  // xóa task
  // delete http://localhost:8000/tasks/:id
  deleteTask: async (req, res, next) => {
    try {
      const taskId = req.params.id;
      const deletedTask = await taskModel.findByIdAndDelete(taskId);
      if (!deletedTask) {
        return res.status(404).json({
          success: false,
          message: "Task not found",
        });
      }
      taskModel.deleteOne({ _id: taskId });
      res.status(200).json({
        success: true,
        message: "Task deleted successfully",
        data: deletedTask,
        taskModel,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Failed to delete task",
        error: error.message,
      });
      next(error);
    }
  },
};
