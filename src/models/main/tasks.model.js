import mongoose from "mongoose";
const taskSchema = mongoose.Schema({
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
    taskStartDate: {
        type: Date,
        required: true,
    },
    taskEndDate:{
        type: Date,
        required: true,
    },
    taskAssign:{
        type: String,
        required: true,
    },
    taskTag:{
        type: String,
    },
    taskStatus:{
        type: String,
    }
});
const taskModel = mongoose.model("taskSchema", taskSchema);
export default taskModel;