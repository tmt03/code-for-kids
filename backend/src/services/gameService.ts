import { userGameModel } from "../models/userGameModel";
import { slugify } from "../utils/formatters";

const saveGame = async ({
  userId,
  username,
  title,
  description,
  code,
}: {
  userId: string;
  username: string;
  title: string;
  description: string;
  code: string;
}) => {
  const slug = slugify(title); // xử lý để tránh trùng

  const result = await userGameModel.upsertUserGame({
    userId,
    username,
    title,
    slug,
    description,
    code,
  });

  return result;
};

const getGameBySlug = async (slug: string) => {
  return await userGameModel.findBySlug(slug);
};

const getGamesByUserId = async (userId: string) => {
  return await userGameModel.findByUserId(userId);
};

export const gameService = {
  saveGame,
  getGameBySlug,
  getGamesByUserId,
};
