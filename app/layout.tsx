import './globals.css';
import type { Metadata } from 'next';
import { Playfair_Display, Inter } from 'next/font/google';
import { CartProvider } from '@/components/cart/cart-context';
import { Toaster } from '@/components/ui/toaster';

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Star Family Restaurant | Hanamkonda',
  description: 'Star Family Restaurant — authentic Indian cuisine in Hanamkonda, Telangana. Biryani, curries, tandoori, and more. Dine-in and takeaway ordering.',
  openGraph: {
    title: 'Star Family Restaurant | Hanamkonda',
    description: 'Authentic Indian cuisine in Hanamkonda, Telangana. Dine-in and takeaway ordering.',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${playfair.variable} ${inter.variable}`}>
      <body className="font-sans antialiased">
        <CartProvider>
          {children}
          <Toaster />
        </CartProvider>
      </body>
    </html>
  );
}
