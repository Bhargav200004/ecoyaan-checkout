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
    <div className="flex items-center gap-4 py-4 border-b last:border-0">
      <div className="relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden border bg-gray-50">
        <Image
          src={item.image}
          alt={item.product_name}
          fill
          className="object-cover"
          unoptimized
        />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-medium text-sm leading-snug line-clamp-2">
          {item.product_name}
        </p>
        <p className="text-primary font-semibold mt-1">
          {formatCurrency(item.product_price)}
        </p>
      </div>
      <div className="flex flex-col items-end gap-2">
        <div className="flex items-center gap-1 border rounded-lg overflow-hidden">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-none"
            onClick={() => updateItemQuantity(item.product_id, item.quantity - 1)}
            aria-label="Decrease quantity"
          >
            {item.quantity === 1 ? (
              <Trash2 className="w-3.5 h-3.5 text-destructive" />
            ) : (
              <Minus className="w-3.5 h-3.5" />
            )}
          </Button>
          <span className="w-8 text-center text-sm font-medium">
            {item.quantity}
          </span>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-none"
            onClick={() => updateItemQuantity(item.product_id, item.quantity + 1)}
            aria-label="Increase quantity"
          >
            <Plus className="w-3.5 h-3.5" />
          </Button>
        </div>
        <p className="text-sm font-semibold text-foreground">
          {formatCurrency(item.product_price * item.quantity)}
        </p>
      </div>
    </div>
  );
};

export default CartItem;
