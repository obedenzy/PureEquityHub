import { notFound } from 'next/navigation';
import { mockFundingRequests } from '../../../lib/mockData';
import ListingDetailClient from './ListingDetailClient';

export async function generateStaticParams() {
  return mockFundingRequests.map((listing) => ({
    id: listing.id,
  }));
}

export default function ListingDetailPage({ params }: { params: { id: string } }) {
  const listing = mockFundingRequests.find(l => l.id === params.id);
  
  if (!listing) {
    notFound();
  }

  // Find related listings of the same type
  const relatedListings = mockFundingRequests
    .filter(l => l.type === listing.type && l.id !== listing.id)
    .slice(0, 3);

  return (
    <ListingDetailClient 
      listing={listing} 
      relatedListings={relatedListings} 
    />
  );
}