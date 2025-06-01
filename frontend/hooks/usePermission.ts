import { useAuth } from "@/hooks/useAuth";
import { Permission, permissions } from "@/lib/utils/permissions";

export function usePermission(required: Permission) {
  const { user } = useAuth();
  if (!user) return false;

  const userPermissions: readonly Permission[] = permissions[user.role] || [];
  return userPermissions.includes(required);
}
