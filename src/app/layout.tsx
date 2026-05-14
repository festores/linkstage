import type { Metadata } from 'next';
import { DM_Sans, Syne } from 'next/font/google';
import './globals.css';

const dmSans = DM_Sans({ subsets: ['latin'], variable: '--font-dm-sans' });
const syne = Syne({ subsets: ['latin'], variable: '--font-syne', weight: ['400','500','600','700','800'] });

export const metadata: Metadata = {
  title: { default: 'LinkStage — Your whole world. One link.', template: '%s | LinkStage' },
  description: 'The link-in-bio platform built for real creators.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${dmSans.variable} ${syne.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}