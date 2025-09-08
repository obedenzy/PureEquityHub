import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Header from '../components/Header';
import { Toaster } from '@/components/ui/toaster'; // Import Toaster

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  metadataBase: new URL('https://pureequityhub.com'),
  title: 'PureEquityHub - SBA 7a Loan Equity Injection Marketplace',
  description: 'Connect investors with buyers seeking 10% equity injection for SBA 7a loans, Non-SBA Loan, and real estate equity financing. $100K-$25M deals.',
  keywords: 'SBA loan equity injection, SBA 7a equity, Non-SBA Loan, real estate equity financing, equity injection marketplace, SBA loan funding, business equity investment',
  authors: [{ name: 'PureEquityHub' }],
  openGraph: {
    title: 'PureEquityHub - SBA 7a Loan Equity Injection Marketplace',
    description: 'Connect investors with buyers seeking 10% equity injection for SBA 7a loans, Non-SBA Loan, and real estate equity financing. $100K-$25M deals.',
    url: 'https://pureequityhub.com',
    siteName: 'PureEquityHub',
    images: [
      {
        url: 'https://images.pexels.com/photos/3182763/pexels-photo-3182763.jpeg',
        width: 1200,
        height: 630,
        alt: 'PureEquityHub SBA Loan Equity Injection Platform',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PureEquityHub - SBA 7a Loan Equity Injection Marketplace',
    description: 'Connect investors with buyers seeking 10% equity injection for SBA 7a loans, Non-SBA Loan, and real estate equity financing.',
    images: ['https://images.pexels.com/photos/3182763/pexels-photo-3182763.jpeg'],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Organization',
              name: 'PureEquityHub',
              url: 'https://pureequityhub.com',
              logo: 'https://pureequityhub.com/logo.png',
              description: 'SBA 7a loan equity injection marketplace connecting investors with buyers seeking equity financing for business acquisitions and real estate',
              sameAs: [
                'https://twitter.com/pureequityhub',
                'https://linkedin.com/company/pureequityhub'
              ],
              contactPoint: {
                '@type': 'ContactPoint',
                contactType: 'customer service',
                email: 'support@pureequityhub.com'
              },
              serviceType: [
                'SBA 7a Loan Equity Injection',
                'Non-SBA Loan Financing',
                'Real Estate Equity Investment',
                'Commercial Real Estate Financing'
              ],
              offers: {
                '@type': 'AggregateOffer',
                priceCurrency: 'USD',
                lowPrice: '100000',
                highPrice: '25000000',
                offerCount: '8400',
                description: 'Equity injection opportunities from $100K to $25M'
              }
            })
          }}
        />
      </head>
      <body className={inter.className}>
        <Header />
        {children}
        <Toaster /> {/* Add Toaster here */}
      </body>
    </html>
  );
}