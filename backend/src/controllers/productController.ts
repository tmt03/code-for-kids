import { Request, Response } from "express";
import { ProductService } from "../services/productService";

/**
 * Controller xử lý các request liên quan đến sản phẩm
 */

/**
 * Lấy tất cả sản phẩm
 * @route GET /v1/products
 * @access Public
 */
export const getAllProducts = async (_req: Request, res: Response) => {
  try {
    // Gọi service để lấy danh sách sản phẩm
    const products = await ProductService.getAllProducts();

    res.status(200).json({
      success: true,
      message: "Lấy danh sách sản phẩm thành công",
      data: products,
      count: products.length,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "Lỗi lấy danh sách sản phẩm",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

/**
 * Lấy sản phẩm theo ID
 * @route GET /v1/products/:pid
 * @access Public
 */
export const getProductById = async (req: Request, res: Response) => {
  try {
    const { pid } = req.params;

    if (!pid) {
      return res.status(400).json({
        success: false,
        message: "Product ID không được để trống",
      });
    }

    // Gọi service để lấy sản phẩm theo ID
    const product = await ProductService.getProductById(pid);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy sản phẩm",
      });
    }

    res.status(200).json({
      success: true,
      message: "Lấy thông tin sản phẩm thành công",
      data: product,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "Lỗi lấy thông tin sản phẩm",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

/**
 * Lấy sản phẩm còn hàng
 * @route GET /v1/products/available
 * @access Public
 */
export const getAvailableProducts = async (_req: Request, res: Response) => {
  try {
    // Gọi service để lấy sản phẩm còn hàng
    const products = await ProductService.getAvailableProducts();

    res.status(200).json({
      success: true,
      message: "Lấy danh sách sản phẩm còn hàng thành công",
      data: products,
      count: products.length,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "Lỗi lấy danh sách sản phẩm còn hàng",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};
