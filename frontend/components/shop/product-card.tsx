import { Button } from "@/components/ui/button";
import Link from "next/link";

interface ProductCardProps {
    id: string;
    image: string;
    name: string;
    quantity: number;
    price: number;
    description: string;
}

export default function ProductCard({ id, image, name, quantity, price, description }: ProductCardProps) {
    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden border-2 border-black hover:shadow-lg transition-shadow duration-300">
            <div className="relative h-48">
                <img
                    src={image}
                    alt={name}
                    className="w-full h-full object-cover"
                />
            </div>
            <div className="p-4">
                <h3 className="text-xl font-bold mb-2">{name}</h3>
                <p className="text-gray-600 mb-2">Số lượng: {quantity}</p>
                <p className="text-lg font-semibold text-blue-600 mb-2">{price.toLocaleString('vi-VN')} VNĐ</p>
                <p className="text-gray-700 mb-4 line-clamp-2">{description}</p>

                <Button asChild className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 text-lg font-medium">
                    <Link
                        href={{
                            pathname: '/shop/order',
                            query: { productId: id }
                        }}
                        className="block w-full h-full"
                    >
                        MUA NGAY
                    </Link>
                </Button>
            </div>
        </div>
    );
}