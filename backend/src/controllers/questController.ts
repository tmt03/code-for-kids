import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { questService } from "../services/questService";

const getQuestDetails = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // console.log("req.params", req.params);
    const questId = req.params.questId; //Lấy questId từ phía frontend gửi về qua fetch

    //Dieu huong du lieu sang tang service
    const quest = await questService.getQuestDetails(questId);

    //Co ket qua tra ve cho client

    res.status(StatusCodes.OK).json(quest);
  } catch (error: any) {
    next(error);
  }
};

export const questController = {
  getQuestDetails,
};
