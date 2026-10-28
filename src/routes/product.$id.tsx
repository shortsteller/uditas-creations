import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Share2,
  ChevronRight,
  Star,
  ShieldCheck,
  Truck,
  RefreshCw,
  Heart,
  Plus,
  Minus,
  Sparkles,
  ShoppingBag,
  Info,
  Check,
} from "lucide-react";
import { toast } from "sonner";
import { getProduct, getRelatedProducts, type Product } from "@/lib/products";
import { useCart } from "@/lib/cart-context";
import { ReviewSection } from "@/components/review-section";
import { waLink } from "@/lib/site";

export const Route = createFileRoute("/product/$id")({
  loader: ({ params }) => {
    const product = getProduct(params.id);
    if (!product) throw notFound();
    return { product };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [
          { title: "Piece Not Found — UDITAS CREATIONS" },
          { name: "robots", content: "noindex" },
        ],
      };
    }
    const { product } = loaderData;
    return {
      meta: [
        { title: `${product.name} — UDITAS CREATIONS Jewelry` },
        { name: "description", content: product.short },
        { property: "og:title", content: `${product.name} — UDITAS CREATIONS` },
        { property: "og:description", content: product.short },
        { property: "og:type", content: "product" },
        { property: "og:url", content: `/product/${product.id}` },
      ],
      links: [{ rel: "canonical", href: `/product/${product.id}` }],
    };
  },
  component: ProductDetailPage,
  notFoundComponent: ProductNotFound,
});

function ProductNotFound() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-24 text-center">
      <span className="font-serif text-6xl text-[#3B1425] block mb-2 font-bold">404</span>
      <h1 className="font-serif text-3xl font-bold text-stone-900">
        Piece Not Found or Sold Out
      </h1>
      <p className="mt-2 text-xs text-stone-500">
        This jewelry piece might have been curated in a limited artisan batch and sold out.
      </p>
      <Link
        to="/gallery"
        className="mt-6 inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#3B1425] text-white text-xs uppercase tracking-wider font-semibold"
      >
        <span>Explore All Jewelry</span>
        <ChevronRight className="w-4 h-4" />
      </Link>
    </div>
  );
}

