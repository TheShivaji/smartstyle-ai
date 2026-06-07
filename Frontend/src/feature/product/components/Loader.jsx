import React from "react";
import { ShoppingBag } from "lucide-react";

export default function Loader() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@300;400;500&display=swap');
        
        .snitch-loader-container {
          font-family: 'DM Mono', monospace;
        }
        
        /* Grain overlay */
        .grain-overlay::after {
          content: '';
          position: absolute;
          inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.05'/%3E%3C/svg%3E");
          pointer-events: none;
          z-index: 5;
          mix-blend-mode: overlay;
        }

        /* Ambient pulse glow */
        @keyframes radialGlow {
          0%, 100% { opacity: 0.15; transform: scale(0.9); }
          50% { opacity: 0.3; transform: scale(1.1); }
        }
        .animate-glow {
          animation: radialGlow 4s ease-in-out infinite;
        }

        /* Subtle spin-pulse for the icon */
        @keyframes spinPulse {
          0% { transform: rotate(0deg) scale(0.95); }
          50% { transform: rotate(180deg) scale(1.05); }
          100% { transform: rotate(360deg) scale(0.95); }
        }
        .animate-spin-pulse {
          animation: spinPulse 3s cubic-bezier(0.4, 0, 0.2, 1) infinite;
        }

        /* Infinite linear progress line */
        @keyframes lineLoad {
          0% { left: -100%; width: 30%; }
          50% { width: 40%; }
          100% { left: 100%; width: 30%; }
        }
        .progress-bar-line::after {
          content: '';
          position: absolute;
          top: 0;
          height: 100%;
          background: linear-gradient(90deg, transparent, #ffffff, transparent);
          animation: lineLoad 1.8s cubic-bezier(0.4, 0, 0.2, 1) infinite;
        }
      `}</style>

      <div className="snitch-loader-container fixed inset-0 bg-neutral-950 flex flex-col items-center justify-center z-[9999] grain-overlay overflow-hidden">
        {/* Glow ambient background elements */}
        <div className="absolute w-80 h-80 rounded-full bg-white/[0.02] blur-[100px] pointer-events-none animate-glow" />

        <div className="flex flex-col items-center space-y-6 relative z-10">
          {/* Logo Brand / Icon */}
          <div className="relative flex items-center justify-center">
            {/* Elegant outer spinning ring */}
            <div className="absolute w-14 h-14 rounded-full border border-dashed border-neutral-800/80 animate-spin-pulse" />
            
            {/* Central icon */}
            <div className="p-3 bg-neutral-900/60 border border-neutral-850 rounded-2xl shadow-xl backdrop-blur-md">
              <ShoppingBag className="h-5 w-5 text-white stroke-[1.25]" />
            </div>
          </div>

          {/* Text and progress */}
          <div className="text-center space-y-3">
            <div className="flex items-center justify-center gap-1.5 pl-[0.6em]">
              <span className="text-xs font-semibold tracking-[0.6em] text-white uppercase select-none">
                SNITCH
              </span>
            </div>
            
            {/* Elegant tiny line loader */}
            <div className="w-28 h-[1px] bg-neutral-900 rounded-full relative overflow-hidden mx-auto progress-bar-line" />
            
            <p className="text-[9px] tracking-[0.3em] text-neutral-500 uppercase font-light animate-pulse pt-1">
              Initializing Session
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
