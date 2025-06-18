// scripts/seedUsers.ts
import { CLOSE_DB, CONNECT_DB } from "../config/mongoDB";
import { userModel } from "../models/userModel";

const seedUsers = async () => {
  await CONNECT_DB();

  const users = [
    { username: "hocthu1", password: "12345", role: "user" },
    { username: "hocthu2", password: "12345", role: "user" },
    { username: "hocthu3", password: "12345", role: "user" },
    { username: "admin001", password: "admin1@6969", role: "admin" },
    { username: "admin002", password: "admin2@6969", role: "admin" },
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
