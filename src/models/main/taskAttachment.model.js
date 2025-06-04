import mongoose from "mongoose";
import Collection from "../../config/collection.js";

const taskAttachmentSchema = new mongoose.Schema(
  {
    task: {
      type: mongoose.Schema.Types.ObjectId, 
      ref: Collection.main.TASKS, 
      required: true 
    },
    uploader: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: Collection.main.USERS, 
      required: true
    },
    fileName: { 
      type: String, 
      required: true 
    },
    fileType: { 
      type: String 
    },
    fileSize: { 
      type: Number 
    },
    fileUrl: { 
      type: String, 
      required: true 
    },
    uploadedAt: { 
      type: Date, 
      default: Date.now 
    },
    comment: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: Collection.main.TASK_COMMENTS, 
      default: null 
    },
    isDeleted: { 
      type: Boolean, 
      default: false 
    },
    storageProvider: { 
      type: String, 
      default: 'local' 
    }
  },
  {
    timestamps: true,
  }
);

const TaskAttachment = mongoose.model(Collection.main.TASK_ATTACHMENT, taskAttachmentSchema);
export default TaskAttachment;