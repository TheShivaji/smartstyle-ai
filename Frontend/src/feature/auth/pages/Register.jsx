import React, { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../hook/useAuth";
import {
  User, Mail, Phone, Lock, Eye, EyeOff, Sparkles,
  ArrowRight, Loader2, ShoppingBag, CheckCircle2, AlertCircle,
  Store
} from "lucide-react";

/* ─── Password strength util ─────────────────────────────────── */
function getStrength(pw) {
  let score = 0;
  if (pw.length >= 6)  score++;
  if (pw.length >= 10) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^a-zA-Z0-9]/.test(pw)) score++;
  return score; // 0-5
}
const strengthMeta = [
  { label: "",         color: "bg-neutral-800" },
  { label: "Weak",     color: "bg-red-500" },
  { label: "Fair",     color: "bg-amber-500" },
  { label: "Good",     color: "bg-yellow-400" },
  { label: "Strong",   color: "bg-emerald-400" },
  { label: "fortress", color: "bg-emerald-300" },
];

/* ─── Floating-label input ────────────────────────────────────── */
function FloatInput({ id, name, type = "text", placeholder, value, onChange, onBlur,
  icon: Icon, error, touched, suffix }) {
  const [focused, setFocused] = useState(false);
  const filled = value.length > 0;
  const hasErr = error && touched;

  return (
    <div className="relative group" style={{ animationDelay: "var(--delay,0ms)" }}>
      {/* Icon */}
      <div className={`absolute left-3.5 top-1/2 -translate-y-1/2 transition-colors duration-200 pointer-events-none
        ${focused ? "text-white" : "text-neutral-600"}`}>
        <Icon className="h-3.5 w-3.5 stroke-[1.5]" />
      </div>

      {/* Floating label */}
      <label
        htmlFor={id}
        className={`absolute left-10 transition-all duration-200 pointer-events-none select-none
          ${(focused || filled)
            ? "top-1.5 text-[9px] tracking-widest font-semibold"
            : "top-1/2 -translate-y-1/2 text-[11px]"}
          ${hasErr
            ? "text-red-400"
            : focused
              ? "text-neutral-300"
              : "text-neutral-600"}`}
      >
        {placeholder}
      </label>

      {/* Input */}
      <input
        id={id}
        name={name}
        type={type}
        autoComplete="off"
        className={`w-full pt-5 pb-2 pl-10 pr-${suffix ? "10" : "4"} text-xs text-white
          bg-neutral-900/50 rounded-xl border transition-all duration-200
          focus:outline-none focus:ring-1
          ${hasErr
            ? "border-red-800/70 focus:border-red-500 focus:ring-red-500/20"
            : "border-neutral-800/60 focus:border-neutral-500 focus:ring-white/[0.06]"}`}
        value={value}
        onChange={onChange}
        onFocus={() => setFocused(true)}
        onBlur={() => { setFocused(false); onBlur(); }}
      />

      {suffix}

      {/* Error */}
      {hasErr && (
        <p className="mt-1 text-[10px] text-red-400 flex items-center gap-1 animate-slideDown">
          <span className="w-1 h-1 rounded-full bg-red-400 shrink-0" />
          {error}
        </p>
      )}
    </div>
  );
}

/* ─── Ticker tape (left panel) ───────────────────────────────── */
const tickerItems = [
  "FREE SHIPPING OVER ₹999", "NEW AW26 DROP", "AI SMART-FIT BETA",
  "OVERSIZED TEE ₹799", "CARGO PANTS ₹1499", "SIZE PREDICTOR LIVE",
];

function Ticker() {
  const doubled = [...tickerItems, ...tickerItems];
  return (
    <div className="overflow-hidden w-full border-y border-white/[0.04] py-2 mb-8">
      <div className="flex gap-10 whitespace-nowrap ticker-run text-[10px] tracking-[0.25em] font-medium text-neutral-500 uppercase">
        {doubled.map((t, i) => (
          <span key={i} className="shrink-0 flex items-center gap-3">
            <span className="w-1 h-1 rounded-full bg-neutral-600 inline-block" />
            {t}
          </span>
        ))}
      </div>
    </div>
  );
}

