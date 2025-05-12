import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import ApiError from "../utils/ApiError";

const createNew = async (req: Request, res: Response, next: NextFunction) => {
  try {
    console.log("req.body", req.body);
    console.log("req.query", req.query);
    console.log("req.params", req.params);

    //Dieu huong du lieu sang tang service

    throw new ApiError(StatusCodes.BAD_REQUEST, "API ERROR");
    //Co ket qua tra ve cho client

    // res.status(StatusCodes.CREATED).json({ message: "Create new board" });
  } catch (error: any) {
    next(error);
  }
};

export const boardController = {
  createNew,
};
