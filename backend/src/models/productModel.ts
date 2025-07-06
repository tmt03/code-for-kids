import { ObjectId } from "mongodb";
import { GET_DB } from "../config/mongoDB";

export interface ProductData {
  _id?: ObjectId;
  pid: string;
  pname: string;
  pimg: string;
  pdescription: string;
  pprice: number;
  pquantity: number;

  // Phân loại sản phẩm
  category: "course" | "event";

  // Mô tả chi tiết
  shortDescription: string; // Mô tả ngắn cho card
  longDescription: string; // Mô tả chi tiết cho trang detail
  features: string[]; // Tính năng nổi bật

  // Media & Content
  images: string[]; // Nhiều ảnh cho gallery
  videoUrl?: string; // Video giới thiệu
  demoUrl?: string; // Link demo/trial

  // Thông tin khóa học
  courseInfo?: {
    duration: string; // "10 hours"
    lessons: number;
    level: "beginner" | "intermediate" | "advanced";
    ageGroup: string; // "8-12 tuổi", "13-16 tuổi", "17+"
    genre: string; // "Game Development", "Web Development", "Mobile App", "AI/ML"
    certificate: boolean;
  };

  // Thông tin sự kiện
  eventInfo?: {
    eventDate: Date;
    eventTime: string; // "14:00 - 17:00"
    location: string;
    organizer: string;
    maxAttendees: number;
    eventType: "workshop" | "seminar" | "hackathon" | "conference";
    agenda?: string[]; // Chương trình sự kiện
  };

  // Sản phẩm đi kèm/Quà tặng
  includedProducts?: {
    name: string;
    image: string;
    description: string;
  }[];

  // Trạng thái & Hiển thị
  isActive: boolean;
  isFeatured: boolean;

  // Thống kê
  viewCount: number;
  purchaseCount: number;

  createdAt?: Date;
  updatedAt?: Date;
}

// Collection name
const COLLECTION_NAME = "products";

/**
 * Lấy tất cả sản phẩm từ database
 * @returns Danh sách tất cả sản phẩm
 */
export const getAllProducts = async (): Promise<ProductData[]> => {
  const db = GET_DB();
  const collection = db.collection<ProductData>(COLLECTION_NAME);
  return await collection.find({}).toArray();
};

/**
 * Lấy sản phẩm theo ID
 * @param pid Product ID
 * @returns Sản phẩm hoặc null nếu không tìm thấy
 */
export const getProductById = async (
  pid: string
): Promise<ProductData | null> => {
  const db = GET_DB();
  const collection = db.collection<ProductData>(COLLECTION_NAME);
  return await collection.findOne({ pid });
};

/**
 * Lấy sản phẩm theo filter
 * @param filter MongoDB filter object
 * @returns Danh sách sản phẩm theo filter
 */
export const getProductsByFilter = async (
  filter: any = {}
): Promise<ProductData[]> => {
  const db = GET_DB();
  const collection = db.collection<ProductData>(COLLECTION_NAME);
  return await collection.find(filter).toArray();
};

// Insert product
export const insertProduct = async (product: Omit<ProductData, "_id">) => {
  const db = GET_DB();
  const collection = db.collection<ProductData>(COLLECTION_NAME);
  return await collection.insertOne({
    ...product,
    createdAt: new Date(),
    updatedAt: new Date(),
  });
};

// Update product
export const updateProduct = async (
  id: string,
  updateData: Partial<ProductData>
) => {
  const db = GET_DB();
  const collection = db.collection<ProductData>(COLLECTION_NAME);
  return await collection.updateOne(
    { _id: new ObjectId(id) },
    { $set: { ...updateData, updatedAt: new Date() } }
  );
};

// Delete product (soft delete)
export const deleteProduct = async (id: string) => {
  const db = GET_DB();
  const collection = db.collection<ProductData>(COLLECTION_NAME);
  // Xóa mềm: chỉ cập nhật isActive=false
  return await collection.updateOne(
    { _id: new ObjectId(id) },
    { $set: { isActive: false, updatedAt: new Date() } }
  );
};
