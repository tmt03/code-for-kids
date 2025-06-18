// frontend/types/user.ts - cập nhật User interface
export interface User {
  userId: string;
  username: string;
  role: string;
  displayName: string;
  avatarUrl: string;
  bannerUrl: string;
  bio: string;
  email: string;
  ratingPoints: number;
  // TRIAL MODE FIELDS
  isActivated: boolean;
  trialChapterId: string;
  trialExpiresAt: string | null;
  trialInfo: TrialInfo | null;
}

export interface TrialInfo {
  isExpired: boolean;
  daysLeft: number;
  allowedChapter: string;
}
