import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'ApexBuilder | Professional Visual No-Code Platform',
  description: 'Design, customize, manage, and publish professional websites without writing code.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen overflow-hidden bg-slate-50 dark:bg-slate-950">
        {children}
      </body>
    </html>
  );
}

