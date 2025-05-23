import express from "express";
import { questRoute } from "./questRoute";
import { chapterRoute } from "./chapterRoute";
const Router = express.Router();

/** Quest APIs */
Router.use("/quests", questRoute);

Router.use("/chapters", chapterRoute);

export default Router;
