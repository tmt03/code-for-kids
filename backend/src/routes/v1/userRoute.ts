import express from "express";
import multer from "multer";
import { uploadAvatar } from "../../controllers/userController";
import { uploadBanner } from "../../controllers/userController";
import { verifyToken } from "../../middlewares/authMiddleware";

const Router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

Router.post("/avatar", verifyToken, upload.single("avatar"), uploadAvatar);
Router.post("/banner", verifyToken, upload.single("banner"), uploadBanner);

export const userRoute = Router;