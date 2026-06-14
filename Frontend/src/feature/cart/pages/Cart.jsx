import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../hook/useCart";
import { useAuth } from "../../auth/hook/useAuth";
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ArrowLeft,
  Loader2,
  AlertCircle,
  LogOut,
  ShoppingBag as BagIcon,
} from "lucide-react";
import { toast } from "react-toastify";

const currencySymbols = {
  INR: "₹",
  USD: "$",
  EUR: "€",
  GBP: "£",
};

export default function Cart() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const {
    items,
    isLoading,
    error,
    handleGetCart,
    handleRemoveItemFromCart,
    handleDeleteCart,
    handleUpdateCartQuantity,
  } = useCart();

  useEffect(() => {
    handleGetCart();
  }, []);

  const formatPrice = (price, currency) => {
    const symbol = currencySymbols[currency] || "₹";
    const amount = Number(price?.amount || price || 0).toLocaleString();
    return `${symbol}${amount}`;
  };

  const calculateSubtotal = () => {
    return items.reduce((acc, item) => {
      const price = item.price?.amount || 0;
      return acc + price * item.quantity;
    }, 0);
  };

  const getCurrency = () => {
    if (items.length > 0) {
      return items[0].price?.currency || "INR";
    }
    return "INR";
  };

  const handleQuantityChange = async (item, change) => {
    const newQty = item.quantity + change;
    const productId = item.product._id || item.product;
    const variantId = item.variant._id || item.variant;

    if (newQty < 1) {
      // If quantity is 0 or less, remove it
      handleRemove(item);
      return;
    }

    // Call update API
    const res = await handleUpdateCartQuantity({
      productId,
      variantId,
      body: { quantity: newQty },
    });

    if (res && !res.success) {
      toast.error(res.message || "Failed to update quantity");
    }
  };

  const handleRemove = async (item) => {
    const productId = item.product._id || item.product;
    const variantId = item.variant._id || item.variant;

    const res = await handleRemoveItemFromCart({
      productId,
      variantId,
    });

    if (res && res.success) {
      toast.success("Item removed from cart");
    } else {
      toast.error(res?.message || "Failed to remove item");
    }
  };

  const handleClearCart = async () => {
    const res = await handleDeleteCart();
    if (res && res.success) {
      toast.success("Cart cleared");
    } else {
      toast.error(res?.message || "Failed to clear cart");
    }
  };

  const handleCheckout = () => {
    if (items.length === 0) {
      toast.error("Your bag is empty!");
      return;
    }
    const firstItem = items[0];
    const productId = firstItem.product._id || firstItem.product;
    const variantId = firstItem.variant._id || firstItem.variant;
    navigate(`/checkout/${productId}/${variantId}`);
  };

  const subtotal = calculateSubtotal();
  const currency = getCurrency();

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,600;1,300;1,600&family=Outfit:wght@300;400;500;600;700;800&display=swap');
        .snitch-cart-page { 
          font-family: 'Outfit', sans-serif; 
        }
        .snitch-cart-page .font-serif { 
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

      <div className="snitch-cart-page min-h-screen bg-neutral-950 text-neutral-200 relative overflow-x-hidden grain flex flex-col p-4 sm:p-6 lg:p-8">
        {/* Glow background elements */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-white/[0.01] blur-[120px] pointer-events-none" />
        <div className="absolute bottom-1/3 right-1/4 w-80 h-80 rounded-full bg-neutral-900/30 blur-[100px] pointer-events-none" />

        {/* Header */}
        <header className="flex items-center justify-between pb-4 border-b border-neutral-800 shrink-0 z-10">
          <button
            onClick={() => navigate("/showallproduct")}
            className="flex items-center gap-2 text-neutral-400 hover:text-white font-mono text-xs tracking-wider transition-all duration-300 cursor-pointer bg-transparent border-0"
          >
            <ArrowLeft className="h-4 w-4" />
            BACK TO CATALOGUE
          </button>
          <div className="flex items-center gap-2">
            <ShoppingBag className="h-4 w-4 stroke-[1.5] text-neutral-300" />
            <span className="font-mono text-xs font-bold tracking-[0.4em] uppercase text-white">
              SNITCH BAG
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate("/my-orders")}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-neutral-850 hover:border-neutral-700 bg-transparent text-neutral-400 hover:text-white font-mono text-[9px] font-bold tracking-wider transition-all duration-300 cursor-pointer"
            >
              MY ORDERS
            </button>
            <button
              onClick={async () => {
                await logout();
                navigate("/login");
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-neutral-850 hover:border-neutral-700 bg-transparent text-neutral-400 hover:text-white font-mono text-[9px] font-bold tracking-wider transition-all duration-300 cursor-pointer"
            >
              <LogOut className="h-3 w-3" />
              LOGOUT
            </button>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 flex flex-col mt-6 z-10 animate-slide-up">
          <div className="space-y-1 mb-6">
            <h1 className="text-3xl sm:text-4xl font-light font-serif text-white tracking-wide">
              Your Bag
            </h1>
            <p className="text-xs font-light text-neutral-400">
              {items.length === 0
                ? "Review and checkout your premium street items."
                : `You have ${items.length} unique item${items.length > 1 ? "s" : ""} in your bag.`}
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-950/20 border border-red-900/40 flex items-start gap-3 text-red-300 text-xs">
              <AlertCircle className="h-4 w-4 text-red-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold font-mono text-[10px] tracking-wider uppercase">
                  Operation Error
                </span>
                <p className="font-light text-red-300/80 mt-0.5">{error}</p>
              </div>
            </div>
          )}

          {isLoading && items.length === 0 ? (
            /* Loading Spinner for first load */
            <div className="flex-1 flex flex-col items-center justify-center min-h-[400px]">
              <Loader2 className="h-8 w-8 text-neutral-500 animate-spin stroke-[1.5]" />
              <span className="text-[10px] font-mono tracking-widest text-neutral-500 mt-4 uppercase">
                LOADING BAG DETAILS...
              </span>
            </div>
          ) : items.length === 0 ? (
            /* Empty State */
            <div className="flex-1 flex flex-col items-center justify-center border border-dashed border-neutral-800 rounded-2xl bg-[#0a0a0a]/40 p-12 text-center min-h-[400px]">
              <div className="p-4 rounded-full bg-neutral-900 border border-neutral-800 mb-4">
                <BagIcon className="h-8 w-8 text-neutral-400 stroke-[1.25]" />
              </div>
              <h3 className="text-lg font-serif font-light text-white mb-1.5">
                Your Bag is Empty
              </h3>
              <p className="text-xs text-neutral-500 font-light max-w-sm leading-relaxed mb-6">
                You haven't added any products to your bag yet. Browse our collections to find premium fits.
              </p>
              <button
                onClick={() => navigate("/showallproduct")}
                className="px-6 py-3 rounded-xl bg-white text-black hover:bg-neutral-200 transition-all font-mono text-xs font-bold tracking-wider cursor-pointer"
              >
                BROWSE COLLECTION
              </button>
            </div>
          ) : (
            /* Cart Grid Layout */
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
              {/* Items List */}
              <div className="lg:col-span-2 space-y-4">
                {items.map((item) => {
                  const product = item.product && typeof item.product === "object" ? item.product : {};
                  const variantId = item.variant?._id || item.variant;
                  const activeVariant =
                    product.variants?.find((v) => v._id === variantId) || {};
                  const itemImage =
                    activeVariant.images?.[0]?.url ||
                    product.images?.[0]?.url;

                  // Format size attributes or other specs
                  const attributes = activeVariant.attributes
                    ? Object.entries(activeVariant.attributes)
                        .map(([key, val]) => `${key.toUpperCase()}: ${val}`)
                        .join(" | ")
                    : "";

                  return (
                    <div
                      key={`${product._id || "unknown"}-${variantId}`}
                      className="flex gap-4 p-4 rounded-2xl bg-[#0c0c0c]/80 border border-neutral-900 hover:border-neutral-800 transition-all duration-300 relative group"
                    >
                      {/* Product Image */}
                      <div
                        className="w-20 sm:w-24 aspect-[3/4] rounded-xl overflow-hidden border border-neutral-900 bg-[#070707] shrink-0 cursor-pointer"
                        onClick={() => navigate(`/product/details/${product._id}`)}
                      >
                        {itemImage ? (
                          <img
                            src={itemImage}
                            alt={product.title || "Product Image"}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-neutral-700 text-[8px] font-mono tracking-widest">
                            NO IMAGE
                          </div>
                        )}
                      </div>

                      {/* Product details */}
                      <div className="flex-1 flex flex-col justify-between py-1">
                        <div className="space-y-1">
                          <div className="flex justify-between items-start gap-4">
                            <h3
                              className="text-xs sm:text-sm font-mono font-bold uppercase tracking-wider text-neutral-100 line-clamp-1 hover:text-white transition-colors cursor-pointer"
                              onClick={() => navigate(`/product/details/${product._id}`)}
                            >
                              {product.title}
                            </h3>
                            <button
                              onClick={() => handleRemove(item)}
                              className="text-neutral-500 hover:text-red-400 p-1 rounded-md transition-colors bg-transparent border-0 cursor-pointer"
                              title="Remove item"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                          <p className="text-[10px] text-neutral-500 font-mono tracking-wide">
                            {attributes || "NO SPECIFICATIONS SELECTED"}
                          </p>
                          <p className="text-[11px] text-neutral-400 font-light line-clamp-2">
                            {product.description}
                          </p>
                        </div>

                        {/* Quantity and Price row */}
                        <div className="flex justify-between items-center mt-4 pt-2 border-t border-neutral-900/60">
                          {/* Quantity Selector */}
                          <div className="flex items-center gap-2 bg-neutral-900 border border-neutral-850 rounded-xl px-2 py-1">
                            <button
                              onClick={() => handleQuantityChange(item, -1)}
                              disabled={isLoading}
                              className="text-neutral-400 hover:text-white disabled:opacity-50 p-1 bg-transparent border-0 cursor-pointer"
                            >
                              <Minus className="h-3 w-3" />
                            </button>
                            <span className="font-mono text-xs font-semibold px-2 text-white">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => handleQuantityChange(item, 1)}
                              disabled={isLoading}
                              className="text-neutral-400 hover:text-white disabled:opacity-50 p-1 bg-transparent border-0 cursor-pointer"
                            >
                              <Plus className="h-3 w-3" />
                            </button>
                          </div>

                          {/* Price Display */}
                          <div className="text-right">
                            <p className="text-xs font-mono font-semibold text-white">
                              {formatPrice(
                                (item.price?.amount || 0) * item.quantity,
                                item.price?.currency || currency
                              )}
                            </p>
                            {item.quantity > 1 && (
                              <p className="text-[9px] font-mono text-neutral-500">
                                {formatPrice(
                                  item.price?.amount || 0,
                                  item.price?.currency || currency
                                )}{" "}
                                each
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Summary panel */}
              <div className="p-6 rounded-2xl bg-[#0c0c0c]/85 border border-neutral-900 space-y-6">
                <h2 className="text-xl font-light font-serif text-white tracking-wide border-b border-neutral-900 pb-3">
                  Summary
                </h2>

                <div className="space-y-3 font-mono text-xs">
                  <div className="flex justify-between text-neutral-400">
                    <span>BAG SUBTOTAL</span>
                    <span>{formatPrice(subtotal, currency)}</span>
                  </div>
                  <div className="flex justify-between text-neutral-400">
                    <span>SHIPPING & HANDLING</span>
                    <span className="text-green-500 font-bold">FREE</span>
                  </div>
                  <div className="border-t border-neutral-900 my-4 pt-4 flex justify-between text-sm font-semibold text-white">
                    <span>GRAND TOTAL</span>
                    <span>{formatPrice(subtotal, currency)}</span>
                  </div>
                </div>

                <div className="space-y-3 pt-2">
                  <button
                    onClick={handleCheckout}
                    disabled={isLoading}
                    className="w-full py-3.5 rounded-xl bg-white text-black hover:bg-neutral-200 transition-all font-mono text-xs font-bold tracking-wider cursor-pointer disabled:opacity-50"
                  >
                    {isLoading ? (
                      <span className="flex items-center justify-center gap-2">
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        PROCESSING...
                      </span>
                    ) : (
                      "PROCEED TO CHECKOUT"
                    )}
                  </button>

                  <button
                    onClick={handleClearCart}
                    disabled={isLoading}
                    className="w-full py-3 rounded-xl bg-transparent hover:bg-neutral-900/50 border border-neutral-850 hover:border-neutral-700 text-neutral-400 hover:text-white transition-all font-mono text-[10px] font-bold tracking-wider cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <Trash2 className="h-3 w-3" />
                    CLEAR ENTIRE BAG
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </>
  );
}
