import { Db, MongoClient, ServerApiVersion } from "mongodb";

// const uri = process.env.MONGODB_URI;
const uri =
  "mongodb+srv://tmt03:tmt03@cluster0-scriptbies.13edc5x.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0-Scriptbies";
const databaseName = process.env.DATABASE_NAME;
let scriptbiesDatabaseInstance: Db | null = null;

const mongoClientInstance = new MongoClient(uri, {
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
  scriptbiesDatabaseInstance = mongoClientInstance.db(databaseName);
};

//Export ra Scriptbies Database Instance sau khi connect thành công để sử dung ở nhiều nơi khác trong code
//Lưu ý: đảm bảo chỉ luôn gọi GET_DB sau khi connect thành công tới MongoDB
export const GET_DB = () => {
  if (!scriptbiesDatabaseInstance)
    throw Error("Must connect to database first");
  return scriptbiesDatabaseInstance;
};

export const CLOSE_DB = async () => {
  await mongoClientInstance.close();
};
