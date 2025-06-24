// orderModel.ts
import { ObjectId } from "mongodb";
import { GET_DB } from "../config/mongoDB";

export interface OrderData {
  _id?: ObjectId; // MongoDB documents sẽ có _id
  orderCode: string;
  role: "guest" | "user";
  products: {
    pid: string;
    pname: string;
    pprice: number;
    quantity: number;
  }[];
  total: number;
  buyer: {
    name: string;
    phone: string;
    email: string;
    address: string;
    note?: string;
  };
  createdAt: Date;
  status: "pending" | "approved" | "rejected" | "done";
  createdBy: string;
}

//Collection name
const COLLECTION_NAME = "orders";

//Insert new order
export const insertOrder = async (order: OrderData) => {
  const db = GET_DB();
  const collection = db.collection<OrderData>(COLLECTION_NAME);
  await collection.insertOne(order);
};

//Find all orders (optionally with filter)
export const getAllOrders = async (filter: Partial<OrderData> = {}) => {
  const db = GET_DB();
  const collection = db.collection<OrderData>(COLLECTION_NAME);
  return await collection.find(filter).toArray();
};

//Get order by code
export const getOrderByCode = async (orderCode: string) => {
  const db = GET_DB();
  const collection = db.collection<OrderData>(COLLECTION_NAME);
  return await collection.findOne({ orderCode });
};

//Get all orders by username
export const getOrdersByUsername = async (username: string) => {
  const db = GET_DB();
  const collection = db.collection<OrderData>(COLLECTION_NAME);
  return await collection.find({ createdBy: username }).toArray();
};

//Update order status
export const updateOrderStatus = async (
  orderCode: string,
  status: OrderData["status"]
) => {
  const db = GET_DB();
  const collection = db.collection<OrderData>(COLLECTION_NAME);
  return await collection.updateOne({ orderCode }, { $set: { status } });
};

export const updateOrderStatusInDB = async (
  orderCode: string,
  status: OrderData["status"]
) => {
  const db = GET_DB();
  const collection = db.collection<OrderData>("orders");
  return await collection.updateOne({ orderCode }, { $set: { status } });
};
