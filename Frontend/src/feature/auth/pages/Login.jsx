import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../hook/useAuth";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  Sparkles,
  ArrowRight,
  Loader2,
  ShoppingBag,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { error: reduxError, loading: reduxLoading } = useSelector(
    (s) => s.auth,
  );

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [localErrors, setLocalErrors] = useState({});
  const [isSuccess, setIsSuccess] = useState(false);
  const [touched, setTouched] = useState({});

  useEffect(() => {
    validateForm();
  }, [formData, touched]);

  const validateForm = () => {
    const e = {};
    if (touched.email) {
      if (!formData.email) e.email = "Email is required";
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
        e.email = "Invalid email address";
    }
    if (touched.password) {
      if (!formData.password) e.password = "Password is required";
      else if (formData.password.length < 6) e.password = "Min. 6 characters";
    }
    setLocalErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleBlur = (field) => setTouched((p) => ({ ...p, [field]: true }));
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setTouched({ email: true, password: true });
    const invalid =
      !formData.email ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email) ||
      !formData.password ||
      formData.password.length < 6;
    if (invalid) return;
    const res = await login(formData);
    if (res?.success) {
      setIsSuccess(true);
      setTimeout(() => navigate("/"), 2000);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,600;1,300;1,600&family=DM+Mono:wght@300;400&display=swap');
        .snitch-login { font-family: ui-sans-serif, system-ui, sans-serif; }
        .snitch-login .font-serif { font-family: 'Cormorant Garamond', Georgia, serif; }
        .snitch-login .font-mono  { font-family: 'DM Mono', monospace; }
        .grain::after {
          content:''; position:absolute; inset:0;
          background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.06'/%3E%3C/svg%3E");
          pointer-events:none; z-index:5; mix-blend-mode:overlay;
        }
        @keyframes drift { 0%,100%{transform:scale(1.04) translateX(0)} 50%{transform:scale(1.08) translateX(-10px)} }
        .animate-drift { animation: drift 18s ease-in-out infinite; }
        @keyframes pulseSlow { 0%,100%{opacity:0.03} 50%{opacity:0.07} }
        .animate-pulse-slow { animation: pulseSlow 6s ease-in-out infinite; }
        @keyframes slideDown { from{opacity:0;transform:translateY(-6px)} to{opacity:1;transform:none} }
        .animate-slideDown { animation: slideDown 0.25s ease both; }
        @keyframes staggerIn { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:none} }
        .stagger { animation: staggerIn 0.4s cubic-bezier(.22,1,.36,1) both; }
        .s1{animation-delay:60ms} .s2{animation-delay:120ms} .s3{animation-delay:180ms} .s4{animation-delay:240ms}
        @keyframes shimmer { from{left:-60%} to{left:130%} }
        .btn-shimmer { position:relative; overflow:hidden; }
        .btn-shimmer::after {
          content:''; position:absolute; top:0; width:40%; height:100%;
          background:linear-gradient(90deg,transparent,rgba(255,255,255,0.18),transparent);
          animation: shimmer 2.2s ease-in-out infinite;
        }
        @keyframes vertScroll { from{transform:translateY(0)} to{transform:translateY(-50%)} }
        .vert-scroll { animation: vertScroll 12s linear infinite; }
      `}</style>

      <div className="snitch-login min-h-screen md:h-screen bg-neutral-950 flex flex-col md:flex-row overflow-y-auto md:overflow-hidden text-neutral-200">
        {/* ══ LEFT PANEL ══ */}
        <div className="hidden md:flex md:w-[52%] relative bg-[#0c0c0c] items-end overflow-hidden grain">
          <div className="absolute inset-0 z-0 animate-drift">
            <img
              src="/fashion_bg.png"
              alt="Snitch editorial"
              className="w-full h-full object-cover opacity-55 contrast-[1.06]"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-[#0c0c0c] via-[#0c0c0c]/50 to-transparent z-10" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0c0c0c]/20 to-transparent z-10" />

          {/* Vertical badge */}
          <div className="absolute top-0 right-6 z-20 overflow-hidden h-full w-5 flex items-start">
            <div className="vert-scroll flex flex-col gap-8 pt-10 text-[8px] tracking-[0.5em] text-neutral-600 font-mono rotate-180 [writing-mode:vertical-rl]">
              {["AW26", "SNITCH", "LIMITED", "AW26", "SNITCH", "LIMITED"].map(
                (t, i) => (
                  <span key={i}>{t}</span>
                ),
              )}
            </div>
          </div>

          <div className="relative z-20 w-full p-12 space-y-6">
            <div className="space-y-4">
              <span className="text-[9px] uppercase tracking-[0.4em] font-mono text-neutral-500 border border-white/[0.06] px-3 py-1.5 rounded-full inline-block">
                Volume I · Autumn-Winter 2026
              </span>
              <h1 className="font-serif text-6xl font-light tracking-wide text-white leading-[1.05]">
                Welcome
                <br />
                <em className="font-semibold not-italic bg-gradient-to-br from-white to-neutral-400 bg-clip-text text-transparent">
                  back
                </em>{" "}
                <span className="font-light opacity-60">to the club.</span>
              </h1>
              <p className="text-[12px] text-neutral-500 font-light max-w-xs leading-relaxed">
                Your wardrobe, your orders, your AI fits — all waiting right
                here.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white/[0.025] backdrop-blur-2xl border border-white/[0.07] hover:border-white/[0.14] transition-all duration-500 group max-w-sm">
              <div className="flex items-start gap-3.5">
                <div className="p-2 rounded-xl bg-white/[0.04] border border-white/[0.06] group-hover:scale-105 transition-transform duration-300 shrink-0">
                  <Sparkles className="h-4 w-4 text-neutral-200" />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h4 className="text-[10px] font-semibold tracking-[0.25em] text-white font-mono">
                      AI SMART-FIT
                    </h4>
                    <span className="text-[8px] px-1.5 py-0.5 rounded bg-white/10 text-white font-mono animate-pulse">
                      BETA
                    </span>
                  </div>
                  <p className="text-[11px] text-neutral-500 font-light leading-relaxed">
                    Sign in to access your personal AI stylist — custom outfit
                    curation based on your body parameters.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between text-[9px] text-neutral-600 font-mono pt-2 border-t border-white/[0.04]">
              <span>© 2026 SNITCH CLOTHING CO.</span>
              <span>PRIVACY & COMPLIANCE</span>
            </div>
          </div>
        </div>

        {/* ══ RIGHT PANEL ══ */}
        <div className="w-full md:w-[48%] flex flex-col justify-center items-center py-8 px-6 sm:px-10 md:overflow-y-auto md:h-full relative">
          <div className="absolute top-1/3 right-1/3 w-72 h-72 rounded-full bg-white/[0.015] blur-[100px] pointer-events-none animate-pulse-slow" />
          <div className="absolute bottom-1/4 left-1/4 w-96 h-96 rounded-full bg-neutral-900/20 blur-[130px] pointer-events-none" />

          <div className="w-full max-w-[360px] space-y-5 relative z-10">
            {/* Brand */}
            <div className="text-center md:text-left space-y-1 stagger s1">
              <div className="flex items-center justify-center md:justify-start gap-2 text-white mb-3">
                <ShoppingBag className="h-4 w-4 stroke-[1.5]" />
                <span className="font-mono text-[13px] font-bold tracking-[0.5em] uppercase">
                  SNITCH
                </span>
              </div>
              <h2 className="font-serif text-3xl font-light tracking-wide text-white leading-tight">
                Welcome Back
              </h2>
              <p className="text-[11px] text-neutral-500 font-light leading-relaxed">
                Sign in to manage your orders and view personalized fits.
              </p>
            </div>

            {/* Alerts */}
            {reduxError && (
              <div className="p-3 rounded-xl bg-red-950/30 border border-red-900/40 flex items-start gap-2.5 text-red-300 text-[11px] animate-slideDown">
                <AlertCircle className="h-3.5 w-3.5 text-red-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold">Access Denied</span>
                  <p className="mt-0.5 font-light text-red-300/80">
                    {reduxError}
                  </p>
                </div>
              </div>
            )}
            {isSuccess && (
              <div className="p-3 rounded-xl bg-emerald-950/30 border border-emerald-900/40 flex items-start gap-2.5 text-emerald-300 text-[11px] animate-slideDown">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold">Verification Successful</span>
                  <p className="mt-0.5 font-light text-emerald-300/80">
                    Accessing your style panel…
                  </p>
                </div>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} noValidate className="space-y-3">
              {/* Email */}
              <div className="stagger s2 space-y-1.5">
                <label
                  className="text-[10px] font-mono tracking-[0.25em] text-neutral-500 uppercase"
                  htmlFor="email"
                >
                  Email
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-600 group-focus-within:text-white transition-colors duration-200">
                    <Mail className="h-3.5 w-3.5 stroke-[1.5]" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="name@domain.com"
                    className={`w-full bg-neutral-900/50 border rounded-xl py-3 pl-10 pr-4 text-xs text-white placeholder-neutral-700
                      focus:outline-none focus:ring-1 transition-all duration-200
                      ${
                        localErrors.email && touched.email
                          ? "border-red-800/70 focus:border-red-500 focus:ring-red-500/20"
                          : "border-neutral-800/60 focus:border-neutral-500 focus:ring-white/[0.06]"
                      }`}
                    value={formData.email}
                    onChange={handleChange}
                    onBlur={() => handleBlur("email")}
                  />
                </div>
                {localErrors.email && touched.email && (
                  <p className="text-[10px] text-red-400 flex items-center gap-1 animate-slideDown">
                    <span className="w-1 h-1 rounded-full bg-red-400 shrink-0" />
                    {localErrors.email}
                  </p>
                )}
              </div>

              {/* Password */}
              <div className="stagger s3 space-y-1.5">
                <div className="flex items-center justify-between">
                  <label
                    className="text-[10px] font-mono tracking-[0.25em] text-neutral-500 uppercase"
                    htmlFor="password"
                  >
                    Password
                  </label>
                  <Link
                    to="/forgot-password"
                    className="text-[9px] font-mono text-neutral-600 hover:text-neutral-300 transition-colors tracking-widest uppercase"
                  >
                    Forgot?
                  </Link>
                </div>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-600 group-focus-within:text-white transition-colors duration-200">
                    <Lock className="h-3.5 w-3.5 stroke-[1.5]" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className={`w-full bg-neutral-900/50 border rounded-xl py-3 pl-10 pr-10 text-xs text-white placeholder-neutral-700
                      focus:outline-none focus:ring-1 transition-all duration-200
                      ${
                        localErrors.password && touched.password
                          ? "border-red-800/70 focus:border-red-500 focus:ring-red-500/20"
                          : "border-neutral-800/60 focus:border-neutral-500 focus:ring-white/[0.06]"
                      }`}
                    value={formData.password}
                    onChange={handleChange}
                    onBlur={() => handleBlur("password")}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-neutral-600 hover:text-white transition-colors duration-200 focus:outline-none"
                    onClick={() => setShowPassword((v) => !v)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-3.5 w-3.5 stroke-[1.5]" />
                    ) : (
                      <Eye className="h-3.5 w-3.5 stroke-[1.5]" />
                    )}
                  </button>
                </div>
                {localErrors.password && touched.password && (
                  <p className="text-[10px] text-red-400 flex items-center gap-1 animate-slideDown">
                    <span className="w-1 h-1 rounded-full bg-red-400 shrink-0" />
                    {localErrors.password}
                  </p>
                )}
              </div>

              {/* Submit */}
              <div className="stagger s4 pt-1">
                <button
                  type="submit"
                  disabled={reduxLoading || isSuccess}
                  className="w-full bg-white hover:bg-neutral-100 text-black font-bold tracking-[0.2em] py-3.5 rounded-xl text-[10px] flex items-center justify-center gap-2 transition-all duration-300 disabled:opacity-50 disabled:pointer-events-none cursor-pointer btn-shimmer"
                >
                  {reduxLoading ? (
                    <>
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />{" "}
                      AUTHENTICATING…
                    </>
                  ) : isSuccess ? (
                    <>
                      <CheckCircle2 className="h-3.5 w-3.5" /> GRANTED
                    </>
                  ) : (
                    <>
                      SIGN IN <ArrowRight className="h-3.5 w-3.5" />
                    </>
                  )}
                </button>
              </div>
            </form>

            <p className="text-center text-[11px] text-neutral-600 font-light pt-1">
              New to SNITCH?{" "}
              <Link
                to="/register"
                className="text-neutral-300 hover:text-white underline underline-offset-4 transition-colors font-medium"
              >
                Create account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
