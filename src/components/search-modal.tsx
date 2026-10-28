import React, { useState, useMemo } from "react";
import { Search, X, Sparkles, ArrowRight, Tag } from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { PRODUCTS, type Product } from "@/lib/products";
import { Link } from "@tanstack/react-router";

const POPULAR_SEARCHES = [
  "Jhumka",
  "Kundan Choker",
  "German Silver",
  "Filigree Bangles",
  "3 for 999",
  "Mirror Ring",
  "Ghungroo Payal",
  "Bridal Hamper",
];

export function SearchModal({
  isOpen,
  onClose,
  onSelectProduct,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSelectProduct?: (product: Product) => void;
}) {
  const [query, setQuery] = useState("");
  const { formatPrice } = useCart();

  const results = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase().trim();
    return PRODUCTS.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.categoryName.toLowerCase().includes(q) ||
        p.short.toLowerCase().includes(q) ||
        p.material.toLowerCase().includes(q) ||
        p.tags.some((t) => t.toLowerCase().includes(q))
    ).slice(0, 6);
  }, [query]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
      />

      <div className="relative min-h-screen flex items-start justify-center p-4 pt-16 md:pt-24">
        <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-[#E8E1D5] overflow-hidden">
          {/* Search Input Bar */}
          <div className="p-4 md:p-6 border-b border-[#EBE4DA] bg-[#FAF7F2] flex items-center gap-3">
            <Search className="w-5 h-5 text-[#8C6D78]" />
            <input
              type="text"
              autoFocus
              placeholder="Search handcrafted jhumkas, chokers, bangles, oxidised..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1 bg-transparent text-base md:text-lg text-stone-900 placeholder:text-stone-400 focus:outline-none"
            />
            {query && (
              <button
                onClick={() => setQuery("")}
                className="text-stone-400 hover:text-stone-700"
              >
                <X className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={onClose}
              className="text-xs font-semibold px-3 py-1.5 rounded-full bg-[#EAE2D8] text-stone-700 hover:bg-[#DCD2C6] transition-colors"
            >
              ESC
            </button>
          </div>

          {/* Body */}
          <div className="p-5 md:p-6 max-h-[65vh] overflow-y-auto">
            {query.trim() === "" ? (
              <div>
                <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-[#8C6D78] font-semibold mb-3">
                  <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>Popular Trending Searches</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {POPULAR_SEARCHES.map((term) => (
                    <button
                      key={term}
                      onClick={() => setQuery(term)}
                      className="px-3.5 py-1.5 rounded-full text-xs font-medium bg-[#F5ECE1] text-[#4A2635] hover:bg-[#EBDDCF] transition-colors flex items-center gap-1.5"
                    >
                      <Tag className="w-3 h-3 text-[#C4683C]" />
                      <span>{term}</span>
                    </button>
                  ))}
                </div>

                <div className="mt-8 pt-6 border-t border-stone-100">
                  <p className="text-xs uppercase tracking-widest text-stone-400 font-semibold mb-3">
                    Featured Categories
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {[
                      { name: "Jhumkas & Chandbalis", slug: "jhumkas" },
                      { name: "Necklaces & Chokers", slug: "necklaces" },
                      { name: "Bangles & Kadas", slug: "bangles" },
                      { name: "Cocktail Rings", slug: "rings" },
                      { name: "Ghungroo Payal", slug: "anklets" },
                      { name: "3 for ₹999 Combos", slug: "combos" },
                    ].map((cat) => (
                      <Link
                        key={cat.slug}
                        to="/gallery"
                        search={{ cat: cat.slug }}
                        onClick={onClose}
                        className="p-2.5 rounded-xl border border-stone-200 text-xs font-medium text-stone-700 hover:border-[#3B1425] hover:text-[#3B1425] hover:bg-[#FDFBF7] transition-all"
                      >
                        {cat.name}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            ) : results.length > 0 ? (
              <div className="space-y-3">
                <p className="text-xs text-stone-500 font-medium">
                  Found {results.length} pieces matching "{query}"
                </p>
                <div className="grid gap-2">
                  {results.map((product) => (
                    <Link
                      key={product.id}
                      to="/product/$id"
                      params={{ id: product.id }}
                      onClick={onClose}
                      className="flex items-center gap-4 p-3 rounded-xl border border-stone-100 hover:border-[#E8DFD5] hover:bg-[#FAF7F2] transition-all group"
                    >
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-14 h-14 rounded-lg object-cover bg-stone-100 flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <span className="text-[10px] uppercase tracking-wider text-[#C4683C] font-semibold">
                          {product.categoryName}
                        </span>
                        <h4 className="font-serif text-base font-semibold text-stone-900 group-hover:text-[#3B1425] truncate">
                          {product.name}
                        </h4>
                        <p className="text-xs text-stone-500 truncate">
                          {product.short}
                        </p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <span className="font-semibold text-sm text-[#3B1425]">
                          {formatPrice(product.price)}
                        </span>
                        {product.mrp > product.price && (
                          <span className="block text-[11px] text-stone-400 line-through">
                            {formatPrice(product.mrp)}
                          </span>
                        )}
                      </div>
                      <ArrowRight className="w-4 h-4 text-stone-300 group-hover:text-[#3B1425] group-hover:translate-x-1 transition-all" />
                    </Link>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="font-serif text-xl text-stone-800">
                  No matching jewelry found for "{query}"
                </p>
                <p className="text-xs text-stone-500 mt-1">
                  Try checking the spelling or browse our popular categories.
                </p>
                <button
                  onClick={() => setQuery("")}
                  className="mt-4 px-4 py-2 rounded-full bg-[#FAF7F2] text-xs font-semibold text-stone-700 hover:bg-[#EFE9DF]"
                >
                  Clear search
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
