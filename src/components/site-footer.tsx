import React, { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Phone, Mail, MapPin, Sparkles, Send, ShieldCheck, RefreshCw, Heart } from "lucide-react";
import { SITE, waLink } from "@/lib/site";
import { toast } from "sonner";

export function SiteFooter({ onOpenTrackOrder }: { onOpenTrackOrder?: () => void }) {
  const [email, setEmail] = useState("");

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    toast.success("Welcome to the Uditas Family! 🎉", {
      description: "Use coupon code 'UDITA10' on your first order for 10% OFF.",
    });
    setEmail("");
  };

  return (
    <footer className="bg-[#1A0B13] text-[#F5EDE4] pt-16 pb-10 border-t border-[#311624]">
      {/* Value Proposition Highlights */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 border-b border-[#2D1420]">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center md:text-left">
          <div className="flex flex-col md:flex-row items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-[#2A101D] text-[#D4AF37] flex items-center justify-center flex-shrink-0 border border-[#3E1A2D]">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-serif text-base font-semibold text-white">Small-Batch Artisanal</h4>
              <p className="text-xs text-[#BFA89B] mt-0.5">Handcrafted in our Kolkata atelier</p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-[#2A101D] text-[#D4AF37] flex items-center justify-center flex-shrink-0 border border-[#3E1A2D]">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-serif text-base font-semibold text-white">100% Skin-Friendly</h4>
              <p className="text-xs text-[#BFA89B] mt-0.5">Nickel-free & anti-tarnish micro plating</p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-[#2A101D] text-[#D4AF37] flex items-center justify-center flex-shrink-0 border border-[#3E1A2D]">
              <RefreshCw className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-serif text-base font-semibold text-white">7-Day Easy Exchange</h4>
              <p className="text-xs text-[#BFA89B] mt-0.5">Hassle-free replacement policy</p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-[#2A101D] text-[#D4AF37] flex items-center justify-center flex-shrink-0 border border-[#3E1A2D]">
              <Phone className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-serif text-base font-semibold text-white">Direct WhatsApp Care</h4>
              <p className="text-xs text-[#BFA89B] mt-0.5">Personal styling & customisation help</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-4">
            <span className="font-serif text-2xl font-bold tracking-[0.15em] text-white block">
              UDITAS CREATIONS
            </span>
            <p className="text-xs text-[#C7B5AA] leading-relaxed max-w-sm">
              Rooted in the timeless artisan heritage of Bengal, UDITAS CREATIONS brings you modern bohemian, oxidised silver, temple, and polki statement jewelry — designed to make every occasion memorable.
            </p>

            <div className="pt-2 text-xs text-[#D8C4B8] space-y-1.5">
              <p className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#D4AF37] flex-shrink-0" />
                <span>{SITE.address}</span>
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#D4AF37] flex-shrink-0" />
                <a href={waLink()} target="_blank" rel="noopener noreferrer" className="hover:text-white">
                  {SITE.phone} (WhatsApp Orders & Support)
                </a>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#D4AF37] flex-shrink-0" />
                <a href={`mailto:${SITE.email}`} className="hover:text-white">
                  {SITE.email}
                </a>
              </p>
            </div>
          </div>

          {/* Categories */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase tracking-[0.25em] font-bold text-[#D4AF37]">
              Shop Jewellery
            </h4>
            <ul className="space-y-2 text-xs text-[#C7B5AA]">
              <li>
                <Link to="/gallery" search={{ cat: "jhumkas" }} className="hover:text-white transition-colors">
                  Jhumkas & Chandbalis
                </Link>
              </li>
              <li>
                <Link to="/gallery" search={{ cat: "necklaces" }} className="hover:text-white transition-colors">
                  Necklaces & Chokers
                </Link>
              </li>
              <li>
                <Link to="/gallery" search={{ cat: "bangles" }} className="hover:text-white transition-colors">
                  Bangles & Kadas
                </Link>
              </li>
              <li>
                <Link to="/gallery" search={{ cat: "rings" }} className="hover:text-white transition-colors">
                  Cocktail Rings
                </Link>
              </li>
              <li>
                <Link to="/gallery" search={{ cat: "anklets" }} className="hover:text-white transition-colors">
                  Ghungroo Payal
                </Link>
              </li>
              <li>
                <Link to="/gallery" search={{ cat: "bridal-sets" }} className="hover:text-white transition-colors">
                  Bridal & Festive Sets
                </Link>
              </li>
              <li>
                <Link to="/gallery" search={{ cat: "combos" }} className="text-[#C4683C] font-semibold hover:text-white transition-colors">
                  ✨ 3 for ₹999 Combos
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Care */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase tracking-[0.25em] font-bold text-[#D4AF37]">
              Customer Care
            </h4>
            <ul className="space-y-2 text-xs text-[#C7B5AA]">
              <li>
                {onOpenTrackOrder ? (
                  <button onClick={onOpenTrackOrder} className="hover:text-white transition-colors text-left">
                    Track Your Order
                  </button>
                ) : (
                  <Link to="/contact" className="hover:text-white transition-colors">
                    Track Order Status
                  </Link>
                )}
              </li>
              <li>
                <Link to="/about" className="hover:text-white transition-colors">
                  Shipping & Delivery Info
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-white transition-colors">
                  7-Day Return & Exchange
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-white transition-colors">
                  Jewelry Care Guide
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-white transition-colors">
                  Contact Studio
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase tracking-[0.25em] font-bold text-[#D4AF37]">
              Join The Club
            </h4>
            <p className="text-xs text-[#BFA89B]">
              Subscribe for VIP festive previews, secret discounts, and new collection drops.
            </p>
            <form onSubmit={handleSubscribe} className="space-y-2">
              <div className="flex gap-1.5">
                <input
                  type="email"
                  placeholder="Your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="flex-1 px-3 py-2 bg-[#250F1A] border border-[#3E1A2D] rounded-lg text-xs text-white placeholder:text-stone-500 focus:outline-none focus:border-[#D4AF37]"
                />
                <button
                  type="submit"
                  className="px-3 py-2 bg-[#D4AF37] text-[#1A0B13] rounded-lg hover:bg-[#E5C378] transition-colors"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
              <span className="text-[10px] text-[#A68F82] block">
                Get 10% off coupon instantly on sign up.
              </span>
            </form>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 border-t border-[#2D1420] flex flex-col md:flex-row items-center justify-between gap-4 text-[11px] text-[#9D887C]">
        <p>© {new Date().getFullYear()} UDITAS CREATIONS. All rights reserved. Handcrafted with passion in India.</p>
        <div className="flex items-center gap-3">
          <span>Accepted Payments: UPI • Visa • RuPay • Mastercard • NetBanking • COD</span>
        </div>
      </div>
    </footer>
  );
}
