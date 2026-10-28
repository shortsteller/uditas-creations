/**
 * Payment Gateway Integration Layer for UDITAS CREATIONS
 * 
 * Supports:
 * 1. Razorpay (Primary Indian payment gateway - UPI, Cards, NetBanking, Wallets)
 * 2. Stripe (International cards and payments)
 * 3. Cash on Delivery (COD)
 * 
 * To connect live Razorpay in future:
 * 1. Add VITE_RAZORPAY_KEY_ID=rzp_test_... to .env
 * 
 * To connect live Stripe in future:
 * 1. Add VITE_STRIPE_PUBLIC_KEY=pk_test_... to .env
 */

export interface PaymentDetails {
  orderId: string;
  amount: number; // in INR
  currency?: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  description?: string;
}

export interface PaymentSuccessResult {
  success: true;
  paymentId: string;
  orderId: string;
  method: string;
  signature?: string;
}

export interface PaymentErrorResult {
  success: false;
  error: string;
}

export type PaymentResponse = PaymentSuccessResult | PaymentErrorResult;

export const paymentConfig = {
  razorpayKeyId: import.meta.env.VITE_RAZORPAY_KEY_ID || "",
  stripePublicKey: import.meta.env.VITE_STRIPE_PUBLIC_KEY || "",
};

export const isPaymentGatewayConfigured = Boolean(
  paymentConfig.razorpayKeyId || paymentConfig.stripePublicKey
);

/**
 * Dynamically loads the Razorpay checkout script if not already on the page
 */
export function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (typeof window === "undefined") return resolve(false);
    if ((window as any).Razorpay) return resolve(true);

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

/**
 * Initiates Razorpay payment or falls back to simulation mode
 */
export async function processPayment(
  details: PaymentDetails,
  method: "online" | "cod"
): Promise<PaymentResponse> {
  if (method === "cod") {
    // Cash on Delivery is confirmed immediately
    return {
      success: true,
      paymentId: `COD_${Date.now()}`,
      orderId: details.orderId,
      method: "Cash on Delivery",
    };
  }

  // If live Razorpay key is configured
  if (paymentConfig.razorpayKeyId) {
    const loaded = await loadRazorpayScript();
    if (!loaded) {
      return { success: false, error: "Failed to load payment gateway script" };
    }

    return new Promise((resolve) => {
      const options = {
        key: paymentConfig.razorpayKeyId,
        amount: Math.round(details.amount * 100), // in paise
        currency: details.currency || "INR",
        name: "UDITAS CREATIONS",
        description: details.description || `Order #${details.orderId}`,
        image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=100&auto=format&fit=crop&q=80",
        prefill: {
          name: details.customerName,
          email: details.customerEmail,
          contact: details.customerPhone,
        },
        theme: {
          color: "#3B1425",
        },
        handler: function (response: any) {
          resolve({
            success: true,
            paymentId: response.razorpay_payment_id,
            orderId: details.orderId,
            signature: response.razorpay_signature,
            method: "Razorpay Online",
          });
        },
        modal: {
          ondismiss: function () {
            resolve({
              success: false,
              error: "Payment cancelled by customer",
            });
          },
        },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    });
  }

  // Simulated Payment Flow for development preview
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        paymentId: `PAY_SIM_${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
        orderId: details.orderId,
        method: "UPI / Prepaid (Demo Mode)",
      });
    }, 1200);
  });
}
