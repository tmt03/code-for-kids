import "dotenv/config";

export const env = {
  MONGODB_URI: process.env.MONGODB_URI,
  MONGODB_NAME: process.env.MONGODB_NAME,
  LOCAL_DEV_HOST: process.env.LOCAL_DEV_HOST,
  LOCAL_DEV_PORT: process.env.LOCAL_DEV_PORT,

  AUTHOR: process.env.AUTHOR,
  BUILD_MODE: process.env.BUILD_MODE || "dev",
  NODE_ENV: process.env.NODE_ENV,

  JWT_SECRET_ACCESS_TOKEN:
    process.env.JWT_SECRET_ACCESS_TOKEN || "access_default",
  JWT_SECRET_REFRESH_TOKEN:
    process.env.JWT_SECRET_REFRESH_TOKEN || "refresh_default",
};
