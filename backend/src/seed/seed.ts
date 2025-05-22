// backend/seed/seed.ts
import { CONNECT_DB, GET_DB, CLOSE_DB } from "../config/mongoDB";
import { readFileSync } from "fs";
import path from "path";

async function seedChapters() {
  try {
    // B1: Kết nối DB
    await CONNECT_DB();
    const db = GET_DB();

    // B2: Đọc file JSON
    const jsonPath = path.join(__dirname, "chapter.json");
    const chapters = JSON.parse(readFileSync(jsonPath, "utf-8"));

    // B3: Ghi vào collection `chapters`
    const chaptersCollection = db.collection("chapters");

    // Xóa dữ liệu cũ (nếu muốn)
    await chaptersCollection.deleteMany({});
    await chaptersCollection.insertMany(chapters);

    console.log("Seed thành công chương học!");
  } catch (err) {
    console.error("Seed thất bại:", err);
  } finally {
    await CLOSE_DB();
  }
}

seedChapters();
