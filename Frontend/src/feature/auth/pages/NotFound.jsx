import React from "react";
import { useNavigate } from "react-router-dom";
import { Compass, ArrowLeft, HelpCircle } from "lucide-react";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,600;1,300;1,600&family=Outfit:wght@300;400;500;600;700;800&display=swap');
        .snitch-404-page { 
          font-family: 'Outfit', sans-serif; 
        }
        .snitch-404-page .font-serif { 
          font-family: 'Cormorant Garamond', Georgia, serif; 
        }
        .grain::after {
          content:''; position:absolute; inset:0;
          background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.05'/%3E%3C/svg%3E");
          pointer-events:none; z-index:5; mix-blend-mode:overlay;
        }
        @keyframes pulseGlow {
          0%, 100% { opacity: 0.15; transform: scale(1); }
          50% { opacity: 0.25; transform: scale(1.1); }
        }
        .pulse-glow {
          animation: pulseGlow 8s ease-in-out infinite;
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-10px) rotate(3deg); }
        }
        .float-animation {
          animation: float 4s ease-in-out infinite;
        }
      `}</style>

      <div className="snitch-404-page min-h-screen bg-neutral-950 text-neutral-200 relative overflow-hidden grain flex flex-col items-center justify-center p-6 text-center">
        {/* Glow ambient background elements */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-white/[0.01] blur-[150px] pointer-events-none pulse-glow" />
        
        {/* Floating Compass/Brand Icon */}
        <div className="float-animation mb-6 p-5 rounded-full bg-neutral-900/60 border border-neutral-850 backdrop-blur-md relative z-10">
          <Compass className="h-10 w-10 text-neutral-400 stroke-[1.25]" />
        </div>

        {/* 404 Large Text */}
        <h1 className="text-8xl sm:text-9xl font-light font-serif tracking-widest text-white/95 relative z-10 select-none">
          404
        </h1>

        {/* Lost Message */}
        <div className="space-y-3 max-w-md mt-4 relative z-10">
          <h2 className="text-xs font-mono font-bold tracking-[0.3em] uppercase text-neutral-400">
            LOST IN THE STREETS
          </h2>
          <p className="text-xs text-neutral-500 font-light leading-relaxed px-4">
            This style, collection, or page does not exist or has been archived. Check your url or return to the studio catalogue.
          </p>
        </div>

        {/* Navigation Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 mt-10 relative z-10 w-full max-w-xs sm:max-w-none justify-center">
          <button
            onClick={() => navigate("/showallproduct")}
            className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-white text-black hover:bg-neutral-200 font-bold font-mono text-[10px] tracking-[0.15em] uppercase transition-all duration-300 cursor-pointer"
          >
            RETURN TO SHOP
          </button>
          
          <button
            onClick={() => navigate(-1)}
            className="flex items-center justify-center gap-1.5 px-6 py-3.5 rounded-xl border border-neutral-800 hover:border-neutral-600 bg-transparent text-neutral-400 hover:text-white font-mono text-[10px] tracking-[0.15em] uppercase transition-all duration-300 cursor-pointer"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            GO BACK
          </button>
        </div>

        {/* Footer brand label */}
        <div className="absolute bottom-6 left-6 right-6 flex justify-between items-center text-[9px] font-mono tracking-widest text-neutral-600 uppercase select-none">
          <span>SNITCH STUDIO © 2026</span>
          <span className="flex items-center gap-1">
            <HelpCircle className="h-3 w-3" /> HELP & SUPPORT
          </span>
        </div>
      </div>
    </>
  );
}
