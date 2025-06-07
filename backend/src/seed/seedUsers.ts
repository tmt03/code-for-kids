// scripts/seedUsers.ts
import { CLOSE_DB, CONNECT_DB } from "../config/mongoDB";
import { userModel } from "../models/userModel";

const seedUsers = async () => {
  await CONNECT_DB();

  const users = [
    { username: "admin01", password: "123", role: "admin" },
    { username: "student01", password: "123", role: "user" },
    { username: "student02", password: "123", role: "user" },
    { username: "admin02", password: "123", role: "admin" },
  ];

  for (const user of users) {
    const exists = await userModel.findByUsername(user.username);
    if (!exists) {
      await userModel.createNew(user);
      console.log(`✅ Created user: ${user.username}`);
    } else {
      console.log(`⚠️ User already exists: ${user.username}`);
    }
  }

  await CLOSE_DB();
};

seedUsers().catch((err) => {
  console.error("❌ Seed failed:", err);
});
