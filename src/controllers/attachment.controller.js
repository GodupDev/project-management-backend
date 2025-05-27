import express from 'express';
import {taskAttachmentModel} from '../models/main/attachments.model.js';

export const attachmentController = {
    getAllAttachments: async (req, res, next) => {
        try {
            const taskId = req.params.taskId;
            const attachments = await taskAttachmentModel.find({ taskId }).populate('userId');
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
    }
    ,
    createAttachment: async (req, res, next) => {
        try {
            const { taskId, fileName, filePath } = req.body;
            const newAttachment = new taskAttachmentModel({
                taskId,
                userId: req.user._id,
                fileName,
                filePath
            });
            await newAttachment.save();
            res.status(201).json({
                success: true,
                message: 'Attachment created successfully',
                data: newAttachment
            });
        } catch (err) {
            res.status(500).json({
                success: false,
                message: 'Failed to create attachment',
                error: err.message
            });
            next(err);
        }
    }
    ,
    deleteAttachment: async (req, res, next) => {
        try {
            const attachmentId = req.params.id;
            const deletedAttachment = await taskAttachment
Model.findByIdAndDelete(attachmentId);
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
    ,

    updateAttachment: async (req, res, next) => {
        try {
            const attachmentId = req.params.id;
            const { fileName, filePath } = req.body;
            const updatedAttachment = await taskAttachmentModel.findByIdAndUpdate(
                attachmentId,
                { fileName, filePath },
                { new: true, runValidators: true }
            ).populate('userId');           
            if (!updatedAttachment) {
                return res.status(404).json({
                    success: false,
                    message: 'Attachment not found'
                });
            }
            res.status(200).json({
                success: true,
                message: 'Attachment updated successfully',
                data: updatedAttachment
            });
        } catch (err) {
            res.status(500).json({
                success: false,
                message: 'Failed to update attachment',
                error: err.message
            });
            next(err);
        }
    }   
};
    