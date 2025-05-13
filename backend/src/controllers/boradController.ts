import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import ApiError from "../utils/ApiError";
import { boardService } from "../services/boardService";

const createNew = async (req: Request, res: Response, next: NextFunction) => {
  try {
    console.log("req.body", req.body);
    console.log("req.query", req.query);
    console.log("req.params", req.params);

    //Dieu huong du lieu sang tang service
    const createdBoard = await boardService.createNew(req.body);

    //Co ket qua tra ve cho client

    res.status(StatusCodes.CREATED).json(createdBoard);
  } catch (error: any) {
    next(error);
  }
};

export const boardController = {
  createNew,
};
