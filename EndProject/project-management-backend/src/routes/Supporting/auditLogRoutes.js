import express from 'express';
import * as AuditLogController from '../../controllers/supporting/auditLogController.js';

const router = express.Router();

// Lưu audit log mới
router.post('/', AuditLogController.createAuditLog);

// Lấy tất cả audit log của người dùng (theo userId)
router.get('/user/:userId', AuditLogController.getAuditLogsByUser);

// Lấy tất cả audit log (admin)
router.get('/', AuditLogController.getAllAuditLogs);



export default router;