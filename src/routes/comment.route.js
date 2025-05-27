import express from 'express';
import { commentController } from '../controllers/comment.controller.js';
const CommentRoute = express.Router();
CommentRoute.get('/:taskId', commentController.getAllComments);
CommentRoute.post('/:taskId', commentController.createComment);
CommentController.post('/:taskId/reply', commentController.replyComment);
CommentRoute.patch('/:id', commentController.updateComment);
CommentRoute.delete('/:id', commentController.deleteComment);