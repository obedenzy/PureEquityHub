'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, MapPin, DollarSign, TrendingUp, FileText, Download, MessageSquare, Share2, Calculator, Video, Shield, Flag } from 'lucide-react';
import { mockFundingRequests } from '../../../lib/mockData';
import { FundingRequest } from '../../../types';
import { isAuthenticated } from '../../../lib/auth';

interface ListingDetailClientProps {
  listing: FundingRequest;
  relatedListings: FundingRequest[];
}

export default function ListingDetailClient({ listing, relatedListings }: ListingDetailClientProps) {
  const router = useRouter();
  const [investmentAmount, setInvestmentAmount] = useState<number>(listing.amount);
  const [calculatedReturn, setCalculatedReturn] = useState<number>(0);

  useEffect(() => {
    if (listing && investmentAmount > 0) {
      const returnPercentage = (investmentAmount / listing.purchasePrice) * listing.profit;
      setCalculatedReturn(returnPercentage);
    }
  }, [investmentAmount, listing]);

  const handleRestrictedAction = (action: string) => {
    if (!isAuthenticated()) {
      alert(`Please log in to ${action}. Use the Login button in the header to access this feature.`);
      return false;
    }
    return true;
  };

  const handleDocumentDownload = (filename: string) => {
    if (!handleRestrictedAction('download documents')) return;
    
    if (listing.hasOTP) {
      const otp = prompt('Enter OTP to access document:');
      if (!otp || otp !== '123456') {
        alert('Invalid OTP. Please contact the buyer for the correct OTP.');
        return;
      }
    }
    
    // Mock download - in real app, this would download from server
    const mockUrl = `/documents/${listing?.id}/${filename}`;
    alert(`Downloading ${filename} from ${mockUrl}`);
  };

  const handleContactBuyer = () => {
    if (!handleRestrictedAction('contact the buyer')) return;
    
    if (listing.videoCallAvailable) {
      const useVideo = confirm('Would you like to schedule a video call with the buyer?');
      if (useVideo) {
        alert('Video call scheduling interface would open here');
      } else {
        alert('Message composer would open here');
      }
    } else {
      alert('Message composer would open here');
    }
  };

  const handleRequestDocuments = () => {
    if (!handleRestrictedAction('request documents')) return;
    
    alert('Document request form would open here');
  };

  const handleFlagInvestor = () => {
    if (!handleRestrictedAction('flag this investor')) return;
    
    const reason = prompt('Please provide a reason for flagging this investor:');
    if (reason) {
      alert(`Investor flagged for: ${reason}. This will be reviewed by our team.`);
    }
  };

  const handleShare = (platform: string) => {
    const url = window.location.href;
    const text = `Check out this investment opportunity: ${listing?.title}`;
    
    switch (platform) {
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank');
        break;
      case 'linkedin':
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, '_blank');
        break;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'SBA': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Non-SBA': return 'bg-green-100 text-green-800 border-green-200';
      case 'Real Estate': return 'bg-orange-100 text-orange-800 border-orange-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTierColor = (tier: string) => {
    switch (tier) {
      case '$100K-$500K': return 'bg-green-100 text-green-800 border-green-200';
      case '$500K-$2M': return 'bg-blue-100 text-blue-800 border-blue-200';
      case '$2M-$10M': return 'bg-purple-100 text-purple-800 border-purple-200';
      case '$10M-$25M': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <button
            onClick={() => router.back()}
            className="flex items-center text-gray-600 hover:text-gray-900 transition-colors mb-4"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back
          </button>
          
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between">
            <div className="flex-1">
              <div className="flex items-center mb-4">
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getTypeColor(listing.type)}`}>
                  {listing.type === 'Non-SBA' ? 'Business Acquisition' : listing.type}
                </span>
                <span className={`ml-3 inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getTierColor(listing.projectTier)}`}>
                  {listing.projectTier}
                </span>
                {listing.featured && (
                  <span className="ml-3 bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium border border-yellow-200">
                    Featured
                  </span>
                )}
              </div>
              
              <h1 className="text-3xl font-bold text-gray-900 mb-4">{listing.title}</h1>
              
              <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-6 text-gray-600 mb-6">
                <div className="flex items-center mb-2 sm:mb-0">
                  <MapPin className="w-5 h-5 mr-2" />
                  {listing.location}
                </div>
                <div className="flex items-center">
                  <span className="text-sm">Preference: {listing.preference}</span>
                </div>
                <div className="flex items-center">
                  <span className="text-sm">Investor Preference: {listing.investorPreference}</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 mt-4 lg:mt-0">
              {listing.videoCallAvailable && (
                <button
                  onClick={handleContactBuyer}
                  className="flex items-center px-4 py-2 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 transition-colors"
                >
                  <Video className="w-4 h-4 mr-2" />
                  Video Call
                </button>
              )}
              <button
                onClick={() => handleShare('twitter')}
                className="flex items-center px-4 py-2 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 transition-colors"
              >
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </button>
              <button
                onClick={handleContactBuyer}
                className="flex items-center bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                <MessageSquare className="w-4 h-4 mr-2" />
                Contact Buyer
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Description */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Overview</h2>
              <p className="text-gray-600 leading-relaxed">{listing.description}</p>
              
              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                  <Shield className="w-5 h-5 text-blue-600 mr-3" />
                  <div>
                    <div className="text-sm font-medium text-gray-900">Project Tier</div>
                    <div className="text-sm text-gray-600">{listing.projectTier}</div>
                  </div>
                </div>
                <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                  <TrendingUp className="w-5 h-5 text-green-600 mr-3" />
                  <div>
                    <div className="text-sm font-medium text-gray-900">Investment Structure</div>
                    <div className="text-sm text-gray-600">{listing.investorPreference}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Key Metrics */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Key Metrics</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <DollarSign className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-gray-900 mb-1">
                    {formatCurrency(listing.purchasePrice)}
                  </div>
                  <div className="text-sm text-gray-600">Purchase Price</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <TrendingUp className="w-8 h-8 text-green-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-gray-900 mb-1">
                    {formatCurrency(listing.amount)}
                  </div>
                  <div className="text-sm text-gray-600">Investment Required</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <Calculator className="w-8 h-8 text-orange-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-gray-900 mb-1">
                    {formatCurrency(listing.profit)}
                  </div>
                  <div className="text-sm text-gray-600">Expected Profit</div>
                </div>
              </div>
            </div>

            {/* Documents */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Available Documents</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {listing.documents.map((doc, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center">
                      <FileText className="w-5 h-5 text-gray-400 mr-3" />
                      <div>
                        <span className="text-gray-900">{doc}</span>
                        {listing.hasOTP && (
                          <div className="text-xs text-blue-600 flex items-center mt-1">
                            <Shield className="w-3 h-3 mr-1" />
                            OTP Required
                          </div>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => handleDocumentDownload(doc)}
                      className="flex items-center text-blue-600 hover:text-blue-700 transition-colors"
                    >
                      <Download className="w-4 h-4 mr-1" />
                      Download
                    </button>
                  </div>
                ))}
              </div>
              <div className="mt-6">
                <button
                  onClick={handleRequestDocuments}
                  className="bg-gray-900 text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition-colors"
                >
                  Request Additional Documents
                </button>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Investor Actions */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Investor Actions</h3>
              <div className="space-y-3">
                <button
                  onClick={handleContactBuyer}
                  className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Contact Buyer
                </button>
                {listing.videoCallAvailable && (
                  <button
                    onClick={handleContactBuyer}
                    className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 transition-colors"
                  >
                    <Video className="w-4 h-4 mr-2" />
                    Schedule Video Call
                  </button>
                )}
                <button
                  onClick={handleFlagInvestor}
                  className="w-full flex items-center justify-center px-4 py-2 border border-red-300 text-red-600 rounded-lg bg-white hover:bg-red-50 transition-colors"
                >
                  <Flag className="w-4 h-4 mr-2" />
                  Flag Concern
                </button>
              </div>
            </div>

            {/* ROI Calculator */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">ROI Calculator</h3>
              <div className="space-y-4">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <div className="text-sm text-blue-700 mb-1">Investment Structure</div>
                  <div className="font-semibold text-blue-900">{listing.investorPreference}</div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Investment Amount
                  </label>
                  <input
                    type="number"
                    value={investmentAmount}
                    onChange={(e) => setInvestmentAmount(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    min="0"
                  />
                </div>
                <div className="p-4 bg-blue-50 rounded-lg">
                  <div className="text-sm text-blue-700 mb-1">Estimated Return</div>
                  <div className="text-2xl font-bold text-blue-900">
                    {formatCurrency(calculatedReturn)}
                  </div>
                </div>
              </div>
            </div>

            {/* Share Options */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Share This Opportunity</h3>
              <div className="space-y-3">
                <button
                  onClick={() => handleShare('twitter')}
                  className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 transition-colors"
                >
                  Share on X (Twitter)
                </button>
                <button
                  onClick={() => handleShare('linkedin')}
                  className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 transition-colors"
                >
                  Share on LinkedIn
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Related Listings */}
        {relatedListings.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Related Opportunities</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedListings.map((relatedListing) => (
                <div key={relatedListing.id} className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-200 overflow-hidden">
                  <div className="p-6">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border mb-3 ${getTypeColor(relatedListing.type)}`}>
                      {relatedListing.type === 'Non-SBA' ? 'Business Acquisition' : relatedListing.type}
                    </span>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {relatedListing.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {relatedListing.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-gray-600">
                        {formatCurrency(relatedListing.amount)} investment
                      </div>
                      <a
                        href={`/listings/${relatedListing.id}`}
                        className="text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors"
                      >
                        View Details →
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}