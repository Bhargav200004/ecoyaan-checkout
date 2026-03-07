import React from "react";
import { useCheckoutStore } from "@/store/useCheckoutStore";
import { formatCurrency } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { Tag } from "lucide-react";

const OrderSummary: React.FC = () => {
  const cartData = useCheckoutStore((s) => s.cartData);
  const getSubtotal = useCheckoutStore((s) => s.getSubtotal);
  const getGrandTotal = useCheckoutStore((s) => s.getGrandTotal);

  if (!cartData) return null;

  const subtotal = getSubtotal();
  const grandTotal = getGrandTotal();
  const totalItems = cartData.cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="space-y-3">
      <div className="flex justify-between text-sm">
        <span className="text-muted-foreground">
          Subtotal ({totalItems} item{totalItems !== 1 ? "s" : ""})
        </span>
        <span className="font-medium">{formatCurrency(subtotal)}</span>
      </div>
      <div className="flex justify-between text-sm">
        <span className="text-muted-foreground">Shipping</span>
        <span className="font-medium text-green-600">
          {cartData.shipping_fee === 0
            ? "FREE"
            : formatCurrency(cartData.shipping_fee)}
        </span>
      </div>
      {cartData.discount_applied > 0 && (
        <div className="flex justify-between text-sm">
          <span className="flex items-center gap-1 text-green-600">
            <Tag className="w-3.5 h-3.5" />
            Discount
          </span>
          <span className="font-medium text-green-600">
            -{formatCurrency(cartData.discount_applied)}
          </span>
        </div>
      )}
      <Separator />
      <div className="flex justify-between font-bold text-base">
        <span>Grand Total</span>
        <span className="text-primary">{formatCurrency(grandTotal)}</span>
      </div>
      <p className="text-xs text-muted-foreground">
        Inclusive of all taxes · Secure checkout
      </p>
    </div>
  );
};

export default OrderSummary;
