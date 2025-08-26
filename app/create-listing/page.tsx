'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Upload, X, Plus } from 'lucide-react';
import { getCurrentUser } from '../../lib/auth';
import { FundingRequest } from '../../types';

export default function CreateListingPage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState(getCurrentUser());
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'SBA' as 'SBA' | 'Non-SBA' | 'Real Estate',
    location: '',
    purchasePrice: '',
    preference: 'Growth' as 'Growth' | 'Income' | 'Value',
    investorPreference: 'Both' as 'Repayment' | 'Equity' | 'Both',
    closingDate: '',
    documents: [] as string[]
  });
  const [newDocument, setNewDocument] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!currentUser || currentUser.role !== 'Buyer') {
      alert('Only buyers can create listings. Please log in as a buyer.');
      router.push('/');
    }
  }, [currentUser, router]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const addDocument = () => {
    if (newDocument.trim() && !formData.documents.includes(newDocument.trim())) {
      setFormData(prev => ({
        ...prev,
        documents: [...prev.documents, newDocument.trim()]
      }));
      setNewDocument('');
    }
  };

  const removeDocument = (doc: string) => {
    setFormData(prev => ({
      ...prev,
      documents: prev.documents.filter(d => d !== doc)
    }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.location.trim()) newErrors.location = 'Location is required';
    if (!formData.purchasePrice) newErrors.purchasePrice = 'Purchase price is required';
    if (isNaN(Number(formData.purchasePrice)) || Number(formData.purchasePrice) <= 0) {
      newErrors.purchasePrice = 'Valid purchase price is required';
    }
    if (!formData.closingDate) newErrors.closingDate = 'Closing date is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const calculateAmountAndProfit = () => {
    const price = Number(formData.purchasePrice);
    if (isNaN(price) || price <= 0) return { amount: 0, profit: 0 };

    let amountPercentage = 0.10; // Default SBA
    let profitPercentage = 0.07; // Default SBA

    switch (formData.type) {
      case 'SBA':
        amountPercentage = 0.10;
        profitPercentage = 0.07;
        break;
      case 'Non-SBA':
        amountPercentage = 0.15;
        profitPercentage = 0.15;
        break;
      case 'Real Estate':
        amountPercentage = 0.20;
        profitPercentage = 0.09;
        break;
    }

    return {
      amount: Math.round(price * amountPercentage),
      profit: Math.round(price * profitPercentage)
    };
  };

  const getProjectTier = (price: number): string => {
    if (price <= 500000) return '$100K-$500K';
    if (price <= 2000000) return '$500K-$2M';
    if (price <= 10000000) return '$2M-$10M';
    return '$10M-$25M';
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    const { amount, profit } = calculateAmountAndProfit();
    const purchasePrice = Number(formData.purchasePrice);

    const newListing: FundingRequest = {
      id: `listing-${Date.now()}`,
      title: formData.title,
      description: formData.description,
      type: formData.type,
      location: formData.location,
      purchasePrice,
      amount,
      profit,
      preference: formData.preference,
      projectTier: getProjectTier(purchasePrice),
      investorPreference: formData.investorPreference,
      documents: formData.documents.length > 0 ? formData.documents : ['Termsheet.pdf', 'LOI.pdf', 'Financials.pdf'],
      hasOTP: true,
      videoCallAvailable: true,
      createdAt: new Date().toISOString(),
      userId: currentUser!.id,
      featured: false,
      closingDate: formData.closingDate
    };

    // In a real app, this would save to a database
    alert('Listing created successfully! Your funding request is now live.');
    router.push('/listings');
  };

  if (!currentUser || currentUser.role !== 'Buyer') {
    return null;
  }

  const { amount, profit } = calculateAmountAndProfit();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button
          onClick={() => router.back()}
          className="flex items-center text-gray-600 hover:text-gray-900 transition-colors mb-6"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back
        </button>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Funding Request</h1>
            <p className="text-gray-600">
              List your opportunity to connect with qualified investors seeking equity injection deals.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Information */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900 border-b border-gray-200 pb-2">
                Basic Information
              </h2>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Listing Title
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="e.g., Tech Startup Acquisition - Series A"
                />
                {errors.title && <p className="text-red-600 text-sm mt-1">{errors.title}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="Describe your business, opportunity, and what makes it attractive to investors..."
                />
                {errors.description && <p className="text-red-600 text-sm mt-1">{errors.description}</p>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Funding Type
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) => handleInputChange('type', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  >
                    <option value="SBA">SBA 7a Loan (10% equity injection)</option>
                    <option value="Non-SBA">Business Acquisition (15% equity)</option>
                    <option value="Real Estate">Real Estate (20% equity)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Location
                  </label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="e.g., Austin, TX"
                  />
                  {errors.location && <p className="text-red-600 text-sm mt-1">{errors.location}</p>}
                </div>
              </div>
            </div>

            {/* Financial Details */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900 border-b border-gray-200 pb-2">
                Financial Details
              </h2>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Purchase Price
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                  <input
                    type="number"
                    value={formData.purchasePrice}
                    onChange={(e) => handleInputChange('purchasePrice', e.target.value)}
                    className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="0"
                    min="0"
                  />
                </div>
                {errors.purchasePrice && <p className="text-red-600 text-sm mt-1">{errors.purchasePrice}</p>}
              </div>

              {formData.purchasePrice && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h3 className="font-medium text-blue-900 mb-2">Calculated Values</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-blue-700">Equity Injection Required:</span>
                      <span className="font-semibold text-blue-900 ml-2">
                        ${amount.toLocaleString()}
                      </span>
                    </div>
                    <div>
                      <span className="text-blue-700">Expected Investor Profit:</span>
                      <span className="font-semibold text-blue-900 ml-2">
                        ${profit.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Investment Preference
                  </label>
                  <select
                    value={formData.preference}
                    onChange={(e) => handleInputChange('preference', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  >
                    <option value="Growth">Growth</option>
                    <option value="Income">Income</option>
                    <option value="Value">Value</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Investor Structure Preference
                  </label>
                  <select
                    value={formData.investorPreference}
                    onChange={(e) => handleInputChange('investorPreference', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  >
                    <option value="Repayment">Repayment Only</option>
                    <option value="Equity">Equity Participation</option>
                    <option value="Both">Both Options Available</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Expected Closing Date
                </label>
                <input
                  type="date"
                  value={formData.closingDate}
                  onChange={(e) => handleInputChange('closingDate', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
                {errors.closingDate && <p className="text-red-600 text-sm mt-1">{errors.closingDate}</p>}
              </div>
            </div>

            {/* Documents */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900 border-b border-gray-200 pb-2">
                Documents
              </h2>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Available Documents
                </label>
                <p className="text-sm text-gray-600 mb-4">
                  Add documents that investors can request access to. Common documents include termsheets, LOIs, and financial statements.
                </p>
                
                <div className="flex gap-2 mb-4">
                  <input
                    type="text"
                    value={newDocument}
                    onChange={(e) => setNewDocument(e.target.value)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="e.g., Termsheet.pdf"
                  />
                  <button
                    type="button"
                    onClick={addDocument}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Add
                  </button>
                </div>

                <div className="space-y-2">
                  {formData.documents.map((doc, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-gray-900">{doc}</span>
                      <button
                        type="button"
                        onClick={() => removeDocument(doc)}
                        className="text-red-600 hover:text-red-700 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>

                {formData.documents.length === 0 && (
                  <div className="text-sm text-gray-500 bg-gray-50 p-4 rounded-lg">
                    Default documents (Termsheet.pdf, LOI.pdf, Financials.pdf) will be added automatically if none are specified.
                  </div>
                )}
              </div>
            </div>

            {/* Submit */}
            <div className="flex items-center justify-between pt-6 border-t border-gray-200">
              <div className="text-sm text-gray-600">
                Listing fee: <span className="font-semibold text-gray-900">$150</span>
              </div>
              <div className="flex items-center space-x-4">
                <button
                  type="button"
                  onClick={() => router.back()}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  Create Listing
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}