import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { useProduct } from "../hook/useProduct";
import Loader from "../components/Loader";
import {
  ShoppingBag,
  ArrowLeft,
  AlertCircle,
  Image as ImageIcon,
  Check,
  Shield,
  Truck,
  RotateCcw,
} from "lucide-react";

const currencySymbols = {
  INR: "₹",
  USD: "$",
  EUR: "€",
  GBP: "£",
};

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { handleShowProductById } = useProduct();

  // Select state from Redux
  const product = useSelector((state) => state.product.selectedProduct);
  const loading = useSelector((state) => state.product.loading);
  const error = useSelector((state) => state.product.error);

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState("");
  const [isAdded, setIsAdded] = useState(false);

  useEffect(() => {
    if (id) {
      handleShowProductById(id);
    }
  }, [id]);

  const formatPrice = (price, currency) => {
    const symbol = currencySymbols[currency] || "₹";
    const amount = Number(price?.amount || price || 0).toLocaleString();
    return `${symbol}${amount}`;
  };

  const handleAddToBag = () => {
    if (!selectedSize) {
      alert("Please select a size");
      return;
    }
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-neutral-950 text-neutral-200 flex flex-col items-center justify-center p-6 text-center">
        <div className="p-4 rounded-full bg-red-950/20 border border-red-900/30 text-red-400 mb-4">
          <AlertCircle className="h-8 w-8 stroke-[1.25]" />
        </div>
        <h3 className="text-lg font-serif font-light text-white mb-2">
          Error Loading Product
        </h3>
        <p className="text-xs text-neutral-500 max-w-sm mb-6">{error}</p>
        <button
          onClick={() => navigate("/showallproduct")}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white hover:bg-neutral-200 text-black font-bold font-mono text-xs tracking-wider transition-all cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4" /> RETURN TO CATALOG
        </button>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-neutral-950 text-neutral-200 flex flex-col items-center justify-center p-6 text-center">
        <h3 className="text-lg font-serif font-light text-white mb-2">
          Product Not Found
        </h3>
        <p className="text-xs text-neutral-500 max-w-sm mb-6">
          The product you are looking for does not exist or has been removed.
        </p>
        <button
          onClick={() => navigate("/showallproduct")}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white hover:bg-neutral-200 text-black font-bold font-mono text-xs tracking-wider transition-all cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4" /> RETURN TO CATALOG
        </button>
      </div>
    );
  }

  const images = product.images || [];
  const currentImage = images[activeImageIndex]?.url;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,600;1,300;1,600&family=Outfit:wght@300;400;500;600;700;800&display=swap');
        .snitch-detail-page { 
          font-family: 'Outfit', sans-serif; 
        }
        .snitch-detail-page .font-serif { 
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

      <div className="snitch-detail-page min-h-screen lg:h-screen lg:overflow-hidden bg-neutral-950 text-neutral-200 relative overflow-x-hidden grain flex flex-col p-4 sm:p-6 lg:p-8 lg:pb-6">
        {/* Glow ambient background elements */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-white/[0.01] blur-[120px] pointer-events-none" />
        <div className="absolute bottom-1/3 right-1/4 w-80 h-80 rounded-full bg-neutral-900/30 blur-[100px] pointer-events-none" />

        {/* Header */}
        <header className="flex items-center justify-between pb-4 border-b border-neutral-800 shrink-0 z-10">
          <button
            onClick={() => navigate("/showallproduct")}
            className="flex items-center gap-1.5 text-neutral-400 hover:text-white transition-colors font-mono text-[10px] tracking-wider"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> BACK TO CATALOG
          </button>
          <div className="flex items-center gap-2">
            <ShoppingBag className="h-4 w-4 stroke-[1.5] text-neutral-300" />
            <span className="font-mono text-xs font-bold tracking-[0.4em] uppercase text-white">
              SNITCH STUDIO
            </span>
          </div>
          <div className="w-20" /> {/* Spacer to balance header */}
        </header>

        {/* Product Details Grid */}
        <main className="flex-1 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 mt-6 lg:mt-8 z-10 animate-slide-up lg:min-h-0 lg:h-full lg:pb-4">
          {/* Left Column: Images */}
          <div className="lg:col-span-7 flex flex-col gap-4 lg:h-full lg:min-h-0">
            {/* Main Image Container */}
            <div className="relative flex-1 rounded-2xl overflow-hidden border border-neutral-900 bg-[#0c0c0c] w-full min-h-[300px] lg:min-h-0 lg:h-full">
              {currentImage ? (
                <img
                  src={currentImage}
                  alt={product.title}
                  className="w-full h-full object-cover transition-all duration-700 ease-out"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-neutral-600 gap-2">
                  <ImageIcon className="h-10 w-10 stroke-[1.25]" />
                  <span className="text-[10px] font-mono tracking-widest uppercase">
                    No Image Available
                  </span>
                </div>
              )}
            </div>

            {/* Thumbnail Selector */}
            {images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2 shrink-0">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`relative w-20 aspect-[3/4] rounded-lg overflow-hidden border transition-all shrink-0 ${
                      activeImageIndex === idx
                        ? "border-white"
                        : "border-neutral-800 opacity-60 hover:opacity-100"
                    }`}
                  >
                    <img
                      src={img.url}
                      alt={`thumbnail-${idx}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Details & Selection */}
          <div className="lg:col-span-5 flex flex-col justify-between py-2 lg:h-full lg:overflow-y-auto lg:pr-2 lg:min-h-0">
            <div className="space-y-6">
              {/* Product Meta Info */}
              <div className="space-y-2">
                <span className="font-mono text-[9px] tracking-[0.3em] uppercase text-neutral-500">
                  EDITORIAL CREATIONS
                </span>
                <h1 className="text-4xl font-light font-serif tracking-wide text-white leading-tight">
                  {product.title}
                </h1>
                <div className="text-xl font-mono text-white font-semibold pt-1">
                  {formatPrice(
                    product.price,
                    product.price?.currency || product.currency,
                  )}
                </div>
              </div>

              <hr className="border-neutral-900" />

              {/* Description */}
              <div className="space-y-2">
                <h4 className="text-[10px] font-mono tracking-[0.2em] text-neutral-400 uppercase">
                  Details & Fit
                </h4>
                <p className="text-xs text-neutral-400 font-light leading-relaxed">
                  {product.description ||
                    "No description provided for this exclusive curated item."}
                </p>
              </div>

              <hr className="border-neutral-900" />

              {/* Size Selector */}
              <div className="space-y-3">
                <div className="flex justify-between items-baseline">
                  <h4 className="text-[10px] font-mono tracking-[0.2em] text-neutral-400 uppercase">
                    Select Size
                  </h4>
                  <span className="text-[9px] text-neutral-500 underline cursor-pointer">
                    Size Guide
                  </span>
                </div>
                <div className="flex flex-wrap gap-2.5">
                  {["S", "M", "L", "XL", "XXL"].map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`h-11 px-5 rounded-xl text-xs font-mono tracking-widest transition-all cursor-pointer border ${
                        selectedSize === size
                          ? "bg-white text-black border-white font-bold"
                          : "bg-neutral-950 text-neutral-400 border-neutral-800 hover:border-neutral-600 hover:text-white"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* CTA Add to Bag */}
              <div className="pt-2">
                <button
                  onClick={handleAddToBag}
                  className={`w-full h-12 rounded-xl text-[10px] font-mono font-bold tracking-[0.2em] uppercase transition-all duration-500 flex items-center justify-center gap-2 cursor-pointer ${
                    isAdded
                      ? "bg-emerald-600 text-white"
                      : "bg-white text-black hover:bg-neutral-200"
                  }`}
                >
                  {isAdded ? (
                    <>
                      <Check className="h-4 w-4" /> ADDED TO BAG
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="h-3.5 w-3.5" /> ADD TO BAG
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-4 pt-8 border-t border-neutral-900 mt-8 text-center text-neutral-500">
              <div className="flex flex-col items-center gap-1">
                <Truck className="h-4 w-4 stroke-[1.25]" />
                <span className="text-[9px] tracking-wide font-mono uppercase">
                  FAST SHIPPING
                </span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <RotateCcw className="h-4 w-4 stroke-[1.25]" />
                <span className="text-[9px] tracking-wide font-mono uppercase">
                  EASY RETURNS
                </span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <Shield className="h-4 w-4 stroke-[1.25]" />
                <span className="text-[9px] tracking-wide font-mono uppercase">
                  SECURE SEC
                </span>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
