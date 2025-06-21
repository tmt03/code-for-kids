/**
 * Cắt một chuỗi tại dấu chấm đầu tiên.
 * Nếu không có dấu chấm, trả về chuỗi gốc.
 * @param str - Chuỗi đầu vào.
 * @returns Chuỗi đã được cắt hoặc chuỗi gốc.
 */
export const truncateBeforeDot = (str: string | undefined): string => {
  if (!str) {
    return "";
  }
  const dotIndex = str.indexOf(".");
  if (dotIndex !== -1) {
    return str.substring(0, dotIndex);
  }
  return str;
};
