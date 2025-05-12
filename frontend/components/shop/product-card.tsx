import { Button } from "@/components/ui/button";
import { Plus, Minus } from 'lucide-react';
import { useHistory } from 'react-router-dom'; // Import useHistory

interface ProductCardProps {
    image: string;
    name: string;
    quantity: number;
    price: number;
    description: string;
    onQuantityChange: (value: number) => void;
    currentQuantity: number;
    error?: string;
}

export default function ProductCard({ 
    image, 
    name, 
    quantity, 
    price, 
    description,
    onQuantityChange,
    currentQuantity,
    error
}: ProductCardProps) {
    const history = useHistory(); // Khởi tạo useHistory

    const handleIncrement = () => {
        if (currentQuantity < quantity) {
            onQuantityChange(currentQuantity + 1);
        }
    };

    const handleBuy = () => {
        history.push('/shop/order'); // Điều hướng đến trang order
    };

    return (
        <div>
            <img src={image} alt={name} />
            <h3>{name}</h3>
            <p>{description}</p>
            <p>Price: ${price}</p>
            <Button onClick={handleIncrement}>+</Button>
            <Button onClick={() => onQuantityChange(currentQuantity - 1)}>-</Button>
            <Button onClick={handleBuy}>MUA</Button> {/* Nút MUA */}
        </div>
    );
}