import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { questService } from "../services/questService";
import { questModel } from "../models/questModel";

const getQuestDetails = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const questId = req.params.questId; //Lấy questId từ phía frontend gửi về qua fetch

    //Dieu huong du lieu sang tang service
    const quest = await questService.getQuestDetails(questId);

    //Co ket qua tra ve cho client

    res.status(StatusCodes.OK).json(quest);
  } catch (error: any) {
    next(error);
  }
};

const updateQuestVideoUrl = async (req: Request, res: Response) => {
  const { questId } = req.params;
  const { videoUrl } = req.body;

  if (!videoUrl) {
    return res.status(StatusCodes.BAD_REQUEST).json({ error: "Thiếu videoUrl" });
  }

  await questModel.updateQuestVideoUrl(questId, videoUrl);

  res.json({ message: "Cập nhật videoUrl thành công" });
};

export const questController = {
  getQuestDetails,
  updateQuestVideoUrl,
};
