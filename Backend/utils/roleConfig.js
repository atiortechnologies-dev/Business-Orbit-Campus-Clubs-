/**
 * @file roleConfig.js
 * @description Defines constants, enumerations, or configuration objects representing the various user roles in the system.
 * @architecture Acts as the single source of truth for role definitions, preventing hardcoded magic strings across the codebase.
 */

const roleConfig = {
  student: {
    redirectTo: "welcome_to_your_chapter",
    initialStatus: "pending_verification",
  },
  mentor: {
    redirectTo: "email_verification",
    initialStatus: "pending_verification",
  },
  investor: {
    redirectTo: "email_verification",
    initialStatus: "pending_verification",
  },
  incubator: {
    redirectTo: "email_verification",
    initialStatus: "pending_verification",
  },
  company: {
    redirectTo: "email_verification",
    initialStatus: "pending_verification",
  },
};

module.exports = roleConfig;
