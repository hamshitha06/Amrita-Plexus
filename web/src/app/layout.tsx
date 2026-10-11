import type { Metadata } from 'next';
import { Bricolage_Grotesque, Geist } from 'next/font/google';
import { ThemeProvider } from 'next-themes';
import { Toaster } from 'sonner';
import { AuthProvider } from '@/contexts/AuthContext';
import { PlexusProvider } from '@/contexts/PlexusContext';
import './globals.css';

const geist = Geist({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

const bricolage = Bricolage_Grotesque({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
  weight: ['400', '500', '600', '700', '800'],
});

export const metadata: Metadata = {
  title: {
    default: 'AmritaPlexus — Campus Life & Logistics Platform',
    template: '%s | AmritaPlexus',
  },
  description:
    'The all-in-one campus life and logistics platform for Amrita Vishwa Vidyapeetham students. Amazon Parcel Management, P2P Snacks, Night Canteen AI, Hostel Forum & Carpooling.',
  keywords: ['AmritaPlexus', 'Amrita', 'Campus', 'Students', 'Parcel Management', 'Hostel Services'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geist.variable} ${bricolage.variable} font-sans antialiased bg-[#F8FAFC]`}
      >
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
          <AuthProvider>
            <PlexusProvider>
              {children}
              <Toaster
                position="top-right"
                richColors
                toastOptions={{
                  style: {
                    borderRadius: '12px',
                    fontFamily: 'var(--font-sans)',
                  },
                }}
              />
            </PlexusProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
