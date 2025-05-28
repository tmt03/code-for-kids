import express from "express";
import { submissionController } from "../../controllers/submissionController";

const Router = express.Router();
console.log(22);

Router.route("/submit").post(submissionController.submitCode);

export const submissionRoute = Router;
