import { otpMailTemplate } from "./otpMailTemplate";

export const generateOtpEmail = (otp: string, message: string) => {
  return otpMailTemplate(otp, message);
};
