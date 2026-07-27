import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "dostavi.me",
  description: "Dostava hrane širom Crne Gore.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="sr-Latn-ME" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
