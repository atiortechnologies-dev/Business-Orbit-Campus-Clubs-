const AuditLog = require('../models/AuditLog');

/**
 * Logs an administrative or system action.
 * @param {Object} actor - The user performing the action (should have _id and full_name or name).
 * @param {String} module - Module name (SECURITY, CLUBS, AUTH, SYSTEM, CONTENT)
 * @param {String} action - Description of the action
 * @param {String} targetEntityId - ID of the entity affected
 * @param {String} targetEntityName - Name of the entity affected
 * @param {String} status - SUCCESS, REJECTED, PENDING
 * @param {String} ipAddress - IP Address of the actor
 * @param {Object} details - Additional details
 */
exports.logAudit = async (
  actor,
  module,
  action,
  targetEntityId,
  targetEntityName,
  status,
  ipAddress,
  details
) => {
  try {
    await AuditLog.create({
      actor_id: actor ? actor._id : null,
      actor_name: actor ? (actor.full_name || actor.name) : 'System',
      module,
      action,
      target_entity_id: targetEntityId || null,
      target_entity_name: targetEntityName || null,
      status,
      ip_address: ipAddress || null,
      details: details || {},
    });
  } catch (error) {
    console.error('Audit Logger Error:', error);
  }
};
