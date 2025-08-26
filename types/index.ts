export interface User {
  id: string;
  email: string;
  role: 'Buyer' | 'Investor';
  name: string;
  createdAt: string;
  preferences?: ('Repayment' | 'Equity' | 'Both')[];
  flagged?: boolean;
  flagReason?: string;
}

export interface FundingRequest {
  id: string;
  title: string;
  description: string;
  type: 'SBA' | 'Non-SBA' | 'Real Estate';
  location: string;
  purchasePrice: number;
  amount: number;
  profit: number;
  preference: 'Growth' | 'Income' | 'Value';
  projectTier: '$100K-$500K' | '$500K-$2M' | '$2M-$10M' | '$10M-$25M';
  investorPreference: 'Repayment' | 'Equity' | 'Both';
  documents: string[];
  hasOTP: boolean;
  videoCallAvailable: boolean;
  createdAt: string;
  userId: string;
  featured: boolean;
  closingDate?: string;
}

export interface Message {
  id: string;
  fromUserId: string;
  toUserId: string;
  fromName: string;
  toName: string;
  subject: string;
  content: string;
  listingId?: string;
  hasVideoCall?: boolean;
  otpRequired?: boolean;
  isRead: boolean;
  createdAt: string;
}

export interface RevenueData {
  totalAnnual: number;
  breakdown: {
    listings: { count: number; revenue: number; price: number };
    addOns: { revenue: number };
  };
  byType: {
    SBA: { percentage: number; revenue: number };
    'Non-SBA': { percentage: number; revenue: number };
    'Real Estate': { percentage: number; revenue: number };
  };
}