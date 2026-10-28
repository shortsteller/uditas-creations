import React, { useState, useEffect } from "react";
import { Sparkles, Phone, ChevronRight, Globe } from "lucide-react";
import { useCart, type Currency } from "@/lib/cart-context";
import { SITE, waLink } from "@/lib/site";

const ANNOUNCEMENTS = [
  "✨ FESTIVE EDIT: Flat 10% OFF with code UDITA10",
  "🚚 FREE Express Shipping on all Prepaid Orders above ₹799",
  "💎 100% Skin-Friendly, Nickel-Free & Anti-Tarnish Jewellery",
  "🎁 Bundle & Save: Any 3 Statement Earrings for just ₹999!",
];

export function AnnouncementBar() {
  const { currency, setCurrency } = useCart();
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % ANNOUNCEMENTS.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative z-50 bg-[#2A101C] text-[#F5EDE4] text-xs py-2 px-4 border-b border-[#3F192B]">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Support contact info */}
        <div className="hidden md:flex items-center gap-3 text-[11px] text-[#E0D0C4]">
          <a
            href={waLink("Hello Udita's Creation, I need help with an order.")}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 hover:text-white transition-colors"
          >
            <Phone className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>Support: {SITE.phone}</span>
          </a>
          <span className="text-[#55273D]">•</span>
          <span className="text-[#C4AFA0]">Pan-India & Global Express</span>
        </div>

        {/* Central rotating banner */}
        <div className="flex-1 text-center font-medium tracking-wide flex items-center justify-center gap-2 overflow-hidden min-h-[1.25rem]">
          <Sparkles className="w-3.5 h-3.5 text-[#D4AF37] flex-shrink-0 animate-pulse" />
          <span className="transition-all duration-500 ease-out inline-block">
            {ANNOUNCEMENTS[index]}
          </span>
        </div>

        {/* Currency Switcher */}
        <div className="flex items-center gap-2 text-[11px]">
          <div className="flex items-center gap-1 bg-[#1F0C15] px-2 py-0.5 rounded border border-[#3F192B]">
            <Globe className="w-3 h-3 text-[#D4AF37]" />
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value as Currency)}
              aria-label="Currency"
              className="bg-transparent text-white text-[11px] font-medium focus:outline-none cursor-pointer"
            >
              <option value="INR" className="bg-[#1F0C15] text-white">INR (₹)</option>
              <option value="USD" className="bg-[#1F0C15] text-white">USD ($)</option>
              <option value="EUR" className="bg-[#1F0C15] text-white">EUR (€)</option>
              <option value="GBP" className="bg-[#1F0C15] text-white">GBP (£)</option>
              <option value="AED" className="bg-[#1F0C15] text-white">AED (د.إ)</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}
