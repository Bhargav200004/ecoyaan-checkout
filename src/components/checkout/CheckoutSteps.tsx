import React from "react";
import { CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface Step {
  id: number;
  label: string;
  key: string;
}

const steps: Step[] = [
  { id: 1, label: "Cart", key: "cart" },
  { id: 2, label: "Shipping", key: "shipping" },
  { id: 3, label: "Payment", key: "payment" },
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
    <div className="flex items-center justify-center mb-8">
      {steps.map((step, idx) => (
        <React.Fragment key={step.id}>
          <div className="flex flex-col items-center gap-1">
            <div
              className={cn(
                "flex items-center justify-center w-9 h-9 rounded-full border-2 transition-all duration-200",
                idx < current
                  ? "bg-primary border-primary text-white"
                  : idx === current
                  ? "border-primary text-primary bg-white"
                  : "border-muted-foreground/30 text-muted-foreground/50 bg-white"
              )}
            >
              {idx < current ? (
                <CheckCircle2 className="w-5 h-5 fill-current" />
              ) : (
                <span className="text-sm font-semibold">{step.id}</span>
              )}
            </div>
            <span
              className={cn(
                "text-xs font-medium hidden sm:block",
                idx <= current ? "text-primary" : "text-muted-foreground/50"
              )}
            >
              {step.label}
            </span>
          </div>
          {idx < steps.length - 1 && (
            <div
              className={cn(
                "flex-1 h-0.5 mx-2 mb-5 transition-all duration-200",
                idx < current ? "bg-primary" : "bg-muted-foreground/20"
              )}
            />
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

export default CheckoutSteps;
