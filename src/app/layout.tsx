import type { Metadata } from 'next';
import './globals.css';
import Navigation from '@/components/Navigation';

export const metadata: Metadata = {
  title: 'LogicSnap | Enterprise Decision Intelligence',
  description: 'A powerful Node.js core that integrates a Statistical Math Evaluator, Time-Travel Backtesting, and AI-Powered Text-to-Rule engine.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Navigation />
        {children}
      </body>
    </html>
  );
}
