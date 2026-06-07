import React from "react";
import { useNavigate } from "react-router-dom";
import { ShieldAlert, ArrowLeft, LogOut, ShoppingBag } from "lucide-react";

export default function Unauthorized() {
  const navigate = useNavigate();

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,600;1,300;1,600&family=Outfit:wght@300;400;500;600;700;800&display=swap');
        
        .unauthorized-page { 
          font-family: 'Outfit', sans-serif; 
        }
        .unauthorized-page .font-serif { 
          font-family: 'Cormorant Garamond', Georgia, serif; 
        }
        
        .grain::after {
          content:''; 
          position:absolute; 
          inset:0;
          background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.05'/%3E%3C/svg%3E");
          pointer-events:none; 
          z-index: 5; 
          mix-blend-mode:overlay;
        }

        @keyframes pulseSlow {
          0%, 100% { opacity: 0.02; transform: scale(1); }
          50% { opacity: 0.05; transform: scale(1.1); }
        }
        .animate-pulse-slow {
          animation: pulseSlow 8s ease-in-out infinite;
        }

        @keyframes slideUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-slide-up {
          animation: slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>

      <div className="unauthorized-page min-h-screen bg-neutral-950 text-neutral-200 flex flex-col justify-between p-6 relative overflow-hidden grain">
        {/* Glow ambient background */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-white/[0.015] blur-[120px] pointer-events-none animate-pulse-slow z-0" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-red-950/[0.05] blur-[150px] pointer-events-none z-0" />

        {/* Top Header */}
        <header className="flex items-center justify-between relative z-10 w-full max-w-7xl mx-auto">
          <div className="flex items-center gap-2 text-white">
            <ShoppingBag className="h-4 w-4 stroke-[1.5]" />
            <span className="font-mono text-xs font-bold tracking-[0.4em] uppercase">
              SNITCH
            </span>
          </div>
          <span className="text-[9px] tracking-[0.25em] text-neutral-500 font-mono uppercase">
            Restricted Directory
          </span>
        </header>

        {/* Central Core Content */}
        <main className="flex-1 flex flex-col items-center justify-center text-center relative z-10 max-w-md mx-auto space-y-8 animate-slide-up">
          {/* Badge & Icon */}
          <div className="space-y-4">
            <div className="inline-flex p-4 rounded-full bg-red-950/20 border border-red-900/30 text-red-400 shadow-[0_0_30px_rgba(239,68,68,0.05)]">
              <ShieldAlert className="h-8 w-8 stroke-[1.25]" />
            </div>
            
            <p className="text-[10px] tracking-[0.3em] text-red-500 font-mono uppercase font-bold">
              Error 403 · Forbidden Access
            </p>
          </div>

          {/* Heading */}
          <div className="space-y-3">
            <h1 className="font-serif text-4xl sm:text-5xl font-light text-white tracking-wide leading-tight">
              Access{" "}
              <em className="font-semibold not-italic bg-gradient-to-br from-white to-neutral-400 bg-clip-text text-transparent">
                Denied
              </em>
            </h1>
            <p className="text-xs text-neutral-500 font-light leading-relaxed">
              This destination is exclusively reserved for verified **Seller** accounts. 
              Your current account type does not possess the credentials required for access.
            </p>
          </div>

          {/* Actions */}
          <div className="w-full space-y-3 pt-2">
            {/* Go back Home */}
            <button
              onClick={() => navigate("/")}
              className="w-full bg-white hover:bg-neutral-100 text-black font-bold tracking-[0.2em] py-3.5 rounded-xl text-[10px] flex items-center justify-center gap-2 transition-all duration-300 cursor-pointer shadow-lg"
            >
              <ArrowLeft className="h-3.5 w-3.5" /> RETURN TO CATALOG
            </button>

            {/* Login with another account */}
            <button
              onClick={() => navigate("/login")}
              className="w-full bg-neutral-900/50 hover:bg-neutral-900/90 text-neutral-300 border border-neutral-800 hover:border-neutral-700 font-bold tracking-[0.2em] py-3.5 rounded-xl text-[10px] flex items-center justify-center gap-2 transition-all duration-300 cursor-pointer"
            >
              <LogOut className="h-3.5 w-3.5" /> SIGN IN WITH ANOTHER ACCOUNT
            </button>
          </div>
        </main>

        {/* Footer */}
        <footer className="text-center relative z-10 w-full py-4">
          <p className="text-[9px] text-neutral-600 font-mono tracking-widest uppercase">
            © 2026 SNITCH CLOTHING CO. · SECURITY SYSTEM
          </p>
        </footer>
      </div>
    </>
  );
}
