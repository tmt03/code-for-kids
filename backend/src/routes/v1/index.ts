import express from "express";
import { chapterRoute } from "./chapterRoute";
import { loginRoute } from "./loginRoute";
import { questRoute } from "./questRoute";
import { submissionRoute } from "./submissionRoute";

const Router = express.Router();

/** Quest APIs */
Router.use("/quests", questRoute);

Router.use("/chapters", chapterRoute);

console.log(1);
Router.use("/submissions", submissionRoute);

Router.use("/login", loginRoute);

export default Router;
