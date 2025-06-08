import { NextFunction, Request, Response } from "express";
import Joi from "joi";

export const validateSaveGame = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const schema = Joi.object({
    title: Joi.string().min(3).max(100).required(),
    description: Joi.string().max(500).allow("").optional(),
    code: Joi.string().min(10).required(),
  });

  const { error } = schema.validate(req.body, { abortEarly: false });

  if (error) {
    return res.status(400).json({
      message: "Invalid request data",
      details: error.details.map((d) => d.message),
    });
  }

  next();
};
