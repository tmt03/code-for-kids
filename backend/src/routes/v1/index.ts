import express from "express";
import { chapterRoute } from "./chapterRoute";
import { loginRoute } from "./loginRoute";
import { questRoute } from "./questRoute";
import { submissionRoute } from "./submissionRoute";
import { helpRoute } from "./helpRoute";

const Router = express.Router();

/** Quest APIs */
Router.use("/quests", questRoute);

Router.use("/chapters", chapterRoute);

Router.use("/submissions", submissionRoute);

Router.use("/login", loginRoute);

Router.use("/help", helpRoute);

export default Router;
