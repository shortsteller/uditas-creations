import React, { useState, useEffect } from "react";
import { Link } from "@tanstack/react-router";
import {
  Search,
  Heart,
  ShoppingBag,
  User,
  Menu,
  X,
  ChevronDown,
  Sparkles,
  Phone,
} from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { useAuth } from "@/lib/firebase";
import { AnnouncementBar } from "./announcement-bar";
import { CATEGORIES } from "@/lib/products";

export function SiteHeader({
  onOpenSearch,
  onOpenAuth,
  onOpenWishlist,
}: {
  onOpenSearch: () => void;
  onOpenAuth: () => void;
  onOpenWishlist?: () => void;
}) {
  const { cartCount, wishlistCount, setIsCartOpen, formatPrice, cartTotal } = useCart();
  const { user } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <AnnouncementBar />

      <header
        className={`sticky top-0 z-40 transition-all duration-300 ${
          scrolled
            ? "bg-[#FAF7F2]/95 backdrop-blur-md shadow-md border-b border-[#E8DFD5]"
            : "bg-[#FAF7F2] border-b border-[#EFE8DD]"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20 md:h-24">
            {/* Mobile Hamburger */}
            <div className="flex items-center lg:hidden">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 text-stone-700 hover:text-stone-900 rounded-lg"
                aria-label="Toggle Navigation Menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
              <button
                onClick={onOpenSearch}
                className="p-2 text-stone-700 hover:text-stone-900 rounded-lg ml-1"
                aria-label="Search items"
              >
                <Search className="w-5 h-5" />
              </button>
            </div>

            {/* Brand Logo */}
            <div className="flex-1 lg:flex-none text-center lg:text-left">
              <Link to="/" className="inline-block group">
                <span className="font-serif text-2xl md:text-3xl lg:text-4xl font-bold tracking-[0.12em] text-[#3B1425] block group-hover:text-[#521C34] transition-colors">
                  UDITAS CREATIONS
                </span>
                <span className="block text-[9px] md:text-[10px] uppercase tracking-[0.35em] text-[#C4683C] font-sans font-medium text-center">
                  Artisanal Junk & Fashion Jewellery
                </span>
              </Link>
            </div>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-7 text-[12px] uppercase tracking-[0.2em] font-semibold text-stone-800">
              <Link
                to="/"
                className="hover:text-[#C4683C] transition-colors py-1 relative group"
                activeProps={{ className: "text-[#C4683C]" }}
              >
                Home
              </Link>

              {/* Shop All with Categories Dropdown */}
              <div className="relative group py-2">
                <Link
                  to="/gallery"
                  className="hover:text-[#C4683C] transition-colors flex items-center gap-1"
                >
                  <span>Collections</span>
                  <ChevronDown className="w-3.5 h-3.5 text-stone-400 group-hover:text-[#C4683C] transition-transform group-hover:rotate-180" />
                </Link>

                {/* Dropdown Menu */}
                <div className="absolute top-full left-0 w-64 bg-white rounded-2xl shadow-xl border border-[#E8DFD5] p-3 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <div className="grid gap-1">
                    {CATEGORIES.map((cat) => (
                      <Link
                        key={cat.slug}
                        to="/gallery"
                        search={{ cat: cat.slug }}
                        className="p-2 rounded-lg text-xs font-medium text-stone-700 hover:text-[#3B1425] hover:bg-[#FAF7F2] transition-colors flex items-center justify-between"
                      >
                        <span>{cat.name}</span>
                        <span className="text-[10px] text-stone-400">{cat.itemCount}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>

              <Link
                to="/gallery"
                search={{ cat: "jhumkas" }}
                className="hover:text-[#C4683C] transition-colors py-1"
              >
                Earrings
              </Link>

              <Link
                to="/gallery"
                search={{ cat: "necklaces" }}
                className="hover:text-[#C4683C] transition-colors py-1"
              >
                Chokers
              </Link>

              <Link
                to="/gallery"
                search={{ cat: "bangles" }}
                className="hover:text-[#C4683C] transition-colors py-1"
              >
                Bangles
              </Link>

              <Link
                to="/gallery"
                search={{ cat: "combos" }}
                className="text-[#C4683C] hover:text-[#A8532A] transition-colors py-1 flex items-center gap-1"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>3 for ₹999</span>
              </Link>

              <Link
                to="/about"
                className="hover:text-[#C4683C] transition-colors py-1"
              >
                Our Story
              </Link>

              <Link
                to="/contact"
                className="hover:text-[#C4683C] transition-colors py-1"
              >
                Contact
              </Link>
            </nav>

            {/* Utility Action Icons */}
            <div className="flex items-center gap-1.5 md:gap-3">
              {/* Search Icon */}
              <button
                onClick={onOpenSearch}
                className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full border border-stone-300 text-stone-500 hover:text-[#3B1425] hover:border-[#3B1425] bg-white transition-colors text-xs"
                title="Search Jewelry (Ctrl + K)"
              >
                <Search className="w-3.5 h-3.5" />
                <span className="text-stone-400 text-[11px]">Search pieces...</span>
              </button>

              {/* User Account / Profile Modal Trigger */}
              <button
                onClick={onOpenAuth}
                className="p-2.5 rounded-full text-stone-700 hover:text-[#3B1425] hover:bg-[#F2ECE4] transition-colors relative"
                title={user ? `Signed in as ${user.displayName}` : "Sign In / Account"}
              >
                <User className="w-5 h-5" />
                {user && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-white" />
                )}
              </button>

              {/* Wishlist */}
              <button
                onClick={onOpenWishlist || onOpenAuth}
                className="p-2.5 rounded-full text-stone-700 hover:text-red-600 hover:bg-[#F2ECE4] transition-colors relative"
                title="Wishlist"
              >
                <Heart className="w-5 h-5" />
                {wishlistCount > 0 && (
                  <span className="absolute top-1 right-1 bg-red-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                    {wishlistCount}
                  </span>
                )}
              </button>

              {/* Cart Drawer Trigger */}
              <button
                onClick={() => setIsCartOpen(true)}
                className="flex items-center gap-2 p-2 sm:px-3.5 sm:py-2 rounded-full bg-[#3B1425] text-white hover:bg-[#280D19] transition-all shadow-md relative"
                title="Shopping Bag"
              >
                <ShoppingBag className="w-4 h-4 text-[#D4AF37]" />
                <span className="hidden sm:inline-block text-xs font-semibold">
                  Bag ({cartCount})
                </span>
                {cartCount > 0 && (
                  <span className="sm:hidden absolute -top-1 -right-1 bg-[#D4AF37] text-[#3B1425] text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white border-t border-[#E8DFD5] px-6 py-6 space-y-4 shadow-xl">
            <div className="grid gap-2 text-xs uppercase tracking-widest font-semibold text-stone-800">
              <Link
                to="/"
                onClick={() => setMobileMenuOpen(false)}
                className="py-2 border-b border-stone-100"
              >
                Home
              </Link>
              <Link
                to="/gallery"
                onClick={() => setMobileMenuOpen(false)}
                className="py-2 border-b border-stone-100"
              >
                All Collections
              </Link>
              <Link
                to="/gallery"
                search={{ cat: "jhumkas" }}
                onClick={() => setMobileMenuOpen(false)}
                className="py-2 border-b border-stone-100"
              >
                Jhumkas & Chandbalis
              </Link>
              <Link
                to="/gallery"
                search={{ cat: "necklaces" }}
                onClick={() => setMobileMenuOpen(false)}
                className="py-2 border-b border-stone-100"
              >
                Necklaces & Chokers
              </Link>
              <Link
                to="/gallery"
                search={{ cat: "bangles" }}
                onClick={() => setMobileMenuOpen(false)}
                className="py-2 border-b border-stone-100"
              >
                Bangles & Kadas
              </Link>
              <Link
                to="/gallery"
                search={{ cat: "rings" }}
                onClick={() => setMobileMenuOpen(false)}
                className="py-2 border-b border-stone-100"
              >
                Cocktail Rings
              </Link>
              <Link
                to="/gallery"
                search={{ cat: "bridal-sets" }}
                onClick={() => setMobileMenuOpen(false)}
                className="py-2 border-b border-stone-100"
              >
                Bridal & Festive Edit
              </Link>
              <Link
                to="/gallery"
                search={{ cat: "combos" }}
                onClick={() => setMobileMenuOpen(false)}
                className="py-2 text-[#C4683C] font-bold flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>3 for ₹999 Bundle Deals</span>
              </Link>
              <Link
                to="/about"
                onClick={() => setMobileMenuOpen(false)}
                className="py-2 border-b border-stone-100"
              >
                Our Kolkata Studio Story
              </Link>
              <Link
                to="/contact"
                onClick={() => setMobileMenuOpen(false)}
                className="py-2"
              >
                Customer Support
              </Link>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
