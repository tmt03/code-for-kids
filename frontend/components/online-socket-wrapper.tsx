"use client";
import { useAuth } from "@/hooks/useAuth";
import { useOnlineSocket } from "@/hooks/useOnlineSocket";

export default function OnlineSocketWrapper({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  useOnlineSocket(user?.userId);
  return <>{children}</>;
}