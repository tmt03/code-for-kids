import { Request, Response } from "express";
import { GET_DB } from "../config/mongoDB";

export const getAllProducts = async (_req: Request, res: Response) => {
  try {
    const products = await GET_DB().collection("products").find({}).toArray();
    res.status(200).json(products);
  } catch (err) {
    console.error("❌ Lỗi getAllProducts:", err);
    res.status(500).json({ message: "Lỗi lấy sản phẩm" });
  }
};

export const addProduct = async (req: Request, res: Response) => {
  try {
    const { name, imageUrls, description, price, quantity } = req.body;

    const newProduct = {
      name,
      imageUrls,
      description,
      price: Number(price),
      quantity: Number(quantity),
      createdAt: new Date(),
      updatedAt: new Date()
    };

    await GET_DB().collection("products").insertOne(newProduct);
    res.status(201).json({ message: "Thêm sản phẩm thành công", product: newProduct });
  } catch (err) {
    console.error("❌ Lỗi addProduct:", err);
    res.status(500).json({ message: "Lỗi thêm sản phẩm" });
  }
};
