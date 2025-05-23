import express from "express";
import { questRoute } from "./questRoute";
const Router = express.Router();

/** Quest APIs */
Router.use("/chapters", questRoute);

export default Router;
