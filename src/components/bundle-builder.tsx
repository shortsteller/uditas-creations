import React, { useState } from "react";
import { Sparkles, Check, Plus, ShoppingBag, X } from "lucide-react";
import { getComboEligibleProducts, type Product } from "@/lib/products";
import { useCart } from "@/lib/cart-context";
import { toast } from "sonner";

export function BundleBuilder() {
  const eligibleProducts = getComboEligibleProducts();
  const { addToCart, setIsCartOpen, formatPrice } = useCart();
  const [selectedItems, setSelectedItems] = useState<Product[]>([]);

  const BUNDLE_PRICE = 999;

  const toggleSelect = (product: Product) => {
    if (selectedItems.some((p) => p.id === product.id)) {
      setSelectedItems((prev) => prev.filter((p) => p.id !== product.id));
    } else {
      if (selectedItems.length >= 3) {
        toast.info("You've already chosen 3 pieces! Deselect one or add this bundle to your bag.");
        return;
      }
      setSelectedItems((prev) => [...prev, product]);
    }
  };

  const handleAddBundleToCart = () => {
    if (selectedItems.length < 3) {
      toast.warning(`Please pick ${3 - selectedItems.length} more item(s) to complete your 3 for ₹999 bundle!`);
      return;
    }

    // Add as a combined special item or individual items with proportional pricing
    selectedItems.forEach((item) => {
      // Each item at 333
      addToCart({ ...item, price: 333 }, 1, item.colors[0]);
    });

    toast.success("🎉 3 for ₹999 Bundle added to your bag!", {
      description: "Discounted pricing applied for all 3 handcrafted pieces.",
      action: {
        label: "View Bag",
        onClick: () => setIsCartOpen(true),
      },
    });

    setSelectedItems([]);
  };

  const originalTotal = selectedItems.reduce((s, p) => s + p.price, 0);
  const totalSavings = Math.max(0, originalTotal - BUNDLE_PRICE);

  return (
    <div className="bg-[#FAF7F2] rounded-3xl border border-[#E8DFD5] p-6 md:p-10 my-12 shadow-sm overflow-hidden relative">
      <div className="absolute top-0 right-0 -mt-12 -mr-12 w-48 h-48 bg-[#D4AF37]/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-8">
        <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#3B1425] text-[#F5EDE4] text-[11px] uppercase tracking-widest font-semibold mb-3">
          <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" /> Signature Special Offer
        </span>
        <h2 className="font-serif text-3xl md:text-5xl font-bold text-stone-900 tracking-tight">
          Curate Your Trio Box
        </h2>
        <p className="font-serif text-xl md:text-2xl text-[#C4683C] italic mt-1 font-medium">
          Pick Any 3 Statement Pieces for Just {formatPrice(BUNDLE_PRICE)}
        </p>
        <p className="text-xs md:text-sm text-stone-500 mt-2">
          Mix & match our bestselling temple jhumkas, chandbalis, mirror rings, and chiming payals. Hand-packed in our gold-foil signature gift box.
        </p>
      </div>

      {/* 3 Selected Slots */}
      <div className="max-w-xl mx-auto bg-white rounded-2xl border-2 border-dashed border-[#DDD2C4] p-4 mb-8">
        <div className="text-xs font-semibold text-stone-600 uppercase tracking-widest text-center mb-3">
          Your Curated Box ({selectedItems.length} of 3 Selected)
        </div>
        <div className="grid grid-cols-3 gap-3">
          {[0, 1, 2].map((slotIdx) => {
            const item = selectedItems[slotIdx];
            return (
              <div
                key={slotIdx}
                className="aspect-square rounded-xl bg-[#FAF7F2] border border-stone-200 flex flex-col items-center justify-center p-2 relative group overflow-hidden"
              >
                {item ? (
                  <>
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover rounded-lg"
                    />
                    <button
                      onClick={() => toggleSelect(item)}
                      className="absolute top-1 right-1 p-1 bg-black/60 text-white rounded-full hover:bg-red-600 transition-colors"
                      title="Remove from bundle"
                    >
                      <X className="w-3 h-3" />
                    </button>
                    <span className="absolute bottom-1 inset-x-1 bg-black/60 backdrop-blur text-white text-[10px] text-center truncate py-0.5 px-1 rounded font-medium">
                      {item.name}
                    </span>
                  </>
                ) : (
                  <div className="text-center text-stone-400">
                    <Plus className="w-6 h-6 mx-auto mb-1 stroke-1" />
                    <span className="text-[11px] font-medium block">Select #{slotIdx + 1}</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Action Button & Savings */}
        <div className="mt-4 pt-4 border-t border-stone-100 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs">
            <span className="text-stone-500">Bundle Price: </span>
            <strong className="text-stone-900 font-serif text-base text-[#3B1425]">
              {formatPrice(BUNDLE_PRICE)}
            </strong>
            {selectedItems.length === 3 && totalSavings > 0 && (
              <span className="ml-2 text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded">
                You Save {formatPrice(totalSavings)}!
              </span>
            )}
          </div>
          <button
            onClick={handleAddBundleToCart}
            disabled={selectedItems.length !== 3}
            className={`px-6 py-2.5 rounded-full text-xs uppercase tracking-wider font-semibold transition-all flex items-center gap-2 ${
              selectedItems.length === 3
                ? "bg-[#3B1425] text-white hover:bg-[#280D19] shadow-md cursor-pointer"
                : "bg-stone-200 text-stone-400 cursor-not-allowed"
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>
              {selectedItems.length === 3
                ? "Add Trio Box to Bag"
                : `Pick ${3 - selectedItems.length} more`}
            </span>
          </button>
        </div>
      </div>

      {/* Eligible products grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
        {eligibleProducts.map((product) => {
          const isSelected = selectedItems.some((p) => p.id === product.id);
          return (
            <div
              key={product.id}
              onClick={() => toggleSelect(product)}
              className={`p-2.5 rounded-xl border bg-white cursor-pointer transition-all relative ${
                isSelected
                  ? "border-[#3B1425] ring-2 ring-[#3B1425]/20 shadow-md"
                  : "border-stone-200 hover:border-stone-400"
              }`}
            >
              <div className="aspect-square rounded-lg overflow-hidden relative mb-2 bg-stone-100">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
                {isSelected && (
                  <div className="absolute inset-0 bg-[#3B1425]/40 backdrop-blur-[1px] flex items-center justify-center">
                    <div className="w-8 h-8 rounded-full bg-white text-[#3B1425] flex items-center justify-center shadow-lg font-bold">
                      <Check className="w-5 h-5" />
                    </div>
                  </div>
                )}
              </div>
              <h4 className="font-serif text-xs font-semibold text-stone-900 truncate">
                {product.name}
              </h4>
              <div className="flex items-center justify-between text-[11px] mt-1">
                <span className="text-stone-400 line-through">
                  {formatPrice(product.price)}
                </span>
                <span className="text-[#C4683C] font-semibold">
                  {isSelected ? "Selected" : "+ Select"}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
