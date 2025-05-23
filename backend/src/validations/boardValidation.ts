import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import Joi from "joi";
import ApiError from "../utils/ApiError";

const createNew = async (req: Request, res: Response, next: NextFunction) => {
  const correctValidation = Joi.object({
    name: Joi.string().required().min(3).max(50).trim().strict(),
    description: Joi.string().required().min(3).max(255).trim().strict(),
  });

  try {
    //set option abortEarly to false để hiển thị tất cả các lỗi
    await correctValidation.validateAsync(req.body, {
      abortEarly: false,
    });
    next();
  } catch (error) {
    next(
      new ApiError( 
        StatusCodes.UNPROCESSABLE_ENTITY,
        new Error(error as string).message
      )
    );
  }
};

export const boardValidation = {
  createNew,
};
