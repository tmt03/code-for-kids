import { ObjectId, ReturnDocument } from "mongodb";
import { GET_DB } from "../config/mongoDB";
import { UserGame } from "../types/userGame";

const USER_GAME_COLLECTION = "userGame";

const upsertUserGame = async ({
  userId,
  username,
  title,
  slug,
  description,
  code,
}: {
  userId: string;
  username: string;
  title: string;
  slug: string;
  description: string;
  code: string;
}): Promise<UserGame> => {
  const db = GET_DB();
  const userGames = db.collection<UserGame>(USER_GAME_COLLECTION);

  const filter = { userId: new ObjectId(userId) };
  const update = {
    $set: {
      username,
      title,
      slug,
      description,
      data: {
        code,
        updatedAt: new Date(),
      },
    },
  };
  const options = {
    upsert: true,
    returnDocument: ReturnDocument.AFTER,
  };

  const result = await userGames.findOneAndUpdate(filter, update, options);
  return result as UserGame;
};

const findBySlug = async (slug: string) => {
  const db = GET_DB();
  const userGames = db.collection<UserGame>(USER_GAME_COLLECTION);
  return await userGames.findOne({ slug });
};

const findByUserId = async (userId: string) => {
  const db = GET_DB();
  const userGames = db.collection<UserGame>(USER_GAME_COLLECTION);
  return await userGames.find({ userId: new ObjectId(userId) }).toArray();
};

const findByUsername = async (username: string) => {
  const db = GET_DB();
  const userGames = db.collection<UserGame>(USER_GAME_COLLECTION);
  return await userGames.find({ username }).toArray();
};

export const userGameModel = {
  upsertUserGame,
  findBySlug,
  findByUserId,
  findByUsername,
};
