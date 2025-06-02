export interface User {
  username: string;
  displayName: string;
  avatarUrl: string;
  bannerUrl: string;
  bio: string;
  role: "admin" | "user";
  // Thêm các trường khác nếu cần
}
