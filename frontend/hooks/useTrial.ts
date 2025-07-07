// frontend/hooks/useTrial.ts
import { useAuth } from "./useAuth";

export function useTrial() {
  const { user, isTrialMode, trialInfo } = useAuth();

  const isExpired = trialInfo?.isExpired || false;
  const daysLeft = trialInfo?.daysLeft || 0;
  const allowedChapters = ["C00", "C01"];

  const canAccessChapter = (chapterId: string) => {
    if (!isTrialMode) return true;
    return allowedChapters.some((chapter) => chapterId.startsWith(chapter));
  };

  const canAccessQuest = (questId: string) => {
    if (!isTrialMode) return true;
    return allowedChapters.some((chapter) => questId.startsWith(chapter));
  };

  const canSubmitCode = (questId: string) => {
    if (!isTrialMode) return true;
    return allowedChapters.some((chapter) => questId.startsWith(chapter));
  };

  const canSaveGame = () => {
    return !isTrialMode;
  };

  return {
    isTrialMode,
    trialInfo,
    isExpired,
    daysLeft,
    allowedChapters,
    canAccessChapter,
    canSubmitCode,
    canSaveGame,
    canAccessQuest,
  };
}
