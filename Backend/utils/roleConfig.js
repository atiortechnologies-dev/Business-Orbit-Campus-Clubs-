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
