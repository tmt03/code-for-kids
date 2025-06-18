import express from "express";
import { chapterRoute } from "./chapterRoute";
import { authRoute } from "./authRoute";
import { questRoute } from "./questRoute";
import { submissionRoute } from "./submissionRoute";
import { userRoute } from "./userRoute";
import { progressRoute } from "./progressRoute";
import { userGameRoute } from "./userGameRoute";
import { adminRoute } from "./adminRoute";

const Router = express.Router();

/** Quest APIs */
Router.use("/quests", questRoute);

Router.use("/chapters", chapterRoute);

Router.use("/submissions", submissionRoute);

Router.use("/auth", authRoute);

Router.use("/users", userRoute);

Router.use("/progress", progressRoute);

Router.use("/user-game", userGameRoute);

Router.use("/admin", adminRoute);

export default Router;
