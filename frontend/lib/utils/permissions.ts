//permissions.ts (frontend)

export const permissions = {
  admin: ["viewDashboard", "manageUsers"],
  user: ["viewCourses"],
} as const;
// export type Permission = (typeof permissions)["admin"][number];
export type Permission = (typeof permissions)[keyof typeof permissions][number];
