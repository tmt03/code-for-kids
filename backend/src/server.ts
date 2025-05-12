import dotenv from "dotenv";
// Load environment variables
dotenv.config();

import express, { Express } from "express";
import exitHook from "exit-hook";
import { CONNECT_DB, GET_DB, CLOSE_DB } from "./config/mongoDB";

// Start server
const START_SERVER = async () => {
  // Initialize express
  const app: Express = express();

  // Basic route
  app.get("/", async (req, res) => {
    console.log(await GET_DB().listCollections().toArray());

    res.end("<h1>Welcome to code for kids</h1>");
  });

  const PORT: number = parseInt(process.env.PORT || "5000", 10);
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
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
