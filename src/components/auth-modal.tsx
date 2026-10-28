import React, { useState } from "react";
import {
  X,
  User,
  Package,
  MapPin,
  LogOut,
  Mail,
  Lock,
  Sparkles,
  CheckCircle2,
  ExternalLink,
  ShieldAlert,
} from "lucide-react";
import { useAuth, type UserAddress } from "@/lib/firebase";
import { useCart } from "@/lib/cart-context";

export function AuthModal({
  isOpen,
  onClose,
  onOpenTrackOrder,
}: {
  isOpen: boolean;
  onClose: () => void;
  onOpenTrackOrder?: (orderNum: string) => void;
}) {
  const { user, signIn, signUp, signInWithGoogle, logout, addAddress, removeAddress, orders, isConfigured } =
    useAuth();
  const { formatPrice } = useCart();

  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [activeTab, setActiveTab] = useState<"orders" | "addresses" | "profile">("orders");

  // Form states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Address form
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [addrName, setAddrName] = useState("");
  const [addrPhone, setAddrPhone] = useState("");
  const [addrStreet, setAddrStreet] = useState("");
  const [addrCity, setAddrCity] = useState("Kolkata");
  const [addrState, setAddrState] = useState("West Bengal");
  const [addrPincode, setAddrPincode] = useState("700091");

  if (!isOpen) return null;

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    setSubmitting(true);
    await signIn(email, password);
    setSubmitting(false);
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || !name) return;
    setSubmitting(true);
    await signUp(email, password, name);
    setSubmitting(false);
  };

  const handleAddAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!addrName || !addrPhone || !addrStreet || !addrPincode) return;
    await addAddress({
      fullName: addrName,
      phone: addrPhone,
      street: addrStreet,
      city: addrCity,
      state: addrState,
      pincode: addrPincode,
    });
    setShowAddressForm(false);
    setAddrName("");
    setAddrPhone("");
    setAddrStreet("");
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
              <span className="font-serif text-xl font-bold tracking-wide text-[#3B1425]">
                {user ? `Namaste, ${user.displayName || "Jewelry Lover"}` : "Customer Portal"}
              </span>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full text-stone-400 hover:text-black hover:bg-[#EFE9E0] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Integration Status Notice */}
          {!isConfigured && (
            <div className="bg-[#FFF9EE] border-b border-[#F7E7CD] px-5 py-2.5 flex items-center gap-2 text-xs text-[#8A5A25]">
              <Sparkles className="w-3.5 h-3.5 text-[#D4AF37] flex-shrink-0" />
              <span>
                <strong>Firebase Ready:</strong> Currently in demo preview mode. Connect your Firebase keys in <code className="bg-[#F6EBD7] px-1 py-0.5 rounded font-mono">.env</code> anytime for production live sync.
              </span>
            </div>
          )}

          {/* Logged in state */}
          {user ? (
            <div className="p-6">
              {/* Tab selector */}
              <div className="flex border-b border-stone-200 gap-6 text-xs uppercase tracking-widest font-semibold mb-6">
                <button
                  onClick={() => setActiveTab("orders")}
                  className={`pb-3 border-b-2 transition-all flex items-center gap-2 ${
                    activeTab === "orders"
                      ? "border-[#3B1425] text-[#3B1425]"
                      : "border-transparent text-stone-400 hover:text-stone-700"
                  }`}
                >
                  <Package className="w-4 h-4" />
                  <span>My Orders ({orders.length})</span>
                </button>
                <button
                  onClick={() => setActiveTab("addresses")}
                  className={`pb-3 border-b-2 transition-all flex items-center gap-2 ${
                    activeTab === "addresses"
                      ? "border-[#3B1425] text-[#3B1425]"
                      : "border-transparent text-stone-400 hover:text-stone-700"
                  }`}
                >
                  <MapPin className="w-4 h-4" />
                  <span>Addresses ({user.addresses?.length || 0})</span>
                </button>
                <button
                  onClick={() => setActiveTab("profile")}
                  className={`pb-3 border-b-2 transition-all flex items-center gap-2 ${
                    activeTab === "profile"
                      ? "border-[#3B1425] text-[#3B1425]"
                      : "border-transparent text-stone-400 hover:text-stone-700"
                  }`}
                >
                  <User className="w-4 h-4" />
                  <span>Profile Info</span>
                </button>
              </div>

              {/* Orders Tab */}
              {activeTab === "orders" && (
                <div className="space-y-4 max-h-[50vh] overflow-y-auto pr-1">
                  {orders.length === 0 ? (
                    <div className="text-center py-10 text-stone-500 text-sm">
                      <Package className="w-10 h-10 mx-auto text-stone-300 mb-2" />
                      <p>You haven't placed any orders yet.</p>
                    </div>
                  ) : (
                    orders.map((ord) => (
                      <div
                        key={ord.id}
                        className="p-4 rounded-xl border border-stone-200 bg-[#FAF7F2] space-y-3"
                      >
                        <div className="flex items-center justify-between text-xs">
                          <div>
                            <span className="font-mono font-bold text-stone-900">
                              Order #{ord.orderNumber}
                            </span>
                            <span className="text-stone-400 ml-2">
                              {new Date(ord.createdAt).toLocaleDateString("en-IN", {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              })}
                            </span>
                          </div>
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                              ord.status === "Delivered"
                                ? "bg-emerald-100 text-emerald-800"
                                : ord.status === "Dispatched"
                                ? "bg-blue-100 text-blue-800"
                                : "bg-amber-100 text-amber-800"
                            }`}
                          >
                            {ord.status}
                          </span>
                        </div>

                        <div className="space-y-1.5 text-xs text-stone-600">
                          {ord.items.map((item, i) => (
                            <div key={i} className="flex justify-between">
                              <span>
                                {item.quantity}x {item.name} ({item.selectedColor || "Standard"})
                              </span>
                              <span className="font-medium text-stone-900">
                                {formatPrice(item.price * item.quantity)}
                              </span>
                            </div>
                          ))}
                        </div>

                        <div className="pt-2 border-t border-stone-200 flex items-center justify-between text-xs">
                          <div>
                            <span className="text-stone-500">Total: </span>
                            <strong className="text-stone-900 text-sm">
                              {formatPrice(ord.total)}
                            </strong>
                            <span className="text-[11px] text-stone-400 ml-2">
                              via {ord.paymentMethod}
                            </span>
                          </div>
                          {onOpenTrackOrder && (
                            <button
                              onClick={() => {
                                onClose();
                                onOpenTrackOrder(ord.orderNumber);
                              }}
                              className="inline-flex items-center gap-1 text-[#C4683C] font-semibold hover:underline"
                            >
                              <span>Track Package</span>
                              <ExternalLink className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

              {/* Addresses Tab */}
              {activeTab === "addresses" && (
                <div className="space-y-4 max-h-[50vh] overflow-y-auto pr-1">
                  <div className="flex justify-between items-center">
                    <p className="text-xs text-stone-500">Saved shipping locations</p>
                    <button
                      onClick={() => setShowAddressForm(!showAddressForm)}
                      className="text-xs font-semibold text-[#3B1425] hover:underline"
                    >
                      {showAddressForm ? "Cancel" : "+ Add New Address"}
                    </button>
                  </div>

                  {showAddressForm && (
                    <form onSubmit={handleAddAddress} className="p-4 rounded-xl border border-stone-300 bg-[#FAF7F2] space-y-3 text-xs">
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="text"
                          placeholder="Full Name"
                          value={addrName}
                          onChange={(e) => setAddrName(e.target.value)}
                          required
                          className="p-2 border rounded bg-white"
                        />
                        <input
                          type="text"
                          placeholder="Phone Number"
                          value={addrPhone}
                          onChange={(e) => setAddrPhone(e.target.value)}
                          required
                          className="p-2 border rounded bg-white"
                        />
                      </div>
                      <input
                        type="text"
                        placeholder="House / Street / Apartment"
                        value={addrStreet}
                        onChange={(e) => setAddrStreet(e.target.value)}
                        required
                        className="w-full p-2 border rounded bg-white"
                      />
                      <div className="grid grid-cols-3 gap-2">
                        <input
                          type="text"
                          placeholder="City"
                          value={addrCity}
                          onChange={(e) => setAddrCity(e.target.value)}
                          required
                          className="p-2 border rounded bg-white"
                        />
                        <input
                          type="text"
                          placeholder="State"
                          value={addrState}
                          onChange={(e) => setAddrState(e.target.value)}
                          required
                          className="p-2 border rounded bg-white"
                        />
                        <input
                          type="text"
                          placeholder="PIN Code"
                          value={addrPincode}
                          onChange={(e) => setAddrPincode(e.target.value)}
                          required
                          className="p-2 border rounded bg-white"
                        />
                      </div>
                      <button
                        type="submit"
                        className="w-full py-2 bg-[#3B1425] text-white rounded font-semibold text-xs hover:bg-[#2A0E1A]"
                      >
                        Save Delivery Address
                      </button>
                    </form>
                  )}

                  {user.addresses && user.addresses.length > 0 ? (
                    user.addresses.map((addr) => (
                      <div
                        key={addr.id}
                        className="p-3.5 rounded-xl border border-stone-200 bg-white flex justify-between items-start text-xs"
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <strong className="text-stone-900">{addr.fullName}</strong>
                            {addr.isDefault && (
                              <span className="text-[10px] bg-stone-100 text-stone-600 px-1.5 py-0.5 rounded">
                                Default
                              </span>
                            )}
                          </div>
                          <p className="text-stone-600 mt-1">{addr.street}</p>
                          <p className="text-stone-500">
                            {addr.city}, {addr.state} - {addr.pincode}
                          </p>
                          <p className="text-stone-500 mt-0.5">📞 {addr.phone}</p>
                        </div>
                        <button
                          onClick={() => removeAddress(addr.id)}
                          className="text-stone-400 hover:text-red-600 text-[11px]"
                        >
                          Delete
                        </button>
                      </div>
                    ))
                  ) : (
                    <p className="text-center py-6 text-stone-400 text-xs">
                      No addresses saved yet.
                    </p>
                  )}
                </div>
              )}

              {/* Profile Tab */}
              {activeTab === "profile" && (
                <div className="space-y-4 max-h-[50vh] overflow-y-auto">
                  <div className="p-4 rounded-xl bg-[#FAF7F2] border border-stone-200 space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-stone-500">Full Name</span>
                      <strong className="text-stone-900">{user.displayName}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-stone-500">Email Address</span>
                      <strong className="text-stone-900">{user.email}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-stone-500">Phone</span>
                      <strong className="text-stone-900">{user.phoneNumber || "+91 98765 43210"}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-stone-500">Membership Tier</span>
                      <span className="text-[#C4683C] font-semibold">✨ Uditas Gold Member</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Sign Out CTA */}
              <div className="mt-6 pt-4 border-t border-stone-200 flex justify-between items-center">
                <span className="text-xs text-stone-500">Logged in as {user.email}</span>
                <button
                  onClick={logout}
                  className="flex items-center gap-1.5 text-xs text-red-600 font-semibold hover:text-red-700"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          ) : (
            /* Logged out state */
            <div className="p-6">
              {/* Mode toggles */}
              <div className="flex border-b border-stone-200 mb-6">
                <button
                  onClick={() => setMode("signin")}
                  className={`flex-1 pb-3 text-xs uppercase tracking-widest font-semibold border-b-2 transition-all ${
                    mode === "signin"
                      ? "border-[#3B1425] text-[#3B1425]"
                      : "border-transparent text-stone-400 hover:text-stone-700"
                  }`}
                >
                  Sign In
                </button>
                <button
                  onClick={() => setMode("signup")}
                  className={`flex-1 pb-3 text-xs uppercase tracking-widest font-semibold border-b-2 transition-all ${
                    mode === "signup"
                      ? "border-[#3B1425] text-[#3B1425]"
                      : "border-transparent text-stone-400 hover:text-stone-700"
                  }`}
                >
                  Create Account
                </button>
              </div>

              {/* Google Button */}
              <button
                type="button"
                onClick={signInWithGoogle}
                className="w-full py-2.5 px-4 border border-stone-300 rounded-xl flex items-center justify-center gap-2 text-xs font-semibold text-stone-700 hover:bg-stone-50 transition-colors shadow-sm mb-4"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span>Continue with Google</span>
              </button>

              <div className="relative flex py-2 items-center mb-4">
                <div className="flex-grow border-t border-stone-200"></div>
                <span className="flex-shrink mx-4 text-[11px] text-stone-400 uppercase tracking-widest font-medium">
                  Or with Email
                </span>
                <div className="flex-grow border-t border-stone-200"></div>
              </div>

              {/* Form */}
              <form onSubmit={mode === "signin" ? handleSignIn : handleSignUp} className="space-y-3.5">
                {mode === "signup" && (
                  <div>
                    <label className="block text-xs font-medium text-stone-700 mb-1">
                      Full Name
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                      <input
                        type="text"
                        placeholder="e.g. Moumita Saha"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        className="w-full pl-9 pr-3 py-2 border border-stone-300 rounded-xl text-xs text-stone-900 focus:outline-none focus:border-[#3B1425]"
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                    <input
                      type="email"
                      placeholder="you@domain.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full pl-9 pr-3 py-2 border border-stone-300 rounded-xl text-xs text-stone-900 focus:outline-none focus:border-[#3B1425]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                    <input
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="w-full pl-9 pr-3 py-2 border border-stone-300 rounded-xl text-xs text-stone-900 focus:outline-none focus:border-[#3B1425]"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full mt-2 py-3 bg-[#3B1425] text-white rounded-xl text-xs uppercase tracking-[0.2em] font-semibold hover:bg-[#280D19] transition-colors"
                >
                  {submitting
                    ? "Processing..."
                    : mode === "signin"
                    ? "Sign In to Account"
                    : "Create Account"}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
