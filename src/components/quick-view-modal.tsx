import React, { useState } from "react";
import { X, Star, ShieldCheck, Heart, Plus, Minus, ArrowRight, Truck } from "lucide-react";
import { type Product } from "@/lib/products";
import { useCart } from "@/lib/cart-context";
import { Link } from "@tanstack/react-router";

export function QuickViewModal({
  product,
  isOpen,
  onClose,
}: {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}) {
  const { addToCart, toggleWishlist, isInWishlist, formatPrice, setIsCartOpen } = useCart();
  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [selectedColor, setSelectedColor] = useState(product?.colors?.[0] || "Antique Gold");
  const [quantity, setQuantity] = useState(1);
  const [pincode, setPincode] = useState("");
  const [pincodeStatus, setPincodeStatus] = useState<string | null>(null);

  if (!isOpen || !product) return null;

  const inWishlist = isInWishlist(product.id);
  const gallery = product.gallery?.length ? product.gallery : [product.image];

  const handleCheckPincode = (e: React.FormEvent) => {
    e.preventDefault();
    if (pincode.length !== 6) {
      setPincodeStatus("Please enter a valid 6-digit PIN code");
      return;
    }
    setPincodeStatus(`✨ Delivery in 2-4 business days | Cash on Delivery available for ${pincode}`);
  };

  const handleAddToCart = () => {
    addToCart(product, quantity, selectedColor);
    onClose();
  };

  const handleBuyNow = () => {
    addToCart(product, quantity, selectedColor);
    onClose();
    setIsCartOpen(true);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
      />

      <div className="relative min-h-screen flex items-center justify-center p-4">
        <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-[#E8DFD5] overflow-hidden">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/80 hover:bg-white text-stone-600 shadow-md transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="grid grid-cols-1 md:grid-cols-2">
            {/* Gallery Column */}
            <div className="p-6 bg-[#FAF7F2] border-r border-[#EFEAE2] flex flex-col justify-between">
              <div className="aspect-square rounded-2xl overflow-hidden bg-white border border-stone-200 shadow-inner relative">
                <img
                  src={gallery[activeImageIdx] || product.image}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
                {product.mrp > product.price && (
                  <span className="absolute top-3 left-3 bg-[#C4683C] text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                    Save {Math.round(((product.mrp - product.price) / product.mrp) * 100)}%
                  </span>
                )}
              </div>

              {/* Thumbnails */}
              {gallery.length > 1 && (
                <div className="flex gap-2 mt-4 overflow-x-auto pb-1">
                  {gallery.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveImageIdx(i)}
                      className={`w-14 h-14 rounded-lg overflow-hidden border-2 flex-shrink-0 transition-all ${
                        activeImageIdx === i ? "border-[#3B1425] scale-95" : "border-stone-200 opacity-70"
                      }`}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Details Column */}
            <div className="p-6 md:p-8 flex flex-col justify-between space-y-4">
              <div>
                <span className="text-[10px] uppercase tracking-widest text-[#C4683C] font-semibold">
                  {product.categoryName}
                </span>
                <h3 className="font-serif text-2xl font-bold text-stone-900 mt-1">
                  {product.name}
                </h3>

                {/* Rating */}
                <div className="flex items-center gap-2 mt-2">
                  <div className="flex text-[#D4AF37]">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-current" />
                    ))}
                  </div>
                  <span className="text-xs text-stone-500 font-medium">
                    {product.rating} ({product.reviewsCount} verified reviews)
                  </span>
                </div>

                {/* Price */}
                <div className="flex items-baseline gap-3 mt-3">
                  <span className="font-serif text-2xl font-bold text-[#3B1425]">
                    {formatPrice(product.price)}
                  </span>
                  {product.mrp > product.price && (
                    <span className="text-sm text-stone-400 line-through">
                      {formatPrice(product.mrp)}
                    </span>
                  )}
                  <span className="text-xs text-stone-500">(Inclusive of all taxes)</span>
                </div>

                <p className="text-xs text-stone-600 mt-3 leading-relaxed">
                  {product.short}
                </p>

                {/* Color/Finish Selection */}
                {product.colors && product.colors.length > 0 && (
                  <div className="mt-4">
                    <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-2">
                      Finish / Polish: <span className="text-[#3B1425]">{selectedColor}</span>
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {product.colors.map((c) => (
                        <button
                          key={c}
                          onClick={() => setSelectedColor(c)}
                          className={`px-3 py-1.5 text-xs rounded-full border transition-all ${
                            selectedColor === c
                              ? "border-[#3B1425] bg-[#3B1425] text-white font-medium"
                              : "border-stone-300 text-stone-700 hover:border-stone-400 bg-white"
                          }`}
                        >
                          {c}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Quantity & Actions */}
                <div className="flex items-center gap-3 mt-5">
                  <div className="flex items-center border border-stone-300 rounded-full bg-[#FAF7F2]">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-8 h-8 flex items-center justify-center text-stone-600 hover:text-black"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="w-8 text-center text-xs font-semibold text-stone-900">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-8 h-8 flex items-center justify-center text-stone-600 hover:text-black"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>

                  <button
                    onClick={handleAddToCart}
                    className="flex-1 py-2.5 px-4 bg-[#3B1425] text-white rounded-full text-xs uppercase tracking-wider font-semibold hover:bg-[#280D19] transition-all shadow-md"
                  >
                    Add to Bag
                  </button>

                  <button
                    onClick={() => toggleWishlist(product)}
                    className={`p-2.5 rounded-full border transition-colors ${
                      inWishlist
                        ? "border-red-400 text-red-500 bg-red-50"
                        : "border-stone-300 text-stone-500 hover:text-red-500"
                    }`}
                    title={inWishlist ? "Saved in Wishlist" : "Save to Wishlist"}
                  >
                    <Heart className={`w-4 h-4 ${inWishlist ? "fill-current" : ""}`} />
                  </button>
                </div>

                <button
                  onClick={handleBuyNow}
                  className="w-full mt-2.5 py-2.5 bg-[#C4683C] text-white rounded-full text-xs uppercase tracking-wider font-semibold hover:bg-[#A8532A] transition-colors"
                >
                  Buy It Now
                </button>
              </div>

              {/* Pincode & Link to full page */}
              <div className="pt-4 border-t border-stone-200">
                <form onSubmit={handleCheckPincode} className="flex gap-2">
                  <input
                    type="text"
                    maxLength={6}
                    placeholder="Enter 6-digit Pincode"
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value)}
                    className="flex-1 px-3 py-1.5 border border-stone-300 rounded-lg text-xs font-mono"
                  />
                  <button
                    type="submit"
                    className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-xs font-medium rounded-lg text-stone-700"
                  >
                    Check
                  </button>
                </form>
                {pincodeStatus && (
                  <p className="text-[11px] text-emerald-700 mt-1.5 font-medium">
                    {pincodeStatus}
                  </p>
                )}

                <div className="mt-4 text-center">
                  <Link
                    to="/product/$id"
                    params={{ id: product.id }}
                    onClick={onClose}
                    className="text-xs font-semibold text-[#3B1425] hover:underline inline-flex items-center gap-1"
                  >
                    <span>View Full Product Specifications & Reviews</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
