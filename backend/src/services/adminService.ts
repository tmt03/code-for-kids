import { userModel } from "../models/userModel";

/** Lấy danh sách user */
export const getAllUsersService = async () => {
  return await userModel.findAllUsers();
};

/** Ban user (set _destroy = true) */
export const banUserService = async (username: string) => {
  return await userModel.banUser(username);
};

/** Mở ban user (set _destroy = false) */
export const unbanUserService = async (username: string) => {
  return await userModel.unbanUser(username);
};

/** Mở khóa user */
export const activateUserService = async (username: string) => {
  return await userModel.activateUser(username);
};

/** Hủy kích hoạt khóa học */
export const deactivateUserService = async (username: string) => {
  return await userModel.deactivateUser(username);
};

/** Update user info */
export const updateUserService = async (username: string, updateData: any) => {
  return await userModel.updateUser(username, updateData);
};
