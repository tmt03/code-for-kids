import express from "express";
import { adminRoute } from "./adminRoute";
import { authRoute } from "./authRoute";
import { chapterRoute } from "./chapterRoute";
import { orderRoute } from "./orderRoute";
import productRoute from "./productRoutes";
import { progressRoute } from "./progressRoute";
import { questRoute } from "./questRoute";
import { submissionRoute } from "./submissionRoute";
import { userGameRoute } from "./userGameRoute";
import { userRoute } from "./userRoute";

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

Router.use("/orders", orderRoute);

Router.use("/products", productRoute);
export default Router;
