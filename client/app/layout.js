import { Toaster } from 'react-hot-toast';
import { ReduxProvider } from '../components/ReduxProvider';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import '../styles/globals.css'; // Let's put globals in styles or use the default app/globals.css
import { Outfit, Inter } from 'next/font/google';

const outfit = Outfit({ 
  subsets: ['latin'],
  variable: '--font-outfit',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata = {
  title: 'Slotify - Salon Booking',
  description: 'Book your next salon appointment with Slotify.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${outfit.variable} ${inter.variable}`}>
      <body className="min-h-screen flex flex-col font-inter">
        <ReduxProvider>
          <Navbar />
          <main className="flex-grow max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 md:py-12">
            {children}
          </main>
          <Footer />
          <Toaster position="top-right" />
        </ReduxProvider>
      </body>
    </html>
  );
}
