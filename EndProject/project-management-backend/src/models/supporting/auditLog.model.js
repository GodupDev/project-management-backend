const mongoose = require("mongoose");
import Collection from "../../config/collection.js";

const auditlogSchema = new mongoose.Schema({
  action: String,
  userId: { type: mongoose.Schema.Types.ObjectId, ref: Collection.main.PROJECT_MEMBERS },
  targetType: String,
  targetId: { type: mongoose.Schema.Types.ObjectId },
  description: String,
}, { timestamps: true });

const AuditLogModel = mongoose.model(Collection.supporting.AUDIT_LOG, auditlogSchema);
export default AuditLogModel;
