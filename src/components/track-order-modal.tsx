import React, { useState } from "react";
import { X, Search, Package, Truck, CheckCircle2, Clock, MapPin, ArrowRight } from "lucide-react";
import { useAuth, type UserOrder } from "@/lib/firebase";
import { useCart } from "@/lib/cart-context";

export function TrackOrderModal({
  isOpen,
  onClose,
  initialQuery = "",
}: {
  isOpen: boolean;
  onClose: () => void;
  initialQuery?: string;
}) {
  const { trackOrder, orders } = useAuth();
  const { formatPrice } = useCart();
  const [query, setQuery] = useState(initialQuery || (orders[0]?.orderNumber ?? "UC-84920"));
  const [order, setOrder] = useState<UserOrder | null>(() => {
    return trackOrder(initialQuery || orders[0]?.orderNumber || "UC-84920");
  });
  const [searched, setSearched] = useState(false);

  if (!isOpen) return null;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    const found = trackOrder(query);
    setOrder(found);
    setSearched(true);
  };

  const getStepStatus = (
    currentStatus: UserOrder["status"],
    stepNumber: number
  ): "completed" | "active" | "pending" => {
    const statusOrder: Record<UserOrder["status"], number> = {
      Placed: 1,
      Confirmed: 2,
      Packed: 2,
      Dispatched: 3,
      Delivered: 4,
      Cancelled: 0,
    };
    const current = statusOrder[currentStatus] || 1;
    if (current > stepNumber) return "completed";
    if (current === stepNumber) return "active";
    return "pending";
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
      />

      <div className="relative min-h-screen flex items-center justify-center p-4">
        <div className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-[#E8DFD5] overflow-hidden">
          {/* Header */}
          <div className="p-5 border-b border-[#EBE4DA] bg-[#FAF7F2] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Truck className="w-5 h-5 text-[#C4683C]" />
              <h3 className="font-serif text-xl font-bold text-stone-900">
                Track Your Shipment
              </h3>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full text-stone-400 hover:text-black hover:bg-[#EFE9E0] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6 space-y-6">
            {/* Search form */}
            <form onSubmit={handleSearch} className="flex gap-2">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-stone-400 absolute left-3 top-3.5" />
                <input
                  type="text"
                  placeholder="Enter Order ID (e.g. UC-84920) or Phone"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 bg-[#FAF7F2] border border-stone-300 rounded-xl text-xs uppercase tracking-wider text-stone-900 font-mono focus:outline-none focus:border-[#3B1425]"
                />
              </div>
              <button
                type="submit"
                className="px-5 py-2.5 bg-[#3B1425] text-white text-xs font-semibold rounded-xl hover:bg-[#280D19] transition-colors"
              >
                Track
              </button>
            </form>

            {/* Quick Demo Search Chips */}
            {orders.length > 0 && (
              <div className="flex items-center gap-2 text-xs text-stone-500">
                <span>Recent Orders:</span>
                {orders.slice(0, 2).map((o) => (
                  <button
                    key={o.id}
                    type="button"
                    onClick={() => {
                      setQuery(o.orderNumber);
                      setOrder(trackOrder(o.orderNumber));
                    }}
                    className="font-mono px-2 py-0.5 rounded bg-stone-100 hover:bg-[#EBDDCF] text-stone-800 text-[11px]"
                  >
                    #{o.orderNumber}
                  </button>
                ))}
              </div>
            )}

            {/* Tracking Result */}
            {order ? (
              <div className="space-y-6 pt-2">
                {/* Status Bar */}
                <div className="p-4 rounded-xl bg-[#FAF7F2] border border-stone-200 flex flex-wrap items-center justify-between gap-3 text-xs">
                  <div>
                    <span className="text-stone-400 text-[11px] block">Order Number</span>
                    <strong className="text-stone-900 font-mono text-sm">#{order.orderNumber}</strong>
                  </div>
                  <div>
                    <span className="text-stone-400 text-[11px] block">Courier Partner</span>
                    <span className="text-stone-800 font-medium">{order.courier || "BlueDart Surface"}</span>
                  </div>
                  <div>
                    <span className="text-stone-400 text-[11px] block">AWB Tracking No.</span>
                    <span className="text-[#3B1425] font-mono font-semibold">
                      {order.trackingNumber || "BD-982348102IN"}
                    </span>
                  </div>
                </div>

                {/* Stepper */}
                <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-stone-200">
                  {/* Step 1 */}
                  <div className="relative flex items-start gap-4">
                    <span
                      className={`absolute -left-6 top-0 w-5 h-5 rounded-full flex items-center justify-center text-white text-[10px] ${
                        getStepStatus(order.status, 1) === "completed" ||
                        getStepStatus(order.status, 1) === "active"
                          ? "bg-emerald-600"
                          : "bg-stone-300"
                      }`}
                    >
                      ✓
                    </span>
                    <div>
                      <h4 className="text-xs font-bold text-stone-900">Order Placed</h4>
                      <p className="text-[11px] text-stone-500">
                        Received on {new Date(order.createdAt).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                        })}
                      </p>
                    </div>
                  </div>

                  {/* Step 2 */}
                  <div className="relative flex items-start gap-4">
                    <span
                      className={`absolute -left-6 top-0 w-5 h-5 rounded-full flex items-center justify-center text-white text-[10px] ${
                        getStepStatus(order.status, 2) === "completed" ||
                        getStepStatus(order.status, 2) === "active"
                          ? "bg-emerald-600"
                          : "bg-stone-300"
                      }`}
                    >
                      ✓
                    </span>
                    <div>
                      <h4 className="text-xs font-bold text-stone-900">Quality Checked & Packed</h4>
                      <p className="text-[11px] text-stone-500">
                        Dispatched from Uditas Creations Kolkata Studio
                      </p>
                    </div>
                  </div>

                  {/* Step 3 */}
                  <div className="relative flex items-start gap-4">
                    <span
                      className={`absolute -left-6 top-0 w-5 h-5 rounded-full flex items-center justify-center text-white text-[10px] ${
                        getStepStatus(order.status, 3) === "completed"
                          ? "bg-emerald-600"
                          : getStepStatus(order.status, 3) === "active"
                          ? "bg-[#C4683C] animate-pulse"
                          : "bg-stone-300"
                      }`}
                    >
                      {getStepStatus(order.status, 3) === "completed" ? "✓" : "3"}
                    </span>
                    <div>
                      <h4 className="text-xs font-bold text-stone-900">
                        In Transit with Courier
                      </h4>
                      <p className="text-[11px] text-stone-500">
                        On route via {order.courier} (Air Express)
                      </p>
                    </div>
                  </div>

                  {/* Step 4 */}
                  <div className="relative flex items-start gap-4">
                    <span
                      className={`absolute -left-6 top-0 w-5 h-5 rounded-full flex items-center justify-center text-white text-[10px] ${
                        order.status === "Delivered" ? "bg-emerald-600" : "bg-stone-300"
                      }`}
                    >
                      {order.status === "Delivered" ? "✓" : "4"}
                    </span>
                    <div>
                      <h4 className="text-xs font-bold text-stone-900">Delivered to Destination</h4>
                      <p className="text-[11px] text-stone-500">
                        {order.shippingAddress.city}, {order.shippingAddress.state} -{" "}
                        {order.shippingAddress.pincode}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Items in parcel */}
                <div className="pt-4 border-t border-stone-200">
                  <p className="text-xs font-semibold text-stone-700 mb-2">
                    Items in this package:
                  </p>
                  <div className="space-y-2 text-xs">
                    {order.items.map((it, i) => (
                      <div key={i} className="flex justify-between items-center text-stone-600">
                        <span>
                          {it.quantity}x {it.name} ({it.selectedColor || "Standard"})
                        </span>
                        <strong className="text-stone-900">{formatPrice(it.price * it.quantity)}</strong>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : searched ? (
              <div className="text-center py-8 text-stone-500 text-xs">
                <Package className="w-10 h-10 text-stone-300 mx-auto mb-2" />
                <p>No order found matching "{query}".</p>
                <p className="text-[11px] text-stone-400 mt-1">
                  Please verify your 5-digit Order ID or contact support.
                </p>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
