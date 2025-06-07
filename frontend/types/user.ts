export interface User {
  username: string;
  displayName: string;
  avatarUrl: string;
  bannerUrl: string;
  bio: string;
  role: "admin" | "user";
  ratingPoints: number;
  // Thêm các trường khác nếu cần
}
