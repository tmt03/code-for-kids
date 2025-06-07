import { Request, Response } from "express";
import Product from "../models/productModel";
import { GET_DB } from "../config/mongoDB";

export const getAllProducts = async (_req: Request, res: Response) => {
  try {
    const products = await GET_DB().collection("product").find({}).toArray();
    res.status(200).json(products);
  } catch (err) {
    res.status(500).json({ message: "Lỗi lấy sản phẩm" });
  }
};

export const addProduct = async (req: Request, res: Response) => {
  try {
    const { pname, pimg, pdescription, pprice, pquantity } = req.body;
    const newProduct = {
      pid: "P" + Math.floor(Math.random() * 10000),
      pname,
      pimg,
      pdescription,
      pprice: Number(pprice),
      pquantity: Number(pquantity)
    };

    await GET_DB().collection("product").insertOne(newProduct);
    res.status(201).json({ message: "Thêm sản phẩm thành công", product: newProduct });
  } catch (err) {
    res.status(500).json({ message: "Lỗi thêm sản phẩm" });
  }
};
