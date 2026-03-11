import React from "react";
import { CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface Step {
  id: number;
  label: string;
  key: string;
  icon: string;
}

const steps: Step[] = [
  { id: 1, label: "Cart", key: "cart", icon: "🛒" },
  { id: 2, label: "Shipping", key: "shipping", icon: "📦" },
  { id: 3, label: "Payment", key: "payment", icon: "💳" },
];

interface CheckoutStepsProps {
  currentStep: "cart" | "shipping" | "payment" | "success";
}

const stepIndex: Record<string, number> = {
  cart: 0,
  shipping: 1,
  payment: 2,
  success: 3,
};

const CheckoutSteps: React.FC<CheckoutStepsProps> = ({ currentStep }) => {
  const current = stepIndex[currentStep] ?? 0;

  return (
    <div className="mb-8">
      <div className="flex items-center justify-center">
        {steps.map((step, idx) => (
          <React.Fragment key={step.id}>
            <div className="flex flex-col items-center gap-1.5">
              <div
                className={cn(
                  "flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-300 shadow-sm",
                  idx < current
                    ? "bg-gradient-to-br from-green-500 to-emerald-600 border-green-500 text-white shadow-green-200"
                    : idx === current
                    ? "border-green-500 text-green-600 bg-white shadow-green-100 ring-4 ring-green-100"
                    : "border-gray-200 text-gray-300 bg-white"
                )}
              >
                {idx < current ? (
                  <CheckCircle2 className="w-5 h-5 fill-current" />
                ) : (
                  <span className="text-base">{step.icon}</span>
                )}
              </div>
              <span
                className={cn(
                  "text-xs font-semibold hidden sm:block transition-colors",
                  idx < current
                    ? "text-green-600"
                    : idx === current
                    ? "text-green-700"
                    : "text-gray-400"
                )}
              >
                {step.label}
              </span>
            </div>
            {idx < steps.length - 1 && (
              <div className="relative flex-1 mx-3 mb-5">
                <div className="h-1 rounded-full bg-gray-100 overflow-hidden">
                  <div
                    className={cn(
                      "h-full rounded-full transition-all duration-500",
                      idx < current
                        ? "bg-gradient-to-r from-green-500 to-emerald-500 w-full"
                        : "w-0"
                    )}
                  />
                </div>
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default CheckoutSteps;
