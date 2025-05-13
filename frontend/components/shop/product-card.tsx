import { Button } from "@/components/ui/button";

interface ProductCardProps {
    image: string;
    name: string;
    quantity: number;
    price: number;
    description: string;
}

export default function ProductCard({ image, name, quantity, price, description }: ProductCardProps) {
    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden border-2 border-black">
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
                <p className="text-gray-700 mb-4">{description}</p>
                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                    MUA
                </Button>
            </div>
        </div>
    );
} 