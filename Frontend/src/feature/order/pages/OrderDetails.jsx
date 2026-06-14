import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useOrder } from "../hook/useOrder";
import OrderDeliveryInfo from "../components/OrderDeliveryInfo";
import OrderItemsList from "../components/OrderItemsList";
import { 
  ArrowLeft, 
  ShoppingBag, 
  Loader2, 
  AlertCircle, 
  Calendar
} from "lucide-react";
import { toast } from "react-toastify";

const statusStyles = {
  PENDING: "bg-amber-950/20 border-amber-900/40 text-amber-400",
  SHIPPED: "bg-sky-950/20 border-sky-900/40 text-sky-400",
  OUT_FOR_DELIVERY: "bg-indigo-950/20 border-indigo-900/40 text-indigo-400",
  DELIVERED: "bg-emerald-950/20 border-emerald-900/40 text-emerald-400",
  CANCELLED: "bg-red-950/20 border-red-900/40 text-red-400",
};

export default function OrderDetails() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { handleGetOrderDetails, handleCancelOrder } = useOrder();

  const currentOrder = useSelector((state) => state.order.currentOrder);
  const loading = useSelector((state) => state.order.loading);
  const error = useSelector((state) => state.order.error);

  useEffect(() => {
    handleGetOrderDetails(orderId);
  }, [orderId]);

  const handleCancel = async () => {
    if (window.confirm("Are you sure you want to cancel this order?")) {
      try {
        const res = await handleCancelOrder(orderId);
        if (res && res.success) {
          toast.success("Order cancelled successfully!");
          handleGetOrderDetails(orderId); // Refresh details
        }
      } catch (err) {
        // Error toast handled in hook
      }
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading && !currentOrder) {
    return (
      <div className="min-h-screen bg-neutral-950 text-neutral-200 flex flex-col items-center justify-center p-8">
        <Loader2 className="h-8 w-8 text-neutral-500 animate-spin stroke-[1.5]" />
        <span className="text-[10px] font-mono tracking-widest text-neutral-500 mt-4 uppercase">
          RETRIEVING ORDER PROFILE...
        </span>
      </div>
    );
  }

  if (!currentOrder && error) {
    return (
      <div className="min-h-screen bg-neutral-950 text-neutral-200 flex flex-col items-center justify-center p-8 text-center space-y-4">
        <AlertCircle className="h-12 w-12 text-red-500 stroke-[1.25]" />
        <h3 className="text-lg font-serif text-white">Failed to retrieve order</h3>
        <p className="text-xs text-neutral-500 max-w-sm font-light">{error}</p>
        <button
          onClick={() => navigate("/my-orders")}
          className="px-5 py-2.5 rounded-xl border border-neutral-800 bg-neutral-900 text-xs font-mono tracking-wider cursor-pointer"
        >
          BACK TO MY ORDERS
        </button>
      </div>
    );
  }

  if (!currentOrder) return null;

  const statusStyle = statusStyles[currentOrder.status] || "border-neutral-850 text-neutral-400";

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,600;1,300;1,600&family=Outfit:wght@300;400;500;600;700;800&display=swap');
        .snitch-order-details { 
          font-family: 'Outfit', sans-serif; 
        }
        .snitch-order-details .font-serif { 
          font-family: 'Cormorant Garamond', Georgia, serif; 
        }
        .grain::after {
          content:''; position:absolute; inset:0;
          background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.05'/%3E%3C/svg%3E");
          pointer-events:none; z-index:5; mix-blend-mode:overlay;
        }
      `}</style>

      <div className="snitch-order-details min-h-screen bg-neutral-950 text-neutral-200 relative overflow-x-hidden grain flex flex-col p-4 sm:p-6 lg:p-8">
        {/* Glow ambient background */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-white/[0.01] blur-[120px] pointer-events-none" />
        <div className="absolute bottom-1/3 right-1/4 w-80 h-80 rounded-full bg-neutral-900/30 blur-[100px] pointer-events-none" />

        {/* Header */}
        <header className="flex items-center justify-between pb-4 border-b border-neutral-800 shrink-0 z-10">
          <button
            onClick={() => navigate("/my-orders")}
            className="flex items-center gap-2 text-neutral-400 hover:text-white font-mono text-xs tracking-wider transition-all duration-300 cursor-pointer bg-transparent border-0"
          >
            <ArrowLeft className="h-4 w-4" />
            MY ORDERS
          </button>
          <div className="flex items-center gap-2">
            <ShoppingBag className="h-4 w-4 stroke-[1.5] text-neutral-300" />
            <span className="font-mono text-xs font-bold tracking-[0.4em] uppercase text-white">
              ORDER SUMMARY
            </span>
          </div>
          <div className="w-20" />
        </header>

        {/* Main content */}
        <main className="flex-1 flex flex-col mt-6 z-10 max-w-4xl mx-auto w-full">
          {/* Title and ID */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 pb-6 border-b border-neutral-900 mb-8">
            <div className="space-y-1.5">
              <span className={`px-2.5 py-0.5 rounded-md border text-[9px] font-mono font-bold tracking-wider uppercase inline-block ${statusStyle}`}>
                {currentOrder.status}
              </span>
              <h1 className="text-2xl sm:text-3xl font-light font-serif text-white tracking-wide">
                Order #{currentOrder._id.toUpperCase()}
              </h1>
              <p className="text-[10px] text-neutral-500 font-mono flex items-center gap-1.5">
                <Calendar className="h-3 w-3 text-neutral-600" />
                PLACED ON {formatDate(currentOrder.createdAt).toUpperCase()}
              </p>
            </div>
            {currentOrder.status === "PENDING" && (
              <button
                onClick={handleCancel}
                disabled={loading}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-red-950/45 hover:border-red-900/60 bg-red-950/10 hover:bg-red-950/20 text-red-400 font-mono text-[10px] font-bold tracking-wider transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? <Loader2 className="h-3 w-3 animate-spin" /> : "CANCEL ORDER"}
              </button>
            )}
          </div>

          <OrderDeliveryInfo order={currentOrder} />

          <OrderItemsList items={currentOrder.items} />
        </main>
      </div>
    </>
  );
}
