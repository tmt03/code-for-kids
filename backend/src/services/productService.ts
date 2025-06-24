import {
  ProductData,
  getAllProducts,
  getProductById,
  getProductsByFilter,
} from "../models/productModel";

/**
 * Service class xử lý business logic cho sản phẩm
 */
export class ProductService {
  /**
   * Lấy tất cả sản phẩm có sẵn
   * @returns Danh sách sản phẩm đã được xử lý
   */
  static async getAllProducts(): Promise<ProductData[]> {
    try {
      // Lấy tất cả sản phẩm từ database
      const products = await getAllProducts();

      // Có thể thêm logic xử lý business ở đây
      // Ví dụ: lọc sản phẩm hết hàng, sắp xếp theo giá, etc.

      return products;
    } catch (error) {
      throw new Error("Không thể lấy danh sách sản phẩm");
    }
  }

  /**
   * Lấy sản phẩm theo ID
   * @param pid Product ID
   * @returns Sản phẩm hoặc null
   */
  static async getProductById(pid: string): Promise<ProductData | null> {
    try {
      if (!pid) {
        throw new Error("Product ID không được để trống");
      }

      const product = await getProductById(pid);
      return product;
    } catch (error) {
      throw new Error("Không thể lấy thông tin sản phẩm");
    }
  }

  /**
   * Lấy sản phẩm theo filter
   * @param filter Filter object
   * @returns Danh sách sản phẩm theo filter
   */
  static async getProductsByFilter(filter: any = {}): Promise<ProductData[]> {
    try {
      const products = await getProductsByFilter(filter);
      return products;
    } catch (error) {
      throw new Error("Không thể lấy danh sách sản phẩm theo filter");
    }
  }

  /**
   * Lấy sản phẩm còn hàng (quantity > 0)
   * @returns Danh sách sản phẩm còn hàng
   */
  static async getAvailableProducts(): Promise<ProductData[]> {
    try {
      const filter = { pquantity: { $gt: 0 } };
      const products = await getProductsByFilter(filter);
      return products;
    } catch (error) {
      throw new Error("Không thể lấy danh sách sản phẩm có sẵn");
    }
  }
}
