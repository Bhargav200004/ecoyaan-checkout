import React from "react";
import Image from "next/image";
import { Minus, Plus, Trash2 } from "lucide-react";
import { CartItem as CartItemType } from "@/types";
import { useCheckoutStore } from "@/store/useCheckoutStore";
import { formatCurrency } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface CartItemProps {
  item: CartItemType;
}

const CartItem: React.FC<CartItemProps> = ({ item }) => {
  const updateItemQuantity = useCheckoutStore((s) => s.updateItemQuantity);

  return (
    <div className="flex items-center gap-4 py-4 border-b last:border-0 group">
      <div className="relative w-20 h-20 flex-shrink-0 rounded-xl overflow-hidden border border-gray-100 bg-gray-50 shadow-sm">
        <Image
          src={item.image}
          alt={item.product_name}
          fill
          className="object-cover transition-transform group-hover:scale-105"
          unoptimized
        />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-sm leading-snug line-clamp-2 text-gray-800">
          {item.product_name}
        </p>
        <p className="text-green-700 font-bold mt-1 text-sm">
          {formatCurrency(item.product_price)}
          <span className="text-xs text-gray-400 font-normal ml-1">/ unit</span>
        </p>
      </div>
      <div className="flex flex-col items-end gap-2">
        <div className="flex items-center gap-1 bg-gray-50 border border-gray-200 rounded-xl overflow-hidden shadow-sm">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-none hover:bg-red-50 hover:text-red-500 transition-colors"
            onClick={() => updateItemQuantity(item.product_id, item.quantity - 1)}
            aria-label="Decrease quantity"
          >
            {item.quantity === 1 ? (
              <Trash2 className="w-3.5 h-3.5 text-red-400" />
            ) : (
              <Minus className="w-3.5 h-3.5 text-gray-600" />
            )}
          </Button>
          <span className="w-8 text-center text-sm font-bold text-gray-800">
            {item.quantity}
          </span>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-none hover:bg-green-50 hover:text-green-600 transition-colors"
            onClick={() => updateItemQuantity(item.product_id, item.quantity + 1)}
            aria-label="Increase quantity"
          >
            <Plus className="w-3.5 h-3.5 text-gray-600" />
          </Button>
        </div>
        <p className="text-sm font-bold text-gray-800">
          {formatCurrency(item.product_price * item.quantity)}
        </p>
      </div>
    </div>
  );
};

export default CartItem;
