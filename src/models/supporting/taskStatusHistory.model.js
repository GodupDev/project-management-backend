import mongoose from "mongoose";
import Collection from "../../config/collection";
const taskStatusHistorySchema = new mongoose.Schema({
    taskId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: Collection.main.TASKS, 
        required: true },
    changedBy: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: Collection.main.USERS, 
        required: true },
    oldStatus: { 
        type: String, 
        required: true },
    newStatus: { 
        type: String, 
        required: true },
    },{
        timestamps: true,
    });
const taskStatusHistoryModel = mongoose.model(Collection.supporting.TASK_STATUS_HISTORY, taskStatusHistorySchema);
export default  taskStatusHistoryModel;