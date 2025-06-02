//permissions.ts (backend)
export const rolePermissions = {
  admin: ["manageUsers"],
  user: [
    "viewChapter",
    "viewQuestDetails",
    "submitQuest",
    "initUserProgress",
    "viewLearnProgress",
  ],
} as const;

// export type Permission = (typeof permissions)["admin"][number];
export type Permission =
  (typeof rolePermissions)[keyof typeof rolePermissions][number];
