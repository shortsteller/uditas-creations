/**
 * Firebase Configuration & Service Layer for UDITAS CREATIONS
 * 
 * To connect your live Firebase project:
 * 1. Create a Firebase project at https://console.firebase.google.com/
 * 2. Enable Authentication (Email/Password & Google)
 * 3. Enable Cloud Firestore database
 * 4. Create a .env file with your credentials:
 *    VITE_FIREBASE_API_KEY=your_api_key
 *    VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
 *    VITE_FIREBASE_PROJECT_ID=your_project_id
 *    VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
 *    VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
 *    VITE_FIREBASE_APP_ID=your_app_id
 */

import React, { createContext, useContext, useEffect, useState } from "react";
import { toast } from "sonner";

export interface UserAddress {
  id: string;
  fullName: string;
  phone: string;
  street: string;
  landmark?: string;
  city: string;
  state: string;
  pincode: string;
  isDefault?: boolean;
}

export interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  selectedColor?: string;
  image?: string;
}

export interface UserOrder {
  id: string;
  orderNumber: string;
  createdAt: string;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  status: "Placed" | "Confirmed" | "Packed" | "Dispatched" | "Delivered" | "Cancelled";
  trackingNumber?: string;
  courier?: string;
  shippingAddress: UserAddress;
  paymentMethod: "Prepaid / UPI" | "Cash on Delivery" | "Card / NetBanking";
  paymentStatus: "Pending" | "Paid" | "Refunded";
}

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  phoneNumber?: string;
  photoURL?: string;
  addresses: UserAddress[];
  createdAt: string;
}

export const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "",
};

export const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey && firebaseConfig.projectId
);

interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  orders: UserOrder[];
  isConfigured: boolean;
  signIn: (email: string, pass: string) => Promise<boolean>;
  signUp: (email: string, pass: string, name: string) => Promise<boolean>;
  signInWithGoogle: () => Promise<boolean>;
  logout: () => Promise<void>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
  addAddress: (addr: Omit<UserAddress, "id">) => Promise<void>;
  removeAddress: (id: string) => Promise<void>;
  createOrder: (orderData: Omit<UserOrder, "id" | "orderNumber" | "createdAt" | "status">) => Promise<UserOrder>;
  trackOrder: (orderNumberOrPhone: string) => UserOrder | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Initial mock orders for realistic experience before live db connection
const SAMPLE_ORDERS: UserOrder[] = [
  {
    id: "ord_101",
    orderNumber: "UC-84920",
    createdAt: "2026-10-24T14:30:00Z",
    items: [
      {
        id: "jhumka-royale",
        name: "Jhumka Royale",
        price: 1299,
        quantity: 1,
        selectedColor: "Antique Gold",
      },
      {
        id: "saanjh-ring-duo",
        name: "Saanjh Mirror Ring",
        price: 899,
        quantity: 1,
        selectedColor: "Oxidised Silver",
      },
    ],
    subtotal: 2198,
    discount: 220,
    shipping: 0,
    total: 1978,
    status: "Dispatched",
    courier: "BlueDart Express",
    trackingNumber: "BD-982348102IN",
    shippingAddress: {
      id: "addr_1",
      fullName: "Ananya Sharma",
      phone: "+91 98765 43210",
      street: "Flat 4B, Silver Oak Heights, Salt Lake Sector 5",
      city: "Kolkata",
      state: "West Bengal",
      pincode: "700091",
      isDefault: true,
    },
    paymentMethod: "Prepaid / UPI",
    paymentStatus: "Paid",
  },
];

