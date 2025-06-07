// ✅ orderModel.ts
import mongoose from "mongoose";

// ✅ Chỉ cần khai báo và export trực tiếp ở đây
export interface OrderData {
  orderCode: string;
  role: 'guest' | 'user';
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
  status: 'pending' | 'approved' | 'rejected' | 'done';
  createdBy: string;
}

const orderSchema = new mongoose.Schema<OrderData>({
  orderCode: { type: String, required: true, unique: true },
  role: { type: String, required: true, enum: ['guest', 'user'] },
  products: [{ pid: String, pname: String, pprice: Number, quantity: Number }],
  total: { type: Number, required: true },
  buyer: {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true },
    address: { type: String, required: true },
    note: { type: String },
  },
  createdAt: { type: Date, required: true, default: Date.now },
  status: {
    type: String,
    required: true,
    enum: ['pending', 'approved', 'rejected', 'done'],
    default: 'pending',
  },
  createdBy: { type: String, required: true },
});

const OrderModel = mongoose.models.Order || mongoose.model("Order", orderSchema);

//Export model
export default OrderModel;
