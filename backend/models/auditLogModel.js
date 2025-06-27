// backend/models/auditLogModel.js
// --- FINAL, COMPLETE VERSION ---

const mongoose = require('mongoose');

const auditLogSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    action: {
      type: String,
      required: true,
      // We are only logging these specific actions
      enum: ['CREATE_TASK', 'UPDATE_TASK', 'DELETE_TASK'],
    },
    details: {
      // We can store extra info, like the ID of the task that was affected
      taskId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Task',
      },
    },
  },
  {
    // This automatically gives us a `createdAt` timestamp for when the log was created
    timestamps: true,
  }
);

module.exports = mongoose.model('AuditLog', auditLogSchema);