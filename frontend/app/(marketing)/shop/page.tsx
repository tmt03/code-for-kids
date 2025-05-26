'use client';

import ProductCard from "@/components/shop/product-card";

const products = [
  {
    id: 1,
    image: "/assets/products/product1.jpg",
    name: "SÁCH CODE_FOR_KIDS",
    quantity: 20,
    price: 200000,
    description: "Sách học lập trình cho trẻ em từ 8-15 tuổi",
  }
];

export default function ShopPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-12">
          CỬA HÀNG SÁCH VÀ KHÓA HỌC
        </h1>

        <div className="grid grid-cols-1 gap-8">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              id={product.id}
              image={product.image}
              name={product.name}
              quantity={product.quantity}
              price={product.price}
              description={product.description}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
