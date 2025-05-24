import express from "express";
import { StatusCodes } from "http-status-codes";
import { submissionController } from "../../controllers/submissionController";

const Router = express.Router();

Router.route("/").post(submissionController.submitCode);

export const codeRoute = Router;
