import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { CheckCircle, Package, Leaf, ArrowRight } from "lucide-react";
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
        <div className="text-center space-y-3 py-6">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 mb-2">
            <CheckCircle className="w-10 h-10 text-green-600" strokeWidth={1.5} />
          </div>
          <h1 className="text-3xl font-bold text-green-600">Order Placed!</h1>
          <p className="text-muted-foreground text-lg">
            Thank you for choosing sustainable living 🌿
          </p>
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium">
            <Package className="w-4 h-4" />
            Order ID: {orderId}
          </div>
        </div>

        {/* Order Details */}
        <Card>
          <CardContent className="pt-6 space-y-5">
            <div>
              <h3 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground mb-3">
                Items Ordered
              </h3>
              <div className="space-y-2">
                {cartData.cartItems.map((item) => (
                  <div key={item.product_id} className="flex justify-between text-sm">
                    <span className="text-foreground">
                      {item.product_name}
                      <span className="text-muted-foreground ml-1">×{item.quantity}</span>
                    </span>
                    <span className="font-medium">
                      {formatCurrency(item.product_price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            <div className="flex justify-between font-bold">
              <span>Total Paid</span>
              <span className="text-primary">{formatCurrency(grandTotal)}</span>
            </div>

            <Separator />

            <div>
              <h3 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground mb-3">
                Delivering To
              </h3>
              <AddressSummary address={shippingAddress} />
            </div>

            <Separator />

            <div className="flex items-start gap-2 text-sm p-3 bg-green-50 rounded-lg text-green-800">
              <Leaf className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <p>
                Your eco-friendly order will be delivered in 3-5 business days.
                Packaged with 100% recycled materials.
              </p>
            </div>
          </CardContent>
        </Card>

        <Button
          className="w-full h-12 gap-2 text-base"
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
