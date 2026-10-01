import './globals.css';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';
import MobileBottomNav from '@/components/MobileBottomNav';
import { CartProvider } from '@/lib/cartContext';

export const metadata = {
  title: 'IPHYGLAMOUR — Style Made to Stand Out',
  description: 'Beautifully crafted, made-to-measure women\'s fashion from IPHYGLAMOUR.'
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="font-body">
        <CartProvider>
          <Nav />
          <div className="pb-16 md:pb-0">
            <main className="min-h-screen">{children}</main>
            <Footer />
          </div>
          <WhatsAppButton />
          <MobileBottomNav />
        </CartProvider>
      </body>
    </html>
  );
}
