import { useEffect, useState } from "react";
import { fetchUserOnlineStatus } from "@/apis";

export function useUserOnlineStatus(userId: string) {
  const [isOnline, setIsOnline] = useState(false);

  useEffect(() => {
    if (!userId) return;
    let isMounted = true;
    const fetchStatus = async () => {
      try {
        const online = await fetchUserOnlineStatus(userId);
        if (isMounted) setIsOnline(online);
      } catch {
        if (isMounted) setIsOnline(false);
      }
    };
    fetchStatus();
    const interval = setInterval(fetchStatus, 10000); // check lại mỗi 10s
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [userId]);

  return isOnline;
}