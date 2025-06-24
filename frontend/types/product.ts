// src/types/product.ts

export interface Product {
  pid: string;
  pname: string;
  pimg: string;
  pdescription: string;
  pprice: number;
  pquantity: number;

  // Phân loại sản phẩm
  category: "course" | "event";

  // Mô tả chi tiết
  shortDescription: string;
  longDescription: string;
  features: string[];

  // Media & Content
  images: string[];
  videoUrl?: string;
  demoUrl?: string;

  // Thông tin khóa học
  courseInfo?: {
    duration: string;
    lessons: number;
    level: "beginner" | "intermediate" | "advanced";
    ageGroup: string;
    genre: string;
    certificate: boolean;
  };

  // Thông tin sự kiện
  eventInfo?: {
    eventDate: Date;
    eventTime: string;
    location: string;
    organizer: string;
    maxAttendees: number;
    eventType: "workshop" | "seminar" | "hackathon" | "conference";
    agenda?: string[];
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
}

export interface OrderFormData {
  fullName: string;
  phone: string;
  email: string;
  address: string;
  question?: string;
  quantity: number;
}
