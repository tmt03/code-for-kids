import { ObjectId } from "mongodb";

export interface UserGame {
  _id?: ObjectId;
  userId: ObjectId;
  username: string;
  title: string;
  slug: string;
  description: string;
  data: {
    code: string;
    updatedAt: Date;
  };
}
