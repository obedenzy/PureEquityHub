import { User } from '../types';

const STORAGE_KEY = 'pureequityhub_user';

export const mockUsers: User[] = [
  {
    id: 'buyer-1',
    email: 'buyer@example.com',
    role: 'Buyer',
    name: 'Alex Buyer',
    createdAt: '2024-01-15T10:00:00Z',
    preferences: ['Both'],
    flagged: false
  },
  {
    id: 'investor-1',
    email: 'investor@example.com',
    role: 'Investor',
    name: 'Jordan Investor',
    createdAt: '2024-01-20T10:00:00Z',
    preferences: ['Equity', 'Repayment'],
    flagged: false
  }
];

export const getCurrentUser = (): User | null => {
  if (typeof window === 'undefined') return null;
  
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return null;
  
  try {
    return JSON.parse(stored);
  } catch {
    return null;
  }
};

export const login = (email: string, password: string): User | null => {
  // Simple mock authentication - in real app, this would validate against backend
  const user = mockUsers.find(u => u.email === email);
  if (user && password === 'password123') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    return user;
  }
  return null;
};

export const logout = (): void => {
  localStorage.removeItem(STORAGE_KEY);
};

export const isAuthenticated = (): boolean => {
  return getCurrentUser() !== null;
};