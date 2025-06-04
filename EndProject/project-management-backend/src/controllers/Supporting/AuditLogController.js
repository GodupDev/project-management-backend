import AuditLog from '../../models/supporting/auditLog.model.js';
import User from '../../models/ProjectAndUserModel/users.models.js';


// Ghi lại log tác vụ
exports.createAuditLog = async (req, res) => {
    try {
        const { action, description } = req.body;
        const userId = req.user ? req.user.id : null; // Lấy user từ middleware xác thực

        const log = new AuditLog({
            user: userId,
            action,
            description,
            ip: req.ip,
            timestamp: new Date()
        });

        await log.save();
        res.status(201).json({ message: 'Log created', log });
    } catch (error) {
        res.status(500).json({ message: 'Error creating log', error: error.message });
    }
};

// Lấy danh sách log
exports.getAllAuditLogs = async (req, res) => {
    try {
        const logs = await AuditLog.find().sort({ timestamp: -1 }).limit(100);
        res.json(logs);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching logs', error: error.message });
    }
};
// Lấy log theo ID
exports.getAuditLogsByUser = async (req, res) => {
    try {
        const userId = req.params.userId;
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ message: 'Invalid userId' });
        }
        const logs = await AuditLog.find({ user: userId }).sort({ timestamp: -1 });
        res.json(logs);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching user logs', error: error.message });
    }
};
