import React from "react";
import { MapPin, Phone, Mail, User } from "lucide-react";
import { ShippingAddress } from "@/types";

interface AddressSummaryProps {
  address: ShippingAddress;
}

const AddressSummary: React.FC<AddressSummaryProps> = ({ address }) => {
  return (
    <div className="space-y-2 text-sm">
      <div className="flex items-start gap-2">
        <User className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
        <span className="font-medium">{address.fullName}</span>
      </div>
      <div className="flex items-start gap-2">
        <MapPin className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
        <span className="text-muted-foreground">
          {address.city}, {address.state} – {address.pinCode}
        </span>
      </div>
      <div className="flex items-center gap-2">
        <Phone className="w-4 h-4 text-muted-foreground flex-shrink-0" />
        <span className="text-muted-foreground">{address.phone}</span>
      </div>
      <div className="flex items-center gap-2">
        <Mail className="w-4 h-4 text-muted-foreground flex-shrink-0" />
        <span className="text-muted-foreground">{address.email}</span>
      </div>
    </div>
  );
};

export default AddressSummary;
