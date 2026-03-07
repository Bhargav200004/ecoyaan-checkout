import React from "react";
import Link from "next/link";
import { ShoppingCart, Leaf } from "lucide-react";

const Header: React.FC = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 shadow-sm">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <div className="flex items-center justify-center w-9 h-9 rounded-full bg-primary">
            <Leaf className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold text-primary">Ecoyaan</span>
        </Link>
        <nav className="flex items-center gap-4">
          <Link
            href="/"
            className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
          >
            <ShoppingCart className="w-4 h-4" />
            <span className="hidden sm:inline">Cart</span>
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;
