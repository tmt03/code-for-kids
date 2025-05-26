import express from 'express';
import { authController } from '../../controllers/authController';

const Router = express.Router();

// GET /login/:username — lấy thông tin user
Router.route("/:username").get(authController.getUserInfo);

// POST /login — thực hiện đăng nhập
Router.post("/", authController.login);

export const loginRoute = Router;