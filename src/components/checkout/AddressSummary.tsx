import React from "react";
import { MapPin, Phone, Mail, User, Home } from "lucide-react";
import { ShippingAddress } from "@/types";

interface AddressSummaryProps {
  address: ShippingAddress;
}

const AddressSummary: React.FC<AddressSummaryProps> = ({ address }) => {
  return (
    <div className="space-y-2.5 text-sm">
      <div className="flex items-center gap-2.5">
        <div className="flex items-center justify-center w-7 h-7 rounded-full bg-green-50 flex-shrink-0">
          <User className="w-3.5 h-3.5 text-green-600" />
        </div>
        <span className="font-semibold text-gray-800">{address.fullName}</span>
      </div>
      {address.addressLine && (
        <div className="flex items-start gap-2.5">
          <div className="flex items-center justify-center w-7 h-7 rounded-full bg-green-50 flex-shrink-0 mt-0.5">
            <Home className="w-3.5 h-3.5 text-green-600" />
          </div>
          <span className="text-gray-600">{address.addressLine}</span>
        </div>
      )}
      <div className="flex items-start gap-2.5">
        <div className="flex items-center justify-center w-7 h-7 rounded-full bg-green-50 flex-shrink-0 mt-0.5">
          <MapPin className="w-3.5 h-3.5 text-green-600" />
        </div>
        <span className="text-gray-600">
          {address.city}, {address.state} – {address.pinCode}
        </span>
      </div>
      <div className="flex items-center gap-2.5">
        <div className="flex items-center justify-center w-7 h-7 rounded-full bg-green-50 flex-shrink-0">
          <Phone className="w-3.5 h-3.5 text-green-600" />
        </div>
        <span className="text-gray-600">{address.phone}</span>
      </div>
      <div className="flex items-center gap-2.5">
        <div className="flex items-center justify-center w-7 h-7 rounded-full bg-green-50 flex-shrink-0">
          <Mail className="w-3.5 h-3.5 text-green-600" />
        </div>
        <span className="text-gray-600">{address.email}</span>
      </div>
    </div>
  );
};

export default AddressSummary;
