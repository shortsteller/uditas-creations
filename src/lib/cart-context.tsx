import React, { createContext, useContext, useEffect, useState } from "react";
import { type Product } from "./products";
import { toast } from "sonner";

export type CartItem = {
  product: Product;
  quantity: number;
  selectedColor?: string;
};

export type Currency = "INR" | "USD" | "EUR" | "GBP" | "AED";

export type Coupon = {
  code: string;
  discountPercent: number;
  minSpend?: number;
  description: string;
};

const VALID_COUPONS: Record<string, Coupon> = {
  UDITA10: {
    code: "UDITA10",
    discountPercent: 10,
    description: "10% OFF on all orders",
  },
  FESTIVE20: {
    code: "FESTIVE20",
    discountPercent: 20,
    minSpend: 1999,
    description: "20% OFF on festive orders above ₹1,999",
  },
  PREPAID15: {
    code: "PREPAID15",
    discountPercent: 15,
    description: "15% OFF special prepaid discount",
  },
};

const CURRENCY_RATES: Record<Currency, { symbol: string; rate: number }> = {
  INR: { symbol: "₹", rate: 1 },
  USD: { symbol: "$", rate: 0.012 },
  EUR: { symbol: "€", rate: 0.011 },
  GBP: { symbol: "£", rate: 0.0095 },
  AED: { symbol: "AED ", rate: 0.044 },
};

