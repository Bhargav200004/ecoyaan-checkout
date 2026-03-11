import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { ArrowLeft, CreditCard, Shield, CheckCircle, Package, MapPin } from "lucide-react";
import Layout from "@/components/layout/Layout";
import CheckoutSteps from "@/components/checkout/CheckoutSteps";
import CartItem from "@/components/cart/CartItem";
import OrderSummary from "@/components/cart/OrderSummary";
import AddressSummary from "@/components/checkout/AddressSummary";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-5">
        <div className="lg:col-span-2 space-y-4 lg:space-y-5">
          {/* Order Items */}
          <Card className="border-0 shadow-md rounded-2xl overflow-hidden">
            <CardHeader className="pb-3 bg-white border-b border-gray-100">
              <CardTitle className="flex items-center gap-2.5 text-lg text-gray-800">
                <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-green-100">
                  <Package className="w-5 h-5 text-green-700" />
                </div>
                Order Items
                <Badge className="ml-1 bg-green-100 text-green-700 hover:bg-green-100 font-semibold">
                  {totalItems} item{totalItems !== 1 ? "s" : ""}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="px-6 pb-2">
              {cartData.cartItems.map((item) => (
                <CartItem key={item.product_id} item={item} />
              ))}
            </CardContent>
          </Card>

          {/* Shipping Address Review */}
          <Card className="border-0 shadow-md rounded-2xl overflow-hidden">
            <CardHeader className="pb-3 bg-white border-b border-gray-100">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2.5 text-lg text-gray-800">
                  <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-green-100">
                    <MapPin className="w-5 h-5 text-green-700" />
                  </div>
                  Delivering To
                </CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-green-700 h-8 text-xs hover:bg-green-50 rounded-lg font-semibold"
                  onClick={() => router.push("/checkout/shipping")}
                >
                  <ArrowLeft className="w-3 h-3 mr-1" />
                  Change
                </Button>
              </div>
              <CardDescription className="text-gray-500">Review your delivery address</CardDescription>
            </CardHeader>
            <CardContent className="pt-4">
              <AddressSummary address={shippingAddress} />
            </CardContent>
          </Card>

          {/* Payment Method */}
          <Card className="border-0 shadow-md rounded-2xl overflow-hidden">
            <CardHeader className="pb-3 bg-white border-b border-gray-100">
              <CardTitle className="flex items-center gap-2.5 text-lg text-gray-800">
                <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-green-100">
                  <CreditCard className="w-5 h-5 text-green-700" />
                </div>
                Payment Method
              </CardTitle>
              <CardDescription className="text-gray-500">Simulated secure payment</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 pt-4">
              <div className="flex items-center gap-4 p-4 border-2 border-green-500 rounded-xl bg-green-50 shadow-sm">
                <div className="w-12 h-8 bg-gradient-to-r from-blue-600 to-blue-400 rounded-lg flex items-center justify-center shadow-sm flex-shrink-0">
                  <span className="text-white text-xs font-bold">VISA</span>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-gray-800">Simulated Card Payment</p>
                  <p className="text-xs text-gray-500">•••• •••• •••• 4242</p>
                </div>
                <div className="flex items-center justify-center w-7 h-7 rounded-full bg-green-600">
                  <CheckCircle className="w-4 h-4 text-white fill-current" />
                </div>
              </div>

              <div className="flex items-start gap-3 text-xs text-gray-500 p-3 bg-gray-50 rounded-xl border border-gray-100">
                <Shield className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                <span>
                  This is a simulated payment. No real transaction will occur. Your data is safe and encrypted with 256-bit SSL.
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Order Summary Sidebar */}
        <div className="lg:col-span-1">
          <Card className="sticky top-24 border-0 shadow-md rounded-2xl overflow-hidden">
            <CardHeader className="pb-3 bg-white border-b border-gray-100">
              <CardTitle className="text-lg text-gray-800">Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <OrderSummary />
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Sticky Bottom Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur border-t border-gray-200 shadow-2xl px-4 py-3">
        <div className="container mx-auto max-w-6xl">
          {/* On desktop: mirror the 2/3 + 1/3 grid — buttons sit in the 2/3 left column */}
          <div className="flex items-center gap-3 lg:grid lg:grid-cols-3">
            <div className="flex items-center gap-3 flex-1 lg:col-span-2">
              <Button
                variant="outline"
                className="gap-2 h-11 px-5 rounded-xl border-gray-300 text-gray-600 hover:border-green-400 hover:text-green-700 font-semibold flex-shrink-0"
                onClick={() => router.back()}
                disabled={isPaying}
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="hidden sm:inline">Back</span>
              </Button>
              <Button
                className="flex-1 gap-2 h-11 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold rounded-xl shadow-lg shadow-green-200 transition-all hover:shadow-xl text-sm disabled:opacity-60"
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
            {/* Right 1/3 — grand total hint on desktop */}
            <div className="hidden lg:flex lg:col-span-1 items-center justify-center text-sm text-gray-400 gap-1.5 pl-4">
              <span>🔒</span>
              <span>256-bit SSL encrypted</span>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default PaymentPage;
