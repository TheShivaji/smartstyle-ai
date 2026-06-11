import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { useProduct } from "../hook/useProduct";
import Loader from "../components/Loader";
import {
  ShoppingBag,
  ArrowLeft,
  Loader2,
  AlertCircle,
  Plus,
  Trash2,
  Image as ImageIcon,
  ChevronLeft,
  ChevronRight,
  FolderKanban,
  Check
} from "lucide-react";

const currencySymbols = {
  INR: "₹",
  USD: "$",
  EUR: "€",
  GBP: "£",
};

export default function MangeProduct() {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { handleShowProductById, handleAddVariants } = useProduct();

  // Select state from Redux
  const product = useSelector((state) => state.product.selectedProduct);
  const loading = useSelector((state) => state.product.loading);
  const error = useSelector((state) => state.product.error);

  // Component state
  const [activeTab, setActiveTab] = useState("add"); // "add" or "list"
  const [activeVariantIndex, setActiveVariantIndex] = useState(0);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  // Form state
  const [variantImages, setVariantImages] = useState([]); // [{ file, preview }]
  const [variantPrice, setVariantPrice] = useState("");
  const [variantStock, setVariantStock] = useState("");
  const [variantAttributes, setVariantAttributes] = useState([{ key: "", value: "" }]);
  const [variantSubmitting, setVariantSubmitting] = useState(false);

  useEffect(() => {
    if (productId) {
      handleShowProductById(productId);
    }
  }, [productId]);

  useEffect(() => {
    // When variants list changes, ensure active index is in range
    if (product?.variants && activeVariantIndex >= product.variants.length) {
      setActiveVariantIndex(Math.max(0, product.variants.length - 1));
    }
  }, [product, activeVariantIndex]);

  const formatPrice = (price, currency) => {
    const symbol = currencySymbols[currency] || "₹";
    const amount = Number(price?.amount || price || 0).toLocaleString();
    return `${symbol}${amount}`;
  };

  // Image upload handlers
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const newImages = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));
    setVariantImages((prev) => [...prev, ...newImages]);
  };

  const removeSelectedImage = (index) => {
    setVariantImages((prev) => {
      const updated = [...prev];
      URL.revokeObjectURL(updated[index].preview);
      updated.splice(index, 1);
      return updated;
    });
  };

  // Attributes rows handlers
  const handleAttributeChange = (index, field, value) => {
    setVariantAttributes((prev) => {
      const updated = [...prev];
      updated[index][field] = value;
      return updated;
    });
  };

  const addAttributeRow = () => {
    setVariantAttributes((prev) => [...prev, { key: "", value: "" }]);
  };

  const removeAttributeRow = (index) => {
    setVariantAttributes((prev) => prev.filter((_, idx) => idx !== index));
  };

  // Form submit handler
  const handleVariantSubmit = async (e) => {
    e.preventDefault();
    if (!product) return;

    setVariantSubmitting(true);
    try {
      const attrsObj = {};
      variantAttributes.forEach((attr) => {
        if (attr.key.trim() && attr.value.trim()) {
          attrsObj[attr.key.trim()] = attr.value.trim();
        }
      });

      const data = {
        images: variantImages,
        price: variantPrice ? Number(variantPrice) : undefined,
        stock: variantStock ? Number(variantStock) : 0,
        attributes: attrsObj,
      };

      const res = await handleAddVariants(product._id, data);
      if (res && res.success) {
        // Reset form
        variantImages.forEach((img) => URL.revokeObjectURL(img.preview));
        setVariantImages([]);
        setVariantPrice("");
        setVariantStock("");
        setVariantAttributes([{ key: "", value: "" }]);
        // Focus on the newly added variant in the slider
        if (res.product?.variants) {
          setActiveVariantIndex(res.product.variants.length - 1);
        }
        setActiveImageIndex(0);
        setActiveTab("list");
      }
    } catch (err) {
      console.error("Failed to add variant:", err);
    } finally {
      setVariantSubmitting(false);
    }
  };

  // Slider handlers
  const handlePrevVariant = () => {
    if (!product?.variants || product.variants.length === 0) return;
    setActiveVariantIndex((prev) =>
      prev === 0 ? product.variants.length - 1 : prev - 1
    );
    setActiveImageIndex(0);
  };

  const handleNextVariant = () => {
    if (!product?.variants || product.variants.length === 0) return;
    setActiveVariantIndex((prev) =>
      prev === product.variants.length - 1 ? 0 : prev + 1
    );
    setActiveImageIndex(0);
  };

  const handlePrevImage = (imgCount) => {
    setActiveImageIndex((prev) => (prev === 0 ? imgCount - 1 : prev - 1));
  };

  const handleNextImage = (imgCount) => {
    setActiveImageIndex((prev) => (prev === imgCount - 1 ? 0 : prev + 1));
  };

  if (loading && !product) {
    return <Loader />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-neutral-950 text-neutral-200 flex flex-col items-center justify-center p-6 text-center">
        <div className="p-4 rounded-full bg-red-950/20 border border-red-900/30 text-red-400 mb-4">
          <AlertCircle className="h-8 w-8 stroke-[1.25]" />
        </div>
        <h3 className="text-lg font-serif font-light text-white mb-2">Error Loading Product</h3>
        <p className="text-xs text-neutral-500 max-w-sm mb-6">{error}</p>
        <button
          onClick={() => navigate("/seller/product/show")}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white hover:bg-neutral-200 text-black font-bold font-mono text-xs tracking-wider transition-all cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4" /> BACK TO CATALOG
        </button>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-neutral-950 text-neutral-200 flex flex-col items-center justify-center p-6 text-center">
        <h3 className="text-lg font-serif font-light text-white mb-2">Product Not Found</h3>
        <p className="text-xs text-neutral-500 max-w-sm mb-6">The product you are looking for does not exist or has been removed.</p>
        <button
          onClick={() => navigate("/seller/product/show")}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white hover:bg-neutral-200 text-black font-bold font-mono text-xs tracking-wider transition-all cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4" /> BACK TO CATALOG
        </button>
      </div>
    );
  }

  const hasVariants = product.variants && product.variants.length > 0;
  const activeVariant = hasVariants ? product.variants[activeVariantIndex] : null;

  // Compute active images based on selection (active variant images or fallback to base product images)
  const displayImages = (activeVariant && activeVariant.images && activeVariant.images.length > 0)
    ? activeVariant.images
    : (product.images || []);

  const currentImageUrl = displayImages[activeImageIndex]?.url;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,600;1,300;1,600&family=Outfit:wght@300;400;500;600;700;800&display=swap');
        .snitch-manage-page { 
          font-family: 'Outfit', sans-serif; 
        }
        .snitch-manage-page .font-serif { 
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
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>

      <div className="snitch-manage-page min-h-screen lg:h-screen lg:overflow-hidden bg-neutral-950 text-neutral-200 relative overflow-x-hidden grain flex flex-col p-4 sm:p-6 lg:p-8">
        {/* Glow ambient background elements */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-white/[0.01] blur-[120px] pointer-events-none" />
        <div className="absolute bottom-1/3 right-1/4 w-80 h-80 rounded-full bg-neutral-900/30 blur-[100px] pointer-events-none" />

        {/* Header */}
        <header className="flex items-center justify-between pb-4 border-b border-neutral-800 shrink-0 z-10">
          <button
            type="button"
            onClick={() => navigate("/seller/product/show")}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-neutral-850 hover:border-neutral-700 bg-neutral-950/45 hover:bg-neutral-900/40 text-neutral-400 hover:text-white transition-all duration-300 font-mono text-[9px] tracking-widest uppercase cursor-pointer"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> BACK TO CATALOG
          </button>
          <div className="flex items-center gap-2">
            <ShoppingBag className="h-4 w-4 stroke-[1.5] text-neutral-300" />
            <span className="font-mono text-xs font-bold tracking-[0.4em] uppercase text-white">
              SNITCH STUDIO
            </span>
          </div>
          <div className="w-24" /> {/* Spacer */}
        </header>

        {/* Main Content */}
        <main className="flex-1 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 mt-4 lg:mt-6 z-10 animate-slide-up lg:min-h-0 lg:pb-4">
          
          {/* Left Column: Interactive Variant Slider & Info */}
          <div className="lg:col-span-7 flex flex-col gap-6 lg:h-full lg:overflow-y-auto pr-2 no-scrollbar lg:pb-6">
            
            {/* Main Image Slider with left/right overlay buttons */}
            <div className="relative aspect-[4/5] sm:aspect-[3/4] rounded-3xl overflow-hidden border border-white/[0.03] shadow-2xl bg-[#0c0c0c] w-full max-h-[460px] sm:max-h-[550px] shrink-0 group">
              
              {/* Floating Variant Selector inside image container - Fades in on image hover */}
              {hasVariants && (
                <div className="absolute top-4 left-4 right-4 flex items-center justify-between p-3 rounded-2xl bg-black/60 backdrop-blur-md border border-white/[0.05] z-20 transition-all duration-300 opacity-0 group-hover:opacity-100 shadow-xl">
                  <div className="space-y-0.5">
                    <span className="font-mono text-[8px] tracking-[0.25em] text-neutral-400 uppercase block">
                      STYLE VARIANT
                    </span>
                    <h3 className="font-mono text-[11px] font-bold text-white leading-none">
                      {activeVariantIndex + 1} of {product.variants.length}
                    </h3>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={handlePrevVariant}
                      className="p-1.5 rounded-lg bg-neutral-900/80 hover:bg-white hover:text-black text-neutral-300 transition-all duration-300 cursor-pointer border-0"
                    >
                      <ChevronLeft className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={handleNextVariant}
                      className="p-1.5 rounded-lg bg-neutral-900/80 hover:bg-white hover:text-black text-neutral-300 transition-all duration-300 cursor-pointer border-0"
                    >
                      <ChevronRight className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              )}

              {/* Image */}
              {currentImageUrl ? (
                <img
                  src={currentImageUrl}
                  alt={product.title}
                  className="w-full h-full object-cover transition-all duration-700 ease-out"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-neutral-600 gap-2">
                  <ImageIcon className="h-10 w-10 stroke-[1.25]" />
                  <span className="text-[10px] font-mono tracking-widest uppercase">No Image Available</span>
                </div>
              )}

              {/* Slider image pagination buttons (Visible on hover) */}
              {displayImages.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={() => handlePrevImage(displayImages.length)}
                    className="absolute inset-y-0 left-4 my-auto h-10 w-10 rounded-full bg-black/60 hover:bg-white hover:text-black text-white backdrop-blur-sm border border-white/10 flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 duration-300 cursor-pointer z-10 border-0"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleNextImage(displayImages.length)}
                    className="absolute inset-y-0 right-4 my-auto h-10 w-10 rounded-full bg-black/60 hover:bg-white hover:text-black text-white backdrop-blur-sm border border-white/10 flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0 duration-300 cursor-pointer z-10 border-0"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>

                  {/* Dot indicator */}
                  <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-1.5 z-10">
                    {displayImages.map((_, idx) => (
                      <span
                        key={idx}
                        className={`h-1.5 rounded-full transition-all duration-300 ${
                          activeImageIndex === idx ? "w-4 bg-white" : "w-1.5 bg-white/40"
                        }`}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Display specifications, price and stock of selected variant */}
            <div className="bg-[#0a0a0a]/30 backdrop-blur-md border border-white/[0.04] shadow-lg rounded-3xl p-6 space-y-4 shrink-0 transition-all duration-500 hover:border-white/[0.08]">
              <div className="flex justify-between items-baseline flex-wrap gap-2">
                <div className="space-y-1">
                  <span className="font-mono text-[9px] tracking-[0.2em] text-neutral-500 uppercase">
                    {activeVariant ? "SELECTED STYLE DETAILS" : "BASE PRODUCT DETAILS"}
                  </span>
                  <h2 className="text-2xl font-light font-serif text-white tracking-wide">
                    {product.title}
                  </h2>
                </div>
                <div className="text-xl font-mono text-white font-semibold">
                  {activeVariant
                    ? formatPrice(activeVariant.price || product.price, activeVariant.price?.currency || product.price?.currency || product.currency)
                    : formatPrice(product.price, product.price?.currency || product.currency)}
                </div>
              </div>

              {/* Stock and attributes */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-white/[0.04]">
                <div className="space-y-1">
                  <span className="text-[9px] font-mono text-neutral-500 uppercase tracking-widest block">STOCK QUANTITY</span>
                  <span className="text-xs font-medium text-white">
                    {activeVariant
                      ? `${activeVariant.stock ?? 0} units available`
                      : "Base stock details not applicable (Manage via variants)"}
                  </span>
                </div>

                <div className="space-y-1">
                  <span className="text-[9px] font-mono text-neutral-500 uppercase tracking-widest block">ATTRIBUTES / SPECIFICATIONS</span>
                  {activeVariant && activeVariant.attributes && (activeVariant.attributes instanceof Map ? Array.from(activeVariant.attributes.entries()) : Object.entries(activeVariant.attributes)).length > 0 ? (
                    <div className="flex flex-wrap gap-1.5 mt-1">
                      {(activeVariant.attributes instanceof Map ? Array.from(activeVariant.attributes.entries()) : Object.entries(activeVariant.attributes)).map(([key, val]) => (
                        <span key={key} className="px-2 py-0.5 rounded bg-neutral-900 border border-white/[0.03] text-[9px] font-mono text-neutral-400">
                          {key.toUpperCase()}: <span className="text-neutral-200 font-medium">{val}</span>
                        </span>
                      ))}
                    </div>
                  ) : (
                    <span className="text-xs text-neutral-500 italic block mt-1">No custom attributes defined</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Manage / Add Variant Form & List */}
          <div className="lg:col-span-5 flex flex-col gap-6 lg:h-full lg:overflow-y-auto pr-2 no-scrollbar lg:pb-6">
            
            {/* Tab Controllers */}
            <div className="flex gap-4 border-b border-neutral-900 pb-3">
              <button
                type="button"
                onClick={() => setActiveTab("add")}
                className={`font-mono text-[10px] font-bold tracking-wider pb-1 transition-all relative cursor-pointer border-0 bg-transparent ${
                  activeTab === "add" ? "text-white" : "text-neutral-500 hover:text-neutral-300"
                }`}
              >
                ADD NEW VARIANT
                {activeTab === "add" && (
                  <span className="absolute bottom-[-13px] left-0 w-full h-[2px] bg-white rounded-full" />
                )}
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("list")}
                className={`font-mono text-[10px] font-bold tracking-wider pb-1 transition-all relative cursor-pointer border-0 bg-transparent ${
                  activeTab === "list" ? "text-white" : "text-neutral-500 hover:text-neutral-300"
                }`}
              >
                ACTIVE VARIANTS ({product.variants?.length || 0})
                {activeTab === "list" && (
                  <span className="absolute bottom-[-13px] left-0 w-full h-[2px] bg-white rounded-full" />
                )}
              </button>
            </div>

            {/* Tab Contents */}
            {activeTab === "add" ? (
              <form onSubmit={handleVariantSubmit} className="space-y-6 bg-[#0a0a0a]/20 backdrop-blur-md border border-white/[0.04] shadow-lg rounded-3xl p-6 transition-all duration-500 hover:border-white/[0.08]">
                
                {/* Variant Images */}
                <div className="space-y-2">
                  <label className="text-[10px] font-mono tracking-[0.2em] text-neutral-400 uppercase">
                    Variant Images
                  </label>
                  <div className="relative border border-dashed border-neutral-800 hover:border-neutral-700 hover:bg-white/[0.02] rounded-2xl p-6 text-center cursor-pointer transition-all duration-300 flex flex-col items-center gap-2">
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageChange}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                    <ImageIcon className="h-6 w-6 text-neutral-500" />
                    <span className="text-[11px] text-neutral-400 font-light">
                      Drag & drop or <span className="underline text-white font-medium">browse</span> files
                    </span>
                    <span className="text-[9px] text-neutral-600 font-mono">
                      SUPPORTED FORMATS: JPG, PNG, WEBP (MAX 7 IMAGES)
                    </span>
                  </div>

                  {/* Thumbnail Previews */}
                  {variantImages.length > 0 && (
                    <div className="grid grid-cols-4 gap-3 pt-3">
                      {variantImages.map((img, idx) => (
                        <div key={idx} className="relative aspect-[3/4] rounded-xl overflow-hidden border border-white/[0.05] group">
                          <img src={img.preview} alt="preview" className="w-full h-full object-cover" />
                          <button
                            type="button"
                            onClick={() => removeSelectedImage(idx)}
                            className="absolute top-1.5 right-1.5 p-1 rounded-md bg-black/75 hover:bg-red-950/80 text-neutral-400 hover:text-white border border-neutral-800 hover:border-red-900 transition-all cursor-pointer opacity-0 group-hover:opacity-100 border-0"
                          >
                            <Trash2 className="h-3 w-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Price & Stock */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-mono tracking-[0.2em] text-neutral-400 uppercase">
                      Variant Price (Optional)
                    </label>
                    <input
                      type="number"
                      min="0"
                      placeholder={`Base: ${formatPrice(product.price, product.price?.currency || product.currency)}`}
                      value={variantPrice}
                      onChange={(e) => setVariantPrice(e.target.value)}
                      className="w-full bg-neutral-950/65 border border-white/[0.05] focus:border-white/30 focus:ring-1 focus:ring-white/10 rounded-xl py-2.5 px-4 text-xs text-white placeholder-neutral-600 focus:outline-none transition-all duration-300"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-mono tracking-[0.2em] text-neutral-400 uppercase">
                      Stock Quantity
                    </label>
                    <input
                      type="number"
                      min="0"
                      placeholder="e.g. 50"
                      value={variantStock}
                      onChange={(e) => setVariantStock(e.target.value)}
                      className="w-full bg-neutral-950/65 border border-white/[0.05] focus:border-white/30 focus:ring-1 focus:ring-white/10 rounded-xl py-2.5 px-4 text-xs text-white placeholder-neutral-600 focus:outline-none transition-all duration-300"
                    />
                  </div>
                </div>

                {/* Attributes Dynamic List */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <label className="text-[10px] font-mono tracking-[0.2em] text-neutral-400 uppercase">
                      Attributes (Size, Color, etc.)
                    </label>
                    <button
                      type="button"
                      onClick={addAttributeRow}
                      className="text-[9px] font-mono font-bold tracking-wider text-white hover:underline flex items-center gap-1 cursor-pointer bg-transparent border-0"
                    >
                      <Plus className="h-3 w-3" /> ADD ROW
                    </button>
                  </div>

                  <div className="space-y-3 max-h-[160px] overflow-y-auto no-scrollbar pr-1">
                    {variantAttributes.map((attr, idx) => (
                      <div key={idx} className="flex gap-3 items-center">
                        <input
                          type="text"
                          placeholder="e.g., Color"
                          value={attr.key}
                          onChange={(e) => handleAttributeChange(idx, "key", e.target.value)}
                          className="flex-1 bg-neutral-950/65 border border-white/[0.05] focus:border-white/30 focus:ring-1 focus:ring-white/10 rounded-xl py-2 px-3 text-xs text-white placeholder-neutral-600 focus:outline-none transition-all duration-300"
                        />
                        <input
                          type="text"
                          placeholder="e.g., Midnight Blue"
                          value={attr.value}
                          onChange={(e) => handleAttributeChange(idx, "value", e.target.value)}
                          className="flex-1 bg-neutral-950/65 border border-white/[0.05] focus:border-white/30 focus:ring-1 focus:ring-white/10 rounded-xl py-2 px-3 text-xs text-white placeholder-neutral-600 focus:outline-none transition-all duration-300"
                        />
                        {variantAttributes.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeAttributeRow(idx)}
                            className="p-2 rounded-xl border border-white/[0.04] hover:border-red-900/30 text-neutral-500 hover:text-red-400 hover:bg-red-950/15 transition-all duration-350 cursor-pointer bg-transparent"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Submit Action */}
                <button
                  type="submit"
                  disabled={variantSubmitting}
                  className="w-full h-12 rounded-xl bg-white hover:bg-neutral-150 disabled:bg-neutral-900 disabled:text-neutral-600 text-black font-mono text-[10px] font-bold tracking-[0.25em] uppercase transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer mt-4 border-0 shadow-lg"
                >
                  {variantSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" /> SUBMITTING
                    </>
                  ) : (
                    "SAVE VARIANT"
                  )}
                </button>
              </form>
            ) : (
              /* Active Variants List */
              <div className="space-y-3 pr-1">
                {!product.variants || product.variants.length === 0 ? (
                  <div className="py-16 text-center text-neutral-500 space-y-2 border border-dashed border-neutral-900 rounded-3xl bg-[#0a0a0a]/30">
                    <FolderKanban className="h-8 w-8 mx-auto text-neutral-650 stroke-[1.25]" />
                    <p className="text-xs font-light">No style variants listed for this product.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {product.variants.map((variant, vIdx) => (
                      <button
                        key={vIdx}
                        type="button"
                        onClick={() => {
                          setActiveVariantIndex(vIdx);
                          setActiveImageIndex(0);
                        }}
                        className={`w-full p-4 rounded-2xl border transition-all duration-300 text-left flex gap-4 items-center cursor-pointer ${
                          activeVariantIndex === vIdx
                            ? "border-white/80 bg-white/[0.04] shadow-md backdrop-blur-sm"
                            : "border-white/[0.04] bg-neutral-950/40 hover:bg-white/[0.01] hover:border-white/[0.08]"
                        }`}
                      >
                        {/* Thumbnail */}
                        <div className="relative w-12 aspect-[3/4] rounded-lg overflow-hidden border border-white/[0.05] bg-neutral-950 shrink-0">
                          {variant.images && variant.images[0]?.url ? (
                            <img src={variant.images[0].url} alt="variant thumbnail" className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-neutral-700 bg-neutral-950">
                              <ImageIcon className="h-4 w-4" />
                            </div>
                          )}
                          {variant.images && variant.images.length > 1 && (
                            <div className="absolute bottom-1 right-1 px-1 py-[0.5px] rounded bg-black/60 text-[7px] font-mono text-neutral-400">
                              +{variant.images.length - 1}
                            </div>
                          )}
                        </div>

                        {/* Details */}
                        <div className="flex-1 min-w-0 space-y-1">
                          <div className="flex justify-between items-baseline">
                            <span className="font-mono text-xs text-white font-semibold">
                              {formatPrice(variant.price || product.price, variant.price?.currency || product.price?.currency || product.currency)}
                            </span>
                            <span className="font-mono text-[9px] text-neutral-400 uppercase tracking-wider">
                              Stock: <span className="text-white font-bold">{variant.stock ?? 0}</span>
                            </span>
                          </div>

                          {/* Attribute Badges */}
                          {variant.attributes && (variant.attributes instanceof Map ? Array.from(variant.attributes.entries()) : Object.entries(variant.attributes)).length > 0 ? (
                            <div className="flex flex-wrap gap-1 pt-0.5">
                              {(variant.attributes instanceof Map ? Array.from(variant.attributes.entries()) : Object.entries(variant.attributes)).map(([key, val]) => (
                                <span key={key} className="px-1.5 py-0.5 rounded-md bg-neutral-900 border border-white/[0.03] text-[9px] font-mono text-neutral-400">
                                  {key.toUpperCase()}: <span className="text-neutral-205 font-medium">{val}</span>
                                </span>
                              ))}
                            </div>
                          ) : (
                            <span className="text-[10px] text-neutral-600 font-mono italic">No attributes defined</span>
                          )}
                        </div>

                        {/* Active indicator check */}
                        {activeVariantIndex === vIdx && (
                          <div className="h-5 w-5 rounded-full bg-white text-black flex items-center justify-center shrink-0 shadow-sm">
                            <Check className="h-3.5 w-3.5 stroke-[2.5]" />
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </main>
      </div>
    </>
  );
}