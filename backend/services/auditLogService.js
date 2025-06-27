// backend/services/auditLogService.js
const AuditLog = require('../models/auditLogModel');

/**
 * Creates an audit log entry.
 * @param {string} userId - The ID of the user performing the action.
 * @param {string} action - The action being performed (e.g., 'CREATE_TASK').
 * @param {object} details - An object containing additional details, like the taskId.
 */
const logAction = async (userId, action, details = {}) => {
  try {
    await AuditLog.create({
      user: userId,
      action,
      details,
    });
    console.log(`Audit Log: User ${userId} performed action ${action}`.grey);
  } catch (error) {
    // We log the error but don't stop the main application flow
    console.error('Failed to create audit log:'.red, error);
  }
};

module.exports = { logAction };