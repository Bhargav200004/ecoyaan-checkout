import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { ArrowLeft, CreditCard, Shield, CheckCircle, Package } from "lucide-react";
import Layout from "@/components/layout/Layout";
import CheckoutSteps from "@/components/checkout/CheckoutSteps";
import CartItem from "@/components/cart/CartItem";
import OrderSummary from "@/components/cart/OrderSummary";
import AddressSummary from "@/components/checkout/AddressSummary";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useCheckoutStore } from "@/store/useCheckoutStore";

const PaymentPage: NextPage = () => {
  const router = useRouter();
  const { cartData, shippingAddress, placeOrder } = useCheckoutStore();
  const [isPaying, setIsPaying] = useState(false);

  useEffect(() => {
    if (!cartData || cartData.cartItems.length === 0) {
      router.replace("/");
    } else if (!shippingAddress) {
      router.replace("/checkout/shipping");
    }
  }, [cartData, shippingAddress, router]);

  const handlePayment = async () => {
    setIsPaying(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    placeOrder();
    router.push("/order-success");
  };

  if (!cartData || !shippingAddress) return null;

  const totalItems = cartData.cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <Layout title="Confirm & Pay – Ecoyaan">
      <CheckoutSteps currentStep="payment" />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Order Items */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Package className="w-5 h-5 text-primary" />
                Order Items
                <Badge variant="secondary">{totalItems} item{totalItems !== 1 ? "s" : ""}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {cartData.cartItems.map((item) => (
                <CartItem key={item.product_id} item={item} />
              ))}
            </CardContent>
          </Card>

          {/* Shipping Address Review */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Delivering To</CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-primary h-7 text-xs"
                  onClick={() => router.push("/checkout/shipping")}
                >
                  Edit
                </Button>
              </div>
              <CardDescription>Review your shipping address</CardDescription>
            </CardHeader>
            <CardContent>
              <AddressSummary address={shippingAddress} />
            </CardContent>
          </Card>

          {/* Payment Method */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <CreditCard className="w-5 h-5 text-primary" />
                Payment Method
              </CardTitle>
              <CardDescription>Simulated secure payment</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3 p-4 border-2 border-primary rounded-lg bg-primary/5">
                <div className="w-10 h-7 bg-gradient-to-r from-blue-600 to-blue-400 rounded flex items-center justify-center">
                  <span className="text-white text-xs font-bold">VISA</span>
                </div>
                <div>
                  <p className="text-sm font-medium">Simulated Card Payment</p>
                  <p className="text-xs text-muted-foreground">•••• •••• •••• 4242</p>
                </div>
                <CheckCircle className="w-5 h-5 text-primary ml-auto" />
              </div>

              <div className="flex items-start gap-2 text-xs text-muted-foreground p-3 bg-muted rounded-lg">
                <Shield className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                <span>
                  This is a simulated payment. No real transaction will occur.
                  Your data is safe and encrypted.
                </span>
              </div>

              <Separator />

              <div className="flex gap-3 pt-1">
                <Button
                  variant="outline"
                  className="gap-2"
                  onClick={() => router.back()}
                  disabled={isPaying}
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back
                </Button>
                <Button
                  className="flex-1 gap-2 h-12 text-base"
                  onClick={handlePayment}
                  disabled={isPaying}
                >
                  {isPaying ? (
                    <>
                      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                      </svg>
                      Processing...
                    </>
                  ) : (
                    <>
                      <Shield className="w-4 h-4" />
                      Pay Securely
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Order Summary Sidebar */}
        <div className="lg:col-span-1">
          <Card className="sticky top-24">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Order Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <OrderSummary />
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default PaymentPage;
