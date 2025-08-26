import Link from 'next/link';
import { ArrowRight, Target, TrendingUp, Shield, Users, DollarSign, Building, Handshake, Video, FileCheck } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-800/20 to-transparent"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl lg:text-6xl font-bold mb-6 leading-tight tracking-tight">
              SBA 7a Loan Equity Injection
              <span className="text-blue-300 block">Marketplace</span>
            </h1>
            <p className="text-xl lg:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto leading-relaxed font-light">
              Connect investors with buyers seeking 10% equity injection for SBA 7a loans, business acquisition financing, 
              and real estate equity financing. Secure deals from $100K to $25M with our vetted marketplace.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/listings"
                className="inline-flex items-center bg-white text-blue-900 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-blue-50 transition-all transform hover:scale-105 shadow-xl hover:shadow-2xl"
              >
                Browse Equity Opportunities
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
              <button
                onClick={() => window.location.href = '/signup'}
                className="inline-flex items-center border-2 border-white text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-white hover:text-blue-900 transition-all"
              >
                Join PureEquityHub
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Trusted by Thousands of Investors & Buyers</h2>
            <p className="text-xl text-gray-600">The leading platform for SBA loan equity injection and business financing</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-blue-600 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                <Target className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-5xl font-bold text-gray-900 mb-2">700+</h3>
              <p className="text-lg text-gray-600 font-medium">New equity requests monthly</p>
              <p className="text-sm text-gray-500 mt-1">$150 flat listing fee</p>
            </div>
            <div className="text-center">
              <div className="bg-green-600 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                <DollarSign className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-5xl font-bold text-gray-900 mb-2">$1.7M</h3>
              <p className="text-lg text-gray-600 font-medium">Platform revenue annually</p>
              <p className="text-sm text-gray-500 mt-1">Growing 40% year-over-year</p>
            </div>
            <div className="text-center">
              <div className="bg-orange-600 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-5xl font-bold text-gray-900 mb-2">8,400+</h3>
              <p className="text-lg text-gray-600 font-medium">Active equity opportunities</p>
              <p className="text-sm text-gray-500 mt-1">$100K - $25M project range</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Three Equity Financing Categories
            </h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              Connect with buyers seeking equity injection for SBA 7a loans, business acquisition financing, 
              and real estate equity deals. Choose your investment preference: repayment, equity, or both.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* SBA 7a Loans */}
            <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 hover:shadow-2xl transition-all duration-300 group relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full -mr-16 -mt-16 group-hover:bg-blue-100 transition-colors"></div>
              <div className="relative">
                <div className="bg-blue-100 w-20 h-20 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-blue-200 transition-colors shadow-md">
                <Shield className="w-8 h-8 text-blue-600" />
              </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">SBA 7a Loan Equity Injection</h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  Connect with buyers seeking 10% equity injection for SBA 7a loans. Government-backed security 
                  with competitive returns and reduced risk for established business acquisitions.
              </p>
              <ul className="space-y-2 mb-6">
                <li className="flex items-center text-sm text-gray-600">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mr-3"></div>
                  10% equity injection required
                </li>
                <li className="flex items-center text-sm text-gray-600">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mr-3"></div>
                  7% average returns on investment
                </li>
                <li className="flex items-center text-sm text-gray-600">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mr-3"></div>
                  Government-backed security
                </li>
              </ul>
              <Link
                href="/listings?type=SBA"
                className="inline-flex items-center text-blue-600 font-semibold hover:text-blue-700 transition-colors group-hover:translate-x-1 transform duration-200"
              >
                Explore SBA 7a Equity Deals
                <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
              </div>
            </div>

            {/* Business Acquisitions */}
            <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 hover:shadow-2xl transition-all duration-300 group relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-green-50 rounded-full -mr-16 -mt-16 group-hover:bg-green-100 transition-colors"></div>
              <div className="relative">
                <div className="bg-green-100 w-20 h-20 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-green-200 transition-colors shadow-md">
                <TrendingUp className="w-8 h-8 text-green-600" />
              </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Business Acquisition Equity</h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  Fund high-growth companies and established businesses seeking acquisition financing. 
                  Higher returns with vetted opportunities and proven track records.
              </p>
              <ul className="space-y-2 mb-6">
                <li className="flex items-center text-sm text-gray-600">
                  <div className="w-2 h-2 bg-green-600 rounded-full mr-3"></div>
                  15% equity injection typical
                </li>
                <li className="flex items-center text-sm text-gray-600">
                  <div className="w-2 h-2 bg-green-600 rounded-full mr-3"></div>
                  15% average returns
                </li>
                <li className="flex items-center text-sm text-gray-600">
                  <div className="w-2 h-2 bg-green-600 rounded-full mr-3"></div>
                  Vetted high-growth opportunities
                </li>
              </ul>
              <Link
                href="/listings?type=Non-SBA"
                className="inline-flex items-center text-green-600 font-semibold hover:text-green-700 transition-colors group-hover:translate-x-1 transform duration-200"
              >
                View Business Equity Deals
                <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
              </div>
            </div>

            {/* Real Estate Equity */}
            <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 hover:shadow-2xl transition-all duration-300 group relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-orange-50 rounded-full -mr-16 -mt-16 group-hover:bg-orange-100 transition-colors"></div>
              <div className="relative">
                <div className="bg-orange-100 w-20 h-20 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-orange-200 transition-colors shadow-md">
                <Building className="w-8 h-8 text-orange-600" />
              </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Real Estate Equity Financing</h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  Provide equity financing for commercial real estate acquisitions including office buildings, 
                  retail centers, and mixed-use developments with strong cash flow potential.
              </p>
              <ul className="space-y-2 mb-6">
                <li className="flex items-center text-sm text-gray-600">
                  <div className="w-2 h-2 bg-orange-600 rounded-full mr-3"></div>
                  20% equity injection typical
                </li>
                <li className="flex items-center text-sm text-gray-600">
                  <div className="w-2 h-2 bg-orange-600 rounded-full mr-3"></div>
                  9% average returns
                </li>
                <li className="flex items-center text-sm text-gray-600">
                  <div className="w-2 h-2 bg-orange-600 rounded-full mr-3"></div>
                  Prime commercial locations
                </li>
              </ul>
              <Link
                href="/listings?type=Real Estate"
                className="inline-flex items-center text-orange-600 font-semibold hover:text-orange-700 transition-colors group-hover:translate-x-1 transform duration-200"
              >
                Browse Real Estate Equity
                <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Platform Features */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Complete Equity Investment Platform
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Everything you need to connect, communicate, and close equity deals securely
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-blue-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                <Video className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">In-Platform Communication</h3>
              <p className="text-gray-600">
                Secure messaging and video calls directly within the platform. No need for external communication tools.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-green-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                <FileCheck className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">OTP Document Access</h3>
              <p className="text-gray-600">
                Secure document sharing with OTP verification. Buyers upload redacted termsheets and LOIs for review.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-orange-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                <Handshake className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Investor Preferences</h3>
              <p className="text-gray-600">
                Choose your investment structure: repayment only, equity participation, or hybrid arrangements.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" style={{animationDelay: '2s'}}></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl lg:text-5xl font-bold mb-6 relative z-10">Ready to Start Investing?</h2>
          <p className="text-xl mb-8 max-w-4xl mx-auto text-blue-100 leading-relaxed relative z-10">
            Join thousands of investors and buyers who trust PureEquityHub for SBA 7a loan equity injection, 
            business acquisition financing, and real estate equity deals.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/listings"
              className="inline-flex items-center bg-white text-blue-600 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-blue-50 transition-all shadow-xl hover:shadow-2xl transform hover:scale-105 relative z-10"
            >
              Browse Equity Deals
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
            <button className="inline-flex items-center border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white hover:text-blue-600 transition-all">
              List Your Opportunity
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}