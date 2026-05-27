import type { Metadata, Viewport } from "next";
import "./globals.css";
import { CartProvider } from "@/lib/cart-context";
import Header from "@/components/Header";
import CartDrawer from "@/components/CartDrawer";

export const metadata: Metadata = {
  title: "BTS Arirang World Tour - Official Merch Restock",
  description: "Official BTS Arirang World Tour merchandise restock - Limited edition items for ARMY",
  metadataBase: new URL("https://brigit.work"),
  openGraph: {
    title: "BTS Arirang World Tour - Official Merch Restock",
    description: "Official BTS Arirang World Tour merchandise restock - Limited edition items for ARMY",
    url: "https://brigit.work",
    siteName: "BTS Arirang Tour Shop",
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#00B8D4",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="bg-white" data-scroll-behavior="smooth">
      <body className="font-sans antialiased">
        <CartProvider>
          <Header />
          {children}
          <CartDrawer />
        </CartProvider>
      </body>
    </html>
  );
}
