import { Db, MongoClient, ServerApiVersion } from "mongodb";
import { env } from "./environment";

let scriptbiesDatabaseInstance: Db | null = null;

const mongoClientInstance = new MongoClient(env.MONGODB_URI as string, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

//Kêt nối database
export const CONNECT_DB = async () => {
  //Gọi kết nối mongoDB Atlas với uri đã khai báo
  await mongoClientInstance.connect();

  //Kêt nối thành công, lấy database theo tên và gán lại scriptbiesDatabaseInstance
  scriptbiesDatabaseInstance = mongoClientInstance.db(
    env.MONGODB_NAME as string
  );
};

//Export ra Scriptbies Database Instance sau khi connect thành công để sử dung ở nhiều nơi khác trong code
//Lưu ý: đảm bảo chỉ luôn gọi GET_DB sau khi connect thành công tới MongoDB
export const GET_DB = () => {
  if (!scriptbiesDatabaseInstance)
    throw Error("Must connect to database first");
  return scriptbiesDatabaseInstance;
};

export const CLOSE_DB = async () => {
  console.log("Closing database connection...");
  await mongoClientInstance.close();
};
