import Project from "../models/project.model.js";
import Task from "../models/task.model.js";
import User from "../models/user.model.js";
import TimeLog from "../models/timeLog.model.js";

// Lấy tổng quan hiệu suất hệ thống
export const getOverview = async (req, res) => {
  try {
    const totalProjects = await Project.countDocuments();
    const totalTasks = await Task.countDocuments();
    const completedTasks = await Task.countDocuments({ status: "completed" });
    const totalUsers = await User.countDocuments();
    const totalTimeLogs = await TimeLog.countDocuments();

    res.json({
      totalProjects,
      totalTasks,
      completedTasks,
      totalUsers,
      totalTimeLogs,
    });
  } catch (error) {
    res.status(500).json({ message: "Lỗi lấy dữ liệu tổng quan", error });
  }
};

// Hiệu suất theo dự án
export const getPerformanceByProjects = async (req, res) => {
  try {
    const projects = await Project.find().populate("tasks");
    const result = projects.map((project) => ({
      projectName: project.name,
      totalTasks: project.tasks.length,
      completedTasks: project.tasks.filter(t => t.status === "completed").length,
    }));

    res.json(result);
  } catch (error) {
    res.status(500).json({ message: "Lỗi lấy hiệu suất dự án", error });
  }
};

// Hiệu suất theo người dùng
export const getPerformanceByUsers = async (req, res) => {
  try {
    const users = await User.find();
    const result = await Promise.all(users.map(async (user) => {
      const taskCount = await Task.countDocuments({ assignedTo: user._id });
      const completedTaskCount = await Task.countDocuments({ assignedTo: user._id, status: "completed" });

      return {
        userName: user.userName,
        taskCount,
        completedTaskCount,
      };
    }));

    res.json(result);
  } catch (error) {
    res.status(500).json({ message: "Lỗi lấy hiệu suất người dùng", error });
  }
};

// Hiệu suất theo công việc
export const getPerformanceByTasks = async (req, res) => {
  try {
    const tasks = await Task.find();
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: "Lỗi lấy hiệu suất task", error });
  }
};

// Các chỉ số hiệu suất
export const getMetrics = async (req, res) => {
  try {
    const totalTasks = await Task.countDocuments();
    const completedTasks = await Task.countDocuments({ status: "completed" });
    const pendingTasks = await Task.countDocuments({ status: "pending" });

    res.json({
      totalTasks,
      completedTasks,
      pendingTasks,
      completionRate: ((completedTasks / totalTasks) * 100).toFixed(2) + "%",
    });
  } catch (error) {
    res.status(500).json({ message: "Lỗi lấy metrics", error });
  }
};

// Xu hướng hiệu suất theo thời gian
export const getTrends = async (req, res) => {
  try {
    const tasks = await Task.find().sort({ createdAt: 1 });

    const trends = tasks.reduce((acc, task) => {
      const date = task.createdAt.toISOString().split("T")[0];
      acc[date] = acc[date] ? acc[date] + 1 : 1;
      return acc;
    }, {});

    res.json(trends);
  } catch (error) {
    res.status(500).json({ message: "Lỗi lấy trends", error });
  }
};
