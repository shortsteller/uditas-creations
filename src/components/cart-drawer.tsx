import React, { useState } from "react";
import { X, Plus, Minus, Trash2, ShoppingBag, ArrowRight, ShieldCheck, Tag, Gift } from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { Link } from "@tanstack/react-router";

export function CartDrawer({ onCheckout }: { onCheckout: () => void }) {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    removeFromCart,
    updateQuantity,
    cartSubtotal,
    cartTotal,
    appliedCoupon,
    couponDiscount,
    applyCoupon,
    removeCoupon,
    freeShippingThreshold,
    shippingFee,
    freeShippingProgress,
    formatPrice,
  } = useCart();

  const [couponCode, setCouponCode] = useState("");
  const [giftNote, setGiftNote] = useState("");
  const [showGiftInput, setShowGiftInput] = useState(false);

  if (!isCartOpen) return null;

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode.trim()) return;
    const ok = applyCoupon(couponCode);
    if (ok) setCouponCode("");
  };

  const amountNeededForFreeShipping = Math.max(0, freeShippingThreshold - cartSubtotal);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={() => setIsCartOpen(false)}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 flex max-w-full pl-10">
        <div className="w-screen max-w-md bg-[#FAF7F2] shadow-2xl flex flex-col">
          {/* Header */}
          <div className="p-5 border-b border-[#E8E1D5] bg-[#FFFFFF] flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <ShoppingBag className="w-5 h-5 text-[#3B1425]" />
              <h2 className="font-serif text-xl font-semibold text-[#1F151A]">
                Your Shopping Bag
              </h2>
              <span className="text-xs bg-[#F2EAE0] text-[#7A5A65] font-semibold px-2 py-0.5 rounded-full">
                {cart.reduce((s, i) => s + i.quantity, 0)}
              </span>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-2 rounded-full text-stone-500 hover:text-black hover:bg-[#F2ECE4] transition-colors"
              aria-label="Close cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Bar */}
          <div className="bg-[#FFF8F0] px-5 py-3 border-b border-[#EFE4D6]">
            <div className="flex items-center justify-between text-xs text-[#5D3A20] mb-1.5 font-medium">
              <span>
                {amountNeededForFreeShipping === 0
                  ? "🎉 You unlocked FREE Express Shipping!"
                  : `Add ${formatPrice(amountNeededForFreeShipping)} more for FREE Express Shipping`}
              </span>
              <span className="font-bold">{freeShippingProgress}%</span>
            </div>
            <div className="w-full bg-[#E8D9C8] h-2 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-[#C4683C] to-[#D4AF37] h-full transition-all duration-500 ease-out rounded-full"
                style={{ width: `${freeShippingProgress}%` }}
              />
            </div>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12">
                <div className="w-20 h-20 rounded-full bg-[#F5ECE1] flex items-center justify-center mb-4">
                  <ShoppingBag className="w-9 h-9 text-[#C4683C]" />
                </div>
                <h3 className="font-serif text-2xl font-medium text-stone-800">
                  Your bag is empty
                </h3>
                <p className="text-sm text-stone-500 mt-2 max-w-xs">
                  Looks like you haven't added any handcrafted pieces yet.
                </p>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="mt-6 inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#3B1425] text-white text-xs uppercase tracking-widest font-semibold hover:bg-[#280D19] transition-all"
                >
                  Explore Collections <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            ) : (
              cart.map((item, idx) => (
                <div
                  key={`${item.product.id}-${item.selectedColor}-${idx}`}
                  className="flex gap-4 p-3.5 bg-white rounded-xl border border-[#EBE4DA] shadow-sm relative group"
                >
                  {/* Thumbnail */}
                  <Link
                    to="/product/$id"
                    params={{ id: item.product.id }}
                    onClick={() => setIsCartOpen(false)}
                    className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 bg-stone-100 border border-stone-200"
                  >
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform"
                    />
                  </Link>

                  {/* Info */}
                  <div className="flex-1 flex flex-col justify-between min-w-0">
                    <div>
                      <div className="flex justify-between items-start gap-2">
                        <Link
                          to="/product/$id"
                          params={{ id: item.product.id }}
                          onClick={() => setIsCartOpen(false)}
                          className="font-serif text-base font-semibold text-stone-900 truncate hover:text-[#C4683C] transition-colors"
                        >
                          {item.product.name}
                        </Link>
                        <button
                          onClick={() =>
                            removeFromCart(item.product.id, item.selectedColor)
                          }
                          className="text-stone-400 hover:text-red-600 transition-colors"
                          title="Remove item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <p className="text-xs text-stone-500 mt-0.5">
                        Finish:{" "}
                        <span className="font-medium text-stone-700">
                          {item.selectedColor}
                        </span>
                      </p>
                    </div>

                    <div className="flex items-center justify-between mt-3">
                      {/* Quantity controls */}
                      <div className="flex items-center border border-[#DDD5C7] rounded-full bg-[#FDFBF7]">
                        <button
                          onClick={() =>
                            updateQuantity(
                              item.product.id,
                              item.quantity - 1,
                              item.selectedColor
                            )
                          }
                          className="w-7 h-7 flex items-center justify-center text-stone-600 hover:text-stone-900"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-7 text-center text-xs font-semibold text-stone-800">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(
                              item.product.id,
                              item.quantity + 1,
                              item.selectedColor
                            )
                          }
                          className="w-7 h-7 flex items-center justify-center text-stone-600 hover:text-stone-900"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      {/* Price */}
                      <div className="text-right">
                        <span className="font-medium text-sm text-[#1F151A]">
                          {formatPrice(item.product.price * item.quantity)}
                        </span>
                        {item.product.mrp > item.product.price && (
                          <span className="text-[11px] text-stone-400 line-through ml-1.5">
                            {formatPrice(item.product.mrp * item.quantity)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer & Checkout Breakdown */}
          {cart.length > 0 && (
            <div className="p-5 bg-white border-t border-[#E8E1D5] space-y-4">
              {/* Coupon input */}
              <div>
                {appliedCoupon ? (
                  <div className="flex items-center justify-between bg-[#F2F8F2] border border-[#C5E1C5] px-3.5 py-2 rounded-lg text-xs">
                    <div className="flex items-center gap-2 text-emerald-800 font-medium">
                      <Tag className="w-4 h-4 text-emerald-600" />
                      <span>
                        Code <strong className="uppercase">{appliedCoupon.code}</strong> applied ({appliedCoupon.discountPercent}% OFF)
                      </span>
                    </div>
                    <button
                      onClick={removeCoupon}
                      className="text-stone-400 hover:text-red-500 font-bold ml-2"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyCoupon} className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Discount code (e.g. UDITA10)"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      className="flex-1 bg-[#FAF7F2] border border-[#DDD5C7] rounded-lg px-3.5 py-2 text-xs uppercase tracking-wider text-stone-800 focus:outline-none focus:border-[#3B1425]"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 bg-[#3B1425] text-white text-xs font-semibold rounded-lg hover:bg-[#280D19] transition-colors"
                    >
                      Apply
                    </button>
                  </form>
                )}
              </div>

              {/* Gift message toggle */}
              <div>
                <button
                  onClick={() => setShowGiftInput(!showGiftInput)}
                  className="flex items-center gap-1.5 text-xs text-[#8A5A38] hover:text-[#5B3921] font-medium"
                >
                  <Gift className="w-3.5 h-3.5" />
                  <span>{showGiftInput ? "Hide Gift Note" : "+ Add Gift Packaging & Note (Free)"}</span>
                </button>
                {showGiftInput && (
                  <textarea
                    rows={2}
                    value={giftNote}
                    onChange={(e) => setGiftNote(e.target.value)}
                    placeholder="Write a warm note for the recipient..."
                    className="w-full mt-2 text-xs bg-[#FAF7F2] border border-[#DDD5C7] rounded-lg p-2.5 text-stone-800 focus:outline-none focus:border-[#3B1425]"
                  />
                )}
              </div>

              {/* Breakdown */}
              <div className="space-y-1.5 text-xs text-stone-600 pt-2 border-t border-stone-100">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-medium text-stone-900">{formatPrice(cartSubtotal)}</span>
                </div>
                {appliedCoupon && (
                  <div className="flex justify-between text-emerald-700">
                    <span>Coupon Discount</span>
                    <span>-{formatPrice(couponDiscount)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className={shippingFee === 0 ? "text-emerald-700 font-medium" : "text-stone-900"}>
                    {shippingFee === 0 ? "FREE" : formatPrice(shippingFee)}
                  </span>
                </div>
                <div className="flex justify-between text-base font-semibold text-stone-900 pt-2 border-t border-stone-200">
                  <span>Total Payable</span>
                  <span className="text-[#3B1425] font-serif text-lg">{formatPrice(cartTotal)}</span>
                </div>
              </div>

              {/* Checkout CTA */}
              <button
                onClick={() => {
                  setIsCartOpen(false);
                  onCheckout();
                }}
                className="w-full py-3.5 bg-gradient-to-r from-[#3B1425] via-[#521C34] to-[#3B1425] text-white rounded-xl text-xs uppercase tracking-[0.2em] font-semibold shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 group"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <div className="flex items-center justify-center gap-2 text-[11px] text-stone-500">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>100% Secure Checkout | COD & UPI Available</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
