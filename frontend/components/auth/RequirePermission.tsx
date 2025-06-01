"use client";

import { usePermission } from "@/hooks/usePermission";

interface Props {
    permission: import("@/lib/utils/permissions").Permission;
    children: React.ReactNode;
    fallback?: React.ReactNode;
}

export default function RequirePermission({ permission, children, fallback = null }: Props) {
    const hasPermission = usePermission(permission);

    if (!hasPermission) return <>{fallback}</>;
    return <>{children}</>;
}
