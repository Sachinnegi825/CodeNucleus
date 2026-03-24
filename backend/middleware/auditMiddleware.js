import AuditLog from '../models/AuditLog.js';

export const logAction = (actionName) => async (req, res, next) => {
  try {
    await AuditLog.create({
      userId: req.user.userId,
      organizationId: req.user.orgId,
      action: actionName,
      ipAddress: req.ip || req.connection.remoteAddress
    });
    next();
  } catch (err) {
    console.error('Audit Log Failed:', err);
    next(); // Don't crash the app, but log to console
  }
};