import { Request, Response } from "express";
import { gameService } from "../services/gameService";

const saveGame = async (req: Request, res: Response) => {
  try {
    const { userId, username } = (req as any).user;
    const { title, description, code } = req.body;

    if (!title || !code) {
      return res.status(400).json({ message: "Missing title or code." });
    }

    const result = await gameService.saveGame({
      userId,
      username,
      title,
      description,
      code,
    });

    return res
      .status(200)
      .json({ message: "Game saved successfully.", data: result });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error });
  }
};

const getSharedGame = async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;

    const game = await gameService.getGameBySlug(slug);
    if (!game) {
      return res.status(404).json({ message: "Game not found" });
    }

    return res.status(200).json({
      title: game.title,
      username: game.username,
      description: game.description,
      code: game.data.code,
      updatedAt: game.data.updatedAt,
      mode: "creative",
    });
  } catch (error) {
    console.error("getSharedGame error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const getMySharedGames = async (req: Request, res: Response) => {
  try {
    const { userId } = (req as any).user;
    const games = await gameService.getGamesByUserId(userId);
    return res.status(200).json(
      games.map((game) => ({
        slug: game.slug,
        title: game.title,
        description: game.description,
        updatedAt: game.data.updatedAt,
      }))
    );
  } catch (error) {
    console.error("getMySharedGames error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const getSharedGamesByUsername = async (req: Request, res: Response) => {
  try {
    const { username } = req.params;
    const games = await gameService.getGamesByUsername(username);
    return res.status(200).json(
      games.map((game) => ({
        slug: game.slug,
        title: game.title,
        description: game.description,
        updatedAt: game.data.updatedAt,
      }))
    );
  } catch (error) {
    console.error("getSharedGamesByUsername error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const gameController = {
  saveGame,
  getSharedGame,
  getMySharedGames,
  getSharedGamesByUsername,
};
