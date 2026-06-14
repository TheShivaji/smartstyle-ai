import React from "react";
import { Package, Truck, CheckCircle, XCircle, ChevronRight, Calendar } from "lucide-react";

const currencySymbols = {
  INR: "₹",
  USD: "$",
  EUR: "€",
  GBP: "£",
};

const statusStyles = {
  PENDING: "bg-amber-950/20 border-amber-900/40 text-amber-400",
  SHIPPED: "bg-sky-950/20 border-sky-900/40 text-sky-400",
  OUT_FOR_DELIVERY: "bg-indigo-950/20 border-indigo-900/40 text-indigo-400",
  DELIVERED: "bg-emerald-950/20 border-emerald-900/40 text-emerald-400",
  CANCELLED: "bg-red-950/20 border-red-900/40 text-red-400",
};

const statusIcons = {
  PENDING: <Package className="h-3.5 w-3.5" />,
  SHIPPED: <Truck className="h-3.5 w-3.5" />,
  OUT_FOR_DELIVERY: <Truck className="h-3.5 w-3.5" />,
  DELIVERED: <CheckCircle className="h-3.5 w-3.5" />,
  CANCELLED: <XCircle className="h-3.5 w-3.5" />,
};

export default function OrderCard({ order, onCancel, onClick }) {
  const activeStyle = statusStyles[order.status] || "border-neutral-850 text-neutral-400";
  const activeIcon = statusIcons[order.status] || <Package className="h-3.5 w-3.5" />;
  const firstItem = order.items?.[0] || {};
  const product = firstItem.product || {};
  const itemImage = product.images?.[0]?.url;

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const formatPrice = (price, currency) => {
    const symbol = currencySymbols[currency] || "₹";
    return `${symbol}${Number(price || 0).toLocaleString()}`;
  };

  return (
    <div
      onClick={onClick}
      className="p-5 rounded-2xl bg-[#0c0c0c]/85 border border-neutral-900 hover:border-neutral-800 transition-all duration-300 cursor-pointer flex flex-col md:flex-row justify-between md:items-center gap-6 relative group"
    >
      {/* Left side details */}
      <div className="flex gap-4 items-center">
        {/* Product preview thumbnail */}
        <div className="w-16 aspect-[3/4] rounded-lg overflow-hidden border border-neutral-900 bg-neutral-950 shrink-0">
          {itemImage ? (
            <img
              src={itemImage}
              alt={product.title || "Product Thumbnail"}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-[6px] font-mono tracking-widest text-neutral-805">
              NO IMG
            </div>
          )}
        </div>
        
        <div className="space-y-1.5">
          <div className="flex flex-wrap items-center gap-2">
            <span className={`px-2.5 py-0.5 rounded-md border text-[9px] font-mono font-bold tracking-wider uppercase flex items-center gap-1.5 ${activeStyle}`}>
              {activeIcon}
              {order.status}
            </span>
            <span className="text-[10px] text-neutral-500 font-mono">
              ID: #{order._id.substring(order._id.length - 8).toUpperCase()}
            </span>
          </div>
          <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-100 line-clamp-1 group-hover:text-white transition-colors">
            {product.title || "Premium Apparel"}
            {order.items.length > 1 && ` (+${order.items.length - 1} more items)`}
          </h3>
          <div className="flex items-center gap-3 text-[10px] text-neutral-400 font-light">
            <span className="flex items-center gap-1">
              <Calendar className="h-3 w-3 text-neutral-500" />
              {formatDate(order.createdAt)}
            </span>
            <span>&bull;</span>
            <span className="font-mono text-neutral-300 font-medium">
              {formatPrice(order.totalAmount, product.price?.currency)}
            </span>
          </div>
        </div>
      </div>

      {/* Right side actions */}
      <div className="flex items-center gap-3 self-end md:self-center">
        {order.status === "PENDING" && (
          <button
            onClick={(e) => onCancel(order._id, e)}
            className="px-3.5 py-2 rounded-xl border border-red-950/45 hover:border-red-900/60 bg-red-950/10 hover:bg-red-950/20 text-red-400 font-mono text-[9px] font-bold tracking-wider transition-all cursor-pointer"
          >
            CANCEL
          </button>
        )}
        
        <div className="p-2 rounded-xl bg-neutral-900 border border-neutral-850 hover:border-neutral-700 text-neutral-400 hover:text-white transition-all cursor-pointer">
          <ChevronRight className="h-4 w-4" />
        </div>
      </div>
    </div>
  );
}
