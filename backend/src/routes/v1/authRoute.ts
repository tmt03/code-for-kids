import express from "express";
import { authController } from "../../controllers/authController";

const Router = express.Router();

// GET /login/:username — lấy thông tin user
// Router.route("/:username").get(authController.getUserInfo);

// POST /login — thực hiện đăng nhập
Router.post("/login", authController.login);
Router.post("/refresh-token", authController.refreshToken);
Router.post("/logout", authController.logout);

export const authRoute = Router;
