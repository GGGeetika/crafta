import type { Metadata } from 'next';
import './globals.css';
export const metadata: Metadata = { title: 'Crafta — Story Studio', description: 'A little imagination. A story only you could tell.' };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="en"><body>{children}</body></html>; }
