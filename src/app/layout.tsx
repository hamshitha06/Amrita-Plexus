import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

import { CarpoolProvider } from "@/context/CarpoolContext";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  title: "Amrita-Plexus",
  description: "Simplifies campus life by bringing together carpooling and more.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <CarpoolProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
        </CarpoolProvider>
      </body>
    </html>
  );
}
