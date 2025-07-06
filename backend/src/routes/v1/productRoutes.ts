// routes/productRoutes.ts
import express from "express";
import {
  addProduct,
  deleteProduct,
  getAllProducts,
  getProductById,
  updateProduct,
} from "../../controllers/productController";
import { verifyToken } from "../../middlewares/authMiddleware";
import { requirePermission } from "../../middlewares/permissionMiddleware";

const Router = express.Router();

/**
 * Product Routes
 * Base path: /v1/products
 */

// Lấy tất cả sản phẩm
Router.get("/all", getAllProducts);

// Lấy sản phẩm theo ID
Router.get("/:pid", getProductById);

// Thêm sản phẩm (admin)
Router.post("/", verifyToken, requirePermission("editProduct"), addProduct);

// Sửa sản phẩm (admin)
Router.put(
  "/:pid",
  verifyToken,
  requirePermission("editProduct"),
  updateProduct
);

// Xóa sản phẩm (admin)
Router.delete(
  "/:pid",
  verifyToken,
  requirePermission("deleteProduct"),
  deleteProduct
);

export default Router;
