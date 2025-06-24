// routes/productRoutes.ts
import express from "express";
import {
  getAllProducts,
  getProductById,
} from "../../controllers/productController";

const Router = express.Router();

/**
 * Product Routes
 * Base path: /v1/products
 */

// Lấy tất cả sản phẩm
Router.get("/all", getAllProducts);

// Lấy sản phẩm theo ID
Router.get("/:pid", getProductById);

export default Router;
