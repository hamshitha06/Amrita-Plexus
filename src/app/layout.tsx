import type { Metadata } from "next";
import "./globals.css";

import { CarpoolProvider } from "@/context/CarpoolContext";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  title: "Amrita-Plexus",
  description: "Simplifies campus life by bringing together carpooling and more.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        <CarpoolProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
        </CarpoolProvider>
      </body>
    </html>
  );
}
