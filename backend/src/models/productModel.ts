
import { GET_DB } from "../config/mongoDB";
import { ObjectId } from "mongodb";

export interface Product {
  _id?: ObjectId;
  name: string;
  imageUrls: string[];
  price: number;
  quantity: number;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

const COLLECTION_NAME = "products";

// Insert product
export const insertProduct = async (product: Omit<Product, "_id">) => {
  const db = GET_DB();
  const collection = db.collection<Product>(COLLECTION_NAME);
  return await collection.insertOne({
    ...product,
    createdAt: new Date(),
    updatedAt: new Date(),
  });
};

// Get all products
export const getAllProducts = async () => {
  const db = GET_DB();
  const collection = db.collection<Product>(COLLECTION_NAME);
  return await collection.find().toArray();
};

// Get product by ID
export const getProductById = async (id: string) => {
  const db = GET_DB();
  const collection = db.collection<Product>(COLLECTION_NAME);
  return await collection.findOne({ _id: new ObjectId(id) });
};

// Update product
export const updateProduct = async (id: string, updateData: Partial<Product>) => {
  const db = GET_DB();
  const collection = db.collection<Product>(COLLECTION_NAME);
  return await collection.updateOne(
    { _id: new ObjectId(id) },
    { $set: { ...updateData, updatedAt: new Date() } }
  );
};

// Delete product
export const deleteProduct = async (id: string) => {
  const db = GET_DB();
  const collection = db.collection<Product>(COLLECTION_NAME);
  return await collection.deleteOne({ _id: new ObjectId(id) });
};
