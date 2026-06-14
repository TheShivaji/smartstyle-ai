import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useOrder } from "../hook/useOrder";
import { 
  ArrowLeft, 
  ShoppingBag, 
  Loader2, 
  AlertCircle, 
  Calendar,
  DollarSign,
  Package,
  XCircle,
  Truck,
  CheckCircle,
  ChevronRight
} from "lucide-react";
import { toast } from "react-toastify";

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

export default function Orders() {
  const navigate = useNavigate();
  const { handleGetMyOrders, handleCancelOrder } = useOrder();
  
  const orders = useSelector((state) => state.order.myOrders) || [];
  const loading = useSelector((state) => state.order.loading);
  const error = useSelector((state) => state.order.error);

  useEffect(() => {
    handleGetMyOrders();
  }, []);

  const handleCancel = async (orderId, e) => {
    e.stopPropagation(); // Prevent card navigation click
    if (window.confirm("Are you sure you want to cancel this order?")) {
      try {
        const res = await handleCancelOrder(orderId);
        if (res && res.success) {
          toast.success("Order cancelled successfully!");
          handleGetMyOrders(); // Refresh order history list
        }
      } catch (err) {
        // Error toast handled in hook
      }
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const formatPrice = (price, currency) => {
    const symbol = currencySymbols[currency] || "₹";
    return `${symbol}${Number(price || 0).toLocaleString()}`;
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,600;1,300;1,600&family=Outfit:wght@300;400;500;600;700;800&display=swap');
        .snitch-orders-page { 
          font-family: 'Outfit', sans-serif; 
        }
        .snitch-orders-page .font-serif { 
          font-family: 'Cormorant Garamond', Georgia, serif; 
        }
        .grain::after {
          content:''; position:absolute; inset:0;
          background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.05'/%3E%3C/svg%3E");
          pointer-events:none; z-index:5; mix-blend-mode:overlay;
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-slide-up {
          animation: slideUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>

      <div className="snitch-orders-page min-h-screen bg-neutral-950 text-neutral-200 relative overflow-x-hidden grain flex flex-col p-4 sm:p-6 lg:p-8">
        {/* Glow ambient background */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-white/[0.01] blur-[120px] pointer-events-none" />
        <div className="absolute bottom-1/3 right-1/4 w-80 h-80 rounded-full bg-neutral-900/30 blur-[100px] pointer-events-none" />

        {/* Header */}
        <header className="flex items-center justify-between pb-4 border-b border-neutral-800 shrink-0 z-10">
          <button
            onClick={() => navigate("/showallproduct")}
            className="flex items-center gap-2 text-neutral-400 hover:text-white font-mono text-xs tracking-wider transition-all duration-300 cursor-pointer bg-transparent border-0"
          >
            <ArrowLeft className="h-4 w-4" />
            BACK TO STORE
          </button>
          <div className="flex items-center gap-2">
            <ShoppingBag className="h-4 w-4 stroke-[1.5] text-neutral-300" />
            <span className="font-mono text-xs font-bold tracking-[0.4em] uppercase text-white">
              MY PURCHASE HISTORY
            </span>
          </div>
          <div className="w-20" />
        </header>

        {/* Main Area */}
        <main className="flex-1 flex flex-col mt-6 z-10 max-w-4xl mx-auto w-full animate-slide-up">
          <div className="space-y-1 mb-8">
            <h1 className="text-3xl sm:text-4xl font-light font-serif text-white tracking-wide">
              Your Orders
            </h1>
            <p className="text-xs font-light text-neutral-400">
              Track fulfillment status and view active or completed orders.
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-950/20 border border-red-900/40 flex items-start gap-3 text-red-300 text-xs">
              <AlertCircle className="h-4 w-4 text-red-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold font-mono text-[10px] tracking-wider uppercase">Fulfillment Error</span>
                <p className="font-light text-red-300/80 mt-0.5">{error}</p>
              </div>
            </div>
          )}

          {loading && orders.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center min-h-[400px]">
              <Loader2 className="h-8 w-8 text-neutral-500 animate-spin stroke-[1.5]" />
              <span className="text-[10px] font-mono tracking-widest text-neutral-500 mt-4 uppercase">
                RETRIEVING ORDER DETAILS...
              </span>
            </div>
          ) : orders.length === 0 ? (
            /* Empty State */
            <div className="flex-1 flex flex-col items-center justify-center border border-dashed border-neutral-800 rounded-2xl bg-[#0a0a0a]/40 p-12 text-center min-h-[400px]">
              <div className="p-4 rounded-full bg-neutral-900 border border-neutral-800 mb-4">
                <Package className="h-8 w-8 text-neutral-400 stroke-[1.25]" />
              </div>
              <h3 className="text-lg font-serif font-light text-white mb-1.5">No orders found</h3>
              <p className="text-xs text-neutral-500 font-light max-w-sm leading-relaxed mb-6">
                You haven't placed any orders yet. Browse our exclusive designs to find your fit.
              </p>
              <button
                onClick={() => navigate("/showallproduct")}
                className="px-6 py-3 rounded-xl bg-white text-black hover:bg-neutral-200 transition-all font-mono text-xs font-bold tracking-wider cursor-pointer"
              >
                EXPLORE CATALOGUE
              </button>
            </div>
          ) : (
            /* Orders List */
            <div className="space-y-4">
              {orders.map((order) => {
                const activeStyle = statusStyles[order.status] || "border-neutral-800 text-neutral-400";
                const activeIcon = statusIcons[order.status] || <Package className="h-3.5 w-3.5" />;
                const firstItem = order.items?.[0] || {};
                const product = firstItem.product || {};
                const itemImage = product.images?.[0]?.url;
                
                return (
                  <div
                    key={order._id}
                    onClick={() => navigate(`/order-details/${order._id}`)}
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
                          <div className="w-full h-full flex items-center justify-center text-[6px] font-mono tracking-widest text-neutral-800">
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
                          onClick={(e) => handleCancel(order._id, e)}
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
              })}
            </div>
          )}
        </main>
      </div>
    </>
  );
}
