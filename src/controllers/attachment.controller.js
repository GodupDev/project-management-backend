import express from 'express';
import taskAttachmentModel from '../models/main/taskAttachment.model.js';
import taskModel from '../models/main/tasks.model.js';
export const attachmentController = {
    // lấy tất cả các tệp đính kèm của một task
    // get http://localhost:8000/tasks/:taskId/attachments
    getAllAttachments: async (req, res, next) => {
        try {
            const taskId = req.params.taskId;
            if(!taskId) {
                return res.status(400).json({   
                    success: false,
                    message: 'Task ID is required'
                });
            }
            const task = await taskModel.findById(taskId);
            if (!task) {    
                return res.status(404).json({
                    success: false,
                    message: 'Task not found'
                });
            }
            const attachments = await taskAttachmentModel.find({ taskId });
            if (!attachments || attachments.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: 'No attachments found for this task'
                });
            }
            res.status(200).json({
                success: true,
                message: 'Get all attachments successfully',
                data: attachments
            });    
            
        } catch (err) {
            res.status(500).json({
                success: false,
                message: 'Failed to get attachments',
                error: err.message
            });
            next(err);
        }
    },
    // xử lý việc tạo một tệp đính kèm mới cho một task
    // post http://localhost:8000/attachments/:taskId
    deleteAttachment: async (req, res, next) => {
        try {
            const attachmentId = req.params.id;
            const deletedAttachment = await taskAttachmentModel.findByIdAndDelete(attachmentId);
            if (!deletedAttachment) {
                return res.status(404).json({
                    success: false,
                    message: 'Attachment not found'
                });
            }
            res.status(200).json({
                success: true,
                message: 'Attachment deleted successfully',
                data: deletedAttachment
            });
        }                   
        catch (err) {
            res.status(500).json({
                success: false,
                message: 'Failed to delete attachment',
                error: err.message
            });
            next(err);
        }
    }
          
}