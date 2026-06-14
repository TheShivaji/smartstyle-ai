import React from "react";

const currencySymbols = {
  INR: "₹",
  USD: "$",
  EUR: "€",
  GBP: "£",
};

export default function OrderItemsList({ items }) {
  const formatPrice = (price, currency) => {
    const symbol = currencySymbols[currency] || "₹";
    return `${symbol}${Number(price || 0).toLocaleString()}`;
  };

  return (
    <div className="p-6 rounded-2xl bg-[#0c0c0c]/85 border border-neutral-900 space-y-6">
      <h2 className="text-lg font-serif font-light text-white border-b border-neutral-900 pb-3 tracking-wide">
        Package Items
      </h2>

      <div className="space-y-4">
        {items?.map((item) => {
          const prod = item.product || {};
          const variantId = item.variant;
          const activeVar = prod.variants?.find((v) => v._id === variantId) || {};
          const itemImage = activeVar.images?.[0]?.url || prod.images?.[0]?.url;
          const currency = prod.price?.currency || "INR";
          
          const attributes = activeVar.attributes
            ? Object.entries(activeVar.attributes)
                .map(([key, val]) => `${key.toUpperCase()}: ${val}`)
                .join(" | ")
            : "";

          return (
            <div
              key={`${prod._id}-${variantId}`}
              className="flex gap-4 p-4 rounded-xl border border-neutral-900 bg-neutral-950/20 hover:border-neutral-800 transition-all duration-300"
            >
              <div className="w-16 sm:w-20 aspect-[3/4] rounded-lg overflow-hidden border border-neutral-900 bg-neutral-950 shrink-0">
                {itemImage ? (
                  <img
                    src={itemImage}
                    alt={prod.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-[6px] font-mono tracking-widest text-neutral-800">
                    NO IMG
                  </div>
                )}
              </div>
              
              <div className="flex-1 flex flex-col justify-between py-1">
                <div className="space-y-1">
                  <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-100">
                    {prod.title}
                  </h3>
                  <p className="text-[9px] text-neutral-500 font-mono">
                    {attributes || "NO SPECIFICATIONS"}
                  </p>
                </div>
                
                <div className="flex justify-between items-end">
                  <p className="text-[10px] text-neutral-400 font-light">
                    Quantity: {item.quantity}
                  </p>
                  <p className="text-xs font-mono font-semibold text-white">
                    {formatPrice((item.price?.amount || prod.price?.amount || 0) * item.quantity, currency)}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
