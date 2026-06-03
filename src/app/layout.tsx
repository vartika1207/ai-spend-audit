import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'SpendScope — AI Spend Audit',
  description: 'Find overspend in your AI tool stack in under five minutes.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
