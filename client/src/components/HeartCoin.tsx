
import { Heart } from "lucide-react";

interface HeartCoinProps {
    amount: number | string;
    size?: "sm" | "md" | "lg" | "xl";
    iconOnly?: boolean;
}

const HeartCoin = ({ amount, size = "md", iconOnly = false }: HeartCoinProps) => {
    // Format the amount to a readable number
    const formattedAmount = typeof amount === 'number'
        ? amount.toLocaleString(undefined, {
            minimumFractionDigits: 0,
            maximumFractionDigits: 2
        })
        : amount;

    // Size classes for both icon and text
    const sizeClasses = {
        sm: "text-xs",
        md: "text-sm",
        lg: "text-lg",
        xl: "text-xl"

    };

    // Icon size based on text size
    const iconSize = {
        sm: 12,
        md: 16,
        lg: 20
    };

    return (
        <span className={`heart-coin ${sizeClasses[size]}`}>
            <Heart
                size={iconSize[size]}
                className="heart-coin-icon"
                fill="currentColor"
            />
            {!iconOnly && (
                <span>{formattedAmount}</span>
            )}
        </span>
    );
};

export default HeartCoin;