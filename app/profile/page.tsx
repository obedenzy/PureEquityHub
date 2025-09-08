'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { User, Building, Mail, Phone, Calendar, Edit, Save, X, Plus, DollarSign, MapPin } from 'lucide-react';
import { getCurrentUser } from '../../lib/auth';
import { User as UserType, FundingRequest } from '../../types';

export default function ProfilePage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<UserType | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    phone: '',
    preferences: [] as string[]
  });
  const [userFundingRequests, setUserFundingRequests] = useState<FundingRequest[]>([]);

  useEffect(() => {
    const user = getCurrentUser();
    if (!user) {
      alert('Please log in to view your profile.');
      router.push('/');
      return;
    }
    setCurrentUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      company: '',
      phone: '',
      preferences: user.preferences || []
    });

    if (user.role === 'Buyer') {
      const storedFundingRequests = JSON.parse(localStorage.getItem('fundingRequests') || '[]') as FundingRequest[];
      const filteredRequests = storedFundingRequests.filter(req => req.userId === user.id);
      setUserFundingRequests(filteredRequests);
    }
  }, [router]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handlePreferenceChange = (preference: string) => {
    setFormData(prev => ({
      ...prev,
      preferences: prev.preferences.includes(preference)
        ? prev.preferences.filter(p => p !== preference)
        : [...prev.preferences, preference]
    }));
  };

  const handleSave = () => {
    if (!currentUser) return;

    const updatedUser: UserType = {
      ...currentUser,
      name: formData.name,
      email: formData.email,
      preferences: currentUser.role === 'Investor' ? formData.preferences as ('Repayment' | 'Equity' | 'Both')[] : undefined
    };

    localStorage.setItem('pureequityhub_user', JSON.stringify(updatedUser));
    setCurrentUser(updatedUser);
    setIsEditing(false);
    alert('Profile updated successfully!');
  };

  const handleCancel = () => {
    if (!currentUser) return;
    
    setFormData({
      name: currentUser.name,
      email: currentUser.email,
      company: '',
      phone: '',
      preferences: currentUser.preferences || []
    });
    setIsEditing(false);
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-12">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mr-6">
                  <User className="w-10 h-10 text-blue-600" />
                </div>
                <div className="text-white">
                  <h1 className="text-3xl font-bold mb-2">{currentUser.name}</h1>
                  <div className="flex items-center space-x-4">
                    <span className="bg-blue-500 px-3 py-1 rounded-full text-sm font-medium">
                      {currentUser.role}
                    </span>
                    <span className="text-blue-100">
                      Member since {formatDate(currentUser.createdAt)}
                    </span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="bg-white text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-50 transition-colors flex items-center"
              >
                <Edit className="w-4 h-4 mr-2" />
                {isEditing ? 'Cancel' : 'Edit Profile'}
              </button>
            </div>
          </div>

          <div className="p-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Basic Information */}
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-900 border-b border-gray-200 pb-2">
                  Basic Information
                </h2>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    />
                  ) : (
                    <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                      <User className="w-5 h-5 text-gray-400 mr-3" />
                      <span className="text-gray-900">{currentUser.name}</span>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  {isEditing ? (
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    />
                  ) : (
                    <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                      <Mail className="w-5 h-5 text-gray-400 mr-3" />
                      <span className="text-gray-900">{currentUser.email}</span>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Company
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={formData.company}
                      onChange={(e) => handleInputChange('company', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      placeholder="Enter your company name"
                    />
                  ) : (
                    <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                      <Building className="w-5 h-5 text-gray-400 mr-3" />
                      <span className="text-gray-900">{formData.company || 'Not specified'}</span>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  {isEditing ? (
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      placeholder="Enter your phone number"
                    />
                  ) : (
                    <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                      <Phone className="w-5 h-5 text-gray-400 mr-3" />
                      <span className="text-gray-900">{formData.phone || 'Not specified'}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Role-Specific Information */}
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-900 border-b border-gray-200 pb-2">
                  {currentUser.role} Information
                </h2>

                {currentUser.role === 'Investor' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Investment Preferences
                    </label>
                    {isEditing ? (
                      <div className="space-y-2">
                        {['Repayment', 'Equity', 'Both'].map((preference) => (
                          <label key={preference} className="flex items-center">
                            <input
                              type="checkbox"
                              checked={formData.preferences.includes(preference)}
                              onChange={() => handlePreferenceChange(preference)}
                              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                            />
                            <span className="ml-2 text-sm text-gray-700">{preference}</span>
                          </label>
                        ))}
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {(currentUser.preferences || []).map((preference) => (
                          <div key={preference} className="inline-flex items-center bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium mr-2">
                            {preference}
                          </div>
                        ))}
                        {(!currentUser.preferences || currentUser.preferences.length === 0) && (
                          <span className="text-gray-500">No preferences set</span>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {currentUser.role === 'Buyer' && (
                  <div className="space-y-4">
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <h3 className="font-medium text-blue-900 mb-2">Buyer Benefits</h3>
                      <ul className="text-sm text-blue-700 space-y-1">
                        <li>• Create unlimited funding requests</li>
                        <li>• Access to qualified investors</li>
                        <li>• Secure document sharing with OTP</li>
                        <li>• In-platform messaging and video calls</li>
                      </ul>
                    </div>
                    <div className="text-center">
                      <button
                        onClick={() => router.push('/create-listing')}
                        className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center mx-auto"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Create New Listing
                      </button>
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Account Status
                  </label>
                  <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                    <div className={`w-3 h-3 rounded-full mr-3 ${currentUser.flagged ? 'bg-red-500' : 'bg-green-500'}`}></div>
                    <span className={`font-medium ${currentUser.flagged ? 'text-red-700' : 'text-green-700'}`}>
                      {currentUser.flagged ? 'Flagged' : 'Active'}
                    </span>
                  </div>
                  {currentUser.flagged && currentUser.flagReason && (
                    <p className="text-sm text-red-600 mt-2">
                      Reason: {currentUser.flagReason}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Member Since
                  </label>
                  <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                    <Calendar className="w-5 h-5 text-gray-400 mr-3" />
                    <span className="text-gray-900">{formatDate(currentUser.createdAt)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* User's Funding Requests Section */}
            {currentUser.role === 'Buyer' && userFundingRequests.length > 0 && (
              <div className="mt-12 space-y-6">
                <h2 className="text-xl font-semibold text-gray-900 border-b border-gray-200 pb-2">
                  My Funding Requests
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {userFundingRequests.map((request) => (
                    <div key={request.id} className="bg-white border border-gray-200 rounded-lg shadow-sm p-5">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">{request.title}</h3>
                      <p className="text-sm text-gray-600 mb-3">{request.description.substring(0, 100)}...</p>
                      <div className="flex items-center text-sm text-gray-700 mb-1">
                        <DollarSign className="w-4 h-4 mr-2 text-gray-500" />
                        Purchase Price: ${request.purchasePrice.toLocaleString()}
                      </div>
                      <div className="flex items-center text-sm text-gray-700 mb-1">
                        <MapPin className="w-4 h-4 mr-2 text-gray-500" />
                        Location: {request.location}
                      </div>
                      <div className="flex justify-end mt-4">
                        <button
                          onClick={() => router.push(`/listings/${request.id}`)}
                          className="text-blue-600 hover:text-blue-800 font-medium text-sm"
                        >
                          View Details
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {currentUser.role === 'Buyer' && userFundingRequests.length === 0 && (
              <div className="mt-12 p-8 bg-gray-100 rounded-lg text-center text-gray-500">
                <p>You haven't created any funding requests yet.</p>
                <button
                  onClick={() => router.push('/create-listing')}
                  className="mt-4 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center mx-auto"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create Your First Listing
                </button>
              </div>
            )}

            {/* Action Buttons */}
            {isEditing && (
              <div className="flex items-center justify-end space-x-4 mt-8 pt-6 border-t border-gray-200">
                <button
                  onClick={handleCancel}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center"
                >
                  <X className="w-4 h-4 mr-2" />
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}