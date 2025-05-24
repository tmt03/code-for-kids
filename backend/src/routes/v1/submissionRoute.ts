import express from "express";
import { submissionController } from "../../controllers/submissionController";

const Router = express.Router();

Router.route("/submit").post(submissionController.submitCode);

export const codeRoute = Router;
