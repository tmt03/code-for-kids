import express from "express";
import { authController } from "../../controllers/authController";
import { verifyToken } from "../../middlewares/verifyToken";

const Router = express.Router();

// GET /me - kiểm tra token trước
Router.get("/me", verifyToken, authController.me);

// POST /login - đăng nhập
Router.post("/login", authController.login);

// POST /logout - đăng xuất
Router.post("/logout", authController.logout);

// GET /:username — lấy thông tin user (sau cùng)
Router.get("/:username", authController.getUserInfo);

export const authRoute = Router;