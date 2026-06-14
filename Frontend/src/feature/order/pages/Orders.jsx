import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useOrder } from "../hook/useOrder";
import OrderCard from "../components/OrderCard";
import { 
  ArrowLeft, 
  ShoppingBag, 
  Loader2, 
  AlertCircle, 
  Package
} from "lucide-react";
import { toast } from "react-toastify";

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
    if (e && e.stopPropagation) e.stopPropagation(); // Prevent card navigation click
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
            <div className="space-y-4">
              {orders.map((order) => (
                <OrderCard
                  key={order._id}
                  order={order}
                  onCancel={(id, e) => handleCancel(id, e)}
                  onClick={() => navigate(`/order-details/${order._id}`)}
                />
              ))}
            </div>
          )}
        </main>
      </div>
    </>
  );
}
