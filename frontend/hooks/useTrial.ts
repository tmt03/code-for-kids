// frontend/hooks/useTrial.ts
import { useAuth } from "./useAuth";

export function useTrial() {
  const { user, isTrialMode, trialInfo } = useAuth();

  const isExpired = trialInfo?.isExpired || false;
  const daysLeft = trialInfo?.daysLeft || 0;
  const allowedChapter = user?.trialChapterId || "C00";

  const canAccessChapter = (chapterId: string) => {
    if (!isTrialMode) return true;
    return chapterId.startsWith(allowedChapter);
  };

  const canAccessQuest = (questId: string) => {
    if (!isTrialMode) return true;
    return questId.startsWith(allowedChapter);
  };

  const canSubmitCode = (questId: string) => {
    if (!isTrialMode) return true;
    return questId.startsWith(allowedChapter);
  };

  const canSaveGame = () => {
    return !isTrialMode;
  };

  return {
    isTrialMode,
    trialInfo,
    isExpired,
    daysLeft,
    allowedChapter,
    canAccessChapter,
    canSubmitCode,
    canSaveGame,
    canAccessQuest,
  };
}
