import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  imageUrls: [String],
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
  description: String,
}, { timestamps: true });

export default mongoose.models.Product || mongoose.model("Product", productSchema);
