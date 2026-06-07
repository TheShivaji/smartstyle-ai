import React, { useState } from "react";
import { useProduct } from "../hook/useProduct";
import { useNavigate } from "react-router-dom";
import { 
  ShoppingBag, 
  UploadCloud, 
  X, 
  Sparkles, 
  ArrowLeft, 
  Plus, 
  Loader2, 
  AlertCircle 
} from "lucide-react";

const currencySymbols = {
  INR: "₹",
  USD: "$",
  EUR: "€",
  GBP: "£",
};

export default function CreateProduct() {
  const { handleCreateProduct } = useProduct();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    currency: "INR",
  });
  
  const [images, setImages] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    
    // Limit to 7 images
    if (images.length + files.length > 7) {
      setError("You can upload a maximum of 7 images.");
      return;
    }

    setError("");
    
    const validFiles = files.filter(file => file.type.startsWith("image/"));
    if (validFiles.length !== files.length) {
      setError("Only image files are allowed.");
    }

    const newImages = [...images, ...validFiles];
    setImages(newImages);

    // Create file previews
    const newPreviews = validFiles.map((file) => URL.createObjectURL(file));
    setPreviews((prev) => [...prev, ...newPreviews]);
  };

  const handleRemoveImage = (index) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    setImages(newImages);

    // Revoke the object URL to avoid memory leaks
    URL.revokeObjectURL(previews[index]);
    
    const newPreviews = [...previews];
    newPreviews.splice(index, 1);
    setPreviews(newPreviews);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validations
    if (!formData.title.trim()) {
      setError("Product title is required.");
      return;
    }
    if (!formData.description.trim()) {
      setError("Product description is required.");
      return;
    }
    if (!formData.price || parseFloat(formData.price) <= 0) {
      setError("Please enter a valid price greater than 0.");
      return;
    }
    if (images.length === 0) {
      setError("At least one product image is required.");
      return;
    }

    setIsSubmitting(true);

    try {
      const data = new FormData();
      data.append("title", formData.title.trim());
      data.append("description", formData.description.trim());
      data.append("price", formData.price);
      data.append("currency", formData.currency);
      
      images.forEach((img) => {
        data.append("images", img);
      });

      const response = await handleCreateProduct(data);
      if (response && response.success) {
        // Redirect to products page or dashboard
        setTimeout(() => {
          navigate("/");
        }, 1500);
      }
    } catch (err) {
      console.error(err);
      setError("An error occurred while creating the product.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,600;1,300;1,600&family=Outfit:wght@300;400;500;600;700;800&display=swap');
        .snitch-product-page { 
          font-family: 'Outfit', sans-serif; 
        }
        .snitch-product-page .font-serif { 
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
        /* Hide scrollbar utility */
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>

      <div className="snitch-product-page h-screen bg-neutral-950 text-neutral-200 relative overflow-hidden grain flex flex-col p-4 sm:p-6 lg:p-8">
        {/* Glow ambient background elements */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-white/[0.01] blur-[120px] pointer-events-none" />
        <div className="absolute bottom-1/3 right-1/4 w-80 h-80 rounded-full bg-neutral-900/30 blur-[100px] pointer-events-none" />

        {/* Header (fixed height) */}
        <header className="flex items-center justify-between pb-4 border-b border-neutral-800 shrink-0 z-10">
          <button 
            onClick={() => navigate(-1)} 
            className="flex items-center gap-2 text-xs font-mono tracking-widest text-neutral-400 hover:text-white transition-colors cursor-pointer group"
          >
            <ArrowLeft className="h-3.5 w-3.5 group-hover:-translate-x-1 transition-transform" />
            BACK
          </button>
          <div className="flex items-center gap-2">
            <ShoppingBag className="h-4 w-4 stroke-[1.5] text-neutral-300" />
            <span className="font-mono text-xs font-bold tracking-[0.4em] uppercase text-white">
              SNITCH STUDIO
            </span>
          </div>
        </header>

        {/* Main Content Area (Rest of screen) */}
        <main className="flex-1 flex flex-col lg:flex-row gap-6 mt-6 overflow-hidden min-h-0 z-10 animate-slide-up">
          
          {/* LEFT SIDE: Media & Previews (50% on desktop) */}
          <div className="lg:w-1/2 flex flex-col h-full overflow-hidden min-h-0 space-y-4">
            
            {/* Drag and Drop Zone */}
            <div className="relative group border border-dashed border-neutral-800 hover:border-neutral-500 rounded-2xl bg-[#0e0e0e] hover:bg-neutral-900/30 transition-all p-6 text-center cursor-pointer flex flex-col justify-center items-center h-48 shrink-0">
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileChange}
                className="absolute inset-0 opacity-0 cursor-pointer z-10"
                disabled={images.length >= 7}
              />
              <div className="flex flex-col items-center justify-center space-y-2">
                <div className="p-2.5 rounded-xl bg-neutral-900 border border-neutral-800 group-hover:scale-105 transition-transform duration-300">
                  <UploadCloud className="h-5 w-5 text-neutral-400 group-hover:text-white transition-colors" />
                </div>
                <p className="text-xs text-neutral-300 font-medium">
                  Drag & drop images here or <span className="underline hover:text-white">browse</span>
                </p>
                <p className="text-[10px] text-neutral-500 font-light">
                  Supports JPG, PNG, WEBP (Max 7 images)
                </p>
              </div>
            </div>

            {/* Image Previews Section (Scrollable grid/list) */}
            <div className="flex-1 overflow-y-auto no-scrollbar">
              <div className="flex justify-between items-center mb-3">
                <label className="text-[10px] font-mono tracking-[0.2em] text-neutral-400 uppercase">
                  EDITORIAL IMAGES ({images.length} OF 7)
                </label>
              </div>

              {previews.length === 0 ? (
                <div className="h-full border border-neutral-800 rounded-2xl bg-[#0e0e0e]/50 flex flex-col items-center justify-center text-neutral-500 p-8 text-center min-h-[160px]">
                  <ShoppingBag className="h-8 w-8 mb-2 opacity-20" />
                  <p className="text-xs font-light">No images uploaded yet.</p>
                  <p className="text-[10px] opacity-60">Upload files above to preview layout</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {previews.map((src, index) => (
                    <div 
                      key={index} 
                      className="relative aspect-square rounded-xl overflow-hidden border border-neutral-800 bg-neutral-900 group"
                    >
                      <img 
                        src={src} 
                        alt={`Preview ${index + 1}`} 
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(index)}
                        className="absolute top-2 right-2 p-1.5 rounded-lg bg-black/70 hover:bg-black text-neutral-300 hover:text-white transition-all backdrop-blur-md opacity-0 group-hover:opacity-100 focus:opacity-100 z-20 cursor-pointer"
                      >
                        <X className="h-3 w-3" />
                      </button>
                      <div className="absolute bottom-2 left-2 px-1.5 py-0.5 bg-black/70 backdrop-blur-md border border-neutral-800 rounded text-[8px] font-mono text-neutral-400">
                        IMG {index + 1}
                      </div>
                    </div>
                  ))}
                  {images.length < 7 && (
                    <div className="relative aspect-square rounded-xl border border-dashed border-neutral-800 hover:border-neutral-600 bg-neutral-900/30 hover:bg-neutral-900/60 transition-all flex flex-col items-center justify-center text-neutral-500 hover:text-neutral-300 cursor-pointer">
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleFileChange}
                        className="absolute inset-0 opacity-0 cursor-pointer z-10"
                      />
                      <Plus className="h-4 w-4 mb-1" />
                      <span className="text-[9px] font-mono tracking-widest">ADD MORE</span>
                    </div>
                  )}
                </div>
              )}
            </div>

          </div>

          {/* RIGHT SIDE: Product Fields Form (50% on desktop) */}
          <div className="lg:w-1/2 h-full flex flex-col overflow-hidden min-h-0 bg-[#0c0c0c] border border-neutral-800 rounded-2xl">
            <form onSubmit={handleSubmit} className="flex flex-col h-full p-6 sm:p-8 justify-between overflow-hidden min-h-0">
              
              <div className="overflow-y-auto no-scrollbar space-y-5 flex-1 pr-1">
                {/* Form header */}
                <div className="space-y-1.5 pb-2 border-b border-neutral-800">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border border-neutral-800 bg-neutral-900/50">
                    <Sparkles className="h-2.5 w-2.5 text-neutral-300" />
                    <span className="text-[9px] font-mono tracking-widest text-neutral-300 uppercase">
                      COLLECTION BUILDER
                    </span>
                  </div>
                  <h1 className="text-2xl font-light font-serif text-white tracking-wide">
                    Product Details
                  </h1>
                </div>

                {/* Error Banner */}
                {error && (
                  <div className="p-3 rounded-xl bg-red-950/20 border border-red-900/40 flex items-start gap-2.5 text-red-300 text-xs">
                    <AlertCircle className="h-4 w-4 text-red-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold font-mono text-[10px] tracking-wider uppercase">Validation Error</span>
                      <p className="font-light text-red-300/80 mt-0.5">{error}</p>
                    </div>
                  </div>
                )}

                {/* Product Title */}
                <div className="space-y-1.5">
                  <label className="text-[9px] font-mono tracking-[0.2em] text-neutral-400 uppercase block" htmlFor="title">
                    Product Title
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    placeholder="e.g. SNITCH OVERSIZED BOXY TEE"
                    value={formData.title}
                    onChange={handleChange}
                    className="w-full bg-[#141414] border border-neutral-800 focus:border-neutral-500 rounded-xl py-2.5 px-3.5 text-xs text-white placeholder-neutral-600 focus:outline-none focus:ring-1 focus:ring-neutral-700 transition-all"
                    required
                  />
                </div>

                {/* Price & Currency */}
                <div className="grid grid-cols-3 gap-3">
                  {/* Currency Selector */}
                  <div className="space-y-1.5 col-span-1">
                    <label className="text-[9px] font-mono tracking-[0.2em] text-neutral-400 uppercase block" htmlFor="currency">
                      CURRENCY
                    </label>
                    <div className="relative">
                      <select
                        id="currency"
                        name="currency"
                        value={formData.currency}
                        onChange={handleChange}
                        className="w-full bg-[#141414] border border-neutral-800 focus:border-neutral-500 rounded-xl py-2.5 px-3 text-xs text-white focus:outline-none focus:ring-1 focus:ring-neutral-700 transition-all appearance-none cursor-pointer"
                      >
                        <option value="INR" className="bg-neutral-900">INR (₹)</option>
                        <option value="USD" className="bg-neutral-900">USD ($)</option>
                        <option value="EUR" className="bg-neutral-900">EUR (€)</option>
                        <option value="GBP" className="bg-neutral-900">GBP (£)</option>
                      </select>
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-neutral-500 text-[10px]">
                        ▼
                      </div>
                    </div>
                  </div>
                  
                  {/* Price Input */}
                  <div className="space-y-1.5 col-span-2">
                    <label className="text-[9px] font-mono tracking-[0.2em] text-neutral-400 uppercase block" htmlFor="price">
                      PRICE
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                        <span className="text-neutral-500 text-xs font-mono">
                          {currencySymbols[formData.currency] || "₹"}
                        </span>
                      </div>
                      <input
                        type="number"
                        id="price"
                        name="price"
                        placeholder="1499"
                        value={formData.price}
                        onChange={handleChange}
                        min="1"
                        className="w-full bg-[#141414] border border-neutral-800 focus:border-neutral-500 rounded-xl py-2.5 pl-8 pr-3.5 text-xs text-white placeholder-neutral-600 focus:outline-none focus:ring-1 focus:ring-neutral-700 transition-all font-mono"
                        required
                      />  
                    </div>
                  </div>
                </div>

                {/* Product Description */}
                <div className="space-y-1.5 flex-1 flex flex-col min-h-[120px]">
                  <label className="text-[9px] font-mono tracking-[0.2em] text-neutral-400 uppercase block" htmlFor="description">
                    Description & Attributes
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    placeholder="Describe the fabric weave, fit configuration, and design details..."
                    value={formData.description}
                    onChange={handleChange}
                    className="w-full flex-1 bg-[#141414] border border-neutral-800 focus:border-neutral-500 rounded-xl py-2.5 px-3.5 text-xs text-white placeholder-neutral-600 focus:outline-none focus:ring-1 focus:ring-neutral-700 transition-all resize-none min-h-[100px]"
                    required
                  />
                </div>
              </div>

              {/* Submit / Publish Button (pinned to bottom) */}
              <div className="pt-4 mt-4 border-t border-neutral-800 shrink-0">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-white hover:bg-neutral-100 text-black font-bold tracking-[0.2em] py-3.5 rounded-xl text-[10px] flex items-center justify-center gap-2 transition-all duration-300 disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-3.5 w-3.5 animate-spin" /> CONSTRUCTING ITEM...
                    </>
                  ) : (
                    <>
                      PUBLISH TO CATALOGUE <Plus className="h-3.5 w-3.5 stroke-[2]" />
                    </>
                  )}
                </button>
              </div>

            </form>
          </div>

        </main>
      </div>
    </>
  );
}
