import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  ArrowLeft,
  ArrowRight,
  MapPin,
  Plus,
  Trash2,
  CheckCircle2,
  Edit2,
  BookMarked,
  Home,
  Briefcase,
} from "lucide-react";
import Layout from "@/components/layout/Layout";
import CheckoutSteps from "@/components/checkout/CheckoutSteps";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import OrderSummary from "@/components/cart/OrderSummary";
import { useCheckoutStore } from "@/store/useCheckoutStore";
import { ShippingAddress, SavedAddress } from "@/types";
import { cn } from "@/lib/utils";

const shippingSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  email: z.email("Please enter a valid email address"),
  phone: z
    .string()
    .regex(/^[6-9]\d{9}$/, "Please enter a valid 10-digit Indian mobile number"),
  addressLine: z.string().min(5, "Please enter a valid address").optional().or(z.literal("")),
  pinCode: z
    .string()
    .regex(/^\d{6}$/, "PIN code must be exactly 6 digits"),
  city: z.string().min(2, "City name must be at least 2 characters"),
  state: z.string().min(2, "State name must be at least 2 characters"),
});

type ShippingFormData = z.infer<typeof shippingSchema>;

const labelIcons: Record<string, React.ReactNode> = {
  Home: <Home className="w-4 h-4" />,
  Work: <Briefcase className="w-4 h-4" />,
  Other: <MapPin className="w-4 h-4" />,
};

