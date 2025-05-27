import express from 'express';
import commentModel from '../models/main/comments.model.js';


export const commentController = {
    getAllComments: async (req, res, next) => {
        try {
            const taskId = req.params.taskId;
            const comments = await commentModel.find({ taskId }).populate('userId');
            res.status(200).json({
                success: true,
                message: 'Get all comments successfully',
                data: comments
            });
        } catch (err) {
            res.status(500).json({
                success: false,
                message: 'Failed to get comments',
                error: err.message
            });
            next(err);
        }
    },

    createComment: async (req, res, next) => {
        try {
            const { taskId, content } = req.body;
            const newComment = new commentModel({
                taskId,
                userId: req.user._id,
                content
            });
            await newComment.save();
            res.status(201).json({
                success: true,
                message: 'Comment created successfully',
                data: newComment
            });
        } catch (err) {
            res.status(500).json({
                success: false,
                message: 'Failed to create comment',
                error: err.message
            });
            next(err);
        }
    },
    replyComment: async (req, res, next) => {
        try {
            const { taskId, content, parentCommentId } = req.body;
            const newReply = new commentModel({
                taskId,     
                userId: req.user._id,
                content,
                parentCommentId 
            });
            await newReply.save();  
            const populatedReply = await newReply
                .populate('userId')
                .populate('parentCommentId');   
            res.status(201).json({
                success: true,  
                message: 'Reply created successfully',
                data: populatedReply    
            });
        } catch (err) { 
            res.status(500).json({
                success: false, 
                message: 'Failed to create reply',
                error: err.message
            });
            next(err);  
        }   
    },
    updateComment: async (req, res, next) => {
        try {
            const commentId = req.params.id;
            const { content } = req.body;
            const updatedComment = await commentModel
                .findByIdAndUpdate(
                    commentId,
                    { content },
                    { new: true }
                )       
                .populate('userId');
            if (!updatedComment) {  
                return res.status(404).json({
                    success: false,
                    message: 'Comment not found'
                });
            }
            res.status(200).json({
                success: true,
                message: 'Comment updated successfully',
                data: updatedComment
            });
        } catch (err) {
            res.status(500).json({
                success: false,
                message: 'Failed to update comment',
                error: err.message
            });
            next(err);
        }   
    },
    deleteComment: async (req, res, next) => {
        try {
            const commentId = req.params.id;
            const comment = await commentModel      
                .findByIdAndDelete(commentId)
                .populate('userId');
            if (!comment) {
                return res.status(404).json({
                    success: false,
                    message: 'Comment not found'
                });
            }       
            res.status(200).json({
                success: true,
                message: 'Comment deleted successfully',
                data: comment
            });
        } catch (err) {     
            res.status(500).json({
                success: false,
                message: 'Failed to delete comment',
                error: err.message
            });
            next(err);
        }           
    }
};      
