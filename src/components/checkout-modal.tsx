import React, { useState } from "react";
import {
  X,
  ShieldCheck,
  CheckCircle2,
  CreditCard,
  Truck,
  MapPin,
  ChevronRight,
  ArrowLeft,
  Sparkles,
  QrCode,
  DollarSign,
  Phone,
} from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { useAuth, type UserOrder } from "@/lib/firebase";
import { processPayment, isPaymentGatewayConfigured } from "@/lib/payment";
import { SITE, waLink } from "@/lib/site";
import { toast } from "sonner";

export function CheckoutModal({
  isOpen,
  onClose,
  onOrderSuccess,
}: {
  isOpen: boolean;
  onClose: () => void;
  onOrderSuccess?: (order: UserOrder) => void;
}) {
  const { cart, cartSubtotal, cartTotal, appliedCoupon, couponDiscount, shippingFee, clearCart, formatPrice } =
    useCart();
  const { user, createOrder } = useAuth();

  const [step, setStep] = useState<"address" | "payment" | "success">("address");
  const [loading, setLoading] = useState(false);

  // Form Fields
  const [name, setName] = useState(user?.displayName || "Ananya Sharma");
  const [email, setEmail] = useState(user?.email || "ananya.sharma@example.com");
  const [phone, setPhone] = useState(user?.phoneNumber || "+91 98765 43210");
  const [street, setStreet] = useState(
    user?.addresses?.[0]?.street || "Flat 4B, Silver Oak Heights, Salt Lake Sector 5"
  );
  const [landmark, setLandmark] = useState("Near City Centre");
  const [city, setCity] = useState(user?.addresses?.[0]?.city || "Kolkata");
  const [state, setState] = useState(user?.addresses?.[0]?.state || "West Bengal");
  const [pincode, setPincode] = useState(user?.addresses?.[0]?.pincode || "700091");

  // Payment Selection
  const [paymentMethod, setPaymentMethod] = useState<"online" | "cod">("online");
  const [completedOrder, setCompletedOrder] = useState<UserOrder | null>(null);

  if (!isOpen) return null;

  const handlePincodeChange = (val: string) => {
    setPincode(val);
    if (val.startsWith("700")) {
      setCity("Kolkata");
      setState("West Bengal");
    } else if (val.startsWith("110")) {
      setCity("New Delhi");
      setState("Delhi");
    } else if (val.startsWith("400")) {
      setCity("Mumbai");
      setState("Maharashtra");
    } else if (val.startsWith("560")) {
      setCity("Bengaluru");
      setState("Karnataka");
    }
  };

  const handleProceedToPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone || !street || !pincode) {
      toast.error("Please fill in all shipping details");
      return;
    }
    setStep("payment");
  };

  const handlePlaceOrder = async () => {
    setLoading(true);
    const orderData = {
      items: cart.map((i) => ({
        id: i.product.id,
        name: i.product.name,
        price: i.product.price,
        quantity: i.quantity,
        selectedColor: i.selectedColor,
        image: i.product.image,
      })),
      subtotal: cartSubtotal,
      discount: couponDiscount,
      shipping: shippingFee,
      total: cartTotal,
      shippingAddress: {
        id: "addr_checkout",
        fullName: name,
        phone,
        street,
        landmark,
        city,
        state,
        pincode,
      },
      paymentMethod:
        paymentMethod === "online" ? ("Prepaid / UPI" as const) : ("Cash on Delivery" as const),
      paymentStatus:
        paymentMethod === "online" ? ("Paid" as const) : ("Pending" as const),
    };

    try {
      // Execute payment layer (Razorpay, Stripe or Demo simulator)
      const payRes = await processPayment(
        {
          orderId: `TMP-${Date.now()}`,
          amount: cartTotal,
          customerName: name,
          customerEmail: email,
          customerPhone: phone,
          description: "Uditas Creations Handcrafted Jewelry",
        },
        paymentMethod
      );

      if (!payRes.success) {
        toast.error(payRes.error || "Payment was not completed.");
        setLoading(false);
        return;
      }

      // Save order in Firebase/storage
      const finalOrder = await createOrder(orderData);
      setCompletedOrder(finalOrder);
      clearCart();
      setStep("success");
      if (onOrderSuccess) onOrderSuccess(finalOrder);
      toast.success("Order confirmed successfully!");
    } catch (err: any) {
      toast.error(err.message || "Failed to place order.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        onClick={step === "success" ? onClose : undefined}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
      />

      <div className="relative min-h-screen flex items-center justify-center p-4">
        <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-[#E8DFD5] overflow-hidden">
          {/* Header */}
          <div className="p-5 border-b border-[#EBE4DA] bg-[#FAF7F2] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-serif text-xl font-bold tracking-wide text-[#3B1425]">
                UDITAS CREATIONS
              </span>
              <span className="text-xs text-stone-400 font-sans">| Checkout</span>
            </div>
            {step !== "success" && (
              <button
                onClick={onClose}
                className="p-1.5 rounded-full text-stone-400 hover:text-black hover:bg-[#EFE9E0] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Stepper indicator */}
          {step !== "success" && (
            <div className="bg-[#FFFDF9] px-6 py-3 border-b border-[#F0E9DF] flex items-center justify-center gap-6 text-xs uppercase tracking-wider font-semibold">
              <div
                className={`flex items-center gap-1.5 ${
                  step === "address" ? "text-[#3B1425]" : "text-emerald-700"
                }`}
              >
                <span
                  className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] ${
                    step === "address"
                      ? "bg-[#3B1425] text-white"
                      : "bg-emerald-700 text-white"
                  }`}
                >
                  1
                </span>
                <span>Shipping Address</span>
              </div>
              <ChevronRight className="w-4 h-4 text-stone-300" />
              <div
                className={`flex items-center gap-1.5 ${
                  step === "payment" ? "text-[#3B1425]" : "text-stone-400"
                }`}
              >
                <span
                  className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] ${
                    step === "payment"
                      ? "bg-[#3B1425] text-white"
                      : "bg-stone-200 text-stone-600"
                  }`}
                >
                  2
                </span>
                <span>Payment</span>
              </div>
            </div>
          )}

          {/* Step 1: Address Form */}
          {step === "address" && (
            <form onSubmit={handleProceedToPayment} className="p-6 space-y-4">
              <h3 className="font-serif text-lg font-semibold text-stone-900 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#C4683C]" />
                <span>Delivery Address & Contact Details</span>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block font-medium text-stone-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full p-2.5 border border-stone-300 rounded-lg focus:outline-none focus:border-[#3B1425]"
                  />
                </div>
                <div>
                  <label className="block font-medium text-stone-700 mb-1">
                    Phone Number (for Courier & Tracking)
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                    className="w-full p-2.5 border border-stone-300 rounded-lg focus:outline-none focus:border-[#3B1425]"
                  />
                </div>
              </div>

              <div className="text-xs">
                <label className="block font-medium text-stone-700 mb-1">Email (for Invoice)</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full p-2.5 border border-stone-300 rounded-lg focus:outline-none focus:border-[#3B1425]"
                />
              </div>

              <div className="text-xs">
                <label className="block font-medium text-stone-700 mb-1">
                  Flat, House No., Building, Apartment
                </label>
                <input
                  type="text"
                  value={street}
                  onChange={(e) => setStreet(e.target.value)}
                  required
                  className="w-full p-2.5 border border-stone-300 rounded-lg focus:outline-none focus:border-[#3B1425]"
                />
              </div>

              <div className="grid grid-cols-3 gap-3 text-xs">
                <div>
                  <label className="block font-medium text-stone-700 mb-1">PIN Code</label>
                  <input
                    type="text"
                    value={pincode}
                    maxLength={6}
                    onChange={(e) => handlePincodeChange(e.target.value)}
                    required
                    className="w-full p-2.5 border border-stone-300 rounded-lg font-mono focus:outline-none focus:border-[#3B1425]"
                  />
                </div>
                <div>
                  <label className="block font-medium text-stone-700 mb-1">City</label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    required
                    className="w-full p-2.5 border border-stone-300 rounded-lg focus:outline-none focus:border-[#3B1425]"
                  />
                </div>
                <div>
                  <label className="block font-medium text-stone-700 mb-1">State</label>
                  <input
                    type="text"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    required
                    className="w-full p-2.5 border border-stone-300 rounded-lg focus:outline-none focus:border-[#3B1425]"
                  />
                </div>
              </div>

              {/* Order quick summary */}
              <div className="p-3 bg-[#FAF7F2] rounded-xl border border-stone-200 text-xs flex justify-between items-center">
                <span className="text-stone-600">
                  {cart.reduce((s, i) => s + i.quantity, 0)} Items in Bag | Total:
                </span>
                <strong className="text-stone-900 font-serif text-base">
                  {formatPrice(cartTotal)}
                </strong>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-[#3B1425] text-white rounded-xl text-xs uppercase tracking-[0.2em] font-semibold hover:bg-[#280D19] transition-colors flex items-center justify-center gap-2"
              >
                <span>Continue to Payment</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* Step 2: Payment */}
          {step === "payment" && (
            <div className="p-6 space-y-5">
              <button
                onClick={() => setStep("address")}
                className="inline-flex items-center gap-1.5 text-xs text-stone-500 hover:text-stone-900"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to Shipping Address</span>
              </button>

              <h3 className="font-serif text-lg font-semibold text-stone-900">
                Choose Payment Method
              </h3>

              <div className="space-y-3">
                {/* Online Payment Option */}
                <label
                  onClick={() => setPaymentMethod("online")}
                  className={`block p-4 rounded-xl border-2 cursor-pointer transition-all ${
                    paymentMethod === "online"
                      ? "border-[#3B1425] bg-[#FFF9F6]"
                      : "border-stone-200 hover:border-stone-300"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex gap-3">
                      <input
                        type="radio"
                        checked={paymentMethod === "online"}
                        onChange={() => setPaymentMethod("online")}
                        className="mt-1 accent-[#3B1425]"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <strong className="text-sm text-stone-900">
                            Online Payment (UPI, Cards, NetBanking)
                          </strong>
                          <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.5 rounded">
                            FASTEST & SECURE
                          </span>
                        </div>
                        <p className="text-xs text-stone-500 mt-1">
                          Google Pay, PhonePe, Paytm, Any UPI, Credit/Debit Cards, NetBanking.
                        </p>
                        <div className="flex gap-2 mt-2">
                          <span className="text-[11px] bg-stone-100 px-2 py-0.5 rounded border text-stone-600">
                            UPI QR
                          </span>
                          <span className="text-[11px] bg-stone-100 px-2 py-0.5 rounded border text-stone-600">
                            Visa / RuPay / MC
                          </span>
                          <span className="text-[11px] bg-stone-100 px-2 py-0.5 rounded border text-stone-600">
                            Net Banking
                          </span>
                        </div>
                      </div>
                    </div>
                    <QrCode className="w-6 h-6 text-[#3B1425] flex-shrink-0" />
                  </div>
                </label>

                {/* Cash on Delivery Option */}
                <label
                  onClick={() => setPaymentMethod("cod")}
                  className={`block p-4 rounded-xl border-2 cursor-pointer transition-all ${
                    paymentMethod === "cod"
                      ? "border-[#3B1425] bg-[#FFF9F6]"
                      : "border-stone-200 hover:border-stone-300"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex gap-3">
                      <input
                        type="radio"
                        checked={paymentMethod === "cod"}
                        onChange={() => setPaymentMethod("cod")}
                        className="mt-1 accent-[#3B1425]"
                      />
                      <div>
                        <strong className="text-sm text-stone-900">
                          Cash on Delivery (COD)
                        </strong>
                        <p className="text-xs text-stone-500 mt-1">
                          Pay cash to courier partner when the parcel arrives at your doorstep.
                        </p>
                      </div>
                    </div>
                    <Truck className="w-6 h-6 text-[#C4683C] flex-shrink-0" />
                  </div>
                </label>
              </div>

              {/* Payment Summary */}
              <div className="p-4 bg-[#FAF7F2] rounded-xl border border-stone-200 text-xs space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-stone-500">Order Subtotal</span>
                  <span className="text-stone-900">{formatPrice(cartSubtotal)}</span>
                </div>
                {couponDiscount > 0 && (
                  <div className="flex justify-between text-emerald-700">
                    <span>Discount</span>
                    <span>-{formatPrice(couponDiscount)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-stone-500">Shipping</span>
                  <span className="text-emerald-700 font-medium">
                    {shippingFee === 0 ? "FREE" : formatPrice(shippingFee)}
                  </span>
                </div>
                <div className="flex justify-between text-base font-bold text-stone-900 pt-2 border-t border-stone-200">
                  <span>Grand Total</span>
                  <span className="font-serif text-[#3B1425]">{formatPrice(cartTotal)}</span>
                </div>
              </div>

              <button
                type="button"
                disabled={loading}
                onClick={handlePlaceOrder}
                className="w-full py-3.5 bg-gradient-to-r from-[#3B1425] to-[#521C34] text-white rounded-xl text-xs uppercase tracking-[0.2em] font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2"
              >
                {loading ? (
                  <span>Processing Payment...</span>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4 text-[#D4AF37]" />
                    <span>Pay {formatPrice(cartTotal)} & Confirm Order</span>
                  </>
                )}
              </button>
            </div>
          )}

          {/* Step 3: Success Screen */}
          {step === "success" && completedOrder && (
            <div className="p-8 text-center space-y-5">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div>
                <span className="text-xs uppercase tracking-widest text-[#C4683C] font-semibold">
                  Payment Confirmed
                </span>
                <h3 className="font-serif text-3xl font-bold text-stone-900 mt-1">
                  Thank You For Your Order!
                </h3>
                <p className="text-xs text-stone-500 mt-2">
                  We've received your order and our Kolkata studio has started handcrafting & packing your pieces.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#FAF7F2] border border-stone-200 text-left text-xs space-y-2 max-w-md mx-auto">
                <div className="flex justify-between">
                  <span className="text-stone-500">Order Number:</span>
                  <strong className="text-stone-900 font-mono">{completedOrder.orderNumber}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">Tracking Code:</span>
                  <span className="font-mono text-[#3B1425] font-semibold">
                    {completedOrder.trackingNumber}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">Courier Partner:</span>
                  <span className="text-stone-800">{completedOrder.courier}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">Delivery Address:</span>
                  <span className="text-stone-800 text-right truncate max-w-[200px]">
                    {completedOrder.shippingAddress.street}, {completedOrder.shippingAddress.city}
                  </span>
                </div>
                <div className="flex justify-between pt-2 border-t border-stone-200">
                  <span className="text-stone-500">Total Paid:</span>
                  <strong className="text-stone-900 text-sm font-serif">
                    {formatPrice(completedOrder.total)}
                  </strong>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 justify-center max-w-md mx-auto pt-2">
                <a
                  href={waLink(
                    `Hi Uditas Creations! I placed order #${completedOrder.orderNumber} for ${formatPrice(
                      completedOrder.total
                    )}. Looking forward to receiving it!`
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-3 px-4 bg-[#25D366] text-white rounded-xl text-xs uppercase tracking-wider font-semibold hover:bg-[#20bd5a] transition-colors flex items-center justify-center gap-2"
                >
                  <Phone className="w-4 h-4" />
                  <span>Notify via WhatsApp</span>
                </a>
                <button
                  onClick={onClose}
                  className="flex-1 py-3 px-4 bg-[#3B1425] text-white rounded-xl text-xs uppercase tracking-wider font-semibold hover:bg-[#280D19] transition-colors"
                >
                  Continue Shopping
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
