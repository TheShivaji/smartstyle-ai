import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useOrder } from "../hook/useOrder";
import { useProduct } from "../../product/hook/useProduct";
import { useCart } from "../../cart/hook/useCart";
import { 
  ArrowLeft, 
  MapPin, 
  CreditCard, 
  Tag, 
  ShoppingBag, 
  Loader2, 
  AlertCircle,
  CheckCircle2
} from "lucide-react";
import { toast } from "react-toastify";

const currencySymbols = {
  INR: "₹",
  USD: "$",
  EUR: "€",
  GBP: "£",
};

export default function Checkout() {
  const { productId, variantId } = useParams();
  const navigate = useNavigate();
  
  const { handleCheckout, handleApplyCoupon } = useOrder();
  const { handleShowProductById } = useProduct();
  const { handleGetCart } = useCart();

  // State from Redux
  const selectedProduct = useSelector((state) => state.product.selectedProduct);
  const cartItems = useSelector((state) => state.cart.items) || [];
  const loading = useSelector((state) => state.order.loading);
  const error = useSelector((state) => state.order.error);
  const appliedCoupon = useSelector((state) => state.order.appliedCoupon);

  // Local state
  const [addressForm, setAddressForm] = useState({
    fullName: "",
    mobileNo: "",
    email: "",
    address: "",
    landmark: "",
    city: "",
    state: "",
    pincode: "",
    country: "India",
  });
  
  const [couponCode, setCouponCode] = useState("");
  const [isCouponApplied, setIsCouponApplied] = useState(false);

  useEffect(() => {
    handleShowProductById(productId);
    handleGetCart();
  }, [productId]);

  // Find variant and quantity
  const activeVariant = selectedProduct?.variants?.find((v) => v._id === variantId) || {};
  const cartItem = cartItems.find(
    (item) => 
      (item.product?._id || item.product) === productId && 
      (item.variant?._id || item.variant) === variantId
  );
  
  const quantity = cartItem?.quantity || 1;
  const priceAmount = activeVariant?.price?.amount || selectedProduct?.price?.amount || 0;
  const currency = activeVariant?.price?.currency || selectedProduct?.price?.currency || "INR";
  const symbol = currencySymbols[currency] || "₹";
  
  const subtotal = priceAmount * quantity;
  
  // Coupon calculation
  const discountAmount = appliedCoupon ? (subtotal * (appliedCoupon.discount / 100)) : 0;
  const grandTotal = subtotal - discountAmount;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAddressForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleCouponSubmit = async (e) => {
    e.preventDefault();
    if (!couponCode.trim()) return;
    try {
      const res = await handleApplyCoupon(couponCode);
      if (res && res.success) {
        setIsCouponApplied(true);
        toast.success(`Coupon applied! ${res.coupon.discount}% off.`);
      }
    } catch (err) {
      // toast is already handled in hook
      setIsCouponApplied(false);
    }
  };

  const handleSubmitOrder = async (e) => {
    e.preventDefault();
    
    // Simple validation check
    const requiredFields = ["fullName", "mobileNo", "address", "city", "state", "pincode"];
    const emptyFields = requiredFields.filter((field) => !addressForm[field].trim());
    
    if (emptyFields.length > 0) {
      toast.error("Please fill in all required address fields.");
      return;
    }

    try {
      const res = await handleCheckout(productId, variantId, addressForm);
      if (res && res.success) {
        toast.success("Order placed successfully!");
        navigate("/my-orders");
      }
    } catch (err) {
      // Error handled in hook toast
    }
  };

  const itemImage = activeVariant?.images?.[0]?.url || selectedProduct?.images?.[0]?.url;
  const attributes = activeVariant?.attributes
    ? Object.entries(activeVariant.attributes)
        .map(([key, val]) => `${key.toUpperCase()}: ${val}`)
        .join(" | ")
    : "";

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,600;1,300;1,600&family=Outfit:wght@300;400;500;600;700;800&display=swap');
        .snitch-checkout-page { 
          font-family: 'Outfit', sans-serif; 
        }
        .snitch-checkout-page .font-serif { 
          font-family: 'Cormorant Garamond', Georgia, serif; 
        }
        .grain::after {
          content:''; position:absolute; inset:0;
          background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.05'/%3E%3C/svg%3E");
          pointer-events:none; z-index:5; mix-blend-mode:overlay;
        }
      `}</style>

      <div className="snitch-checkout-page min-h-screen bg-neutral-950 text-neutral-200 relative overflow-x-hidden grain flex flex-col p-4 sm:p-6 lg:p-8">
        {/* Glow ambient background */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-white/[0.01] blur-[120px] pointer-events-none" />
        <div className="absolute bottom-1/3 right-1/4 w-80 h-80 rounded-full bg-neutral-900/30 blur-[100px] pointer-events-none" />

        {/* Header */}
        <header className="flex items-center justify-between pb-4 border-b border-neutral-800 shrink-0 z-10">
          <button
            onClick={() => navigate("/cart")}
            className="flex items-center gap-2 text-neutral-400 hover:text-white font-mono text-xs tracking-wider transition-all duration-300 cursor-pointer bg-transparent border-0"
          >
            <ArrowLeft className="h-4 w-4" />
            BACK TO BAG
          </button>
          <div className="flex items-center gap-2">
            <ShoppingBag className="h-4 w-4 stroke-[1.5] text-neutral-300" />
            <span className="font-mono text-xs font-bold tracking-[0.4em] uppercase text-white">
              SECURE CHECKOUT
            </span>
          </div>
          <div className="w-20" /> {/* Spacer */}
        </header>

        {/* Main Grid Content */}
        <main className="flex-1 flex flex-col mt-6 z-10 max-w-7xl mx-auto w-full">
          <div className="space-y-1 mb-8">
            <h1 className="text-3xl sm:text-4xl font-light font-serif text-white tracking-wide">
              Fulfillment & Payment
            </h1>
            <p className="text-xs font-light text-neutral-400">
              Provide shipment details to complete your order checkout.
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-950/20 border border-red-900/40 flex items-start gap-3 text-red-300 text-xs">
              <AlertCircle className="h-4 w-4 text-red-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold font-mono text-[10px] tracking-wider uppercase">Order Error</span>
                <p className="font-light text-red-300/80 mt-0.5">{error}</p>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Column: Address Form */}
            <div className="lg:col-span-7 space-y-6">
              <div className="p-6 rounded-2xl bg-[#0c0c0c]/85 border border-neutral-900 space-y-6">
                <div className="flex items-center gap-2 border-b border-neutral-900 pb-3">
                  <MapPin className="h-4 w-4 text-neutral-400" />
                  <h2 className="text-lg font-serif font-light text-white tracking-wide">
                    Shipping Address
                  </h2>
                </div>

                <form onSubmit={handleSubmitOrder} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-mono tracking-wider text-neutral-500 uppercase">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        name="fullName"
                        value={addressForm.fullName}
                        onChange={handleInputChange}
                        required
                        className="w-full bg-neutral-900/40 border border-neutral-800 focus:border-neutral-500 rounded-xl px-4 py-2.5 text-xs text-white placeholder-neutral-600 focus:outline-none focus:ring-1 focus:ring-neutral-700 transition-all"
                        placeholder="John Doe"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-mono tracking-wider text-neutral-500 uppercase">
                        Mobile Number *
                      </label>
                      <input
                        type="tel"
                        name="mobileNo"
                        value={addressForm.mobileNo}
                        onChange={handleInputChange}
                        required
                        className="w-full bg-neutral-900/40 border border-neutral-800 focus:border-neutral-500 rounded-xl px-4 py-2.5 text-xs text-white placeholder-neutral-600 focus:outline-none focus:ring-1 focus:ring-neutral-700 transition-all"
                        placeholder="10-digit number"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono tracking-wider text-neutral-500 uppercase">
                      Email Address
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={addressForm.email}
                      onChange={handleInputChange}
                      className="w-full bg-neutral-900/40 border border-neutral-800 focus:border-neutral-500 rounded-xl px-4 py-2.5 text-xs text-white placeholder-neutral-600 focus:outline-none focus:ring-1 focus:ring-neutral-700 transition-all"
                      placeholder="john@example.com (optional)"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono tracking-wider text-neutral-500 uppercase">
                      Street Address *
                    </label>
                    <input
                      type="text"
                      name="address"
                      value={addressForm.address}
                      onChange={handleInputChange}
                      required
                      className="w-full bg-neutral-900/40 border border-neutral-800 focus:border-neutral-500 rounded-xl px-4 py-2.5 text-xs text-white placeholder-neutral-600 focus:outline-none focus:ring-1 focus:ring-neutral-700 transition-all"
                      placeholder="Flat, House no., Building, Company, Apartment"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono tracking-wider text-neutral-500 uppercase">
                      Landmark
                    </label>
                    <input
                      type="text"
                      name="landmark"
                      value={addressForm.landmark}
                      onChange={handleInputChange}
                      className="w-full bg-neutral-900/40 border border-neutral-800 focus:border-neutral-500 rounded-xl px-4 py-2.5 text-xs text-white placeholder-neutral-600 focus:outline-none focus:ring-1 focus:ring-neutral-700 transition-all"
                      placeholder="e.g. Near Apollo Hospital (optional)"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-mono tracking-wider text-neutral-500 uppercase">
                        Town/City *
                      </label>
                      <input
                        type="text"
                        name="city"
                        value={addressForm.city}
                        onChange={handleInputChange}
                        required
                        className="w-full bg-neutral-900/40 border border-neutral-800 focus:border-neutral-500 rounded-xl px-4 py-2.5 text-xs text-white placeholder-neutral-600 focus:outline-none focus:ring-1 focus:ring-neutral-700 transition-all"
                        placeholder="Mumbai"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-mono tracking-wider text-neutral-500 uppercase">
                        State *
                      </label>
                      <input
                        type="text"
                        name="state"
                        value={addressForm.state}
                        onChange={handleInputChange}
                        required
                        className="w-full bg-neutral-900/40 border border-neutral-800 focus:border-neutral-500 rounded-xl px-4 py-2.5 text-xs text-white placeholder-neutral-600 focus:outline-none focus:ring-1 focus:ring-neutral-700 transition-all"
                        placeholder="Maharashtra"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-mono tracking-wider text-neutral-500 uppercase">
                        Pincode *
                      </label>
                      <input
                        type="text"
                        name="pincode"
                        value={addressForm.pincode}
                        onChange={handleInputChange}
                        required
                        className="w-full bg-neutral-900/40 border border-neutral-800 focus:border-neutral-500 rounded-xl px-4 py-2.5 text-xs text-white placeholder-neutral-600 focus:outline-none focus:ring-1 focus:ring-neutral-700 transition-all"
                        placeholder="6 digits"
                      />
                    </div>
                  </div>

                  {/* Payment Selection (Only COD available for now) */}
                  <div className="pt-6 border-t border-neutral-900">
                    <div className="flex items-center gap-2 mb-4">
                      <CreditCard className="h-4 w-4 text-neutral-400" />
                      <h2 className="text-lg font-serif font-light text-white tracking-wide">
                        Payment Method
                      </h2>
                    </div>

                    <div className="p-4 rounded-xl border border-neutral-800 bg-neutral-900/20 flex items-center justify-between cursor-pointer">
                      <div className="flex items-center gap-3">
                        <CheckCircle2 className="h-4 w-4 text-white" />
                        <div>
                          <p className="text-xs font-mono font-semibold text-white">
                            CASH ON DELIVERY (COD)
                          </p>
                          <p className="text-[10px] text-neutral-500 font-light mt-0.5">
                            Pay in cash or UPI scan when your courier arrives.
                          </p>
                        </div>
                      </div>
                      <span className="text-[10px] font-mono tracking-wider bg-neutral-850 px-2 py-0.5 rounded text-neutral-400 uppercase">
                        COD
                      </span>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full mt-6 py-3.5 rounded-xl bg-white text-black hover:bg-neutral-200 transition-all font-mono text-xs font-bold tracking-wider cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        PLACING ORDER...
                      </>
                    ) : (
                      "PLACE ORDER (COD)"
                    )}
                  </button>
                </form>
              </div>
            </div>

            {/* Right Column: Order Summary */}
            <div className="lg:col-span-5 space-y-6">
              <div className="p-6 rounded-2xl bg-[#0c0c0c]/85 border border-neutral-900 space-y-6">
                <h2 className="text-lg font-serif font-light text-white border-b border-neutral-900 pb-3 tracking-wide">
                  Order Summary
                </h2>

                {/* Product details */}
                {selectedProduct && (
                  <div className="flex gap-4 items-start pb-4 border-b border-neutral-900/60">
                    <div className="w-16 aspect-[3/4] rounded-lg overflow-hidden border border-neutral-900 bg-neutral-950 shrink-0">
                      {itemImage ? (
                        <img
                          src={itemImage}
                          alt={selectedProduct.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[6px] font-mono tracking-widest text-neutral-700">
                          NO IMG
                        </div>
                      )}
                    </div>
                    <div className="space-y-1 py-0.5">
                      <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-100 line-clamp-1">
                        {selectedProduct.title}
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
            </div>

          </div>
        </main>
      </div>
    </>
  );
}
