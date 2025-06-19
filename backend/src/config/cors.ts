import { CorsOptions } from "cors";
import { StatusCodes } from "http-status-codes";
import ApiError from "../utils/ApiError";
import { WHITELIST_DOMAINS } from "../utils/constants";
import { env } from "./environment";

// Cấu hình CORS Option trong dự án thực tế
export const corsOptions: CorsOptions = {
  origin: function (
    origin: string | undefined,
    callback: (err: Error | null, allow?: boolean) => void
  ) {
    // Cho phép tất cả trong dev (bao gồm POSTMAN hoặc không có origin)
    if (env.BUILD_MODE === "dev") {
      return callback(null, true);
    }

    // Cho phép không có origin trong production (nếu cần, ví dụ: server-to-server)
    if (!origin && env.BUILD_MODE === "production") {
      console.log("No origin detected in production, allowing for now"); // Log để debug
      return callback(null, true); // Hoặc thêm logic kiểm tra khác nếu cần
    }

    // Kiểm tra origin trong whitelist trong production
    if (origin && WHITELIST_DOMAINS.includes(origin)) {
      return callback(null, true);
    }

    // Trả về lỗi nếu origin không được chấp nhận
    return callback(
      new ApiError(
        StatusCodes.FORBIDDEN,
        `${origin || "undefined"} not allowed by our CORS Policy.`
      )
    );
  },

  // Một số trình duyệt cũ (IE11, SmartTVs) không hỗ trợ mã 204
  optionsSuccessStatus: 200,

  // Cho phép gửi cookies qua CORS
  credentials: true,
};