function ProductDetailPage() {
  const { product } = Route.useLoaderData() as { product: Product };
  const { addToCart, toggleWishlist, isInWishlist, formatPrice, setIsCartOpen } = useCart();

  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [selectedColor, setSelectedColor] = useState(product.colors[0] || "Antique Gold");
  const [quantity, setQuantity] = useState(1);
  const [zoom, setZoom] = useState({ x: 50, y: 50, on: false });

  // Pincode checker
  const [pincode, setPincode] = useState("");
  const [pincodeMessage, setPincodeMessage] = useState<string | null>(null);

  // Accordion active tab
  const [openAccordion, setOpenAccordion] = useState<string>("details");

  const inWishlist = isInWishlist(product.id);
  const gallery = product.gallery?.length ? product.gallery : [product.image];
  const relatedProducts = getRelatedProducts(product, 4);

  const handleShare = async () => {
    const url = typeof window !== "undefined" ? window.location.href : "";
    if (navigator.share) {
      try {
        await navigator.share({ title: product.name, text: product.short, url });
      } catch {}
    } else {
      await navigator.clipboard.writeText(url);
      toast.success("Product link copied to clipboard!");
    }
  };

  const handleCheckPincode = (e: React.FormEvent) => {
    e.preventDefault();
    if (pincode.length !== 6) {
      setPincodeMessage("Please enter a valid 6-digit Indian PIN code");
      return;
    }
    setPincodeMessage(
      `🎉 Express Delivery available for PIN ${pincode}! Estimated arrival in 2-4 business days. COD available.`
    );
  };

  const handleBuyNow = () => {
    addToCart(product, quantity, selectedColor);
    setIsCartOpen(true);
  };

  return (
    <div className="bg-[#FAF7F2] min-h-screen pb-20">
      {/* Breadcrumb Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
        <nav className="flex items-center gap-2 text-xs text-stone-500 font-medium">
          <Link to="/" className="hover:text-stone-900">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-stone-300" />
          <Link to="/gallery" className="hover:text-stone-900">
            Collections
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-stone-300" />
          <Link
            to="/gallery"
            search={{ cat: product.category }}
            className="hover:text-stone-900"
          >
            {product.categoryName}
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-stone-300" />
          <span className="text-stone-900 truncate max-w-[200px]">{product.name}</span>
        </nav>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
          {/* LEFT: GALLERY SECTION */}
          <div className="lg:col-span-7 space-y-4">
            {/* Main Image with Zoom Lens */}
            <div
              className="aspect-square rounded-3xl overflow-hidden bg-white border border-[#E8DFD5] shadow-lg relative cursor-crosshair group"
              onMouseMove={(e) => {
                const r = e.currentTarget.getBoundingClientRect();
                setZoom({
                  x: ((e.clientX - r.left) / r.width) * 100,
                  y: ((e.clientY - r.top) / r.height) * 100,
                  on: true,
                });
              }}
              onMouseLeave={() => setZoom((z) => ({ ...z, on: false }))}
            >
              <img
                src={gallery[activeImageIdx] || product.image}
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-300"
                style={
                  zoom.on
                    ? {
                        transform: "scale(1.8)",
                        transformOrigin: `${zoom.x}% ${zoom.y}%`,
                      }
                    : undefined
                }
              />

              {/* Discount Tag */}
              {product.mrp > product.price && (
                <span className="absolute top-4 left-4 bg-[#C4683C] text-white text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow">
                  Save {Math.round(((product.mrp - product.price) / product.mrp) * 100)}% OFF
                </span>
              )}

              {/* Share Button */}
              <button
                onClick={handleShare}
                className="absolute top-4 right-4 p-2.5 rounded-full bg-white/90 text-stone-700 hover:text-black shadow-md backdrop-blur-sm transition-all"
                title="Share this design"
              >
                <Share2 className="w-4 h-4" />
              </button>
            </div>

            {/* Thumbnails Row */}
            {gallery.length > 1 && (
              <div className="grid grid-cols-4 sm:grid-cols-5 gap-3">
                {gallery.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImageIdx(i)}
                    className={`aspect-square rounded-xl overflow-hidden border-2 bg-white transition-all ${
                      activeImageIdx === i
                        ? "border-[#3B1425] shadow-md scale-95"
                        : "border-stone-200 opacity-70 hover:opacity-100"
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Complete Look / Frequently Bought Together */}
            {relatedProducts.length > 0 && (
              <div className="hidden lg:block mt-8 p-5 rounded-2xl bg-white border border-[#E8DFD5] space-y-3">
                <span className="text-[10px] uppercase tracking-widest text-[#C4683C] font-semibold block">
                  Frequently Bought Together
                </span>
                <div className="flex items-center gap-4">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-16 h-16 rounded-xl object-cover border"
                  />
                  <span className="text-xl font-bold text-stone-400">+</span>
                  <img
                    src={relatedProducts[0].image}
                    alt={relatedProducts[0].name}
                    className="w-16 h-16 rounded-xl object-cover border"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-serif text-sm font-bold text-stone-900 truncate">
                      Pair with {relatedProducts[0].name}
                    </p>
                    <p className="text-xs text-stone-500">
                      Total:{" "}
                      <strong className="text-[#3B1425]">
                        {formatPrice(product.price + relatedProducts[0].price - 200)}
                      </strong>{" "}
                      <span className="text-stone-400 line-through">
                        {formatPrice(product.price + relatedProducts[0].price)}
                      </span>
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      addToCart(product, 1, selectedColor);
                      addToCart(relatedProducts[0], 1, relatedProducts[0].colors[0]);
                    }}
                    className="px-4 py-2 bg-[#3B1425] text-white rounded-lg text-xs font-semibold hover:bg-[#280D19]"
                  >
                    Add Pair
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* RIGHT: DETAILS & PURCHASE ACTIONS */}
          <div className="lg:col-span-5 space-y-6">
            <div>
              <div className="flex items-center justify-between text-xs text-stone-500 mb-1">
                <span className="uppercase tracking-widest text-[#C4683C] font-semibold">
                  {product.categoryName}
                </span>
                <span className="font-mono text-[11px] text-stone-400">SKU: {product.sku}</span>
              </div>

              <h1 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900 tracking-tight">
                {product.name}
              </h1>

              {/* Rating */}
              <div className="flex items-center gap-2 mt-2.5">
                <div className="flex text-[#D4AF37]">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <span className="text-xs text-stone-500 font-medium">
                  {product.rating} ({product.reviewsCount} customer ratings)
                </span>
              </div>

              {/* Price & Savings */}
              <div className="flex items-baseline gap-3 mt-4 pt-3 border-t border-stone-200">
                <span className="font-serif text-3xl font-bold text-[#3B1425]">
                  {formatPrice(product.price)}
                </span>
                {product.mrp > product.price && (
                  <>
                    <span className="text-base text-stone-400 line-through">
                      {formatPrice(product.mrp)}
                    </span>
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                      Save {formatPrice(product.mrp - product.price)}
                    </span>
                  </>
                )}
              </div>
              <p className="text-[11px] text-stone-400 mt-0.5">
                Price inclusive of all taxes. Free express shipping on orders over ₹799.
              </p>
            </div>

            {/* Stock Alert */}
            <div className="p-3 bg-[#FFF7EE] border border-[#FBE0C8] rounded-xl flex items-center gap-2 text-xs text-[#8A4A1C] font-medium">
              <Sparkles className="w-4 h-4 text-[#C4683C] flex-shrink-0 animate-pulse" />
              <span>
                <strong>Hurry!</strong> Only {product.stockCount} handcrafted pieces left in studio batch.
              </span>
            </div>

            {/* Finish/Color Variant Swatches */}
            {product.colors && product.colors.length > 0 && (
              <div>
                <label className="block text-xs uppercase tracking-wider font-semibold text-stone-800 mb-2">
                  Finish Polish: <span className="text-[#3B1425] font-bold">{selectedColor}</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {product.colors.map((c) => (
                    <button
                      key={c}
                      onClick={() => setSelectedColor(c)}
                      className={`px-4 py-2 rounded-xl text-xs font-medium border transition-all ${
                        selectedColor === c
                          ? "border-[#3B1425] bg-[#3B1425] text-white shadow-sm"
                          : "border-stone-300 bg-white text-stone-800 hover:border-stone-400"
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity Selector & CTAs */}
            <div className="space-y-3 pt-2">
              <div className="flex gap-3">
                {/* Quantity */}
                <div className="flex items-center border border-stone-300 rounded-xl bg-white px-2">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-2 text-stone-500 hover:text-black"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-8 text-center text-xs font-bold text-stone-900">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-2 text-stone-500 hover:text-black"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Add to Bag */}
                <button
                  onClick={() => addToCart(product, quantity, selectedColor)}
                  className="flex-1 py-3.5 bg-[#3B1425] text-white rounded-xl text-xs uppercase tracking-[0.2em] font-semibold hover:bg-[#280D19] transition-all shadow-md flex items-center justify-center gap-2"
                >
                  <ShoppingBag className="w-4 h-4 text-[#D4AF37]" />
                  <span>Add to Bag</span>
                </button>

                {/* Wishlist */}
                <button
                  onClick={() => toggleWishlist(product)}
                  className={`p-3.5 rounded-xl border transition-colors ${
                    inWishlist
                      ? "border-red-400 text-red-500 bg-red-50"
                      : "border-stone-300 bg-white text-stone-600 hover:text-red-500"
                  }`}
                  title="Wishlist"
                >
                  <Heart className={`w-5 h-5 ${inWishlist ? "fill-current" : ""}`} />
                </button>
              </div>

              {/* Buy Now Button */}
              <button
                onClick={handleBuyNow}
                className="w-full py-3.5 bg-gradient-to-r from-[#C4683C] to-[#D97745] text-white rounded-xl text-xs uppercase tracking-[0.2em] font-bold hover:shadow-lg transition-all"
              >
                Instant Buy Now (Fast Checkout)
              </button>
            </div>

            {/* Pincode Estimator */}
            <div className="p-4 rounded-2xl bg-white border border-[#E8DFD5] space-y-2">
              <label className="block text-xs font-semibold text-stone-800 flex items-center gap-1.5">
                <Truck className="w-4 h-4 text-[#C4683C]" />
                <span>Delivery & COD Availability Check</span>
              </label>
              <form onSubmit={handleCheckPincode} className="flex gap-2">
                <input
                  type="text"
                  maxLength={6}
                  placeholder="Enter 6-digit Pincode"
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  className="flex-1 px-3 py-2 border border-stone-300 rounded-lg text-xs font-mono focus:outline-none focus:border-[#3B1425]"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-xs font-semibold rounded-lg text-stone-800"
                >
                  Check
                </button>
              </form>
              {pincodeMessage && (
                <p className="text-[11px] text-emerald-700 font-medium pt-1">
                  {pincodeMessage}
                </p>
              )}
            </div>

            {/* Accordion Tabs */}
            <div className="border border-[#E8DFD5] rounded-2xl bg-white overflow-hidden divide-y divide-[#E8DFD5]">
              {/* 1. Design Overview */}
              <div>
                <button
                  onClick={() =>
                    setOpenAccordion(openAccordion === "details" ? "" : "details")
                  }
                  className="w-full p-4 flex items-center justify-between text-left text-xs uppercase tracking-wider font-bold text-stone-900"
                >
                  <span>Design Story & Overview</span>
                  <span>{openAccordion === "details" ? "−" : "+"}</span>
                </button>
                {openAccordion === "details" && (
                  <div className="p-4 pt-0 text-xs text-stone-600 leading-relaxed space-y-2">
                    <p>{product.description}</p>
                  </div>
                )}
              </div>

              {/* 2. Specifications */}
              <div>
                <button
                  onClick={() =>
                    setOpenAccordion(openAccordion === "specs" ? "" : "specs")
                  }
                  className="w-full p-4 flex items-center justify-between text-left text-xs uppercase tracking-wider font-bold text-stone-900"
                >
                  <span>Materials & Specifications</span>
                  <span>{openAccordion === "specs" ? "−" : "+"}</span>
                </button>
                {openAccordion === "specs" && (
                  <div className="p-4 pt-0 text-xs text-stone-600 space-y-1.5">
                    <p>
                      <strong>Base Metal:</strong> {product.material}
                    </p>
                    <p>
                      <strong>Polish & Coating:</strong> {product.polish}
                    </p>
                    <p>
                      <strong>Dimensions:</strong> {product.dimensions}
                    </p>
                    <p>
                      <strong>Weight:</strong> {product.weight}
                    </p>
                  </div>
                )}
              </div>

              {/* 3. Care Guide */}
              <div>
                <button
                  onClick={() =>
                    setOpenAccordion(openAccordion === "care" ? "" : "care")
                  }
                  className="w-full p-4 flex items-center justify-between text-left text-xs uppercase tracking-wider font-bold text-stone-900"
                >
                  <span>Jewelry Care & Longevity</span>
                  <span>{openAccordion === "care" ? "−" : "+"}</span>
                </button>
                {openAccordion === "care" && (
                  <div className="p-4 pt-0 text-xs text-stone-600 space-y-1.5">
                    <p>{product.care}</p>
                    <p className="text-[11px] text-stone-500">
                      💡 Pro-tip: Always spray perfume and apply makeup before wearing your jewelry. Store in airtight zip pouch away from sunlight.
                    </p>
                  </div>
                )}
              </div>

              {/* 4. Shipping & Returns */}
              <div>
                <button
                  onClick={() =>
                    setOpenAccordion(openAccordion === "shipping" ? "" : "shipping")
                  }
                  className="w-full p-4 flex items-center justify-between text-left text-xs uppercase tracking-wider font-bold text-stone-900"
                >
                  <span>Shipping & 7-Day Exchange</span>
                  <span>{openAccordion === "shipping" ? "−" : "+"}</span>
                </button>
                {openAccordion === "shipping" && (
                  <div className="p-4 pt-0 text-xs text-stone-600 space-y-1.5">
                    <p>
                      • <strong>Dispatch:</strong> Orders are dispatched within 24-48 hours from our Kolkata studio via BlueDart & Delhivery Air.
                    </p>
                    <p>
                      • <strong>Exchange:</strong> Easy 7-day exchange window if the size or look doesn't fit your expectations.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Customer Reviews Section */}
        <ReviewSection productName={product.name} />

        {/* Related Products Carousel */}
        {relatedProducts.length > 0 && (
          <div className="mt-20 pt-12 border-t border-[#E8DFD5]">
            <h3 className="font-serif text-3xl font-bold text-stone-900 mb-8">
              You May Also Adore
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 md:gap-6">
              {relatedProducts.map((rel) => (
                <div
                  key={rel.id}
                  className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <Link to="/product/$id" params={{ id: rel.id }} className="aspect-square block overflow-hidden bg-stone-100">
                    <img
                      src={rel.image}
                      alt={rel.name}
                      className="w-full h-full object-cover hover:scale-105 transition-transform"
                    />
                  </Link>
                  <div className="p-3.5">
                    <span className="text-[9px] uppercase tracking-wider text-[#C4683C] font-semibold">
                      {rel.categoryName}
                    </span>
                    <Link
                      to="/product/$id"
                      params={{ id: rel.id }}
                      className="font-serif text-sm font-semibold text-stone-900 truncate block mt-0.5"
                    >
                      {rel.name}
                    </Link>
                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-stone-100">
                      <span className="font-serif text-base font-bold text-[#3B1425]">
                        {formatPrice(rel.price)}
                      </span>
                      <button
                        onClick={() => addToCart(rel, 1, rel.colors[0])}
                        className="p-1.5 rounded-full bg-[#FAF7F2] text-[#3B1425] hover:bg-[#3B1425] hover:text-white border"
                      >
                        <ShoppingBag className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
