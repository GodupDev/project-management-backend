import express from 'express';
import commentModel from '../models/main/taskComments.model.js';


export const commentController = {
    // lấy toàn bộ bình luận của một task
    //get http://localhost:8000/comments/:taskId
    getAllComments: async (req, res, next) => {
        try {
            const taskId = req.params.taskId;
            //const comments = await commentModel.find({ taskId }).populate('userId');
            const comments = await commentModel.find({taskId});
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
    // tạo mới một bình luận cho một bài viết cụ thể
    // post http://localhost:8000/comments/:taskId 
    createComment: async (req, res, next) => {
        try {
            const taskId = req.params.taskId;
            if (!taskId) {  
                return res.status(400).json({
                    success: false,
                    message: 'Task ID is required'
                }); 
            }

            const { authorId, content, mentions } = req.body;
            if (!content && !authorId) {
                return res.status(400).json({
                    success: false,
                    message: 'Content and author ID are required'
                });
            }
            const newComment = new commentModel({
                taskId,
                authorId,
                content,
                mentions
              
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
    // tạo mới một bình luận trả lời cho một bình luận khác
    // post http://localhost:8000/comments/:taskId/reply
    replyComment: async (req, res, next) => {
        try {
            const taskId = req.params.taskId;
            if (!taskId) {
                return res.status(400).json({
                    success: false,
                    message: 'Task ID is required'
                }); 
            }
            const { content,authorId, parentCommentId } = req.body;
            const newReply = new commentModel({
                taskId,     
                authorId,
                content,
                parentCommentId 
            });
            await newReply.save();  
            const populatedReply = await commentModel.findById(newReply._id)
  .populate('authorId')
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
    // lấy tất cả reply của một bình luận cụ thể
    // get http://localhost:8000/comments/:id/replies
    getReplies: async (req, res, next) => {
        try {
            const commentId = req.params.id;
            const replies = await commentModel
                .find({ parentCommentId: commentId })
                .populate('authorId')
                .populate('parentCommentId');
            if (replies.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: 'No replies found for this comment'
                });
            }
            res.status(200).json({
                success: true,
                message: 'Replies retrieved successfully',
                data: replies
            });
        } catch (err) {
            res.status(500).json({
                success: false,
                message: 'Failed to retrieve replies',
                error: err.message
            });
            next(err);
        }
    },  
    // cập nhật một bình luận
    // patch http://localhost:8000/comments/:id
    updateComment: async (req, res, next) => {
        try {
            const commentId = req.params.id;
            const { content, mentions } = req.body;
            const updatedComment = await commentModel
                .findByIdAndUpdate(
                    commentId,
                    { content, mentions, isEdited: true },
                    { new: true }
                )       
                .populate('authorId');
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
    // xóa một bình luận
    // delete http://localhost:8000/comments/:id
    deleteComment: async (req, res, next) => {
        try {
            const commentId = req.params.id;
            const comment = await commentModel      
                .findByIdAndDelete(commentId)
                .populate('authorId');
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
