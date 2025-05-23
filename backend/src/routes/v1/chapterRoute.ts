import express from "express";
import { chapterController } from "../../controllers/chapterController";

const Router = express.Router();
Router.route("/").get(chapterController.getAllChapters);

export const chapterRoute = Router;
