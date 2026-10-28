import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  SlidersHorizontal,
  Star,
  Heart,
  Eye,
  ShoppingBag,
  Sparkles,
  Grid3X3,
  LayoutGrid,
  RotateCcw,
} from "lucide-react";
import { CATEGORIES, PRODUCTS, type Product } from "@/lib/products";
import { useCart } from "@/lib/cart-context";
import { QuickViewModal } from "@/components/quick-view-modal";

export const Route = createFileRoute("/gallery")({
  validateSearch: (search: Record<string, unknown>) => {
    return {
      cat: (search.cat as string) || "all",
    };
  },
  component: GalleryPage,
});

type SortOption = "featured" | "price-asc" | "price-desc" | "rating" | "newest";

function GalleryPage() {
  const { cat: urlCat } = Route.useSearch();
  const [selectedCategory, setSelectedCategory] = useState<string>(urlCat || "all");
  const [maxPrice, setMaxPrice] = useState<number>(5500);
  const [sort, setSort] = useState<SortOption>("featured");
  const [inStockOnly, setInStockOnly] = useState(false);
  const [selectedFinish, setSelectedFinish] = useState<string>("all");
  const [columns, setColumns] = useState<3 | 4>(4);

  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  const { addToCart, toggleWishlist, isInWishlist, formatPrice } = useCart();

  // Filter & sort logic
  const filteredProducts = useMemo(() => {
    let list = [...PRODUCTS];

    if (selectedCategory === "combos") {
      list = list.filter((p) => p.comboDeal || p.category === "combos");
    } else if (selectedCategory !== "all") {
      list = list.filter((p) => p.category === selectedCategory);
    }

    list = list.filter((p) => p.price <= maxPrice);

    if (inStockOnly) {
      list = list.filter((p) => p.inStock);
    }

    if (selectedFinish !== "all") {
      list = list.filter((p) =>
        p.colors.some((c) => c.toLowerCase().includes(selectedFinish.toLowerCase()))
      );
    }

    if (sort === "price-asc") {
      list.sort((a, b) => a.price - b.price);
    } else if (sort === "price-desc") {
      list.sort((a, b) => b.price - a.price);
    } else if (sort === "rating") {
      list.sort((a, b) => b.rating - a.rating);
    } else if (sort === "newest") {
      list.sort((a, b) => (b.newArrival ? 1 : 0) - (a.newArrival ? 1 : 0));
    }

    return list;
  }, [selectedCategory, maxPrice, sort, inStockOnly, selectedFinish]);

  const resetFilters = () => {
    setSelectedCategory("all");
    setMaxPrice(5500);
    setSort("featured");
    setInStockOnly(false);
    setSelectedFinish("all");
  };

  const categoryTabs = [{ slug: "all", name: "All Pieces" }, ...CATEGORIES];

  return (
    <div className="bg-[#FAF7F2] min-h-screen pb-20">
      {/* Header Banner */}
      <div className="bg-gradient-to-b from-[#2A101C] to-[#3B1425] text-white py-14 px-4 sm:px-6 lg:px-8 border-b border-[#4A1E31]">
        <div className="max-w-7xl mx-auto text-center space-y-3">
          <span className="text-[11px] uppercase tracking-[0.3em] text-[#D4AF37] font-semibold block">
            The Catalog
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight">
            Handcrafted Jewelry Collection
          </h1>
          <p className="text-xs sm:text-sm text-[#DFCEC3] max-w-xl mx-auto">
            Explore {PRODUCTS.length} heirloom-inspired creations. Designed and assembled in our Kolkata studio with hypoallergenic brass, 24k micro gold, and German silver.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {/* Horizontal Category Carousel */}
        <div className="overflow-x-auto pb-4 no-scrollbar">
          <div className="flex gap-2 min-w-max">
            {categoryTabs.map((tab) => {
              const active = selectedCategory === tab.slug;
              return (
                <button
                  key={tab.slug}
                  onClick={() => setSelectedCategory(tab.slug)}
                  className={`px-4 py-2 rounded-full text-xs uppercase tracking-wider font-semibold transition-all ${
                    active
                      ? "bg-[#3B1425] text-white shadow-md"
                      : "bg-white text-stone-700 border border-stone-200 hover:border-stone-400"
                  }`}
                >
                  {tab.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* Filter & Controls Bar */}
        <div className="bg-white rounded-2xl border border-[#E8DFD5] p-4 md:p-5 my-6 shadow-sm flex flex-col md:flex-row gap-5 items-center justify-between">
          {/* Price Range Slider */}
          <div className="w-full md:w-64">
            <div className="flex justify-between text-xs font-semibold text-stone-700 mb-1.5">
              <span>Max Budget:</span>
              <span className="text-[#3B1425] font-serif font-bold text-sm">
                {formatPrice(maxPrice)}
              </span>
            </div>
            <input
              type="range"
              min={500}
              max={5500}
              step={100}
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full accent-[#3B1425] cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-stone-400 mt-0.5">
              <span>₹500</span>
              <span>₹5,500+</span>
            </div>
          </div>

          {/* Finish / Material Dropdown */}
          <div className="flex items-center gap-2 w-full md:w-auto">
            <label className="text-xs font-semibold text-stone-600 whitespace-nowrap">
              Finish:
            </label>
            <select
              value={selectedFinish}
              onChange={(e) => setSelectedFinish(e.target.value)}
              className="px-3 py-1.5 rounded-lg border border-stone-300 text-xs font-medium text-stone-800 bg-[#FAF7F2] focus:outline-none focus:border-[#3B1425]"
            >
              <option value="all">All Finishes</option>
              <option value="gold">Antique Gold</option>
              <option value="silver">Oxidised / German Silver</option>
              <option value="kundan">Kundan / Polki</option>
              <option value="rose">Rose Gold</option>
            </select>
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2 w-full md:w-auto">
            <label className="text-xs font-semibold text-stone-600 whitespace-nowrap">
              Sort By:
            </label>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortOption)}
              className="px-3 py-1.5 rounded-lg border border-stone-300 text-xs font-medium text-stone-800 bg-[#FAF7F2] focus:outline-none focus:border-[#3B1425]"
            >
              <option value="featured">Featured / Curated</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
              <option value="newest">New Arrivals</option>
            </select>
          </div>

          {/* In Stock & Reset */}
          <div className="flex items-center gap-4 w-full md:w-auto justify-end">
            <label className="flex items-center gap-2 text-xs font-medium text-stone-700 cursor-pointer">
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={(e) => setInStockOnly(e.target.checked)}
                className="accent-[#3B1425] rounded"
              />
              <span>In Stock Only</span>
            </label>

            <button
              onClick={resetFilters}
              className="text-stone-400 hover:text-stone-800 text-xs flex items-center gap-1 font-medium"
              title="Reset all filters"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Reset</span>
            </button>
          </div>
        </div>

        {/* Results Counter */}
        <div className="flex items-center justify-between text-xs text-stone-500 mb-6 font-medium">
          <span>Showing {filteredProducts.length} handcrafted pieces</span>
          {selectedCategory === "combos" && (
            <span className="text-[#C4683C] font-semibold bg-[#FFF3EC] px-3 py-1 rounded-full border border-[#FEDCC9]">
              ✨ Eligible for "3 for ₹999" Special Bundle!
            </span>
          )}
        </div>

        {/* Product Grid */}
        {filteredProducts.length === 0 ? (
          <div className="bg-white rounded-3xl border border-stone-200 p-12 text-center max-w-md mx-auto my-12">
            <h3 className="font-serif text-2xl font-bold text-stone-900">
              No matching pieces found
            </h3>
            <p className="text-xs text-stone-500 mt-2">
              Try adjusting your price filter or selecting another category.
            </p>
            <button
              onClick={resetFilters}
              className="mt-6 px-6 py-2.5 rounded-full bg-[#3B1425] text-white text-xs uppercase tracking-wider font-semibold"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {filteredProducts.map((product) => {
              const inWishlist = isInWishlist(product.id);
              return (
                <div
                  key={product.id}
                  className="group bg-white rounded-2xl border border-[#EBE4DA] overflow-hidden shadow-sm hover:shadow-xl hover:border-[#D5C7B7] transition-all flex flex-col justify-between"
                >
                  {/* Image with hover swap */}
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
                      {product.comboDeal && (
                        <span className="bg-[#C4683C] text-white text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider shadow">
                          3 for ₹999
                        </span>
                      )}
                      {product.mrp > product.price && (
                        <span className="bg-[#3B1425] text-white text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider shadow">
                          -{Math.round(((product.mrp - product.price) / product.mrp) * 100)}%
                        </span>
                      )}
                    </div>

                    {/* Quick action buttons */}
                    <div className="absolute top-2.5 right-2.5 flex flex-col gap-1.5 opacity-90 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => toggleWishlist(product)}
                        className={`p-2 rounded-full shadow-md backdrop-blur-sm transition-all ${
                          inWishlist
                            ? "bg-red-50 text-red-500"
                            : "bg-white/90 text-stone-700 hover:text-red-500"
                        }`}
                        title="Wishlist"
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
        )}
      </div>

      {/* Quick View Modal */}
      <QuickViewModal
        product={quickViewProduct}
        isOpen={Boolean(quickViewProduct)}
        onClose={() => setQuickViewProduct(null)}
      />
    </div>
  );
}
