import express from "express";
import { questRoute } from "./questRoute";
import { chapterRoute } from "./chapterRoute";
import { loginRoute } from "./loginRoute";
const Router = express.Router();

/** Quest APIs */
Router.use("/quests", questRoute);

Router.use("/chapters", chapterRoute);

Router.use("/login", loginRoute);

export default Router;
