import Cors from "cors";
import exitHook from "exit-hook";
import express, { Express } from "express";
import { corsOptions } from "./config/cors";
import { env } from "./config/environment";
import { CLOSE_DB, CONNECT_DB } from "./config/mongoDB";
import { errorHandlingMiddleware } from "./middlewares/errorHandlingMiddleware";
import APIs_V1 from "./routes/v1";

// Start server
const START_SERVER = async () => {
  // Initialize express
  const app: Express = express();

  app.use(Cors(corsOptions));

  app.use(express.json());
  console.log(3);
  app.use("/v1", APIs_V1);

  //Middleware xử lý lỗi
  app.use(errorHandlingMiddleware);

  app.listen(env.PORT, () => {
    console.log(`Server is running on port ${env.PORT}`);
  });

  //Thực hiện các tác vụ cleaup trước khi dừng server
  //Tài liệu: https://www.npmjs.com/package/exit-hook?activeTab=readme
  exitHook(() => {
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
