'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Upload, X, File as FileIcon } from 'lucide-react';
import { useDropzone, FileWithPath } from 'react-dropzone';
import { getCurrentUser } from '../../lib/auth';
import { FundingRequest } from '../../types';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { toast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';


// Make sure to call loadStripe outside of a component’s render to avoid recreating the Stripe object on every render.
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!); 

interface PaymentFormContentProps {
  clientSecret: string;
  paymentIntentId: string;
  listingTitle: string;
  onPaymentSuccess: () => void;
}

function PaymentFormContent({ clientSecret, paymentIntentId, listingTitle, onPaymentSuccess }: PaymentFormContentProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paymentErrorMessage, setPaymentErrorMessage] = useState<string | null>(null);

  const handlePaymentError = (message: string) => {
    setPaymentErrorMessage(message);
    toast({
      title: "Payment Failed",
      description: message,
      variant: "destructive",
    });
    setIsProcessingPayment(false);
  };

  const handleSubmitPayment = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js has not yet loaded.
      return;
    }

    setIsProcessingPayment(true);
    setPaymentErrorMessage(null);

    const { error: submitError } = await elements.submit();

    if (submitError) {
      handlePaymentError(submitError.message || 'An unknown error occurred.');
      return;
    }

    try {
      const { paymentIntent, error } = await stripe.confirmPayment({
        elements,
        clientSecret: clientSecret!,
        confirmParams: {
          return_url: `${window.location.origin}/payment-success`, // Redirect if necessary, though we handle success here
        },
        redirect: 'if_required',
      });

      if (error) {
        handlePaymentError(error.message || 'Payment failed.');
      } else if (paymentIntent && paymentIntent.status === 'succeeded') {
        toast({
          title: 'Payment Successful!',
          description: 'Your listing fee has been paid.',
          variant: 'default',
        });
        onPaymentSuccess(); // Call createListing directly on success
      } else {
        handlePaymentError('Payment not succeeded. Status: ' + paymentIntent?.status);
      }
    } catch (err: any) {
      handlePaymentError(err.message || 'An unexpected error occurred during payment confirmation.');
    } finally {
      setIsProcessingPayment(false);
    }
  };

  return (
    <form onSubmit={handleSubmitPayment} className="space-y-6">
      <div className="p-4 border border-gray-200 rounded-lg bg-gray-50">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Payment Details</h3>
        <p className="text-sm text-gray-700 mb-4">
          You are about to pay a listing fee of <span className="font-semibold text-blue-600">$150</span> for "{listingTitle}".
        </p>
        <PaymentElement options={{ layout: 'tabs' }} />
      </div>

      {paymentErrorMessage && (
        <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
          {paymentErrorMessage}
        </div>
      )}

      <Button
        type="submit"
        disabled={!stripe || isProcessingPayment}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors"
      >
        {isProcessingPayment ? 'Processing Payment...' : `Pay $150`}
      </Button>
    </form>
  );
}


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
    loi: null as FileWithPath | null,
    termsheet: null as FileWithPath | null,
    financials: [] as FileWithPath[]
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isClient, setIsClient] = useState(false);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [paymentIntentId, setPaymentIntentId] = useState<string | null>(null);
  const [isFetchingPaymentIntent, setIsFetchingPaymentIntent] = useState(false); // State for fetching payment intent
  const [showPaymentPanel, setShowPaymentPanel] = useState(false); // New state to control payment panel visibility

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Dropzone for Letter of Intent (LOI)
  const onDropLoi = useCallback((acceptedFiles: FileWithPath[]) => {
    if (acceptedFiles.length > 0) {
      setFormData(prev => ({ ...prev, loi: acceptedFiles[0] }));
    }
  }, []);
  const { getRootProps: getLoiRootProps, getInputProps: getLoiInputProps, isDragActive: isLoiDragActive } = useDropzone({
    onDrop: onDropLoi,
    maxFiles: 1,
    accept: {'application/pdf': ['.pdf']}
  });

  // Dropzone for Termsheet
  const onDropTermsheet = useCallback((acceptedFiles: FileWithPath[]) => {
    if (acceptedFiles.length > 0) {
      setFormData(prev => ({ ...prev, termsheet: acceptedFiles[0] }));
    }
  }, []);
  const { getRootProps: getTermsheetRootProps, getInputProps: getTermsheetInputProps, isDragActive: isTermsheetDragActive } = useDropzone({
    onDrop: onDropTermsheet,
    maxFiles: 1,
    accept: {'application/pdf': ['.pdf']}
  });

  // Dropzone for Financials (max 3 files)
  const onDropFinancials = useCallback((acceptedFiles: FileWithPath[]) => {
    setFormData(prev => ({
      ...prev,
      financials: [...prev.financials, ...acceptedFiles.filter(file => 
        !prev.financials.some(existingFile => existingFile.path === file.path)
      )].slice(0, 3) // Ensure max 3 files
    }));
  }, []);
  const { getRootProps: getFinancialsRootProps, getInputProps: getFinancialsInputProps, isDragActive: isFinancialsDragActive } = useDropzone({
    onDrop: onDropFinancials,
    maxFiles: 3,
    accept: {'application/pdf': ['.pdf'], 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'], 'application/vnd.ms-excel': ['.xls']}
  });

  useEffect(() => {
    if (!currentUser || currentUser.role !== 'Buyer') {
      router.push('/');
    }
  }, [currentUser, router]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const removeLoi = () => setFormData(prev => ({ ...prev, loi: null }));
  const removeTermsheet = () => setFormData(prev => ({ ...prev, termsheet: null }));
  const removeFinancial = (fileToRemove: FileWithPath) => {
    setFormData(prev => ({
      ...prev,
      financials: prev.financials.filter(file => file !== fileToRemove)
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

  const createListing = () => {
    console.log('Payment successful! Finalizing listing...');

    try {
      const { amount, profit } = calculateAmountAndProfit(); 
      const purchasePrice = Number(formData.purchasePrice);

      const documentNames: string[] = [];
      if (formData.loi) documentNames.push(formData.loi.name);
      if (formData.termsheet) documentNames.push(formData.termsheet.name);
      formData.financials.forEach(f => documentNames.push(f.name));

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
        documents: documentNames.length > 0 ? documentNames : ['Termsheet.pdf', 'LOI.pdf', 'Financials.pdf'],
        hasOTP: true,
        videoCallAvailable: true,
        createdAt: new Date().toISOString(),
        userId: currentUser!.id,
        featured: false,
        closingDate: formData.closingDate
      };

      const existingListings = JSON.parse(localStorage.getItem('fundingRequests') || '[]');
      existingListings.push(newListing);
      localStorage.setItem('fundingRequests', JSON.stringify(existingListings));

      console.log('Final Listing Data:', newListing);
      toast({
        title: "Listing created successfully!",
        description: "Your funding request is now live.",
        variant: "default",
      });
      router.push('/profile');
    } catch (error) {
      console.error('Error creating listing:', error);
      toast({
        title: "Error",
        description: "An error occurred while finalizing your listing. Please try again.",
        variant: "destructive",
      });
    } finally {
      setClientSecret(null); 
      setPaymentIntentId(null); 
      setShowPaymentPanel(false); // Hide payment panel after successful listing
    }
  };

  const handleContinueClick = async () => {
    if (!validateForm()) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields before proceeding.",
        variant: "destructive",
      });
      return;
    }

    setShowPaymentPanel(true); // Show payment panel
    setIsFetchingPaymentIntent(true); 
    try {
      const response = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ amount: 150, description: formData.title }),
      });

      if (!response.ok) {
        throw new Error('Failed to create Payment Intent.');
      }

      const { clientSecret, paymentIntentId } = await response.json();
      setClientSecret(clientSecret);
      setPaymentIntentId(paymentIntentId); 
    } catch (error) {
      console.error('Failed to initiate payment:', error);
      toast({
        title: "Payment Preparation Error",
        description: "An error occurred while preparing for payment. Please try again.",
        variant: "destructive",
      });
      setShowPaymentPanel(false); // Hide payment panel on error
    } finally {
      setIsFetchingPaymentIntent(false);
    }
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

          {!isClient ? (
            <div className="p-8 bg-gray-100 rounded-lg text-center text-gray-500">
              Loading form...
            </div>
          ) : (
            <form onSubmit={(e) => e.preventDefault()} className="space-y-8">
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

                {/* LOI Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Letter of Intent (LOI) <span className="text-gray-500 text-xs">(PDF only, max 1)</span></label>
                  <div {...getLoiRootProps()} className={`p-6 border-2 border-dashed rounded-lg text-center cursor-pointer transition-colors ${isLoiDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-500'}`}>
                    <input {...getLoiInputProps()} />
                    <Upload className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                    {isLoiDragActive ?
                      <p className="text-blue-600">Drop the LOI here ...</p> :
                      <p className="text-gray-600">Drag & drop LOI here, or <span className="text-blue-600 font-semibold">click to select file</span></p>
                    }
                  </div>
                  {formData.loi && (
                    <div className="mt-2 flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center">
                        <FileIcon className="w-5 h-5 text-gray-500 mr-2" />
                        <span className="text-gray-900">{formData.loi.name} - {(formData.loi.size / 1024).toFixed(2)} KB</span>
                      </div>
                      <button
                        type="button"
                        onClick={removeLoi}
                        className="text-red-600 hover:text-red-700 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>

                {/* Termsheet Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Termsheet <span className="text-gray-500 text-xs">(PDF only, max 1)</span></label>
                  <div {...getTermsheetRootProps()} className={`p-6 border-2 border-dashed rounded-lg text-center cursor-pointer transition-colors ${isTermsheetDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-500'}`}>
                    <input {...getTermsheetInputProps()} />
                    <Upload className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                    {isTermsheetDragActive ?
                      <p className="text-blue-600">Drop the Termsheet here ...</p> :
                      <p className="text-gray-600">Drag & drop Termsheet here, or <span className="text-blue-600 font-semibold">click to select file</span></p>
                    }
                  </div>
                  {formData.termsheet && (
                    <div className="mt-2 flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center">
                        <FileIcon className="w-5 h-5 text-gray-500 mr-2" />
                        <span className="text-gray-900">{formData.termsheet.name} - {(formData.termsheet.size / 1024).toFixed(2)} KB</span>
                      </div>
                      <button
                        type="button"
                        onClick={removeTermsheet}
                        className="text-red-600 hover:text-red-700 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>

                {/* Financials Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Financial Statements <span className="text-gray-500 text-xs">(PDF, XLSX, XLS, max 3)</span></label>
                  <div {...getFinancialsRootProps()} className={`p-6 border-2 border-dashed rounded-lg text-center cursor-pointer transition-colors ${isFinancialsDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-500'}`}>
                    <input {...getFinancialsInputProps()} />
                    <Upload className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                    {isFinancialsDragActive ?
                      <p className="text-blue-600">Drop the financial files here ...</p> :
                      <p className="text-gray-600">Drag & drop financial files here, or <span className="text-blue-600 font-semibold">click to select files</span></p>
                    }
                    {formData.financials.length >= 3 && (
                      <p className="text-sm text-red-600 mt-2">Maximum of 3 financial documents uploaded.</p>
                    )}
                  </div>
                  {formData.financials.length > 0 && (
                    <div className="mt-2 space-y-2">
                      <h3 className="text-sm font-medium text-gray-700">Uploaded Financials:</h3>
                      {formData.financials.map((file, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center">
                            <FileIcon className="w-5 h-5 text-gray-500 mr-2" />
                            <span className="text-gray-900">{file.name} - {(file.size / 1024).toFixed(2)} KB</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeFinancial(file)}
                            className="text-red-600 hover:text-red-700 transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Payment Section */}
              {showPaymentPanel && (
                <div className="space-y-6 pt-6 border-t border-gray-200">
                  <h2 className="text-xl font-semibold text-gray-900 border-b border-gray-200 pb-2">
                    Payment for Listing Fee
                  </h2>
                  {clientSecret && paymentIntentId && stripePromise ? (
                    <Elements stripe={stripePromise} options={{ clientSecret }}>
                      <PaymentFormContent 
                        clientSecret={clientSecret} 
                        paymentIntentId={paymentIntentId} 
                        listingTitle={formData.title}
                        onPaymentSuccess={createListing}
                      />
                    </Elements>
                  ) : (
                    <div className="p-4 bg-gray-100 rounded-lg text-center text-gray-600">
                      {isFetchingPaymentIntent ? (
                        <p>Loading payment form...</p>
                      ) : (
                        <p className="mb-2">A listing fee of <span className="font-semibold text-blue-600">$150</span> is required to create a listing.</p>
                      )}
                    </div>
                  )}
                </div>
              )}

              <div className="flex items-center justify-between pt-6 border-t border-gray-200">
                <div className="text-sm text-gray-600">
                  Listing fee: <span className="font-semibold text-blue-600">$150</span>
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
                    type="button"
                    onClick={handleContinueClick}
                    disabled={isFetchingPaymentIntent || showPaymentPanel}
                    className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                  >
                    {isFetchingPaymentIntent ? 'Preparing Payment...' : (showPaymentPanel ? 'Payment Details' : 'Continue To Payment')}
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
