import express from "express";
import { StatusCodes } from "http-status-codes";
import { boardController } from "../../controllers/boradController";
import { boardValidation } from "../../validations/boardValidation";

const Router = express.Router();
Router.route("/")
  .get((req, res) => {
    res.status(StatusCodes.OK).json({ message: "Get: API get list boards" });
  })
  .post(boardValidation.createNew, boardController.createNew);

export const boardRoute = Router;
