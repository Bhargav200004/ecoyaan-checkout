import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowLeft, ArrowRight, MapPin } from "lucide-react";
import Layout from "@/components/layout/Layout";
import CheckoutSteps from "@/components/checkout/CheckoutSteps";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import OrderSummary from "@/components/cart/OrderSummary";
import { useCheckoutStore } from "@/store/useCheckoutStore";
import { ShippingAddress } from "@/types";
import { cn } from "@/lib/utils";

const shippingSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  email: z.email("Please enter a valid email address"),
  phone: z
    .string()
    .regex(/^[6-9]\d{9}$/, "Please enter a valid 10-digit Indian mobile number"),
  pinCode: z
    .string()
    .regex(/^\d{6}$/, "PIN code must be exactly 6 digits"),
  city: z.string().min(2, "City name must be at least 2 characters"),
  state: z.string().min(2, "State name must be at least 2 characters"),
});

type ShippingFormData = z.infer<typeof shippingSchema>;

const ShippingPage: NextPage = () => {
  const router = useRouter();
  const { cartData, shippingAddress, setShippingAddress } = useCheckoutStore();

  useEffect(() => {
    if (!cartData || cartData.cartItems.length === 0) {
      router.replace("/");
    }
  }, [cartData, router]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ShippingFormData>({
    resolver: zodResolver(shippingSchema),
    defaultValues: shippingAddress ?? undefined,
  });

  const onSubmit = (data: ShippingFormData) => {
    setShippingAddress(data as ShippingAddress);
    router.push("/checkout/payment");
  };

  const fields: Array<{
    name: keyof ShippingFormData;
    label: string;
    placeholder: string;
    type?: string;
    hint?: string;
  }> = [
    { name: "fullName", label: "Full Name", placeholder: "Riya Sharma" },
    { name: "email", label: "Email Address", placeholder: "riya@example.com", type: "email" },
    { name: "phone", label: "Phone Number", placeholder: "9876543210", hint: "10-digit mobile number" },
    { name: "pinCode", label: "PIN Code", placeholder: "110001", hint: "6-digit PIN code" },
    { name: "city", label: "City", placeholder: "New Delhi" },
    { name: "state", label: "State", placeholder: "Delhi" },
  ];

  return (
    <Layout title="Shipping Address – Ecoyaan">
      <CheckoutSteps currentStep="shipping" />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <MapPin className="w-5 h-5 text-primary" />
                Shipping Address
              </CardTitle>
              <CardDescription>
                Enter the delivery address for your order
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {fields.map((field) => (
                    <div
                      key={field.name}
                      className={cn(
                        "space-y-1.5",
                        field.name === "fullName" || field.name === "email"
                          ? "sm:col-span-2"
                          : ""
                      )}
                    >
                      <Label htmlFor={field.name}>{field.label}</Label>
                      <Input
                        id={field.name}
                        type={field.type ?? "text"}
                        placeholder={field.placeholder}
                        {...register(field.name)}
                        className={cn(errors[field.name] && "border-destructive focus-visible:ring-destructive")}
                        aria-describedby={errors[field.name] ? `${field.name}-error` : undefined}
                      />
                      {field.hint && !errors[field.name] && (
                        <p className="text-xs text-muted-foreground">{field.hint}</p>
                      )}
                      {errors[field.name] && (
                        <p id={`${field.name}-error`} className="text-xs text-destructive" role="alert">
                          {errors[field.name]?.message}
                        </p>
                      )}
                    </div>
                  ))}
                </div>

                <div className="flex gap-3 pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    className="gap-2"
                    onClick={() => router.back()}
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Back
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1 gap-2 h-11"
                    disabled={isSubmitting}
                  >
                    Continue to Payment
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

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

export default ShippingPage;