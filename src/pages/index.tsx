import type { GetServerSideProps, NextPage } from "next";
import { useEffect } from "react";
import { useRouter } from "next/router";
import { ShoppingCart, ArrowRight, Package, Leaf } from "lucide-react";
import Layout from "@/components/layout/Layout";
import CheckoutSteps from "@/components/checkout/CheckoutSteps";
import CartItem from "@/components/cart/CartItem";
import OrderSummary from "@/components/cart/OrderSummary";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCheckoutStore } from "@/store/useCheckoutStore";
import { CartData } from "@/types";
import { Badge } from "@/components/ui/badge";

interface CartPageProps {
  initialCartData: CartData;
}

const CartPage: NextPage<CartPageProps> = ({ initialCartData }) => {
  const router = useRouter();
  const { cartData, setCartData } = useCheckoutStore();

  useEffect(() => {
    setCartData(initialCartData);
  }, [initialCartData, setCartData]);

  const displayData = cartData ?? initialCartData;
  const totalItems = displayData.cartItems.reduce(
    (acc, item) => acc + item.quantity,
    0
  );

  const handleProceed = () => {
    router.push("/checkout/shipping");
  };

  return (
    <Layout title="Your Cart – Ecoyaan">
      <CheckoutSteps currentStep="cart" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5">
        {/* Cart Items */}
        <div className="md:col-span-2">
          <Card className="border-0 shadow-md rounded-2xl overflow-hidden">
            <CardHeader className="pb-3 bg-white border-b border-gray-100">
              <CardTitle className="flex items-center gap-2.5 text-xl text-gray-800">
                <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-green-100">
                  <ShoppingCart className="w-5 h-5 text-green-700" />
                </div>
                Shopping Cart
                {totalItems > 0 && (
                  <Badge className="ml-1 bg-green-100 text-green-700 hover:bg-green-100 font-semibold">
                    {totalItems} item{totalItems !== 1 ? "s" : ""}
                  </Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {displayData.cartItems.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 gap-4 text-gray-400">
                  <div className="w-24 h-24 rounded-full bg-gray-50 flex items-center justify-center">
                    <Package className="w-12 h-12 opacity-30" />
                  </div>
                  <p className="text-lg font-semibold text-gray-500">Your cart is empty</p>
                  <p className="text-sm">Add some eco-friendly products!</p>
                </div>
              ) : (
                <div className="px-6">
                  {displayData.cartItems.map((item) => (
                    <CartItem key={item.product_id} item={item} />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Eco badge */}
          <div className="mt-4 flex items-center gap-2 p-3 bg-green-50 rounded-xl border border-green-100">
            <Leaf className="w-4 h-4 text-green-600 flex-shrink-0" />
            <p className="text-xs text-green-700 font-medium">
              All products are sustainably sourced and packaged with eco-friendly materials 🌿
            </p>
          </div>
        </div>

        {/* Order Summary */}
        <div className="md:col-span-1">
          <Card className="sticky top-24 border-0 shadow-md rounded-2xl overflow-hidden">
            <CardHeader className="pb-3 bg-white border-b border-gray-100">
              <CardTitle className="text-lg text-gray-800">Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-4">
              <OrderSummary />
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Sticky bottom action bar */}
      {displayData.cartItems.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur border-t border-gray-200 shadow-2xl px-3 pt-2.5 pb-safe-bar sm:px-4 sm:pt-3">
          <div className="mx-auto max-w-6xl">
            <div className="flex items-center gap-2 sm:gap-3 md:grid md:grid-cols-3">
              <div className="hidden md:flex md:col-span-2 items-center gap-2">
                <span className="text-sm font-semibold text-gray-800">
                  {totalItems} item{totalItems !== 1 ? "s" : ""} in cart
                </span>
                <span className="text-gray-300">·</span>
                <span className="text-xs text-gray-400">Free shipping on orders above ₹499</span>
              </div>
              <div className="flex-1 md:col-span-1">
                <Button
                  className="w-full gap-2 text-sm h-11 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold rounded-xl shadow-lg shadow-green-200 transition-all hover:shadow-xl"
                  onClick={handleProceed}
                >
                  Proceed to Checkout
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps = async () => {
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";

  try {
    const res = await fetch(`${baseUrl}/api/cart`);
    const cartData: CartData = await res.json();
    return {
      props: {
        initialCartData: cartData,
      },
    };
  } catch {
    const { mockCartData } = await import("@/data/mockData");
    return {
      props: {
        initialCartData: mockCartData,
      },
    };
  }
};

export default CartPage;