/* ─── Main component ──────────────────────────────────────────── */
export default function Register() {
  const navigate = useNavigate();
  const { signup } = useAuth();
  const { error: reduxError, loading: reduxLoading } = useSelector((s) => s.auth);

  const [formData, setFormData] = useState({
    fullName: "", email: "", password: "", contactNumber: "", isSeller: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [localErrors, setLocalErrors] = useState({});
  const [isSuccess, setIsSuccess] = useState(false);
  const [touched, setTouched] = useState({});

  const pwStrength = getStrength(formData.password);

  useEffect(() => { validateForm(); }, [formData, touched]);

  const validateForm = () => {
    const e = {};
    if (touched.fullName) {
      if (!formData.fullName.trim()) e.fullName = "Full name is required";
      else if (formData.fullName.trim().length < 3) e.fullName = "Min. 3 characters";
    }
    if (touched.email) {
      if (!formData.email) e.email = "Email is required";
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) e.email = "Invalid email address";
    }
    if (touched.password) {
      if (!formData.password) e.password = "Password is required";
      else if (formData.password.length < 6) e.password = "Min. 6 characters";
    }
    if (touched.contactNumber) {
      if (!formData.contactNumber) e.contactNumber = "Contact number is required";
      else if (!/^\d{10}$/.test(formData.contactNumber)) e.contactNumber = "Must be exactly 10 digits";
    }
    setLocalErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleBlur = (field) => setTouched(p => ({ ...p, [field]: true }));
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(p => ({ ...p, [name]: type === "checkbox" ? checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const allTouched = Object.keys(formData).reduce((a, k) => ({ ...a, [k]: true }), {});
    setTouched(allTouched);
    const invalid =
      !formData.fullName.trim() || formData.fullName.trim().length < 3 ||
      !formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email) ||
      !formData.password || formData.password.length < 6 ||
      !formData.contactNumber || !/^\d{10}$/.test(formData.contactNumber);
    if (invalid) return;
    const res = await signup(formData);
    if (res?.success) {
      setIsSuccess(true);
      setTimeout(() => navigate("/"), 3000);
    }
  };

  return (
    <>
      {/* ── Global styles (scoped) ── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,600;1,300;1,600&family=DM+Mono:wght@300;400&display=swap');

        .snitch-register { font-family: ui-sans-serif, system-ui, sans-serif; }
        .snitch-register .font-serif { font-family: 'Cormorant Garamond', Georgia, serif; }
        .snitch-register .font-mono  { font-family: 'DM Mono', monospace; }

        /* Grain texture overlay */
        .grain::after {
          content: '';
          position: absolute; inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.06'/%3E%3C/svg%3E");
          pointer-events: none; z-index: 5; mix-blend-mode: overlay;
        }

        /* Ticker */
        @keyframes tickerRun { from { transform: translateX(0) } to { transform: translateX(-50%) } }
        .ticker-run { animation: tickerRun 22s linear infinite; }

        /* Slide-down alert */
        @keyframes slideDown { from { opacity: 0; transform: translateY(-6px) } to { opacity: 1; transform: none } }
        .animate-slideDown { animation: slideDown 0.25s ease both; }

        /* Stagger-in form fields */
        @keyframes staggerIn { from { opacity: 0; transform: translateY(10px) } to { opacity: 1; transform: none } }
        .stagger { animation: staggerIn 0.4s cubic-bezier(.22,1,.36,1) both; }
        .stagger-1 { animation-delay: 60ms  }
        .stagger-2 { animation-delay: 120ms }
        .stagger-3 { animation-delay: 180ms }
        .stagger-4 { animation-delay: 240ms }
        .stagger-5 { animation-delay: 300ms }
        .stagger-6 { animation-delay: 360ms }

        /* Shimmer on submit button */
        @keyframes shimmer { from { left: -60% } to { left: 130% } }
        .btn-shimmer { position: relative; overflow: hidden; }
        .btn-shimmer::after {
          content: '';
          position: absolute; top: 0; width: 40%; height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.18), transparent);
          animation: shimmer 2.2s ease-in-out infinite;
        }

        /* Left panel drift */
        @keyframes drift { 0%,100%{transform:scale(1.04) translateX(0)} 50%{transform:scale(1.08) translateX(-10px)} }
        .animate-drift { animation: drift 18s ease-in-out infinite; }

        /* Soft pulse */
        @keyframes pulseSlow { 0%,100%{opacity:0.03} 50%{opacity:0.07} }
        .animate-pulse-slow { animation: pulseSlow 6s ease-in-out infinite; }

        /* Vertical badge */
        @keyframes vertScroll { from{transform:translateY(0)} to{transform:translateY(-50%)} }
        .vert-scroll { animation: vertScroll 12s linear infinite; }
      `}</style>

      <div className="snitch-register min-h-screen md:h-screen bg-neutral-950 flex flex-col md:flex-row overflow-y-auto md:overflow-hidden text-neutral-200">

        {/* ══ LEFT PANEL ══════════════════════════════════════════════ */}
        <div className="hidden md:flex md:w-[52%] relative bg-[#0c0c0c] items-end overflow-hidden grain">

          {/* Background image */}
          <div className="absolute inset-0 z-0 animate-drift">
            <img
              src="/fashion_bg.png"
              alt="Snitch editorial"
              className="w-full h-full object-cover opacity-55 contrast-[1.06]"
            />
          </div>

          {/* Gradient overlays */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0c0c0c] via-[#0c0c0c]/50 to-transparent z-10" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0c0c0c]/20 to-transparent z-10" />

          {/* Vertical scrolling badge (top-right) */}
          <div className="absolute top-0 right-6 z-20 overflow-hidden h-full w-5 flex items-start">
            <div className="vert-scroll flex flex-col gap-8 pt-10 text-[8px] tracking-[0.5em] text-neutral-600 font-mono rotate-180 [writing-mode:vertical-rl]">
              {["AW26", "SNITCH", "LIMITED", "AW26", "SNITCH", "LIMITED"].map((t, i) => (
                <span key={i}>{t}</span>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="relative z-20 w-full p-12 space-y-6">
            <Ticker />

            <div className="space-y-4">
              <span className="text-[9px] uppercase tracking-[0.4em] font-mono text-neutral-500 border border-white/[0.06] px-3 py-1.5 rounded-full inline-block">
                Volume I · Autumn-Winter 2026
              </span>
              <h1 className="font-serif text-6xl font-light tracking-wide text-white leading-[1.05]">
                Designed for<br />
                <em className="font-semibold not-italic bg-gradient-to-br from-white to-neutral-400 bg-clip-text text-transparent">
                  unapologetic
                </em>{" "}
                <span className="font-light opacity-60">style.</span>
              </h1>
              <p className="text-[12px] text-neutral-500 font-light max-w-xs leading-relaxed">
                Snitch is more than a label — it's a statement of individuality,
                crafted from premium fabrics for the modern streetwear vanguard.
              </p>
            </div>

            {/* AI Protocol card */}
            <div className="p-4 rounded-2xl bg-white/[0.025] backdrop-blur-2xl border border-white/[0.07] hover:border-white/[0.14] transition-all duration-500 group max-w-sm">
              <div className="flex items-start gap-3.5">
                <div className="p-2 rounded-xl bg-white/[0.04] border border-white/[0.06] group-hover:scale-105 transition-transform duration-300 shrink-0">
                  <Sparkles className="h-4 w-4 text-neutral-200" />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h4 className="text-[10px] font-semibold tracking-[0.25em] text-white font-mono">AI SMART-FIT</h4>
                    <span className="text-[8px] px-1.5 py-0.5 rounded bg-white/10 text-white font-mono animate-pulse">BETA</span>
                  </div>
                  <p className="text-[11px] text-neutral-500 font-light leading-relaxed">
                    Custom styled streetwear recommendations matched to your precise body parameters — automatically.
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

        {/* ══ RIGHT PANEL — FORM ══════════════════════════════════════ */}
        <div className="w-full md:w-[48%] flex flex-col justify-center items-center py-8 px-6 sm:px-10 md:overflow-y-auto md:h-full relative">
          {/* Subtle background image for the form panel */}
          <div className="absolute inset-0 z-0 opacity-[0.12] md:opacity-[0.08] pointer-events-none mix-blend-luminosity">
            <img src="/fashion_bg.png" alt="background texture" className="w-full h-full object-cover" />
          </div>
          {/* Overlay to ensure text readability */}
          <div className="absolute inset-0 bg-neutral-950/80 backdrop-blur-[2px] z-0" />

          {/* Ambient blobs */}
          <div className="absolute top-1/3 right-1/3 w-72 h-72 rounded-full bg-white/[0.015] blur-[100px] pointer-events-none animate-pulse-slow z-0" />
          <div className="absolute bottom-1/4 left-1/4 w-96 h-96 rounded-full bg-neutral-900/20 blur-[130px] pointer-events-none z-0" />

          <div className="w-full max-w-[360px] space-y-5 relative z-10">

            {/* Brand header */}
            <div className="text-center md:text-left space-y-1 stagger stagger-1">
              <div className="flex items-center justify-center md:justify-start gap-2 text-white mb-3">
                <ShoppingBag className="h-4 w-4 stroke-[1.5]" />
                <span className="font-mono text-[13px] font-bold tracking-[0.5em] uppercase">SNITCH</span>
              </div>
              <h2 className="font-serif text-3xl font-light tracking-wide text-white leading-tight">
                Begin Your Journey
              </h2>
              <p className="text-[11px] text-neutral-500 font-light leading-relaxed">
                Create an account to unlock AI sizing and track your orders.
              </p>
            </div>

            {/* Alerts */}
            {reduxError && (
              <div className="p-3 rounded-xl bg-red-950/30 border border-red-900/40 flex items-start gap-2.5 text-red-300 text-[11px] animate-slideDown">
                <AlertCircle className="h-3.5 w-3.5 text-red-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold">Registration Failed</span>
                  <p className="mt-0.5 font-light text-red-300/80">{reduxError}</p>
                </div>
              </div>
            )}
            {isSuccess && (
              <div className="p-3 rounded-xl bg-emerald-950/30 border border-emerald-900/40 flex items-start gap-2.5 text-emerald-300 text-[11px] animate-slideDown">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold">Welcome to the Club</span>
                  <p className="mt-0.5 font-light text-emerald-300/80">Account created. Preparing your profile…</p>
                </div>
              </div>
            )}

            {/* ── Form ── */}
            <form onSubmit={handleSubmit} noValidate className="space-y-3">

              {/* Full Name */}
              <div className="stagger stagger-2">
                <FloatInput
                  id="fullName" name="fullName" type="text"
                  placeholder="Full Name"
                  value={formData.fullName}
                  onChange={handleChange}
                  onBlur={() => handleBlur("fullName")}
                  icon={User}
                  error={localErrors.fullName}
                  touched={touched.fullName}
                />
              </div>

              {/* Email */}
              <div className="stagger stagger-3">
                <FloatInput
                  id="email" name="email" type="email"
                  placeholder="Email Address"
                  value={formData.email}
                  onChange={handleChange}
                  onBlur={() => handleBlur("email")}
                  icon={Mail}
                  error={localErrors.email}
                  touched={touched.email}
                />
              </div>

              {/* Contact */}
              <div className="stagger stagger-4">
                <FloatInput
                  id="contactNumber" name="contactNumber" type="tel"
                  placeholder="Mobile Number"
                  value={formData.contactNumber}
                  onChange={handleChange}
                  onBlur={() => handleBlur("contactNumber")}
                  icon={Phone}
                  error={localErrors.contactNumber}
                  touched={touched.contactNumber}
                />
              </div>

              {/* Password + strength */}
              <div className="stagger stagger-5">
                <FloatInput
                  id="password" name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                  onBlur={() => handleBlur("password")}
                  icon={Lock}
                  error={localErrors.password}
                  touched={touched.password}
                  suffix={
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-white transition-colors duration-200 focus:outline-none"
                      onClick={() => setShowPassword(v => !v)}
                    >
                      {showPassword
                        ? <EyeOff className="h-3.5 w-3.5 stroke-[1.5]" />
                        : <Eye    className="h-3.5 w-3.5 stroke-[1.5]" />}
                    </button>
                  }
                />

                {/* Strength bar — only show if user has typed */}
                {formData.password.length > 0 && (
                  <div className="mt-2 space-y-1 animate-slideDown">
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map(i => (
                        <div
                          key={i}
                          className={`h-0.5 flex-1 rounded-full transition-all duration-300 ${
                            pwStrength >= i
                              ? strengthMeta[Math.min(pwStrength, 5)].color
                              : "bg-neutral-800"
                          }`}
                        />
                      ))}
                    </div>
                    <p className="text-[9px] text-neutral-500 font-mono tracking-widest uppercase">
                      {strengthMeta[Math.min(pwStrength, 5)].label}
                    </p>
                  </div>
                )}
              </div>

              {/* Account type */}
              <div className="stagger stagger-6 space-y-1.5 pt-1">
                <span className="text-[9px] font-mono tracking-[0.3em] text-neutral-500 uppercase">Account type</span>
                <div className="grid grid-cols-2 gap-1 bg-neutral-900/40 p-1 rounded-xl border border-neutral-800/50">
                  {[
                    { label: "Buyer",  icon: ShoppingBag, value: false },
                    { label: "Seller", icon: Store,       value: true  },
                  ].map(({ label, icon: Icon, value }) => (
                    <button
                      key={label}
                      type="button"
                      onClick={() => setFormData(p => ({ ...p, isSeller: value }))}
                      className={`py-2.5 rounded-lg text-[10px] font-bold tracking-widest transition-all duration-300 flex items-center justify-center gap-1.5 cursor-pointer
                        ${formData.isSeller === value
                          ? "bg-white text-black shadow-sm"
                          : "text-neutral-500 hover:text-neutral-300 hover:bg-white/[0.03]"}`}
                    >
                      <Icon className="h-3 w-3 stroke-[2]" />
                      {label.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={reduxLoading || isSuccess}
                className="w-full mt-2 bg-white hover:bg-neutral-100 text-black font-bold tracking-[0.2em] py-3.5 rounded-xl text-[10px] flex items-center justify-center gap-2 transition-all duration-300 disabled:opacity-50 disabled:pointer-events-none cursor-pointer btn-shimmer"
              >
                {reduxLoading ? (
                  <><Loader2 className="h-3.5 w-3.5 animate-spin" /> CREATING PROFILE…</>
                ) : isSuccess ? (
                  <><CheckCircle2 className="h-3.5 w-3.5" /> SUCCESS</>
                ) : (
                  <>CREATE ACCOUNT <ArrowRight className="h-3.5 w-3.5" /></>
                )}
              </button>
            </form>

            {/* Footer link */}
            <p className="text-center text-[11px] text-neutral-600 font-light pt-1">
              Already registered?{" "}
              <Link to="/login" className="text-neutral-300 hover:text-white underline underline-offset-4 transition-colors font-medium">
                Access account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}