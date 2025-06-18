import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { authService } from "../services/authService";
import jwt from "jsonwebtoken";
import { env } from "../config/environment";
import { userModel } from "../models/userModel";
import { sendMail } from "../utils/emailService";
import bcrypt from "bcryptjs";

// const getUserInfo = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   try {
//     const username = req.params.username;
//     const result = await authService.getUserInfo(username);

//     if (!result) {
//       return res.status(StatusCodes.NOT_FOUND).json({ error: "User not found" });
//     }

//     // Xóa trường password hoặc password_hash
//     const { password_hash, ...safeUser } = result;

//     res.status(StatusCodes.OK).json(safeUser);
//   } catch (error: any) {
//     next(error);
//   }
// };

const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { username, password } = req.body;

    const result = await authService.login(username, password);

    // Gửi refreshToken qua cookie
    res.cookie("refreshToken", result.refreshToken, {
      httpOnly: true,
      secure: env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 ngày
    });

    // Trả accessToken cho frontend
    res.status(StatusCodes.OK).json({
      accessToken: result.accessToken,
      user: result.user,
    });
  } catch (error: any) {
    res.status(StatusCodes.UNAUTHORIZED).json({ error: error.message });
  }
};

const refreshToken = async (req: Request, res: Response) => {
  const token = req.cookies.refreshToken;

  if (!token) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ error: "Thiếu refreshToken" });
  }

  try {
    const result = await authService.refreshAccessToken(token);
    return res.status(StatusCodes.OK).json(result);
  } catch (error: any) {
    return res.status(StatusCodes.UNAUTHORIZED).json({ error: error.message });
  }
};

const logout = async (req: Request, res: Response) => {
  const token = req.cookies.refreshToken;
  if (!token) return res.sendStatus(204);

  try {
    const decoded = jwt.verify(token, env.JWT_SECRET_REFRESH_TOKEN) as any;
    await authService.logout(decoded.username);
  } catch (e) {}

  res.clearCookie("refreshToken");
  res.status(200).json({ message: "Đã đăng xuất" });
};

const me = async (req: Request, res: Response) => {
  const userFromToken = (req as any).user; // lấy từ verifyToken

  if (!userFromToken) {
    return res.status(401).json({ error: "Chưa xác thực" });
  }

  // Lấy user mới nhất từ DB
  const user = await authService.getUserInfo(userFromToken.username);
  if (!user) {
    return res.status(404).json({ error: "Không tìm thấy user" });
  }

  res.status(200).json({ user });
};

const forgotPassword = async (req: Request, res: Response) => {
  const { email } = req.body;
  const user = await userModel.findByEmail(email);
  if (!user) return res.status(404).json({ error: "Email không tồn tại" });

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const expires = Date.now() + 10 * 60 * 1000;

  await userModel.saveOTP(user.username, otp, expires);
  await sendMail(email, "[Scriptbies] Mã OTP đặt lại mật khẩu", `Mã OTP của bạn là: ${otp}. KHÔNG CHIA SẺ MÃ NÀY CHO BẤT KỲ AI. Bạn có 10 phút để sử dụng mã này. Nếu bạn không yêu cầu đặt lại mật khẩu, hãy bỏ qua email này. Bạn cũng nên thay đổi mật khẩu của mình thường xuyên để bảo mật tài khoản.`);
  res.json({ message: "Đã gửi OTP về email" });

};

export const resetPassword = async (req: Request, res: Response) => {
    const { email, otp, newPassword, confirmPassword } = req.body;
    if (newPassword !== confirmPassword)
        return res.status(400).json({ error: "Mật khẩu không khớp" });

    const user = await userModel.findByEmail(email);
    if (!user) return res.status(404).json({ error: "Email không tồn tại" });

    const otpRecord = await userModel.getOTP(user.username);
    if (
        !otpRecord ||
        otpRecord.resetOTP !== otp ||
        otpRecord.resetOTPExpires < Date.now()
    ) {
        return res.status(400).json({ error: "OTP không hợp lệ hoặc đã hết hạn" });
    }

    await userModel.changePassword(user.username, newPassword);
    await userModel.clearOTP(user.username);

    res.json({ message: "Đổi mật khẩu thành công" });
};

export const register = async (req: Request, res: Response) => {
  const { username, password, email } = req.body;
  if (await userModel.findByUsername(username))
    return res.status(400).json({ error: "Username đã tồn tại" });
  if (await userModel.findByEmail(email))
    return res.status(400).json({ error: "Email đã tồn tại" });

  const hashedPassword = await bcrypt.hash(password, 10);
  await userModel.createNew({
    username,
    password: hashedPassword,
    email,
    role: "user",
    _destroy: false,
    created_at: new Date(),
    updated_at: null,
    avatarUrl: null,
    bannerUrl: null,
    bio: null,
    displayName: null,
    resetOTP: null,
    resetOTPExpires: null,
    isVerified: false,
    registerOTP: null,
    registerOTPExpires: null,
  });

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const expires = Date.now() + 10 * 60 * 1000; // 10 phút
  await userModel.saveRegisterOTP(email, otp, expires);

  await sendMail(email, "[Scriptbies] Mã xác minh đăng ký tài khoản", `Mã OTP đăng ký tài khoản của bạn là: ${otp}`);

  res.json({ message: "Đăng ký thành công, vui lòng kiểm tra email để xác minh tài khoản." });
};

export const verifyEmail = async (req: Request, res: Response) => {
  const { email, otp } = req.body;

  const user = await userModel.findByEmail(email);
  if (!user) return res.status(404).json({ error: "Email không tồn tại" });
  if (user.isVerified) return res.status(400).json({ error: "Tài khoản đã xác minh" });

  const otpRecord = await userModel.getRegisterOTP(email);
  if (
      !otpRecord ||
      otpRecord.registerOTP !== otp ||
      otpRecord.registerOTPExpires < Date.now()
  ) {
    return res.status(400).json({ error: "OTP không hợp lệ hoặc đã hết hạn" });
  }

  await userModel.verifyUser(email);
  await userModel.clearRegisterOTP(email);

  res.json({ message: "Xác minh email thành công, bạn có thể đăng nhập!" });
};

export const authController = {
  login,
  refreshToken,
  logout,
  me,
  forgotPassword,
  resetPassword,
  register,
  verifyEmail,
};
