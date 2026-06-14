import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useOrder } from "../hook/useOrder";
import { useProduct } from "../../product/hook/useProduct";
import { useCart } from "../../cart/hook/useCart";
import ShippingAddressForm from "../components/ShippingAddressForm";
import CheckoutSummary from "../components/CheckoutSummary";
import { ArrowLeft, ShoppingBag, AlertCircle } from "lucide-react";
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
            
            {/* Left Column: Address Form Component */}
            <div className="lg:col-span-7">
              <ShippingAddressForm
                addressForm={addressForm}
                onChange={handleInputChange}
                onSubmit={handleSubmitOrder}
                loading={loading}
              />
            </div>

            {/* Right Column: Order Summary Component */}
            <div className="lg:col-span-5">
              <CheckoutSummary
                product={selectedProduct}
                activeVariant={activeVariant}
                quantity={quantity}
                couponCode={couponCode}
                setCouponCode={setCouponCode}
                handleCouponSubmit={handleCouponSubmit}
                isCouponApplied={isCouponApplied}
                appliedCoupon={appliedCoupon}
                subtotal={subtotal}
                discountAmount={discountAmount}
                grandTotal={grandTotal}
                loading={loading}
              />
            </div>

          </div>
        </main>
      </div>
    </>
  );
}
