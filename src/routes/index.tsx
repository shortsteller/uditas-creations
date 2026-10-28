import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Sparkles,
  Star,
  Heart,
  Eye,
  ShoppingBag,
  ShieldCheck,
  Truck,
  RefreshCw,
  Gift,
  Check,
} from "lucide-react";
import hero from "@/assets/hero.jpg";
import { CATEGORIES, PRODUCTS, type Product } from "@/lib/products";
import { useCart } from "@/lib/cart-context";
import { BundleBuilder } from "@/components/bundle-builder";
import { QuickViewModal } from "@/components/quick-view-modal";
import { waLink } from "@/lib/site";

export const Route = createFileRoute("/")({
  component: IndexPage,
});

export function IndexPage() {
  const { addToCart, toggleWishlist, isInWishlist, formatPrice } = useCart();
  const [activeTab, setActiveTab] = useState<"bestsellers" | "new" | "trending">("bestsellers");
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  const displayedProducts = PRODUCTS.filter((p) => {
    if (activeTab === "bestsellers") return p.bestSeller;
    if (activeTab === "new") return p.newArrival;
    return p.trending || p.rating >= 4.9;
  }).slice(0, 8);

  const customerTestimonials = [
    {
      name: "Roshni Sen",
      city: "Kolkata",
      quote:
        "The Royal Rajwada Jhumkas are breathtaking. Lightweight enough to dance all evening without my earlobes aching, and the gold micro-polish looked authentic!",
      product: "Royal Rajwada Temple Jhumkas",
      rating: 5,
    },
    {
      name: "Tanya Kapoor",
      city: "Mumbai",
      quote:
        "Ordered the Meher Emerald Choker for my engagement. The hydro glass emerald beads have such a deep, royal glow. Got infinite compliments!",
      product: "Meher Emerald Kundan Choker",
      rating: 5,
    },
    {
      name: "Dr. Pallavi Verma",
      city: "Bengaluru",
      quote:
        "The '3 for ₹999' combo box is the best deal ever. High quality, zero allergic reaction, and packed so beautifully with individual velvet pouches.",
      product: "Trio Glam Box",
      rating: 5,
    },
  ];

  return (
    <div className="overflow-hidden">
      {/* 1. HERO SECTION */}
      <section className="relative bg-[#FAF7F2] overflow-hidden pt-6 pb-16 md:pt-10 md:pb-24 border-b border-[#E8DFD5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="lg:col-span-7 space-y-6 text-center lg:text-left"
            >
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#3B1425]/10 border border-[#3B1425]/20 text-[#3B1425] text-xs uppercase tracking-[0.25em] font-semibold">
                <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>The Royal Festive Edit 2026</span>
              </div>

              <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-bold text-stone-900 leading-[1.08] tracking-tight">
                Artisanal Jewelry <br />
                <span className="italic font-normal text-[#C4683C]">Handcrafted</span> for Modern Royalty.
              </h1>

              <p className="text-base sm:text-lg text-stone-600 max-w-xl mx-auto lg:mx-0 leading-relaxed font-normal">
                Born in our Kolkata atelier, UDITAS CREATIONS celebrates Indian heritage with modern bohemian flair. Statement jhumkas, regal kundan chokers, and oxidised treasures — skin-friendly, nickel-free, and heirloom-worthy.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <Link
                  to="/gallery"
                  className="w-full sm:w-auto px-8 py-4 bg-[#3B1425] text-white rounded-full text-xs uppercase tracking-[0.25em] font-bold shadow-xl hover:bg-[#280D19] hover:shadow-2xl hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 group"
                >
                  <span>Explore Collections</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>

                <Link
                  to="/gallery"
                  search={{ cat: "combos" }}
                  className="w-full sm:w-auto px-8 py-4 bg-white border border-[#3B1425] text-[#3B1425] rounded-full text-xs uppercase tracking-[0.25em] font-bold shadow-sm hover:bg-[#FAF7F2] transition-all flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-4 h-4 text-[#C4683C]" />
                  <span>Build 3 for ₹999 Box</span>
                </Link>
              </div>

              {/* Trust Indicators */}
              <div className="pt-6 border-t border-stone-200/80 grid grid-cols-3 gap-4 text-center lg:text-left">
                <div>
                  <strong className="block font-serif text-2xl font-bold text-stone-900">100%</strong>
                  <span className="text-xs text-stone-500">Nickel-Free & Safe</span>
                </div>
                <div>
                  <strong className="block font-serif text-2xl font-bold text-stone-900">50,000+</strong>
                  <span className="text-xs text-stone-500">Happy Queens Styled</span>
                </div>
                <div>
                  <strong className="block font-serif text-2xl font-bold text-stone-900">COD</strong>
                  <span className="text-xs text-stone-500">Available Pan-India</span>
                </div>
              </div>
            </motion.div>

            {/* Right Visual Image */}
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.9, delay: 0.1 }}
              className="lg:col-span-5 relative"
            >
              <div className="relative mx-auto max-w-md lg:max-w-none">
                <div className="absolute -inset-4 bg-gradient-to-tr from-[#3B1425]/15 via-[#D4AF37]/20 to-transparent rounded-[2.5rem] blur-2xl -z-10" />

                <div className="aspect-[4/5] rounded-[2rem] overflow-hidden border border-[#E8DFD5] shadow-2xl bg-stone-100 relative">
                  <img
                    src={hero}
                    alt="UDITAS CREATIONS Artisanal Jewelry Model"
                    className="w-full h-full object-cover object-center"
                  />

                  {/* Floating Highlight Card */}
                  <div className="absolute bottom-5 left-5 right-5 bg-white/95 backdrop-blur-md p-4 rounded-2xl border border-stone-200 shadow-xl flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-1 text-[#D4AF37] mb-0.5">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 fill-current" />
                        ))}
                      </div>
                      <p className="font-serif text-sm font-bold text-stone-900">
                        Rajwada Heritage Collection
                      </p>
                      <p className="text-[11px] text-stone-500">Starting from ₹549 only</p>
                    </div>
                    <Link
                      to="/gallery"
                      search={{ cat: "jhumkas" }}
                      className="p-2.5 bg-[#3B1425] text-white rounded-full hover:bg-[#280D19]"
                    >
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 2. SHOP BY CATEGORY CIRCULAR / CARD GRID */}
      <section className="py-16 bg-white border-b border-[#E8DFD5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
            <div>
              <span className="text-xs uppercase tracking-[0.25em] text-[#C4683C] font-semibold block mb-1">
                Explore The Taxonomy
              </span>
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-stone-900">
                Curated Collections
              </h2>
            </div>
            <Link
              to="/gallery"
              className="text-xs uppercase tracking-widest font-semibold text-[#3B1425] hover:text-[#C4683C] transition-colors mt-2 md:mt-0 flex items-center gap-1.5"
            >
              <span>View All 8 Collections</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
            {CATEGORIES.slice(0, 10).map((cat) => (
              <Link
                key={cat.slug}
                to="/gallery"
                search={{ cat: cat.slug }}
                className="group flex flex-col items-center text-center p-3 rounded-2xl border border-stone-100 hover:border-[#E8DFD5] hover:bg-[#FAF7F2] transition-all"
              >
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden border-2 border-[#E8DFD5] group-hover:border-[#3B1425] p-1 transition-all duration-300 relative shadow-sm mb-3">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-full object-cover rounded-full group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <h3 className="font-serif text-sm md:text-base font-bold text-stone-900 group-hover:text-[#3B1425] transition-colors">
                  {cat.name}
                </h3>
                <span className="text-[11px] text-stone-400 mt-0.5">
                  {cat.itemCount} Designs
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 3. CURATED TABS: BESTSELLERS / NEW ARRIVALS / TRENDING */}
      <section className="py-16 md:py-20 bg-[#FAF7F2] border-b border-[#E8DFD5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-10">
            <span className="text-xs uppercase tracking-[0.25em] text-[#C4683C] font-semibold block mb-1">
              Handcrafted Treasures
            </span>
            <h2 className="font-serif text-3xl md:text-5xl font-bold text-stone-900">
              Most Loved Pieces
            </h2>

            {/* Filter Tabs */}
            <div className="flex justify-center gap-2 mt-6 p-1 bg-white rounded-full border border-stone-200 inline-flex shadow-sm">
              <button
                onClick={() => setActiveTab("bestsellers")}
                className={`px-5 py-2 rounded-full text-xs uppercase tracking-wider font-semibold transition-all ${
                  activeTab === "bestsellers"
                    ? "bg-[#3B1425] text-white shadow-sm"
                    : "text-stone-600 hover:text-black"
                }`}
              >
                Bestsellers
              </button>
              <button
                onClick={() => setActiveTab("new")}
                className={`px-5 py-2 rounded-full text-xs uppercase tracking-wider font-semibold transition-all ${
                  activeTab === "new"
                    ? "bg-[#3B1425] text-white shadow-sm"
                    : "text-stone-600 hover:text-black"
                }`}
              >
                New In
              </button>
              <button
                onClick={() => setActiveTab("trending")}
                className={`px-5 py-2 rounded-full text-xs uppercase tracking-wider font-semibold transition-all ${
                  activeTab === "trending"
                    ? "bg-[#3B1425] text-white shadow-sm"
                    : "text-stone-600 hover:text-black"
                }`}
              >
                Trending Now
              </button>
            </div>
          </div>

          {/* Product Cards Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {displayedProducts.map((product) => {
              const inWishlist = isInWishlist(product.id);
              return (
                <div
                  key={product.id}
                  className="group bg-white rounded-2xl border border-[#EBE4DA] overflow-hidden shadow-sm hover:shadow-xl hover:border-[#D5C7B7] transition-all flex flex-col justify-between"
                >
                  {/* Image Container with Hover Swap */}
                  <div className="aspect-[4/4.5] overflow-hidden relative bg-stone-100">
                    <Link to="/product/$id" params={{ id: product.id }} className="block w-full h-full">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      {product.secondaryImage && (
                        <img
                          src={product.secondaryImage}
                          alt={product.name}
                          className="w-full h-full object-cover absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                        />
                      )}
                    </Link>

                    {/* Badges */}
                    <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 pointer-events-none">
                      {product.bestSeller && (
                        <span className="bg-[#3B1425] text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow">
                          Bestseller
                        </span>
                      )}
                      {product.mrp > product.price && (
                        <span className="bg-[#C4683C] text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider shadow">
                          -{Math.round(((product.mrp - product.price) / product.mrp) * 100)}%
                        </span>
                      )}
                    </div>

                    {/* Quick Action Overlays */}
                    <div className="absolute top-2.5 right-2.5 flex flex-col gap-1.5 opacity-90 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => toggleWishlist(product)}
                        className={`p-2 rounded-full shadow-md backdrop-blur-sm transition-all ${
                          inWishlist
                            ? "bg-red-50 text-red-500"
                            : "bg-white/90 text-stone-700 hover:text-red-500"
                        }`}
                        title={inWishlist ? "Saved in Wishlist" : "Save to Wishlist"}
                      >
                        <Heart className={`w-4 h-4 ${inWishlist ? "fill-current" : ""}`} />
                      </button>

                      <button
                        onClick={() => setQuickViewProduct(product)}
                        className="p-2 rounded-full bg-white/90 text-stone-700 hover:text-black shadow-md backdrop-blur-sm transition-all"
                        title="Quick View"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-4 flex flex-col flex-1 justify-between">
                    <div>
                      <span className="text-[10px] uppercase tracking-widest text-[#C4683C] font-semibold">
                        {product.categoryName}
                      </span>
                      <Link
                        to="/product/$id"
                        params={{ id: product.id }}
                        className="font-serif text-base font-semibold text-stone-900 group-hover:text-[#3B1425] transition-colors line-clamp-1 block mt-0.5"
                      >
                        {product.name}
                      </Link>

                      {/* Rating */}
                      <div className="flex items-center gap-1.5 mt-1.5">
                        <div className="flex text-[#D4AF37]">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star key={i} className="w-3 h-3 fill-current" />
                          ))}
                        </div>
                        <span className="text-[11px] text-stone-400">
                          ({product.reviewsCount})
                        </span>
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between">
                      <div>
                        <span className="font-serif text-lg font-bold text-stone-900">
                          {formatPrice(product.price)}
                        </span>
                        {product.mrp > product.price && (
                          <span className="text-xs text-stone-400 line-through ml-1.5">
                            {formatPrice(product.mrp)}
                          </span>
                        )}
                      </div>

                      <button
                        onClick={() => addToCart(product, 1, product.colors[0])}
                        className="p-2 rounded-full bg-[#FAF7F2] text-[#3B1425] hover:bg-[#3B1425] hover:text-white border border-[#E8DFD5] transition-all shadow-sm"
                        title="Add to Bag"
                      >
                        <ShoppingBag className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="text-center mt-12">
            <Link
              to="/gallery"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full border-2 border-[#3B1425] text-[#3B1425] text-xs uppercase tracking-widest font-bold hover:bg-[#3B1425] hover:text-white transition-all shadow-sm"
            >
              <span>Explore All Handcrafted Pieces</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* 4. SIGNATURE INTERACTIVE BUNDLE BUILDER (3 for ₹999) */}
      <section className="py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <BundleBuilder />
      </section>

      {/* 5. CUSTOMER TESTIMONIALS */}
      <section className="py-16 bg-white border-t border-b border-[#E8DFD5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-12">
            <span className="text-xs uppercase tracking-[0.25em] text-[#C4683C] font-semibold block mb-1">
              #StyledWithUditas
            </span>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-stone-900">
              Loved by Queens Across India
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {customerTestimonials.map((t, idx) => (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-[#FAF7F2] border border-[#E8DFD5] space-y-4 flex flex-col justify-between shadow-sm"
              >
                <div className="space-y-3">
                  <div className="flex text-[#D4AF37]">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                  <p className="font-serif text-base italic text-stone-800 leading-relaxed">
                    "{t.quote}"
                  </p>
                </div>

                <div className="pt-3 border-t border-stone-200">
                  <strong className="block text-sm font-semibold text-stone-900">{t.name}</strong>
                  <span className="text-xs text-stone-500">
                    {t.city} • Verified Buyer of <em>{t.product}</em>
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quick View Modal */}
      <QuickViewModal
        product={quickViewProduct}
        isOpen={Boolean(quickViewProduct)}
        onClose={() => setQuickViewProduct(null)}
      />
    </div>
  );
}
