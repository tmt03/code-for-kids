import express from "express";
import { authController } from "../../controllers/authController";
import { verifyToken } from "../../middlewares/authMiddleware";

const Router = express.Router();

// GET /login/:username — lấy thông tin user
// Router.route("/:username").get(authController.getUserInfo);

// POST /login — thực hiện đăng nhập
Router.post("/login", authController.login);
Router.post("/refresh-token", authController.refreshToken);
Router.post("/logout", authController.logout);
Router.get("/me", verifyToken, authController.me);
Router.post("/forgot-password", authController.forgotPassword);
Router.post("/reset-password", authController.resetPassword);
Router.post("/register", authController.register);
Router.post("/verify-email", authController.verifyEmail);

export const authRoute = Router;
