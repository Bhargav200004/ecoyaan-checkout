import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { CheckCircle, Package, Leaf, ArrowRight, Sparkles } from "lucide-react";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import AddressSummary from "@/components/checkout/AddressSummary";
import { useCheckoutStore } from "@/store/useCheckoutStore";
import { formatCurrency } from "@/lib/utils";

const OrderSuccessPage: NextPage = () => {
  const router = useRouter();
  const { orderId, shippingAddress, cartData, resetCheckout, getGrandTotal } =
    useCheckoutStore();

  useEffect(() => {
    if (!orderId) {
      router.replace("/");
    }
  }, [orderId, router]);

  const grandTotal = getGrandTotal();

  const handleContinueShopping = () => {
    resetCheckout();
    router.push("/");
  };

  if (!orderId || !shippingAddress || !cartData) return null;

  return (
    <Layout title="Order Placed! – Ecoyaan">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Success Banner */}
        <div className="text-center space-y-4 py-8">
          <div className="relative inline-flex">
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-green-400 to-emerald-600 shadow-xl shadow-green-200">
              <CheckCircle className="w-12 h-12 text-white" strokeWidth={2} />
            </div>
            <span className="absolute -top-1 -right-1 text-2xl animate-bounce">🎉</span>
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mt-2">Order Placed!</h1>
            <p className="text-gray-500 text-base mt-1">
              Thank you for choosing sustainable living 🌿
            </p>
          </div>
          <div className="inline-flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 px-5 py-2.5 rounded-full text-sm font-semibold shadow-sm">
            <Package className="w-4 h-4" />
            Order ID: {orderId}
          </div>
        </div>

        {/* Order Details Card */}
        <Card className="border-0 shadow-lg rounded-2xl overflow-hidden">
          <CardContent className="p-0">
            {/* Items */}
            <div className="p-5 space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5" />
                Items Ordered
              </h3>
              <div className="space-y-2">
                {cartData.cartItems.map((item) => (
                  <div key={item.product_id} className="flex justify-between items-center text-sm py-1">
                    <span className="text-gray-700 font-medium flex-1 mr-4">
                      {item.product_name}
                      <span className="text-gray-400 font-normal ml-1.5 text-xs">×{item.quantity}</span>
                    </span>
                    <span className="font-semibold text-gray-800 flex-shrink-0">
                      {formatCurrency(item.product_price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            <div className="flex justify-between items-center font-bold px-5 py-4 bg-green-50">
              <span className="text-gray-800">Total Paid</span>
              <span className="text-green-700 text-lg">{formatCurrency(grandTotal)}</span>
            </div>

            <Separator />

            {/* Delivery Address */}
            <div className="p-5 space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 flex items-center gap-2">
                <Package className="w-3.5 h-3.5" />
                Delivering To
              </h3>
              <AddressSummary address={shippingAddress} />
            </div>

            <Separator />

            {/* Eco note */}
            <div className="flex items-start gap-3 p-5 bg-gradient-to-r from-green-50 to-emerald-50">
              <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-green-100 flex-shrink-0">
                <Leaf className="w-5 h-5 text-green-600" />
              </div>
              <p className="text-sm text-green-800">
                <span className="font-semibold">Eco-Friendly Delivery!</span> Your order will arrive in{" "}
                <span className="font-semibold">3-5 business days</span>, packaged with 100% recycled materials. 🌱
              </p>
            </div>
          </CardContent>
        </Card>

        <Button
          className="w-full h-12 gap-2 text-base bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 font-semibold rounded-xl shadow-lg shadow-green-200 transition-all hover:shadow-xl"
          onClick={handleContinueShopping}
        >
          Continue Shopping
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </Layout>
  );
};

export default OrderSuccessPage;
