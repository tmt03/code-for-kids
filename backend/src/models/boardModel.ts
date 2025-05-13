import Joi from "joi";
import { ObjectId } from "mongodb";
import { GET_DB } from "../config/mongoDB";

//Define the collection name and schema
const BOARD_COLLECTION_NAME = "boards";
const BOARD_COLLECTION_SCHEMA = Joi.object({
  title: Joi.string().required(),
  slug: Joi.string().required(),
  description: Joi.string().required(),

  columnOrderIds: Joi.array()
    .items(Joi.string().pattern(/^[0-9a-fA-F]{24}$/))
    .default([]),

  createdAt: Joi.date().required(),
  updatedAt: Joi.date().required(),
  _destroy: Joi.boolean().required(),
});

const createNew = async (data: any) => {
  try {
    const createBoard = await GET_DB()
      .collection(BOARD_COLLECTION_NAME)
      .insertOne(data);
    return createBoard;
  } catch (error) {
    throw new Error(error as string);
  }
};

const findOneById = async (id: string) => {
  try {
    const findBoard = await GET_DB()
      .collection(BOARD_COLLECTION_NAME)
      .findOne({ _id: new ObjectId(id.toString()) });
    return findBoard;
  } catch (error) {
    throw new Error(error as string);
  }
};

export const BoardModel = {
  BOARD_COLLECTION_NAME,
  BOARD_COLLECTION_SCHEMA,
  createNew,
  findOneById,
};
