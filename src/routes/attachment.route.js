import express from 'express';
import { attachmentController } from '../controllers/attachment.controller.js';
const AttachmentRoute = express.Router();
AttachmentRoute.get('/:taskId/', attachmentController.getAllAttachments);        
AttachmentRoute.delete('/:id', attachmentController.deleteAttachment);  
export default AttachmentRoute;

