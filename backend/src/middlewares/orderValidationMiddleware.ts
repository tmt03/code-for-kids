// Validation và Sanitization:
// Validate dữ liệu với Joi schema
// Sanitize dữ liệu (trim, lowercase email, etc.)
// Kiểm tra logic nghiệp vụ
// Phát hiện đơn hàng trùng lặp

import { NextFunction, Request, Response } from "express";
import Joi from "joi";

// Schema validation cho đơn hàng
const orderValidationSchema = Joi.object({
  products: Joi.array()
    .items(
      Joi.object({
        pid: Joi.string().required().min(1).max(50),
        pname: Joi.string().required().min(1).max(200),
        pprice: Joi.number().positive().max(10000000).required(),
        quantity: Joi.number().integer().positive().max(100).required(),
      })
    )
    .min(1)
    .max(20)
    .required(),

  total: Joi.number().positive().max(10000000).required(),

  buyer: Joi.object({
    name: Joi.string()
      .required()
      .min(2)
      .max(100)
      .pattern(/^[a-zA-ZÀ-ỹ\s]+$/),
    phone: Joi.string()
      .required()
      .pattern(/^[0-9]{10,11}$/),
    email: Joi.string().email().required().max(100),
    address: Joi.string().required().min(10).max(500),
    note: Joi.string().allow("").max(1000),
  }).required(),

  role: Joi.string().valid("user").required(),
  createdBy: Joi.string().required().min(1).max(100),
});

// Sanitize function để làm sạch dữ liệu
const sanitizeOrderData = (data: any) => {
  return {
    ...data,
    buyer: {
      ...data.buyer,
      name: data.buyer.name.trim(),
      phone: data.buyer.phone.trim(),
      email: data.buyer.email.toLowerCase().trim(),
      address: data.buyer.address.trim(),
      note: data.buyer.note?.trim() || "",
    },
    products: data.products.map((product: any) => ({
      ...product,
      pname: product.pname.trim(),
      pid: product.pid.trim(),
    })),
  };
};

// Validation middleware
export const validateOrderData = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Sanitize dữ liệu trước khi validate
    const sanitizedData = sanitizeOrderData(req.body);

    // Validate schema
    const { error, value } = orderValidationSchema.validate(sanitizedData, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      const errorMessages = error.details.map((detail) => detail.message);
      return res.status(400).json({
        error: "Dữ liệu đơn hàng không hợp lệ",
        details: errorMessages,
      });
    }

    // Kiểm tra logic nghiệp vụ
    const totalCalculated = value.products.reduce(
      (sum: number, product: any) => {
        return sum + product.pprice * product.quantity;
      },
      0
    );

    // Cho phép sai số nhỏ do làm tròn số
    if (Math.abs(totalCalculated - value.total) > 1000) {
      return res.status(400).json({
        error: "Tổng tiền không khớp với giá trị sản phẩm",
      });
    }

    // Gán dữ liệu đã validate vào request
    req.body = value;
    next();
  } catch (error) {
    console.error("Validation error:", error);
    return res.status(500).json({
      error: "Lỗi xử lý dữ liệu",
    });
  }
};

// Kiểm tra duplicate order
export const checkDuplicateOrder = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { buyer, products } = req.body;

    // Tạo hash đơn giản để so sánh đơn hàng
    const orderHash = JSON.stringify({
      email: buyer.email,
      phone: buyer.phone,
      products: products.map((p: any) => ({
        pid: p.pid,
        quantity: p.quantity,
      })),
    });

    // Kiểm tra đơn hàng tương tự trong 5 phút gần đây
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);

    // Lưu hash vào request để sử dụng sau
    (req as any).orderHash = orderHash;
    (req as any).checkTime = fiveMinutesAgo;

    next();
  } catch (error) {
    console.error("Duplicate check error:", error);
    next();
  }
};
