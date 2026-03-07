import type { GetServerSideProps, NextPage } from "next";
import { useEffect } from "react";
import { useRouter } from "next/router";
import { ShoppingCart, ArrowRight, Package } from "lucide-react";
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
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Cart Items */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-xl">
                <ShoppingCart className="w-5 h-5 text-primary" />
                Shopping Cart
                <Badge variant="secondary" className="ml-1">
                  {totalItems} item{totalItems !== 1 ? "s" : ""}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {displayData.cartItems.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 gap-4 text-muted-foreground">
                  <Package className="w-16 h-16 opacity-30" />
                  <p className="text-lg font-medium">Your cart is empty</p>
                  <p className="text-sm">Add some eco-friendly products!</p>
                </div>
              ) : (
                <div>
                  {displayData.cartItems.map((item) => (
                    <CartItem key={item.product_id} item={item} />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <Card className="sticky top-24">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <OrderSummary />
              {displayData.cartItems.length > 0 && (
                <Button
                  className="w-full gap-2 text-base h-12"
                  onClick={handleProceed}
                >
                  Proceed to Checkout
                  <ArrowRight className="w-4 h-4" />
                </Button>
              )}
              <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                <span>🔒</span>
                <span>Secure &amp; Encrypted Checkout</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
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
