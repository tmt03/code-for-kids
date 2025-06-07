//permissions.ts (backend)
export const rolePermissions = {
  admin: ["manageUsers", "manageOrders", "viewAllOrders", "editProduct", "deleteProduct"],
  user: ["viewChapter", "viewQuestDetails", "submitQuest", "placeOrder", "viewOwnOrders", "initUserProgress", "viewLearnProgress",],
  guest: ["browseProducts", "placeOrder", "lookupOrder"]
} as const;

// export type Permission = (typeof permissions)["admin"][number];
export type Permission =
  (typeof rolePermissions)[keyof typeof rolePermissions][number];