const ShippingPage: NextPage = () => {
  const router = useRouter();
  const { cartData, shippingAddress, setShippingAddress, savedAddresses, addSavedAddress, removeSavedAddress } =
    useCheckoutStore();

  const [mode, setMode] = useState<"select" | "new" | "edit">(
    savedAddresses.length > 0 ? "select" : "new"
  );
  const [selectedId, setSelectedId] = useState<string | null>(
    savedAddresses.length > 0 ? savedAddresses[0].id : null
  );
  const [addressLabel, setAddressLabel] = useState("Home");
  const [saveAddress, setSaveAddress] = useState(true);

  useEffect(() => {
    if (!cartData || cartData.cartItems.length === 0) {
      router.replace("/");
    }
  }, [cartData, router]);

  // Pre-select if shippingAddress matches a saved address
  useEffect(() => {
    if (shippingAddress && savedAddresses.length > 0) {
      const match = savedAddresses.find((a) => a.phone === shippingAddress.phone && a.fullName === shippingAddress.fullName);
      if (match) setSelectedId(match.id);
    }
  }, []);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ShippingFormData>({
    resolver: zodResolver(shippingSchema),
    defaultValues: mode === "new" ? (shippingAddress ?? undefined) : undefined,
  });

  const handleSelectAndProceed = () => {
    const selected = savedAddresses.find((a) => a.id === selectedId);
    if (!selected) return;
    const { id, label, ...addressData } = selected;
    setShippingAddress(addressData as ShippingAddress);
    router.push("/checkout/payment");
  };

  const onSubmit = (data: ShippingFormData) => {
    const address = data as ShippingAddress;
    setShippingAddress(address);
    if (saveAddress) {
      addSavedAddress(address, addressLabel);
    }
    router.push("/checkout/payment");
  };

  const fields: Array<{
    name: keyof ShippingFormData;
    label: string;
    placeholder: string;
    type?: string;
    hint?: string;
    colSpan?: boolean;
  }> = [
    { name: "fullName", label: "Full Name", placeholder: "Riya Sharma", colSpan: true },
    { name: "email", label: "Email Address", placeholder: "riya@example.com", type: "email", colSpan: true },
    { name: "phone", label: "Phone Number", placeholder: "9876543210", hint: "10-digit mobile number" },
    { name: "addressLine", label: "Address Line", placeholder: "House No, Street, Area", colSpan: true },
    { name: "pinCode", label: "PIN Code", placeholder: "110001", hint: "6-digit PIN code" },
    { name: "city", label: "City", placeholder: "New Delhi" },
    { name: "state", label: "State", placeholder: "Delhi" },
  ];

  return (
    <Layout title="Shipping Address – Ecoyaan">
      <CheckoutSteps currentStep="shipping" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5">
        <div className="md:col-span-2 space-y-3 md:space-y-4">
          {/* Saved Addresses Section */}
          {savedAddresses.length > 0 && (
            <Card className="border-0 shadow-md rounded-2xl overflow-hidden">
              <CardHeader className="pb-3 bg-white border-b border-gray-100">
                <CardTitle className="flex items-center gap-2.5 text-lg text-gray-800">
                  <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-green-100">
                    <BookMarked className="w-5 h-5 text-green-700" />
                  </div>
                  Saved Addresses
                  <span className="text-sm font-normal text-gray-400 ml-1">
                    ({savedAddresses.length})
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 space-y-3">
                {savedAddresses.map((addr: SavedAddress) => (
                  <div
                    key={addr.id}
                    onClick={() => { setSelectedId(addr.id); setMode("select"); }}
                    className={cn(
                      "flex items-start gap-3 p-3.5 rounded-xl border-2 cursor-pointer transition-all duration-200",
                      selectedId === addr.id && mode === "select"
                        ? "border-green-500 bg-green-50 shadow-sm"
                        : "border-gray-200 bg-white hover:border-green-300 hover:bg-green-50/30"
                    )}
                  >
                    {/* Left icon */}
                    <div className={cn(
                      "flex items-center justify-center w-9 h-9 rounded-xl flex-shrink-0 mt-0.5",
                      selectedId === addr.id && mode === "select"
                        ? "bg-green-600 text-white"
                        : "bg-gray-100 text-gray-500"
                    )}>
                      {labelIcons[addr.label] ?? <MapPin className="w-4 h-4" />}
                    </div>

                    {/* Address text */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={cn(
                          "text-xs font-bold px-2 py-0.5 rounded-full",
                          selectedId === addr.id && mode === "select"
                            ? "bg-green-600 text-white"
                            : "bg-gray-100 text-gray-600"
                        )}>
                          {addr.label}
                        </span>
                        <span className="font-semibold text-sm text-gray-800">{addr.fullName}</span>
                      </div>
                      {addr.addressLine && (
                        <p className="text-xs text-gray-500 truncate">{addr.addressLine},</p>
                      )}
                      <p className="text-xs text-gray-500 truncate">
                        {addr.city}, {addr.state} – {addr.pinCode}
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5">{addr.phone}</p>
                    </div>

                    {/* Right actions column — trash stacked above tick, never overlapping */}
                    <div className="flex flex-col items-center gap-1.5 flex-shrink-0 ml-1">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeSavedAddress(addr.id);
                          if (selectedId === addr.id) {
                            const remaining = savedAddresses.filter((a) => a.id !== addr.id);
                            setSelectedId(remaining.length > 0 ? remaining[0].id : null);
                            if (remaining.length === 0) setMode("new");
                          }
                        }}
                        className="p-1.5 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        aria-label="Remove address"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                      {selectedId === addr.id && mode === "select" ? (
                        <CheckCircle2 className="w-5 h-5 text-green-600" />
                      ) : (
                        <div className="w-5 h-5 rounded-full border-2 border-gray-200" />
                      )}
                    </div>
                  </div>
                ))}

                <button
                  type="button"
                  onClick={() => { setMode("new"); setSelectedId(null); reset(); }}
                  className="w-full flex items-center justify-center gap-2 p-3 border-2 border-dashed border-gray-300 rounded-xl text-sm font-medium text-gray-500 hover:border-green-400 hover:text-green-600 hover:bg-green-50 transition-all"
                >
                  <Plus className="w-4 h-4" />
                  Add New Address
                </button>
              </CardContent>
            </Card>
          )}

          {/* Add New Address Form */}
          {mode === "new" && (
            <Card className="border-0 shadow-md rounded-2xl overflow-hidden">
              <CardHeader className="pb-3 bg-white border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2.5 text-lg text-gray-800">
                    <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-green-100">
                      <MapPin className="w-5 h-5 text-green-700" />
                    </div>
                    {savedAddresses.length > 0 ? "New Address" : "Delivery Address"}
                  </CardTitle>
                  {savedAddresses.length > 0 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => { setMode("select"); setSelectedId(savedAddresses[0].id); }}
                      className="text-xs text-gray-500 hover:text-green-700"
                    >
                      Cancel
                    </Button>
                  )}
                </div>
                <CardDescription className="text-gray-500">
                  Enter the delivery address for your order
                </CardDescription>
              </CardHeader>
              <CardContent className="p-5">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
                  {/* Address Label */}
                  <div className="space-y-2">
                    <Label className="text-gray-700 font-semibold">Save As</Label>
                    <div className="flex gap-2">
                      {["Home", "Work", "Other"].map((lbl) => (
                        <button
                          key={lbl}
                          type="button"
                          onClick={() => setAddressLabel(lbl)}
                          className={cn(
                            "flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-medium border-2 transition-all",
                            addressLabel === lbl
                              ? "border-green-500 bg-green-50 text-green-700"
                              : "border-gray-200 text-gray-500 hover:border-green-300"
                          )}
                        >
                          {labelIcons[lbl]}
                          {lbl}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {fields.map((field) => (
                      <div
                        key={field.name}
                        className={cn("space-y-1.5", field.colSpan ? "sm:col-span-2" : "")}
                      >
                        <Label htmlFor={field.name} className="text-gray-700 font-medium text-sm">
                          {field.label}
                          {field.name !== "addressLine" && <span className="text-red-400 ml-0.5">*</span>}
                        </Label>
                        <Input
                          id={field.name}
                          type={field.type ?? "text"}
                          placeholder={field.placeholder}
                          {...register(field.name)}
                          className={cn(
                            "rounded-xl border-gray-200 bg-gray-50 focus:bg-white transition-colors h-11",
                            errors[field.name] && "border-red-400 focus-visible:ring-red-400 bg-red-50"
                          )}
                          aria-describedby={errors[field.name] ? `${field.name}-error` : undefined}
                        />
                        {field.hint && !errors[field.name] && (
                          <p className="text-xs text-gray-400">{field.hint}</p>
                        )}
                        {errors[field.name] && (
                          <p id={`${field.name}-error`} className="text-xs text-red-500 flex items-center gap-1" role="alert">
                            ⚠ {errors[field.name]?.message}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Save address toggle */}
                  <label className="flex items-center gap-3 cursor-pointer p-3 bg-gray-50 rounded-xl hover:bg-green-50 transition-colors">
                    <div
                      onClick={() => setSaveAddress(!saveAddress)}
                      className={cn(
                        "relative w-11 h-6 rounded-full transition-colors flex-shrink-0",
                        saveAddress ? "bg-green-500" : "bg-gray-300"
                      )}
                    >
                      <div className={cn(
                        "absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform",
                        saveAddress ? "translate-x-6" : "translate-x-1"
                      )} />
                    </div>
                    <span className="text-sm text-gray-600 font-medium">Save this address for future orders</span>
                  </label>

                  {/* Hidden submit for form (triggered by sticky bar) */}
                  <button type="submit" id="shipping-submit" className="sr-only">Submit</button>
                </form>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar - Order Summary */}
        <div className="md:col-span-1">
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
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur border-t border-gray-200 shadow-2xl px-3 pt-2.5 pb-safe-bar sm:px-4 sm:pt-3">
        <div className="mx-auto max-w-6xl">
          <div className="flex items-center gap-2 sm:gap-3 md:grid md:grid-cols-3">
            <div className="flex items-center gap-2 sm:gap-3 flex-1 md:col-span-2">
              <Button
                type="button"
                variant="outline"
                className="gap-1.5 sm:gap-2 h-10 sm:h-11 px-3 sm:px-5 rounded-xl border-gray-300 text-gray-600 hover:border-green-400 hover:text-green-700 font-semibold flex-shrink-0"
                onClick={() => router.back()}
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="hidden sm:inline">Back</span>
              </Button>
              <Button
                type="button"
                className="flex-1 gap-1.5 sm:gap-2 h-10 sm:h-11 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold rounded-xl shadow-lg shadow-green-200 transition-all hover:shadow-xl text-sm"
                disabled={isSubmitting}
                onClick={() => {
                  if (mode === "select") {
                    handleSelectAndProceed();
                  } else {
                    document.getElementById("shipping-submit")?.click();
                  }
                }}
              >
                <span className="hidden sm:inline">Continue to </span>Payment
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
            <div className="hidden md:flex md:col-span-1 items-center justify-center text-sm text-gray-400 gap-1.5 pl-4">
              <span>🔒</span>
              <span>Secure & Encrypted</span>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ShippingPage;
