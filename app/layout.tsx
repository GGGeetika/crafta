import type { Metadata } from 'next';
import './globals.css';
export const metadata: Metadata = { title: 'Crafta — Story Studio', description: 'Imagine a story, bring it to life, and enjoy reading it together.' };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="en"><body>{children}</body></html>; }
