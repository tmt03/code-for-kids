import express from "express";
import { questRoute } from "./questRoute";
import { chapterRoute } from "./chapterRoute";
import { authRoute } from "./authRoute";
const Router = express.Router();

/** Quest APIs */
Router.use("/quests", questRoute);

Router.use("/chapters", chapterRoute);

Router.use("/auth", authRoute);

export default Router;
