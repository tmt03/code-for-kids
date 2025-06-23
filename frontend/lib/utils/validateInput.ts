// Escape username: chỉ cho phép chữ, số, dấu chấm, dấu gạch dưới
export function escapeUsername(str: string) {
  return str.replace(/[^a-zA-Z0-9._]/g, "");
}

// Escape email: chỉ cho phép ký tự hợp lệ của email
export function escapeEmail(str: string) {
  return str.replace(/[^a-zA-Z0-9@._\-+]/g, "");
}

// Escape OTP: chỉ cho phép chữ số
export function escapeOtp(str: string) {
  return str.replace(/[^0-9]/g, "");
}

// Validate username
export function isValidUsername(str: string) {
  // Không bắt đầu hoặc kết thúc bằng dấu chấm hoặc gạch dưới, chỉ cho phép chữ, số, dấu chấm, dấu gạch dưới ở giữa
  return /^(?![._])[a-zA-Z0-9._]+(?<![._])$/.test(str);
}

// Validate email (regex đơn giản)
export function isValidEmail(str: string) {
  return /^[a-zA-Z0-9._\-+]+@[a-zA-Z0-9._\-]+\.[a-zA-Z]{2,}$/.test(str);
}

// Validate OTP (6 số)
export function isValidOtp(str: string) {
  return /^[0-9]{6}$/.test(str);
}

// Validate password: tối thiểu 6 ký tự, không chứa khoảng trắng, có ít nhất 1 chữ cái và 1 số
export function isValidPassword(str: string) {
  return (
    /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]{6,}$/.test(
      str
    ) && !/\s/.test(str)
  );
}
