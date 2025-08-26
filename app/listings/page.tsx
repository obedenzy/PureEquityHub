'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { Search, Filter, Heart, MapPin, DollarSign, TrendingUp, X } from 'lucide-react';
import { mockFundingRequests } from '../../lib/mockData';
import { FundingRequest } from '../../types';

export default function ListingsPage() {
  const [listings, setListings] = useState<FundingRequest[]>(mockFundingRequests);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('');
  const [selectedLocation, setSelectedLocation] = useState<string>('');
  const [selectedPreference, setSelectedPreference] = useState<string>('');
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [showFilters, setShowFilters] = useState(false);

  // Get unique values for filter dropdowns
  const locations = useMemo(() => {
    return Array.from(new Set(listings.map(listing => listing.location))).sort();
  }, [listings]);

  const preferences = useMemo(() => {
    return Array.from(new Set(listings.map(listing => listing.preference))).sort();
  }, [listings]);

  // Filter listings based on search and filters
  const filteredListings = useMemo(() => {
    return listings.filter(listing => {
      const matchesSearch = searchTerm === '' || 
        listing.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        listing.description.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesType = selectedType === '' || listing.type === selectedType;
      const matchesLocation = selectedLocation === '' || listing.location === selectedLocation;
      const matchesPreference = selectedPreference === '' || listing.preference === selectedPreference;

      return matchesSearch && matchesType && matchesLocation && matchesPreference;
    });
  }, [listings, searchTerm, selectedType, selectedLocation, selectedPreference]);

  const toggleFavorite = (id: string) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(id)) {
      newFavorites.delete(id);
    } else {
      newFavorites.add(id);
    }
    setFavorites(newFavorites);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedType('');
    setSelectedLocation('');
    setSelectedPreference('');
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

  const activeFiltersCount = [selectedType, selectedLocation, selectedPreference].filter(Boolean).length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Investment Opportunities</h1>
              <p className="text-gray-600">
                Discover vetted SBA loans, business acquisitions, and real estate investments
              </p>
            </div>
            <div className="mt-4 lg:mt-0">
              <div className="flex items-center text-sm text-gray-500">
                <span className="font-medium text-blue-600">{filteredListings.length}</span>
                <span className="ml-1">opportunities found</span>
              </div>
            </div>
          </div>

          {/* Search and Filter Bar */}
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search opportunities..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center px-6 py-3 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 transition-colors"
            >
              <Filter className="w-5 h-5 mr-2" />
              Filters
              {activeFiltersCount > 0 && (
                <span className="ml-2 bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {activeFiltersCount}
                </span>
              )}
            </button>
          </div>

          {/* Filter Panel */}
          {showFilters && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg border">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">All Types</option>
                  <option value="SBA">SBA Loans</option>
                  <option value="Non-SBA">Business Acquisitions</option>
                  <option value="Real Estate">Real Estate</option>
                </select>
                
                <select
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">All Locations</option>
                  {locations.map(location => (
                    <option key={location} value={location}>{location}</option>
                  ))}
                </select>
                
                <select
                  value={selectedPreference}
                  onChange={(e) => setSelectedPreference(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">All Preferences</option>
                  {preferences.map(preference => (
                    <option key={preference} value={preference}>{preference}</option>
                  ))}
                </select>
              </div>
              
              {activeFiltersCount > 0 && (
                <button
                  onClick={clearFilters}
                  className="flex items-center text-sm text-blue-600 hover:text-blue-700 transition-colors"
                >
                  <X className="w-4 h-4 mr-1" />
                  Clear all filters
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Listings Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredListings.map((listing) => (
            <div key={listing.id} className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-200 overflow-hidden group">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getTypeColor(listing.type)}`}>
                    {listing.type === 'Non-SBA' ? 'Business Acquisition' : listing.type}
                  </span>
                  <button
                    onClick={() => toggleFavorite(listing.id)}
                    className="text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <Heart className={`w-5 h-5 ${favorites.has(listing.id) ? 'fill-red-500 text-red-500' : ''}`} />
                  </button>
                </div>

                <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                  {listing.title}
                </h3>
                
                <p className="text-gray-600 mb-4 line-clamp-2 text-sm leading-relaxed">
                  {listing.description}
                </p>

                <div className="space-y-3 mb-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                    {listing.location}
                  </div>
                  
                  <div className="flex items-center text-sm text-gray-600">
                    <DollarSign className="w-4 h-4 mr-2 text-gray-400" />
                    Purchase Price: {formatCurrency(listing.purchasePrice)}
                  </div>
                  
                  <div className="flex items-center text-sm text-gray-600">
                    <TrendingUp className="w-4 h-4 mr-2 text-gray-400" />
                    Equity Injection: {formatCurrency(listing.amount)}
                  </div>
                  
                  <div className="flex items-center text-sm text-gray-600">
                    <span className="w-4 h-4 mr-2 text-gray-400">📅</span>
                    Closing: {listing.closingDate ? new Date(listing.closingDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'TBD'}
                  </div>
                </div>

                <div className="pt-3 mb-4">
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {listing.description}
                  </p>
                </div>

                <div className="flex items-center text-xs text-gray-500 mb-4">
                  Posted: {new Date(listing.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                  <div className="text-sm">
                    <span className="text-gray-500">Preference:</span>
                    <span className="font-medium text-gray-900 ml-1">
                      {listing.investorPreference}
                    </span>
                  </div>
                  
                  <Link
                    href={`/listings/${listing.id}`}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                  >
                    View Details
                  </Link>
                </div>

                <div className="mt-2 text-center">
                  <div className="text-sm">
                    <span className="text-gray-500">Expected Return:</span>
                    <span className="font-semibold text-green-600 ml-1">
                      {formatCurrency(listing.profit)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredListings.length === 0 && (
          <div className="text-center py-16">
            <div className="text-gray-400 mb-4">
              <Search className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No opportunities found</h3>
            <p className="text-gray-600 mb-4">
              Try adjusting your search criteria or clearing your filters
            </p>
            <button
              onClick={clearFilters}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}