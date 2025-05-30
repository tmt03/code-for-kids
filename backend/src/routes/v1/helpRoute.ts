import express from "express";
import { questController } from "../../controllers/questController";

const Router = express.Router();

Router.route("/:questId").get(questController.getQuestDetails);

export const helpRoute = Router;
