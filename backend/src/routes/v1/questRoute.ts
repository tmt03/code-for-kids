import express from "express";
import { StatusCodes } from "http-status-codes";
import { questController } from "../../controllers/questController";

const Router = express.Router();

Router.route("/:questId").get(questController.getQuestDetails);

export const questRoute = Router;
