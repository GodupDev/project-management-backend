import mongoose from "mongoose";
import Collection from "../../config/collection.js";
const taskSchema =  mongoose.Schema({
    taskTitle:{
        type: String,
        required: true,
    },
    taskType: {
        type: String,
        required: true
    },
    taskDescription:{
        type: String,
    },
    taskAttachment:[{
        type: String
        //type: mongoose.Schema.Types.ObjectId,
        //ref: Collection.main.TASK_ATTACHMENT,
       
    }],
    taskStartDate: {
        type: Date,
        required: true,
    },
    taskEndDate:{
        type: Date,
        required: true,
    },
    taskAssign:[{
        //type: mongoose.Schema.Types.ObjectId,
        //ref: Collection.main.PROJECT_MEMBERS,
        type: String,
        required: true,
    }],
    taskTag:{
        type: String,
    },
    taskStatus:{
        type: String,
        enum: ["pending", "active", "completed", "cancelled"],
        default: "pending",
    },
},
{
    timestamps: true,
});
const taskModel = mongoose.model(Collection.main.TASKS, taskSchema);
export default taskModel;