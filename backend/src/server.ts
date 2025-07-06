import cookieParser from "cookie-parser";
import Cors from "cors";
import exitHook from "exit-hook";
import express, { Express } from "express";
import cron from "node-cron";
import { corsOptions } from "./config/cors";
import { env } from "./config/environment";
import { CLOSE_DB, CONNECT_DB } from "./config/mongoDB";
import { errorHandlingMiddleware } from "./middlewares/errorHandlingMiddleware";
import APIs_V1 from "./routes/v1";
import { OrderCleanupService } from "./services/orderCleanupService";
import { cleanupUnverifiedUsers } from "./utils/cleanupUnverifiedUsers";
import http from "http";
import { Server as SocketIOServer } from "socket.io";
import { onlineUsers } from "./utils/onlineUsers";

// Start server
const START_SERVER = async () => {
  // Initialize express
  const app: Express = express();

  const server = http.createServer(app);

  const io = new SocketIOServer(server, {
    cors: {
      origin: "*",
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    socket.on("user-online", (userId: string) => {
      socket.data.userId = userId;
      onlineUsers.add(userId);
      io.emit("online-users", Array.from(onlineUsers));
    });

    socket.on("disconnect", () => {
      const userId = socket.data.userId;
      if (userId) {
        onlineUsers.delete(userId);
        io.emit("online-users", Array.from(onlineUsers));
      }
    })
  });

  app.use(Cors(corsOptions));

  app.use(express.json());

  app.use(cookieParser());

  app.use("/v1", APIs_V1);

  //Middleware xử lý lỗi
  app.use(errorHandlingMiddleware);

  // Khởi động cronjob xóa user chưa xác thực hết hạn OTP mỗi phút
  cron.schedule("* * * * *", cleanupUnverifiedUsers);

  // Khởi động Order Cleanup Service
  const orderCleanupService = OrderCleanupService.getInstance();
  orderCleanupService.startCleanupJobs();

  if (env.BUILD_MODE === "production") {
    server.listen(process.env.PORT, () => {
      console.log(`Server is running on port ${process.env.PORT}`);
    });
  } else {
    server.listen(
      Number(env.LOCAL_DEV_PORT) || 3000,
      env.LOCAL_DEV_HOST || "localhost",
      () => {
        console.log(
          `Local DEV: Server is running on port ${env.LOCAL_DEV_PORT} and host ${env.LOCAL_DEV_HOST}`
        );
      }
    );
  }

  //Thực hiện các tác vụ cleaup trước khi dừng server
  //Tài liệu: https://www.npmjs.com/package/exit-hook?activeTab=readme
  exitHook(() => {
    // Dừng cleanup service
    orderCleanupService.stopCleanupJobs();
    CLOSE_DB();
  });
};

CONNECT_DB()
  .then(() => console.log("Connected to MongoDB Cloud Atlas"))
  .then(() => START_SERVER())
  .catch((error) => {
    console.error("Failed to connect to MongoDB Cloud Atlas:", error);
    process.exit(0);
  });
