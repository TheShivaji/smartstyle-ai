import React from "react";
import { MapPin, CreditCard, CheckCircle2, Loader2 } from "lucide-react";

export default function ShippingAddressForm({ addressForm, onChange, onSubmit, loading }) {
  return (
    <div className="p-6 rounded-2xl bg-[#0c0c0c]/85 border border-neutral-900 space-y-6">
      <div className="flex items-center gap-2 border-b border-neutral-900 pb-3">
        <MapPin className="h-4 w-4 text-neutral-400" />
        <h2 className="text-lg font-serif font-light text-white tracking-wide">
          Shipping Address
        </h2>
      </div>

      <form onSubmit={onSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-[10px] font-mono tracking-wider text-neutral-500 uppercase">
              Full Name *
            </label>
            <input
              type="text"
              name="fullName"
              value={addressForm.fullName}
              onChange={onChange}
              required
              className="w-full bg-neutral-900/40 border border-neutral-800 focus:border-neutral-500 rounded-xl px-4 py-2.5 text-xs text-white placeholder-neutral-600 focus:outline-none focus:ring-1 focus:ring-neutral-700 transition-all"
              placeholder="John Doe"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] font-mono tracking-wider text-neutral-500 uppercase">
              Mobile Number *
            </label>
            <input
              type="tel"
              name="mobileNo"
              value={addressForm.mobileNo}
              onChange={onChange}
              required
              className="w-full bg-neutral-900/40 border border-neutral-800 focus:border-neutral-500 rounded-xl px-4 py-2.5 text-xs text-white placeholder-neutral-600 focus:outline-none focus:ring-1 focus:ring-neutral-700 transition-all"
              placeholder="10-digit number"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-[10px] font-mono tracking-wider text-neutral-500 uppercase">
            Email Address
          </label>
          <input
            type="email"
            name="email"
            value={addressForm.email}
            onChange={onChange}
            className="w-full bg-neutral-900/40 border border-neutral-800 focus:border-neutral-500 rounded-xl px-4 py-2.5 text-xs text-white placeholder-neutral-600 focus:outline-none focus:ring-1 focus:ring-neutral-700 transition-all"
            placeholder="john@example.com (optional)"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-[10px] font-mono tracking-wider text-neutral-500 uppercase">
            Street Address *
          </label>
          <input
            type="text"
            name="address"
            value={addressForm.address}
            onChange={onChange}
            required
            className="w-full bg-neutral-900/40 border border-neutral-800 focus:border-neutral-500 rounded-xl px-4 py-2.5 text-xs text-white placeholder-neutral-600 focus:outline-none focus:ring-1 focus:ring-neutral-700 transition-all"
            placeholder="Flat, House no., Building, Company, Apartment"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-[10px] font-mono tracking-wider text-neutral-500 uppercase">
            Landmark
          </label>
          <input
            type="text"
            name="landmark"
            value={addressForm.landmark}
            onChange={onChange}
            className="w-full bg-neutral-900/40 border border-neutral-800 focus:border-neutral-500 rounded-xl px-4 py-2.5 text-xs text-white placeholder-neutral-600 focus:outline-none focus:ring-1 focus:ring-neutral-700 transition-all"
            placeholder="e.g. Near Apollo Hospital (optional)"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-1.5">
            <label className="text-[10px] font-mono tracking-wider text-neutral-500 uppercase">
              Town/City *
            </label>
            <input
              type="text"
              name="city"
              value={addressForm.city}
              onChange={onChange}
              required
              className="w-full bg-neutral-900/40 border border-neutral-800 focus:border-neutral-500 rounded-xl px-4 py-2.5 text-xs text-white placeholder-neutral-600 focus:outline-none focus:ring-1 focus:ring-neutral-700 transition-all"
              placeholder="Mumbai"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] font-mono tracking-wider text-neutral-500 uppercase">
              State *
            </label>
            <input
              type="text"
              name="state"
              value={addressForm.state}
              onChange={onChange}
              required
              className="w-full bg-neutral-900/40 border border-neutral-800 focus:border-neutral-500 rounded-xl px-4 py-2.5 text-xs text-white placeholder-neutral-600 focus:outline-none focus:ring-1 focus:ring-neutral-700 transition-all"
              placeholder="Maharashtra"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] font-mono tracking-wider text-neutral-500 uppercase">
              Pincode *
            </label>
            <input
              type="text"
              name="pincode"
              value={addressForm.pincode}
              onChange={onChange}
              required
              className="w-full bg-neutral-900/40 border border-neutral-800 focus:border-neutral-500 rounded-xl px-4 py-2.5 text-xs text-white placeholder-neutral-600 focus:outline-none focus:ring-1 focus:ring-neutral-700 transition-all"
              placeholder="6 digits"
            />
          </div>
        </div>

        <div className="pt-6 border-t border-neutral-900">
          <div className="flex items-center gap-2 mb-4">
            <CreditCard className="h-4 w-4 text-neutral-400" />
            <h2 className="text-lg font-serif font-light text-white tracking-wide">
              Payment Method
            </h2>
          </div>

          <div className="p-4 rounded-xl border border-neutral-800 bg-neutral-900/20 flex items-center justify-between cursor-pointer">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="h-4 w-4 text-white" />
              <div>
                <p className="text-xs font-mono font-semibold text-white">
                  CASH ON DELIVERY (COD)
                </p>
                <p className="text-[10px] text-neutral-500 font-light mt-0.5">
                  Pay in cash or UPI scan when your courier arrives.
                </p>
              </div>
            </div>
            <span className="text-[10px] font-mono tracking-wider bg-neutral-850 px-2 py-0.5 rounded text-neutral-400 uppercase">
              COD
            </span>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full mt-6 py-3.5 rounded-xl bg-white text-black hover:bg-neutral-200 transition-all font-mono text-xs font-bold tracking-wider cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {loading ? (
            <>
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
              PLACING ORDER...
            </>
          ) : (
            "PLACE ORDER (COD)"
          )}
        </button>
      </form>
    </div>
  );
}
