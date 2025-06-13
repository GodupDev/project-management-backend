import express from "express";
import taskModel from "../models/main/tasks.model.js";
import UserModel from "../models/main/users.model.js";
import ProjectModel from "../models/main/project.model.js";
export const taskController = {
    // lấy tất cả task
    // get http://localhost:8000/tasks
    getAllTask: async(req, res, next) => {
        try{
            const { page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'desc', q } = req.query;
            const pageNum = parseInt(page);
            const limitNum = parseInt(limit);
            let query = {};
            let taskQuery = await taskModel.find(query).skip((pageNum - 1) * limitNum).limit(limitNum).sort({ [sortBy]: sortOrder === 'desc' ? -1 : 1 }).limit(limitNum);   
            const tasks = await taskModel.find().populate('taskAssign').populate('projectId', 'projectName');

            const totalTasks = await taskModel.countDocuments(query);
            const totalPages = Math.ceil(totalTasks/limitNum);
            res.status(200).json({
                success: true,
                message: "Get all tasks successfully",
                data: tasks,
                pagination: {
                    limit: limitNum,
                    page: pageNum,
                    totalPages: totalPages,
                    totalItems: totalTasks,
                    hasPreviousPage: pageNum > 1,
                    hasNextPage: pageNum < totalPages
                }
            });
        }catch(err){
            res.status(500).json({
                success: false,
                message: "Failed to get tasks",
                error: err.message
            });
            next(err);
        }
    },

    // lấy task theo projectId
    // get http://localhost:8000/tasks/project/:projectId   
    getTasksByProjectId: async (req, res, next) => {
  try {
    const projectId = req.params.projectId;

    // Lấy page và limit từ query params, default page=1, limit=10
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Tổng số task theo projectId (để tính tổng trang)
    const totalTasks = await taskModel.countDocuments({ projectId });

    if (totalTasks === 0) {
      return res.status(404).json({
        success: false,
        message: "No tasks found for this project"
      });
    }

    // Truy vấn có pagination + populate
    const tasks = await taskModel
      .find({ projectId })
      .skip(skip)
      .limit(limit)
      .populate('taskAssign');

    res.status(200).json({
      success: true,
      message: "Get tasks by project ID successfully",
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
      message: "Failed to get tasks by project ID",
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
            message: "No tasks found for this user"
        });
        }

        // Truy vấn có pagination + populate
        const tasks = await taskModel
        .find({ taskAssign: userId})
        .skip(skip)
        .limit(limit)
        .populate('taskAssign');

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
    getTask :async (req, res, next) => {
        try {
            const taskId = req.params.id;
            const task = await taskModel.findById(taskId).populate('taskAssign');
            if (!task) {
                return res.status(404).json({
                    success: false,
                    message: "Task not found"
                });
            }
            res.status(200).json({
                success: true,
                message: "Get task successfully",
                data: task
            });
        } catch (err) {
            res.status(500).json({
                success: false,
                message: "Failed to get task",
                error: err.message
            });
            next(err);
        }
    },
    
    // tạo task mới
    // post http://localhost:8000/tasks
    createTask: async (req, res, next) => {
        try {
            const { projectId, taskTitle, taskType, taskDescription,taskAttachment, taskStartDate, taskEndDate, taskAssign, taskTag } = req.body;
            if (!projectId || !taskTitle || !taskType || !taskStartDate || !taskEndDate || !taskAssign) {
                return res.status(400).json({
                    success: false,
                    message: "Missing required fields"
                });
            }
            const newTask = new taskModel(req.body);
            const savedTask = await newTask.save();
            res.status(201).json({
                success: true,
                message: "Task created successfully",
                data: savedTask
            });
        } catch (err) {
            res.status(500).json({
                success: false,
                message: "Failed to create task",
                error: err.message
            });
            next(err);
        }
    },

    // cập nhật task
    // patch http://localhost:8000/tasks/:id
    updateTask: async (req, res, next) => {
        try {
            const taskId = req.params.id;
            const updateData = req.body;
            const existingTask= await taskModel.findById(taskId);
            if (!existingTask) {
                return res.status(404).json({
                    success: false,
                    message: "Task not found"
                });
            }
            const updatedTask = await taskModel.findByIdAndUpdate(
                taskId,
                {$set: updateData},
                {new: true, runValidators: true}
            ).populate("taskAssign")

            res.status(200).json({
                success: true,
                message: "Task updated successfully",
                data: updatedTask
            })
        }catch (err) {
            res.status(500).json({
                success: false,
                message: "Failed to update task",
                error: err.message
            });
            next(err);
        }
    },
    // xóa task
    // delete http://localhost:8000/tasks/:id
    deleteTask: async (req, res, next) =>{
        try{
            const taskId = req.params.id;
            const deletedTask = await taskModel.findByIdAndDelete(taskId);
            if (!deletedTask) {
                return res.status(404).json({
                    success: false,
                    message: "Task not found"
                });
            }   
            taskModel.deleteOne({ _id: taskId })
            res.status(200).json({
                success: true,
                message: "Task deleted successfully",
                data: deletedTask,
                taskModel
            });
        }catch (error){
            res.status(500).json({
                success: false,
                message: "Failed to delete task",
                error: error.message
            });
            next(error);
        }
    }

};
