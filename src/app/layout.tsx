import type { Metadata } from "next";
import { Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ImageGen Playground",
  description:
    "Debug and compare the gw-backend-stormbreaker image generation pipeline across page types, image types, and graphic_token variants.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistMono.variable} h-full`}>
      <body className="min-h-full flex flex-col bg-neutral-950 text-neutral-100 antialiased font-mono">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
