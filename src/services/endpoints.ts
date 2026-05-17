export const endpoints = {
  auth: {
    login: "/auth/login",
    register: "/auth/register",
  },

  employeeGoals: {
    root: "/employee/goals/",
    my: "/employee/goals/my",
    submit: "/employee/goals/submit",
    byId: (goalId: string) => `/employee/goals/${goalId}`,
    updateWeightage: (goalId: string) =>
      `/employee/goals/${goalId}/weightage`,
    quarterlyCheckin: (goalId: string) =>
      `/employee/goals/${goalId}/quarterly-checkin`,
    unlockRequest: (goalId: string) =>
      `/employee/goals/${goalId}/unlock-request`,
    mySharedGoals: "/employee/goals/my-shared-goals",
  },

  managerGoals: {
    review: "/manager/goals/review",
    approved: "/manager/goals/",
    approve: (goalId: string) => `/manager/goals/${goalId}/approve`,
    return: (goalId: string) => `/manager/goals/${goalId}/return`,
    comment: (goalId: string) => `/manager/goals/${goalId}/comment`,
  },

  adminGoals: {
    unlock: (goalId: string) => `/admin/goals/${goalId}/unlock`,
    unlockRequests: "/admin/goals/unlock-requests",
    approveUnlockRequest: (requestId: string) =>
      `/admin/goals/unlock-requests/${requestId}/approve`,
    rejectUnlockRequest: (requestId: string) =>
      `/admin/goals/unlock-requests/${requestId}/reject`,
    logs: "/admin/goals/logs",
  },

  sharedGoals: {
    push: "/shared-goals/push",
    pushed: "/shared-goals/pushed",
  },

  organization: {
    hierarchy: "/organization/hierarchy",
  },
} as const
