import express from 'express';
import { attachmentController } from '../controllers/attachment.controller';
const AttachmentRoute = express.Router();
AttachmentRoute.get('/:taskId', attachmentController.getAllAttachments);        
AttachmentRoute.post('/', attachmentController.createAttachment);
AttachmentRoute.put('/:id', attachmentController.updateAttachment);
AttachmentRoute.delete('/:id', attachmentController.deleteAttachment);  
export default AttachmentRoute;

