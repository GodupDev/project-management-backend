import express from "express";
import taskModel from "../models/main/tasks.model.js";

export const taskController = {
    getAllTask: async(req, res, next) => {
        try{
            const { page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'desc', q } = req.query;
            const pageNum = parseInt(page);
            const limitNum = parseInt(limit);
            let query = {};
            let taskQuery = await taskModel.find(query).skip((pageNum - 1) * limitNum).limit(limitNum).sort({ [sortBy]: sortOrder === 'desc' ? -1 : 1 }).limit(limitNum);   
            const tasks = await taskModel.find().populate('taskAssign');
            const totalTasks = await taskModel.countDocuments(query);
            const totalPages = (totalTasks % limitNum) + 1;
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
    
    // post api
    createTask: async (req, res, next) => {
        try {
            const { taskTitle, taskType, taskDescription, taskStartDate, taskEndDate, taskAssign, taskTag } = req.body;
            if (!taskTitle || !taskType || !taskStartDate || !taskEndDate || !taskAssign) {
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

    // update task api
    updateTask: async (req, res, next) => {
        try {
            const taskId = req.params.id;
            const updatedTask = await taskModel.findById(taskId);
            if (!updatedTask) {
                return res.status(404).json({
                    success: false,
                    message: "Task not found"
                });
            }
            
        }catch (err) {
            res.status(500).json({
                success: false,
                message: "Failed to update task",
                error: err.message
            });
            next(err);
        }
    }

};

