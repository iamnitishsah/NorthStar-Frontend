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