interface CartContextType {
  cart: CartItem[];
  wishlist: Product[];
  addToCart: (product: Product, quantity?: number, selectedColor?: string) => void;
  removeFromCart: (productId: string, selectedColor?: string) => void;
  updateQuantity: (productId: string, quantity: number, selectedColor?: string) => void;
  clearCart: () => void;
  toggleWishlist: (product: Product) => void;
  isInWishlist: (productId: string) => boolean;
  cartSubtotal: number;
  cartTotal: number;
  cartCount: number;
  wishlistCount: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  currency: Currency;
  setCurrency: (c: Currency) => void;
  formatPrice: (inrAmount: number) => string;
  appliedCoupon: Coupon | null;
  couponDiscount: number;
  applyCoupon: (code: string) => boolean;
  removeCoupon: () => void;
  freeShippingThreshold: number;
  shippingFee: number;
  freeShippingProgress: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      const saved = localStorage.getItem("uditas_cart");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [wishlist, setWishlist] = useState<Product[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      const saved = localStorage.getItem("uditas_wishlist");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(() => {
    if (typeof window === "undefined") return null;
    try {
      const saved = localStorage.getItem("uditas_coupon");
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [currency, setCurrencyState] = useState<Currency>(() => {
    if (typeof window === "undefined") return "INR";
    return (localStorage.getItem("uditas_currency") as Currency) || "INR";
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem("uditas_cart", JSON.stringify(cart));
    } catch (e) {
      console.error(e);
    }
  }, [cart]);

  useEffect(() => {
    try {
      localStorage.setItem("uditas_wishlist", JSON.stringify(wishlist));
    } catch (e) {
      console.error(e);
    }
  }, [wishlist]);

  useEffect(() => {
    try {
      if (appliedCoupon) {
        localStorage.setItem("uditas_coupon", JSON.stringify(appliedCoupon));
      } else {
        localStorage.removeItem("uditas_coupon");
      }
    } catch (e) {
      console.error(e);
    }
  }, [appliedCoupon]);

  const setCurrency = (c: Currency) => {
    setCurrencyState(c);
    localStorage.setItem("uditas_currency", c);
    toast.success(`Currency changed to ${c}`);
  };

  const formatPrice = (inrAmount: number) => {
    const config = CURRENCY_RATES[currency] || CURRENCY_RATES.INR;
    const converted = inrAmount * config.rate;
    if (currency === "INR") {
      return `${config.symbol}${Math.round(converted).toLocaleString("en-IN")}`;
    }
    return `${config.symbol}${converted.toFixed(2)}`;
  };

  const freeShippingThreshold = 799;

  const cartSubtotal = cart.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const couponDiscount = appliedCoupon
    ? Math.round((cartSubtotal * appliedCoupon.discountPercent) / 100)
    : 0;

  const shippingFee = cartSubtotal === 0 || cartSubtotal >= freeShippingThreshold ? 0 : 70;
  const cartTotal = Math.max(0, cartSubtotal - couponDiscount + shippingFee);

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const wishlistCount = wishlist.length;

  const freeShippingProgress = Math.min(
    100,
    Math.round((cartSubtotal / freeShippingThreshold) * 100)
  );

  const addToCart = (
    product: Product,
    quantity = 1,
    selectedColor?: string
  ) => {
    const chosenColor = selectedColor || product.colors?.[0] || "Standard";
    setCart((prev) => {
      const existingIdx = prev.findIndex(
        (i) => i.product.id === product.id && i.selectedColor === chosenColor
      );
      if (existingIdx > -1) {
        const next = [...prev];
        next[existingIdx] = {
          ...next[existingIdx],
          quantity: next[existingIdx].quantity + quantity,
        };
        return next;
      }
      return [...prev, { product, quantity, selectedColor: chosenColor }];
    });
    toast.success(`Added ${product.name} to your bag!`, {
      description: `Color: ${chosenColor} | Qty: ${quantity}`,
      action: {
        label: "View Bag",
        onClick: () => setIsCartOpen(true),
      },
    });
  };

  const removeFromCart = (productId: string, selectedColor?: string) => {
    setCart((prev) =>
      prev.filter(
        (i) => !(i.product.id === productId && (!selectedColor || i.selectedColor === selectedColor))
      )
    );
    toast.info("Item removed from bag");
  };

  const updateQuantity = (
    productId: string,
    quantity: number,
    selectedColor?: string
  ) => {
    if (quantity <= 0) {
      removeFromCart(productId, selectedColor);
      return;
    }
    setCart((prev) =>
      prev.map((i) => {
        if (i.product.id === productId && (!selectedColor || i.selectedColor === selectedColor)) {
          return { ...i, quantity };
        }
        return i;
      })
    );
  };

  const clearCart = () => {
    setCart([]);
    setAppliedCoupon(null);
  };

  const toggleWishlist = (product: Product) => {
    const exists = wishlist.some((p) => p.id === product.id);
    if (exists) {
      setWishlist((prev) => prev.filter((p) => p.id !== product.id));
      toast.info(`Removed ${product.name} from Wishlist`);
    } else {
      setWishlist((prev) => [...prev, product]);
      toast.success(`Saved to Wishlist!`, {
        description: product.name,
      });
    }
  };

  const isInWishlist = (productId: string) => {
    return wishlist.some((p) => p.id === productId);
  };

  const applyCoupon = (code: string): boolean => {
    const upper = code.trim().toUpperCase();
    const coupon = VALID_COUPONS[upper];
    if (!coupon) {
      toast.error("Invalid coupon code. Try 'UDITA10' or 'FESTIVE20'");
      return false;
    }
    if (coupon.minSpend && cartSubtotal < coupon.minSpend) {
      toast.error(
        `Coupon requires a minimum spend of ₹${coupon.minSpend}. Add ₹${
          coupon.minSpend - cartSubtotal
        } more to apply.`
      );
      return false;
    }
    setAppliedCoupon(coupon);
    toast.success(`Coupon applied! ${coupon.discountPercent}% discount added.`);
    return true;
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    toast.info("Coupon removed");
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        wishlist,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        toggleWishlist,
        isInWishlist,
        cartSubtotal,
        cartTotal,
        cartCount,
        wishlistCount,
        isCartOpen,
        setIsCartOpen,
        isSearchOpen,
        setIsSearchOpen,
        isAuthModalOpen,
        setIsAuthModalOpen,
        currency,
        setCurrency,
        formatPrice,
        appliedCoupon,
        couponDiscount,
        applyCoupon,
        removeCoupon,
        freeShippingThreshold,
        shippingFee,
        freeShippingProgress,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
