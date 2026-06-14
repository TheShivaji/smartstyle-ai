import React from "react";
import { Tag, CheckCircle2 } from "lucide-react";

const currencySymbols = {
  INR: "₹",
  USD: "$",
  EUR: "€",
  GBP: "£",
};

export default function CheckoutSummary({
  product,
  activeVariant,
  quantity,
  couponCode,
  setCouponCode,
  handleCouponSubmit,
  isCouponApplied,
  appliedCoupon,
  subtotal,
  discountAmount,
  grandTotal,
  loading
}) {
  const itemImage = activeVariant?.images?.[0]?.url || product?.images?.[0]?.url;
  const currency = activeVariant?.price?.currency || product?.price?.currency || "INR";
  const symbol = currencySymbols[currency] || "₹";
  const priceAmount = activeVariant?.price?.amount || product?.price?.amount || 0;

  const attributes = activeVariant?.attributes
    ? Object.entries(activeVariant.attributes)
        .map(([key, val]) => `${key.toUpperCase()}: ${val}`)
        .join(" | ")
    : "";

  return (
    <div className="p-6 rounded-2xl bg-[#0c0c0c]/85 border border-neutral-900 space-y-6">
      <h2 className="text-lg font-serif font-light text-white border-b border-neutral-900 pb-3 tracking-wide">
        Order Summary
      </h2>

      {/* Product details */}
      {product && (
        <div className="flex gap-4 items-start pb-4 border-b border-neutral-900/60">
          <div className="w-16 aspect-[3/4] rounded-lg overflow-hidden border border-neutral-900 bg-neutral-950 shrink-0">
            {itemImage ? (
              <img
                src={itemImage}
                alt={product.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-[6px] font-mono tracking-widest text-neutral-800">
                NO IMG
              </div>
            )}
          </div>
          <div className="space-y-1 py-0.5">
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-100 line-clamp-1">
              {product.title}
            </h3>
            <p className="text-[9px] text-neutral-500 font-mono">
              {attributes || "NO SPECIFICATIONS"}
            </p>
            <p className="text-[10px] text-neutral-400 font-light">
              Qty: {quantity} &times; {symbol}{priceAmount.toLocaleString()}
            </p>
          </div>
        </div>
      )}

      {/* Coupon form */}
      <form onSubmit={handleCouponSubmit} className="flex gap-2 items-center">
        <div className="relative flex-1">
          <Tag className="absolute inset-y-0 left-3.5 h-3.5 w-3.5 text-neutral-500 my-auto pointer-events-none" />
          <input
            type="text"
            placeholder="ENTER PROMO CODE..."
            value={couponCode}
            onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
            disabled={isCouponApplied || loading}
            className="w-full bg-neutral-900/40 border border-neutral-800 focus:border-neutral-500 rounded-xl py-2 pl-9 pr-4 text-[10px] font-mono text-white placeholder-neutral-600 focus:outline-none focus:ring-1 focus:ring-neutral-700 transition-all uppercase"
          />
        </div>
        <button
          type="submit"
          disabled={isCouponApplied || loading || !couponCode.trim()}
          className="px-4 py-2.5 rounded-xl border border-neutral-800 hover:border-neutral-700 bg-neutral-900 text-neutral-300 hover:text-white font-mono text-[10px] font-bold tracking-wider transition-all cursor-pointer disabled:opacity-30 shrink-0"
        >
          APPLY
        </button>
      </form>

      {isCouponApplied && appliedCoupon && (
        <div className="p-3.5 rounded-xl bg-green-950/20 border border-green-900/40 flex items-center gap-2 text-green-400 text-xs">
          <CheckCircle2 className="h-4 w-4 text-green-400 shrink-0" />
          <p className="font-light">
            Coupon <span className="font-mono font-bold">{appliedCoupon.code}</span> applied successfully ({appliedCoupon.discount}% discount).
          </p>
        </div>
      )}

      {/* Subtotals */}
      <div className="space-y-3 pt-2 border-t border-neutral-900 font-mono text-xs">
        <div className="flex justify-between text-neutral-400">
          <span>ITEMS TOTAL</span>
          <span>{symbol}{subtotal.toLocaleString()}</span>
        </div>
        <div className="flex justify-between text-neutral-400">
          <span>COUPON DISCOUNT</span>
          {isCouponApplied && appliedCoupon ? (
            <span className="text-green-500 font-bold">
              -{symbol}{discountAmount.toLocaleString()}
            </span>
          ) : (
            <span>{symbol}0</span>
          )}
        </div>
        <div className="flex justify-between text-neutral-400">
          <span>SHIPPING & HANDLING</span>
          <span className="text-green-500 font-bold">FREE</span>
        </div>
        
        <div className="border-t border-neutral-900 my-4 pt-4 flex justify-between text-sm font-semibold text-white">
          <span>GRAND TOTAL</span>
          <span>{symbol}{grandTotal.toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
}
