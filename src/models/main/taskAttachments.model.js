import mongoose from "mongoose";
import Collection from "../../config/collection.js";
const taskAttachmentSchema = new mongoose.Schema({
    taskId: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: Collection.main.TASKS, 
        required: true },
    authorId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: Collection.main.USERS, 
        required: true},
    uploadedAt: { 
        type: Date, 
        default: Date.now },
    storageProvider: { 
        type: String, 
        default: 'local' }
    },{
        timestamps: true,
    });
const taskAttachmentModel = mongoose.model(Collection.main.TASK_ATTACHMENT, taskAttachmentSchema);
export default taskAttachmentModel;