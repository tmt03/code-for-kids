// middlewares/permissionMiddleware.ts
import { NextFunction, Request, Response } from "express";
import { Permission, rolePermissions } from "../utils/permissions";

export function requirePermission(permission: Permission) {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).user;

    if (!user || !user.role) {
      return res
        .status(401)
        .json({ error: "Chưa xác thực hoặc thiếu vai trò" });
    }

    const allowedPermissions: readonly Permission[] =
      rolePermissions[user.role as keyof typeof rolePermissions] || [];

    if (!allowedPermissions.includes(permission)) {
      return res
        .status(403)
        .json({ error: "Không có quyền truy cập chức năng này" });
    }

    next();
  };
}
