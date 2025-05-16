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
    // Cho phép gọi API bằng POSTMAN ở môi trường dev
    if (!origin && env.BUILD_MODE === "dev") {
      return callback(null, true);
    }

    // Kiểm tra xem origin có nằm trong danh sách whitelist không
    if (origin && WHITELIST_DOMAINS.includes(origin)) {
      return callback(null, true);
    }

    // Nếu domain không được chấp nhận thì trả về lỗi
    return callback(
      new ApiError(
        StatusCodes.FORBIDDEN,
        `${origin} not allowed by our CORS Policy.`
      )
    );
  },

  // Một số trình duyệt cũ (IE11, SmartTVs) không hỗ trợ mã 204
  optionsSuccessStatus: 200,

  // Cho phép gửi cookies qua CORS
  credentials: true,
};
