import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { chapterService } from "../services/chapterService";

const getAllChapters = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    //Dieu huong du lieu sang tang service
    const quest = await chapterService.getAllChapters();

    //Co ket qua tra ve cho client

    res.status(StatusCodes.OK).json(quest);
  } catch (error: any) {
    next(error);
  }
};

export const chapterController = {
  getAllChapters,
};
