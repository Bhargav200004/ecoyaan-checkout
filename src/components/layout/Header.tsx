import React from "react";
import Link from "next/link";
import { ShoppingCart, Leaf } from "lucide-react";
import { useCheckoutStore } from "@/store/useCheckoutStore";

const Header: React.FC = () => {
  const cartData = useCheckoutStore((s) => s.cartData);
  const totalItems = cartData?.cartItems.reduce((acc, item) => acc + item.quantity, 0) ?? 0;

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80 shadow-sm">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2.5 hover:opacity-80 transition-opacity group">
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 shadow-md group-hover:shadow-lg transition-shadow">
            <Leaf className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="text-xl font-bold text-green-700">Ecoyaan</span>
            <p className="text-[10px] text-green-600/70 leading-none -mt-0.5 hidden sm:block">Sustainable Living</p>
          </div>
        </Link>
        <nav className="flex items-center gap-4">
          <Link
            href="/"
            className="relative flex items-center gap-1.5 text-sm font-medium text-gray-600 hover:text-green-700 transition-colors px-3 py-1.5 rounded-full hover:bg-green-50"
          >
            <ShoppingCart className="w-4 h-4" />
            <span className="hidden sm:inline">Cart</span>
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 flex items-center justify-center w-5 h-5 text-[10px] font-bold text-white bg-green-600 rounded-full">
                {totalItems > 9 ? "9+" : totalItems}
              </span>
            )}
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;
