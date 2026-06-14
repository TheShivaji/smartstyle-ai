import React from "react";
import { MapPin, CreditCard, Layers } from "lucide-react";

const currencySymbols = {
  INR: "₹",
  USD: "$",
  EUR: "€",
  GBP: "£",
};

export default function OrderDeliveryInfo({ order }) {
  const address = order.shipmentAddress || {};
  const firstItem = order.items?.[0] || {};
  const product = firstItem.product || {};
  const currency = product.price?.currency || "INR";
  const symbol = currencySymbols[currency] || "₹";

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {/* Delivery address card */}
      <div className="p-5 rounded-2xl bg-[#0c0c0c]/85 border border-neutral-900 space-y-3">
        <div className="flex items-center gap-2 border-b border-neutral-900 pb-2 text-neutral-400">
          <MapPin className="h-4 w-4" />
          <span className="text-[10px] font-mono tracking-wider uppercase">Shipment Address</span>
        </div>
        <div className="text-xs space-y-1 font-light text-neutral-300 leading-relaxed">
          <p className="font-semibold text-white">{address.fullName}</p>
          <p>{address.address}</p>
          {address.landmark && <p>Landmark: {address.landmark}</p>}
          <p>{address.city}, {address.state} - {address.pincode}</p>
          <p className="pt-2 font-mono text-[10px] text-neutral-500">TEL: {address.mobileNo}</p>
        </div>
      </div>

      {/* Payment card */}
      <div className="p-5 rounded-2xl bg-[#0c0c0c]/85 border border-neutral-900 space-y-3">
        <div className="flex items-center gap-2 border-b border-neutral-900 pb-2 text-neutral-400">
          <CreditCard className="h-4 w-4" />
          <span className="text-[10px] font-mono tracking-wider uppercase">Payment Method</span>
        </div>
        <div className="text-xs space-y-1 font-light text-neutral-300">
          <p className="font-semibold text-white">Cash on Delivery (COD)</p>
          <p className="font-mono text-[10px] text-neutral-500 uppercase">
            Status: <span className="text-neutral-400">{order.paymentStatus || "PENDING"}</span>
          </p>
          <p className="text-[10px] text-neutral-500 font-light pt-2 leading-relaxed">
            Pay at door when shipment is delivered by our logistics team.
          </p>
        </div>
      </div>

      {/* Pricing Summary card */}
      <div className="p-5 rounded-2xl bg-[#0c0c0c]/85 border border-neutral-900 space-y-3">
        <div className="flex items-center gap-2 border-b border-neutral-900 pb-2 text-neutral-400">
          <Layers className="h-4 w-4" />
          <span className="text-[10px] font-mono tracking-wider uppercase">Billing Summary</span>
        </div>
        <div className="space-y-2.5 font-mono text-[10px] text-neutral-400">
          <div className="flex justify-between">
            <span>ITEMS SUB-TOTAL</span>
            <span>{symbol}{Number(order.totalAmount || 0).toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span>DELIVERY FEE</span>
            <span className="text-green-500 font-bold">FREE</span>
          </div>
          <div className="border-t border-neutral-900 pt-2.5 flex justify-between text-xs font-semibold text-white">
            <span>GRAND TOTAL</span>
            <span>{symbol}{Number(order.totalAmount || 0).toLocaleString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
