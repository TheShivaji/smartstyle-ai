import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useProduct } from "../hook/useProduct";
import {
  ShoppingBag,
  Plus,
  Loader2,
  AlertCircle,
  Search,
  SlidersHorizontal,
  FolderKanban,
  Image as ImageIcon,
  ArrowRight
} from "lucide-react";

const currencySymbols = {
  INR: "₹",
  USD: "$",
  EUR: "€",
  GBP: "£",
};

export default function ShowProduct() {
  const { handleShowAllProducts } = useProduct();
  const navigate = useNavigate();
  
  // Select state from Redux
  const products = useSelector((state) => state.product.products) || [];
  const loading = useSelector((state) => state.product.loading);
  const error = useSelector((state) => state.product.error);
  const user = useSelector((state) => state.auth.user);

  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("newest"); // newest, priceAsc, priceDesc
  const [hoveredCardId, setHoveredCardId] = useState(null);

  useEffect(() => {
    handleShowAllProducts();
  }, []);

  const formatPrice = (price, currency) => {
    const symbol = currencySymbols[currency] || "₹";
    const amount = Number(price?.amount || price || 0).toLocaleString();
    return `${symbol}${amount}`;
  };

  // Filter & Sort logic
  const filteredProducts = products.filter((p) => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return true;
    return (
      p.title?.toLowerCase().includes(query) ||
      p.description?.toLowerCase().includes(query)
    );
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    const priceA = Number(a.price?.amount || a.price || 0);
    const priceB = Number(b.price?.amount || b.price || 0);

    if (sortBy === "priceAsc") {
      return priceA - priceB;
    } else if (sortBy === "priceDesc") {
      return priceB - priceA;
    } else {
      // Newest first (assuming Mongoose ObjectId or createdAt property)
      const dateA = a.createdAt ? new Date(a.createdAt) : new Date();
      const dateB = b.createdAt ? new Date(b.createdAt) : new Date();
      return dateB - dateA;
    }
  });

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,600;1,300;1,600&family=Outfit:wght@300;400;500;600;700;800&display=swap');
        .snitch-catalog-page { 
          font-family: 'Outfit', sans-serif; 
        }
        .snitch-catalog-page .font-serif { 
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

      <div className="snitch-catalog-page min-h-screen bg-neutral-950 text-neutral-200 relative overflow-x-hidden grain flex flex-col p-4 sm:p-6 lg:p-8">
        {/* Glow ambient background elements */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-white/[0.01] blur-[120px] pointer-events-none" />
        <div className="absolute bottom-1/3 right-1/4 w-80 h-80 rounded-full bg-neutral-900/30 blur-[100px] pointer-events-none" />

        {/* Header */}
        <header className="flex items-center justify-between pb-4 border-b border-neutral-800 shrink-0 z-10">
          <div className="flex items-center gap-2">
            <ShoppingBag className="h-4 w-4 stroke-[1.5] text-neutral-300" />
            <span className="font-mono text-xs font-bold tracking-[0.4em] uppercase text-white">
              SNITCH STUDIO
            </span>
          </div>
          <button
            onClick={() => navigate("/product/create")}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-neutral-150 text-black font-mono text-[10px] font-bold tracking-wider transition-all duration-300 cursor-pointer"
          >
            <Plus className="h-3.5 w-3.5 stroke-[2]" />
            CREATE PRODUCT
          </button>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 flex flex-col mt-6 z-10 animate-slide-up">
          {/* Title and stats */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 pb-6 border-b border-neutral-900">
            <div className="space-y-1">
              <h1 className="text-3xl sm:text-4xl font-light font-serif text-white tracking-wide">
                The Catalog
              </h1>
              <p className="text-xs font-light text-neutral-400">
                {products.length === 0 
                  ? "Build and curate your fashion catalog items." 
                  : `Showing ${sortedProducts.length} of ${products.length} curated design pieces.`}
              </p>
            </div>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="mt-4 p-4 rounded-xl bg-red-950/20 border border-red-900/40 flex items-start gap-3 text-red-300 text-xs">
              <AlertCircle className="h-4 w-4 text-red-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold font-mono text-[10px] tracking-wider uppercase">Connection Error</span>
                <p className="font-light text-red-300/80 mt-0.5">{error}</p>
                <button 
                  onClick={() => navigate("/login")}
                  className="mt-2 text-white underline hover:no-underline font-mono text-[10px]"
                >
                  GO TO SIGN IN &rarr;
                </button>
              </div>
            </div>
          )}

          {/* Controls Bar (Search & Sort) */}
          <div className="flex flex-col md:flex-row gap-4 my-6 items-stretch md:items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute inset-y-0 left-3.5 h-4 w-4 text-neutral-500 my-auto" />
              <input
                type="text"
                placeholder="Search collection by title or keyword..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#0c0c0c]/85 border border-neutral-800 focus:border-neutral-500 rounded-xl py-2.5 pl-10 pr-4 text-xs text-white placeholder-neutral-600 focus:outline-none focus:ring-1 focus:ring-neutral-700 transition-all"
              />
            </div>

            {/* Sort & Actions */}
            <div className="flex items-center gap-3">
              <div className="relative flex items-center">
                <SlidersHorizontal className="absolute left-3.5 h-3.5 w-3.5 text-neutral-500 pointer-events-none" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-[#0c0c0c]/85 border border-neutral-800 focus:border-neutral-500 rounded-xl py-2.5 pl-9 pr-8 text-xs text-white focus:outline-none focus:ring-1 focus:ring-neutral-700 transition-all appearance-none cursor-pointer font-mono"
                >
                  <option value="newest">NEWEST ARRIVALS</option>
                  <option value="priceAsc">PRICE: LOW TO HIGH</option>
                  <option value="priceDesc">PRICE: HIGH TO LOW</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-neutral-500 text-[8px]">
                  ▼
                </div>
              </div>
            </div>
          </div>

          {/* Products Catalogue Grid */}
          {loading ? (
            /* Skeleton Loading Grid */
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="flex flex-col space-y-3 animate-pulse">
                  <div className="aspect-[3/4] rounded-2xl bg-neutral-900 border border-neutral-850" />
                  <div className="h-4 w-1/3 bg-neutral-900 rounded" />
                  <div className="h-5 w-3/4 bg-neutral-900 rounded" />
                  <div className="h-3 w-full bg-neutral-900 rounded" />
                </div>
              ))}
            </div>
          ) : sortedProducts.length === 0 ? (
            /* Empty State */
            <div className="flex-1 flex flex-col items-center justify-center border border-dashed border-neutral-800 rounded-2xl bg-[#0a0a0a]/40 p-12 text-center min-h-[400px]">
              <div className="p-4 rounded-full bg-neutral-900 border border-neutral-800 mb-4">
                <FolderKanban className="h-8 w-8 text-neutral-400 stroke-[1.25]" />
              </div>
              <h3 className="text-lg font-serif font-light text-white mb-1.5">No products in your catalog</h3>
              <p className="text-xs text-neutral-500 font-light max-w-sm leading-relaxed mb-6">
                Start listing your editorial creations, custom fits, and luxury apparel sets. All products uploaded by you will display here.
              </p>
              <button
                onClick={() => navigate("/product/create")}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white hover:bg-neutral-200 text-black font-bold font-mono text-xs tracking-wider transition-all cursor-pointer"
              >
                CREATE FIRST PRODUCT &rarr;
              </button>
            </div>
          ) : (
            /* Products Grid */
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10">
              {sortedProducts.map((p) => {
                const hasSecondImage = p.images && p.images.length > 1;
                const activeImage = (hoveredCardId === p._id && hasSecondImage) 
                  ? p.images[1]?.url 
                  : p.images[0]?.url;

                return (
                  <div
                    key={p._id}
                    className="flex flex-col group"
                    onMouseEnter={() => setHoveredCardId(p._id)}
                    onMouseLeave={() => setHoveredCardId(null)}
                  >
                    {/* Image Container */}
                    <div className="relative aspect-[3/4] rounded-2xl overflow-hidden border border-neutral-900 bg-[#0c0c0c] mb-4">
                      {activeImage ? (
                        <img
                          src={activeImage}
                          alt={p.title}
                          className="w-full h-full object-cover transition-all duration-700 ease-out group-hover:scale-105"
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center text-neutral-600 gap-2">
                          <ImageIcon className="h-6 w-6 stroke-[1.25]" />
                          <span className="text-[10px] font-mono tracking-widest uppercase">No Image</span>
                        </div>
                      )}
                      
                      {/* Image count badge */}
                      {p.images && p.images.length > 1 && (
                        <div className="absolute bottom-3 right-3 px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-md border border-neutral-850 text-[9px] font-mono text-neutral-300">
                          {p.images.length} IMGS
                        </div>
                      )}
                    </div>

                    {/* Metadata details */}
                    <div className="space-y-1.5 flex-1 flex flex-col justify-between">
                      <div>
                        {/* Price & Currency */}
                        <div className="flex justify-between items-baseline mb-1">
                          <span className="font-mono text-sm text-white font-semibold">
                            {formatPrice(p.price, p.price?.currency || p.currency)}
                          </span>
                        </div>

                        {/* Title */}
                        <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-100 line-clamp-1 group-hover:text-white transition-colors">
                          {p.title}
                        </h3>

                        {/* Description */}
                        <p className="text-[11px] text-neutral-400 font-light leading-relaxed line-clamp-2 mt-1">
                          {p.description}
                        </p>
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
