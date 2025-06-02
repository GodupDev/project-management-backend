import TimeLog from '../../models/supporting/timelog.model.js';

// src/controller/Supporting/timeLogController.js


// Lấy danh sách nhật ký công việc
exports.getAllTimeLogs = async (req, res) => {
    try {
        const timeLogs = await TimeLog.find();
        res.json(timeLogs);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Lấy chi tiết nhật ký
exports.getTimeLogById = async (req, res) => {
    try {
        const timeLog = await TimeLog.findById(req.params.id);
        if (!timeLog) return res.status(404).json({ message: 'TimeLog not found' });
        res.json(timeLog);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Tạo nhật ký mới
exports.createTimeLog = async (req, res) => {
    try {
        const newTimeLog = new TimeLog(req.body);
        const savedTimeLog = await newTimeLog.save();
        res.status(201).json(savedTimeLog);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// Cập nhật nhật ký
exports.updateTimeLog = async (req, res) => {
    try {
        const updatedTimeLog = await TimeLog.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        if (!updatedTimeLog) return res.status(404).json({ message: 'TimeLog not found' });
        res.json(updatedTimeLog);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// Xóa nhật ký
exports.deleteTimeLog = async (req, res) => {
    try {
        const deletedTimeLog = await TimeLog.findByIdAndDelete(req.params.id);
        if (!deletedTimeLog) return res.status(404).json({ message: 'TimeLog not found' });
        res.json({ message: 'TimeLog deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Lấy nhật ký theo người dùng
exports.getTimeLogsByUser = async (req, res) => {
    try {
        const timeLogs = await TimeLog.find({ userId: req.params.userId });
        res.json(timeLogs);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Lấy nhật ký theo công việc
exports.getTimeLogsByTask = async (req, res) => {
    try {
        const timeLogs = await TimeLog.find({ taskId: req.params.taskId });
        res.json(timeLogs);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};