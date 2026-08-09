import type { Metadata } from "next";
import "@fontsource/poppins/400.css";
import "@fontsource/poppins/500.css";
import "@fontsource/poppins/600.css";
import "@fontsource/poppins/700.css";
import { CartProvider } from "@/components/cart";
import { AuthProvider } from "@/components/auth";
import { DeliveryLocationProvider, DeliveryPopup } from "@/components/delivery";
import "./globals.css";

export const metadata: Metadata = {
  title: "Donesi.me",
  description: "Dostava hrane širom Crne Gore.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="sr-Latn-ME" className="h-full antialiased">
      <body className="min-h-full flex flex-col">
        <AuthProvider>
          <DeliveryLocationProvider>
            <CartProvider>
              {children}
              <DeliveryPopup />
            </CartProvider>
          </DeliveryLocationProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