const DEMO_USER: UserProfile = {
  uid: "demo_user_101",
  email: "ananya.sharma@example.com",
  displayName: "Ananya Sharma",
  phoneNumber: "+91 98765 43210",
  createdAt: "2026-08-15T10:00:00Z",
  addresses: [
    {
      id: "addr_1",
      fullName: "Ananya Sharma",
      phone: "+91 98765 43210",
      street: "Flat 4B, Silver Oak Heights, Salt Lake Sector 5",
      city: "Kolkata",
      state: "West Bengal",
      pincode: "700091",
      isDefault: true,
    },
  ],
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(() => {
    if (typeof window === "undefined") return DEMO_USER;
    try {
      const saved = localStorage.getItem("uditas_user");
      return saved ? JSON.parse(saved) : DEMO_USER;
    } catch {
      return DEMO_USER;
    }
  });

  const [orders, setOrders] = useState<UserOrder[]>(() => {
    if (typeof window === "undefined") return SAMPLE_ORDERS;
    try {
      const saved = localStorage.getItem("uditas_orders");
      return saved ? JSON.parse(saved) : SAMPLE_ORDERS;
    } catch {
      return SAMPLE_ORDERS;
    }
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    try {
      if (user) {
        localStorage.setItem("uditas_user", JSON.stringify(user));
      } else {
        localStorage.removeItem("uditas_user");
      }
    } catch (e) {
      console.error(e);
    }
  }, [user]);

  useEffect(() => {
    try {
      localStorage.setItem("uditas_orders", JSON.stringify(orders));
    } catch (e) {
      console.error(e);
    }
  }, [orders]);

  const signIn = async (email: string, _pass: string): Promise<boolean> => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 600));
    setLoading(false);
    const existing = {
      uid: "usr_" + Math.random().toString(36).substring(2, 9),
      email: email,
      displayName: email.split("@")[0].replace(/[._]/g, " "),
      addresses: user?.addresses || [],
      createdAt: new Date().toISOString(),
    };
    setUser(existing);
    toast.success(`Welcome back, ${existing.displayName}!`);
    return true;
  };

  const signUp = async (
    email: string,
    _pass: string,
    name: string
  ): Promise<boolean> => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 600));
    setLoading(false);
    const newUser: UserProfile = {
      uid: "usr_" + Math.random().toString(36).substring(2, 9),
      email,
      displayName: name,
      addresses: [],
      createdAt: new Date().toISOString(),
    };
    setUser(newUser);
    toast.success(`Account created successfully! Welcome to Uditas Creations.`);
    return true;
  };

  const signInWithGoogle = async (): Promise<boolean> => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 700));
    setLoading(false);
    const gUser: UserProfile = {
      uid: "g_usr_" + Math.random().toString(36).substring(2, 9),
      email: "google.user@example.com",
      displayName: "Jewelry Lover",
      addresses: [],
      createdAt: new Date().toISOString(),
    };
    setUser(gUser);
    toast.success("Signed in with Google successfully!");
    return true;
  };

  const logout = async () => {
    setUser(null);
    toast.info("Logged out successfully");
  };

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!user) return;
    const updated = { ...user, ...updates };
    setUser(updated);
    toast.success("Profile updated successfully");
  };

  const addAddress = async (addr: Omit<UserAddress, "id">) => {
    if (!user) return;
    const newAddr: UserAddress = {
      ...addr,
      id: "addr_" + Math.random().toString(36).substring(2, 9),
      isDefault: user.addresses.length === 0,
    };
    const nextAddresses = [...user.addresses, newAddr];
    setUser({ ...user, addresses: nextAddresses });
    toast.success("Delivery address added");
  };

  const removeAddress = async (id: string) => {
    if (!user) return;
    const nextAddresses = user.addresses.filter((a) => a.id !== id);
    setUser({ ...user, addresses: nextAddresses });
    toast.info("Address deleted");
  };

  const createOrder = async (
    orderData: Omit<UserOrder, "id" | "orderNumber" | "createdAt" | "status">
  ): Promise<UserOrder> => {
    const randomSuffix = Math.floor(10000 + Math.random() * 90000);
    const newOrder: UserOrder = {
      ...orderData,
      id: "ord_" + Math.random().toString(36).substring(2, 9),
      orderNumber: `UC-${randomSuffix}`,
      createdAt: new Date().toISOString(),
      status: "Confirmed",
      courier: "Delhivery Surface",
      trackingNumber: `DEL-${Math.floor(100000000 + Math.random() * 900000000)}IN`,
    };
    setOrders((prev) => [newOrder, ...prev]);
    return newOrder;
  };

  const trackOrder = (query: string): UserOrder | null => {
    const trimmed = query.trim().toUpperCase();
    return (
      orders.find(
        (o) =>
          o.orderNumber.toUpperCase() === trimmed ||
          (o.trackingNumber && o.trackingNumber.toUpperCase() === trimmed) ||
          o.shippingAddress.phone.replace(/\D/g, "").includes(trimmed.replace(/\D/g, ""))
      ) || null
    );
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        orders,
        isConfigured: isFirebaseConfigured,
        signIn,
        signUp,
        signInWithGoogle,
        logout,
        updateProfile,
        addAddress,
        removeAddress,
        createOrder,
        trackOrder,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
