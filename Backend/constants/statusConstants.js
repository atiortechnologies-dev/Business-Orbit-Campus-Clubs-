/**
 * @file statusConstants.js
 * @description Centralized enums and statuses across the platform.
 */

const REQUEST_STATUS = {
  PENDING: "pending",
  ACCEPTED: "accepted",
  DECLINED: "declined",
};

const ASSIGNMENT_STATUS = {
  ACTIVE: "active",
  INACTIVE: "inactive",
};

const MEETING_STATUS = {
  SCHEDULED: "scheduled",
  COMPLETED: "completed",
  CANCELLED: "cancelled",
};

module.exports = {
  REQUEST_STATUS,
  ASSIGNMENT_STATUS,
  MEETING_STATUS,
};
