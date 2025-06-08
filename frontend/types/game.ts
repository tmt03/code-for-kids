export interface SaveGameRequest {
  title: string;
  description?: string;
  code: string;
}

export interface SaveGameData {
  _id: string;
  userId: string;
  username: string;
  title: string;
  slug: string;
  description: string;
  data: {
    code: string;
    updatedAt: string;
  };
}

export interface SaveGameResponse {
  message: string;
  data: SaveGameData;
}
