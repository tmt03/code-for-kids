import bcrypt from "bcryptjs";
import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import jwt from "jsonwebtoken";
import { env } from "../config/environment";
import { userModel } from "../models/userModel";
import { authService } from "../services/authService";
import { sendMail } from "../utils/emailService";
import { generateOtpEmail } from "../utils/emailTemplate";

const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { username, password } = req.body;

    const result = await authService.login(username, password);

    // Gửi refreshToken qua cookie
    res.cookie("refreshToken", result.refreshToken, {
      httpOnly: true,
      secure: env.NODE_ENV === "production",
      sameSite: env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 ngày
    });

    // Trả accessToken cho frontend
    res.status(StatusCodes.OK).json({
      accessToken: result.accessToken,
      user: result.user,
    });
  } catch (error: any) {
    res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ error: "Tên đăng nhập hoặc mật khẩu không chính xác." });
  }
};

const refreshToken = async (req: Request, res: Response) => {
  const token = req.cookies.refreshToken;

  if (!token) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ error: "Phiên đăng nhập không hợp lệ. Vui lòng đăng nhập lại." });
  }

  try {
    const result = await authService.refreshAccessToken(token);
    return res.status(StatusCodes.OK).json(result);
  } catch (error: any) {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      error: "Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.",
    });
  }
};

const logout = async (req: Request, res: Response) => {
  const token = req.cookies.refreshToken;
  if (!token) return res.sendStatus(204);

  try {
    // Sử dụng jwt.verify với ignoreExpiration để lấy thông tin user
    // ngay cả khi token đã hết hạn
    const decoded = jwt.verify(token, env.JWT_SECRET_REFRESH_TOKEN, {
      ignoreExpiration: true,
    }) as { username: string } | null;

    // Nếu token có thể được giải mã và chứa username, tiến hành logout
    if (decoded && decoded.username) {
      await authService.logout(decoded.username);
    }
  } catch (error) {
    // Trong production, có thể ghi log lỗi vào một hệ thống giám sát
    console.error("An error occurred during logout:", error);
  }

  // Luôn xóa cookie và trả về thông báo thành công cho client.
  res.clearCookie("refreshToken");
  res.status(200).json({ message: "Đã đăng xuất" });
};

const me = async (req: Request, res: Response) => {
  const userFromToken = (req as any).user; // lấy từ verifyToken

  if (!userFromToken) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ error: "Yêu cầu cần xác thực. Vui lòng đăng nhập." });
  }

  // Lấy user mới nhất từ DB
  const user = await authService.getUserInfo(userFromToken.username);
  if (!user) {
    return res.status(StatusCodes.NOT_FOUND).json({
      error: "Không thể tìm thấy thông tin người dùng. Vui lòng đăng nhập lại.",
    });
  }

  res.status(StatusCodes.OK).json({ user });
};

const forgotPassword = async (req: Request, res: Response) => {
  const { email } = req.body;
  const user = await userModel.findByEmail(email);
  if (!user)
    return res
      .status(StatusCodes.NOT_FOUND)
      .json({ error: "Địa chỉ email này chưa được đăng ký." });

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const expires = Date.now() + 3 * 60 * 1000; // 3 phút

  await userModel.saveOTP(user.username, otp, expires);

  const emailBody = generateOtpEmail(
    otp,
    "Bạn đã yêu cầu đặt lại mật khẩu. Vui lòng sử dụng mã OTP dưới đây để tiếp tục."
  );

  await sendMail(email, "[Scriptbies] Mã OTP đặt lại mật khẩu", emailBody);
  res.json({ message: "Một mã OTP đã được gửi đến email của bạn." });
};

export const resetPassword = async (req: Request, res: Response) => {
  const { email, otp, newPassword, confirmPassword } = req.body;
  if (newPassword !== confirmPassword)
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ error: "Mật khẩu và mật khẩu xác nhận không khớp." });

  const user = await userModel.findByEmail(email);
  if (!user)
    return res
      .status(StatusCodes.NOT_FOUND)
      .json({ error: "Địa chỉ email này chưa được đăng ký." });

  const otpRecord = await userModel.getOTP(user.username);
  if (
    !otpRecord ||
    otpRecord.resetOTP !== otp ||
    otpRecord.resetOTPExpires < Date.now()
  ) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ error: "Mã OTP không hợp lệ hoặc đã hết hạn." });
  }

  await userModel.changePassword(user.username, newPassword);
  await userModel.clearOTP(user.username);

  res.json({ message: "Đổi mật khẩu thành công. Bạn có thể đăng nhập ngay." });
};

export const register = async (req: Request, res: Response) => {
  const { username, password, email } = req.body;
  if (await userModel.findByUsername(username))
    return res
      .status(StatusCodes.CONFLICT)
      .json({ error: "Tên đăng nhập này đã được sử dụng." });
  if (await userModel.findByEmail(email))
    return res
      .status(StatusCodes.CONFLICT)
      .json({ error: "Địa chỉ email này đã được sử dụng." });

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
  const expires = Date.now() + 3 * 60 * 1000; // 3 phút
  await userModel.saveRegisterOTP(email, otp, expires);

  const emailBody = generateOtpEmail(
    otp,
    "Cảm ơn bạn đã đăng ký. Vui lòng sử dụng mã OTP dưới đây để xác minh tài khoản của bạn."
  );

  await sendMail(
    email,
    "[Scriptbies] Mã xác minh đăng ký tài khoản",
    emailBody
  );

  res.json({
    message:
      "OTP đã được gửi qua email cho bạn. Vui lòng nhập mã OTP để xác minh tài khoản. Nếu bạn không nhận được OTP, vui lòng kiểm tra lại email hoặc nhập lại email chính xác.",
  });
};

export const verifyEmail = async (req: Request, res: Response) => {
  const { email, otp } = req.body;

  const user = await userModel.findByEmail(email);
  if (!user)
    return res
      .status(StatusCodes.NOT_FOUND)
      .json({ error: "Địa chỉ email này chưa được đăng ký." });
  if (user.isVerified)
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ error: "Tài khoản này đã được xác minh trước đó." });

  const otpRecord = await userModel.getRegisterOTP(email);
  if (
    !otpRecord ||
    otpRecord.registerOTP !== otp ||
    otpRecord.registerOTPExpires < Date.now()
  ) {
    // Nếu OTP hết hạn, xóa luôn user chưa xác thực
    if (user && !user.isVerified) {
      await userModel.deleteByEmail(email);
    }
    return res.status(StatusCodes.BAD_REQUEST).json({
      error:
        "Mã OTP không hợp lệ hoặc đã hết hạn. Nếu bạn nhập sai email, vui lòng đăng ký lại với email chính xác.",
    });
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
