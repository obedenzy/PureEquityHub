'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { User, LogIn, LogOut, Menu, X } from 'lucide-react';
import { getCurrentUser, logout } from '../lib/auth';
import { User as UserType } from '../types';
import LoginModal from './LoginModal';

export default function Header() {
  const [user, setUser] = useState<UserType | null>(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    setUser(getCurrentUser());
  }, []);

  const handleLogout = () => {
    logout();
    setUser(null);
  };

  const handleLoginSuccess = (loggedInUser: UserType) => {
    setUser(loggedInUser);
    setShowLoginModal(false);
  };

  return (
    <>
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link href="/" className="flex items-center">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-lg mr-3">
                  P
                </div>
                <span className="text-xl font-bold text-gray-900">PureEquityHub</span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <Link href="/listings" className="text-gray-600 hover:text-blue-600 font-medium transition-colors">
                Browse Listings
              </Link>
              <Link href="/inbox" className="text-gray-600 hover:text-blue-600 font-medium transition-colors">
                Inbox
              </Link>
              <Link href="/profile" className="text-gray-600 hover:text-blue-600 font-medium transition-colors">
                Profile
              </Link>
              {user?.role === 'Buyer' && (
                <Link href="/create-listing" className="text-gray-600 hover:text-blue-600 font-medium transition-colors">
                  Create Listing
                </Link>
              )}
              {user ? (
                <div className="flex items-center space-x-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <User className="w-4 h-4 mr-1" />
                    {user.name} ({user.role})
                  </div>
                  <button
                    onClick={handleLogout}
                    className="flex items-center text-gray-600 hover:text-red-600 transition-colors"
                  >
                    <LogOut className="w-4 h-4 mr-1" />
                    Logout
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setShowLoginModal(true)}
                  className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <LogIn className="w-4 h-4 mr-2" />
                  Login
                </button>
              )}
            </nav>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="text-gray-600 hover:text-gray-900"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <div className="md:hidden py-4 border-t">
              <div className="flex flex-col space-y-3">
                <Link 
                  href="/listings" 
                  className="text-gray-600 hover:text-blue-600 font-medium py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Browse Listings
                </Link>
                <Link 
                  href="/inbox" 
                  className="text-gray-600 hover:text-blue-600 font-medium py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Inbox
                </Link>
                <Link 
                  href="/profile" 
                  className="text-gray-600 hover:text-blue-600 font-medium py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Profile
                </Link>
                {user?.role === 'Buyer' && (
                  <Link 
                    href="/create-listing" 
                    className="text-gray-600 hover:text-blue-600 font-medium py-2"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Create Listing
                  </Link>
                )}
                <Link 
                  href="/signup" 
                  className="text-gray-600 hover:text-blue-600 font-medium py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Sign Up
                </Link>
                {user ? (
                  <>
                    <div className="flex items-center text-sm text-gray-600 py-2">
                      <User className="w-4 h-4 mr-2" />
                      {user.name} ({user.role})
                    </div>
                    <button
                      onClick={() => {
                        handleLogout();
                        setMobileMenuOpen(false);
                      }}
                      className="flex items-center text-red-600 hover:text-red-700 transition-colors py-2"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Logout
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => {
                      setShowLoginModal(true);
                      setMobileMenuOpen(false);
                    }}
                    className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors justify-center"
                  >
                    <LogIn className="w-4 h-4 mr-2" />
                    Login
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </header>

      {showLoginModal && (
        <LoginModal
          onClose={() => setShowLoginModal(false)}
          onSuccess={handleLoginSuccess}
        />
      )}
    </>
  );
}