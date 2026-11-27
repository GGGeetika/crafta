import type { Metadata, Viewport } from 'next';
import { Fraunces, Libre_Caslon_Text, Nunito_Sans } from 'next/font/google';
import { ArtDefs } from '@/components/art/defs';
import './globals.css';

const display = Fraunces({ subsets: ['latin'], axes: ['SOFT', 'WONK', 'opsz'], variable: '--font-display', display: 'swap' });
const book = Libre_Caslon_Text({ subsets: ['latin'], weight: ['400', '700'], style: ['normal', 'italic'], variable: '--font-book', display: 'swap' });
const ui = Nunito_Sans({ subsets: ['latin'], variable: '--font-ui', display: 'swap' });

export const metadata: Metadata = {
  metadataBase: new URL('https://publish.craftabooks.com'),
  title: 'Crafta — Little books. Big memories.',
  description: 'A classic children’s book that you make together.',
  openGraph: { siteName: 'Crafta', type: 'website', title: 'Crafta — Little books. Big memories.', description: 'A classic children’s book that you make together.' },
  twitter: { card: 'summary_large_image', title: 'Crafta — Little books. Big memories.', description: 'A classic children’s book that you make together.' },
  appleWebApp: { capable: true, title: 'Crafta', statusBarStyle: 'default' },
};

export const viewport: Viewport = { themeColor: '#f7f0e1', width: 'device-width', initialScale: 1, viewportFit: 'cover' };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${display.variable} ${book.variable} ${ui.variable}`}>
      <body>
        <ArtDefs />
        {children}
      </body>
    </html>
  );
}
