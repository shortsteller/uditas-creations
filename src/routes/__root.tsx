import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useState, useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { CartProvider, useCart } from "@/lib/cart-context";
import { AuthProvider } from "@/lib/firebase";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { CartDrawer } from "@/components/cart-drawer";
import { SearchModal } from "@/components/search-modal";
import { AuthModal } from "@/components/auth-modal";
import { CheckoutModal } from "@/components/checkout-modal";
import { TrackOrderModal } from "@/components/track-order-modal";
import { ScrollToTop } from "@/components/scroll-to-top";
import { Toaster } from "@/components/ui/sonner";
import { WhatsAppButton } from "@/components/wa-button";

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "UDITAS CREATIONS — Artisanal Junk & Fashion Jewellery Studio" },
      {
        name: "description",
        content:
          "Handcrafted statement jhumkas, chandbalis, kundan chokers, oxidised silver bangles, cocktail rings, and bridal jewelry sets designed and made in small batches in Kolkata, India.",
      },
      { name: "author", content: "UDITAS CREATIONS" },
      { property: "og:title", content: "UDITAS CREATIONS — Artisanal Fashion Jewellery" },
      {
        property: "og:description",
        content:
          "Explore handcrafted modern bohemian & ethnic fashion jewelry. Free express shipping on prepaid orders across India.",
      },
      { property: "og:type", content: "website" },
      { property: "og:site_name", content: "UDITAS CREATIONS" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
      { rel: "icon", href: "/firmware.ico", type: "image/x-icon" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap",
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body className="bg-[#FAF7F2] text-stone-900 font-sans antialiased selection:bg-[#3B1425] selection:text-white">
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function NotFoundComponent() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center bg-[#FAF7F2] px-4">
      <div className="max-w-md text-center py-16">
        <span className="font-serif text-8xl font-bold text-[#3B1425]">404</span>
        <h2 className="mt-4 font-serif text-3xl font-bold text-stone-900">Piece Not Found</h2>
        <p className="mt-2 text-xs text-stone-500">
          The page or jewelry item you are looking for has moved or sold out.
        </p>
        <div className="mt-6">
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-full bg-[#3B1425] px-6 py-3 text-xs uppercase tracking-widest font-semibold text-white transition-colors hover:bg-[#280D19]"
          >
            Return to Studio
          </a>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#FAF7F2] px-4">
      <div className="max-w-md text-center">
        <h1 className="font-serif text-2xl font-bold text-stone-900">
          Something went wrong
        </h1>
        <p className="mt-2 text-xs text-stone-500">
          We encountered an issue loading this section.
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="rounded-full bg-[#3B1425] px-5 py-2.5 text-xs uppercase tracking-widest font-semibold text-white hover:bg-[#280D19]"
          >
            Try again
          </button>
          <a
            href="/"
            className="rounded-full border border-stone-300 px-5 py-2.5 text-xs uppercase tracking-widest font-semibold text-stone-700 hover:bg-stone-50"
          >
            Home
          </a>
        </div>
      </div>
    </div>
  );
}

function AppLayout() {
  const { isSearchOpen, setIsSearchOpen, isAuthModalOpen, setIsAuthModalOpen } = useCart();
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isTrackOrderOpen, setIsTrackOrderOpen] = useState(false);
  const [trackQuery, setTrackQuery] = useState("");

  const handleOpenTrack = (query?: string) => {
    if (query) setTrackQuery(query);
    setIsTrackOrderOpen(true);
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#FAF7F2]">
      <SiteHeader
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        onOpenWishlist={() => setIsAuthModalOpen(true)}
      />

      <main className="flex-1">
        <Outlet />
      </main>

      <SiteFooter onOpenTrackOrder={() => handleOpenTrack()} />

      {/* Global Drawers & Modals */}
      <CartDrawer onCheckout={() => setIsCheckoutOpen(true)} />
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onOpenTrackOrder={handleOpenTrack}
      />
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
      />
      <TrackOrderModal
        isOpen={isTrackOrderOpen}
        initialQuery={trackQuery}
        onClose={() => setIsTrackOrderOpen(false)}
      />

      {/* Floating WhatsApp button */}
      <div className="fixed bottom-6 right-6 z-40">
        <WhatsAppButton />
      </div>

      <ScrollToTop />
      <Toaster position="bottom-right" richColors />
    </div>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <CartProvider>
          <AppLayout />
        </CartProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}
