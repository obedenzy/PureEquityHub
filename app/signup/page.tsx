'use client';

import { useState } from 'react';
import { Eye, EyeOff, User, Building, TrendingUp } from 'lucide-react';
import { login } from '../../lib/auth';
import { User as UserType } from '../../types';
import { useRouter } from 'next/navigation';

export default function SignupPage() {
  const router = useRouter();
  const [userType, setUserType] = useState<'Buyer' | 'Investor'>('Buyer');
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    company: '',
    phone: '',
    preferences: [] as string[]
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handlePreferenceChange = (preference: string) => {
    setFormData(prev => ({
      ...prev,
      preferences: prev.preferences.includes(preference)
        ? prev.preferences.filter(p => p !== preference)
        : [...prev.preferences, preference]
    }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!formData.email.includes('@')) newErrors.email = 'Valid email is required';
    if (!formData.password) newErrors.password = 'Password is required';
    if (formData.password.length < 8) newErrors.password = 'Password must be at least 8 characters';
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';

    if (userType === 'Investor' && formData.preferences.length === 0) {
      newErrors.preferences = 'Please select at least one investment preference';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    // Mock signup - in real app, this would call an API
    const newUser: UserType = {
      id: `user-${Date.now()}`,
      email: formData.email,
      role: userType,
      name: formData.name,
      createdAt: new Date().toISOString(),
      preferences: userType === 'Investor' ? formData.preferences as ('Repayment' | 'Equity' | 'Both')[] : undefined,
      flagged: false
    };

    // Auto-login the new user
    localStorage.setItem('pureequityhub_user', JSON.stringify(newUser));
    
    alert(`Account created successfully! Welcome to PureEquityHub, ${formData.name}!`);
    router.push('/listings');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Left Side - Image */}
      <div className="hidden lg:flex lg:w-1/2 relative">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/90 to-blue-700/90 z-10"></div>
        <img
          src="https://images.pexels.com/photos/3182763/pexels-photo-3182763.jpeg"
          alt="Business meeting"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 z-20 flex items-center justify-center p-12">
          <div className="text-center text-white">
            <h1 className="text-4xl font-bold mb-6">Join PureEquityHub</h1>
            <p className="text-xl text-blue-100 mb-8 leading-relaxed">
              Connect with investors and buyers in the premier marketplace for SBA 7a loan equity injection, 
              business acquisition financing, and real estate equity deals.
            </p>
            <div className="grid grid-cols-1 gap-4 text-left">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-blue-300 rounded-full mr-3"></div>
                <span>$100K - $25M project range</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-blue-300 rounded-full mr-3"></div>
                <span>Secure document sharing with OTP</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-blue-300 rounded-full mr-3"></div>
                <span>In-platform messaging & video calls</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <User className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Create Account</h2>
            <p className="text-gray-600">Join thousands of investors and buyers</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* User Type Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                I am a
              </label>
              <select
                value={userType}
                onChange={(e) => setUserType(e.target.value as 'Buyer' | 'Investor')}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              >
                <option value="Buyer">Buyer - Seeking equity injection</option>
                <option value="Investor">Investor - Providing equity funding</option>
              </select>
            </div>

            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="Enter your full name"
              />
              {errors.name && <p className="text-red-600 text-sm mt-1">{errors.name}</p>}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="Enter your email"
              />
              {errors.email && <p className="text-red-600 text-sm mt-1">{errors.email}</p>}
            </div>

            {/* Company */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Company (Optional)
              </label>
              <input
                type="text"
                value={formData.company}
                onChange={(e) => handleInputChange('company', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="Enter your company name"
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="Enter your phone number"
              />
              {errors.phone && <p className="text-red-600 text-sm mt-1">{errors.phone}</p>}
            </div>

            {/* Investor Preferences */}
            {userType === 'Investor' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Investment Preferences
                </label>
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
                {errors.preferences && <p className="text-red-600 text-sm mt-1">{errors.preferences}</p>}
              </div>
            )}

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="Create a password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && <p className="text-red-600 text-sm mt-1">{errors.password}</p>}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confirm Password
              </label>
              <input
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="Confirm your password"
              />
              {errors.confirmPassword && <p className="text-red-600 text-sm mt-1">{errors.confirmPassword}</p>}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium text-lg"
            >
              Create {userType} Account
            </button>

            <div className="text-center text-sm text-gray-600">
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => router.push('/')}
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                Sign in
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}