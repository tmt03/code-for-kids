import express from "express";
import { chapterRoute } from "./chapterRoute";
import { authRoute } from "./authRoute";
import { questRoute } from "./questRoute";
import { submissionRoute } from "./submissionRoute";

const Router = express.Router();

/** Quest APIs */
Router.use("/quests", questRoute);

Router.use("/chapters", chapterRoute);

Router.use("/submissions", submissionRoute);

Router.use("/auth", authRoute);

export default Router;
