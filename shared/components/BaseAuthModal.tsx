// Base auth modal component for web and mobile
import React, { useState } from 'react';
import { Platform } from '../types';

interface BaseAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuth: (email: string, password: string, isSignUp: boolean) => Promise<void>;
  platform: Platform;
  className?: string;
}

export const BaseAuthModal: React.FC<BaseAuthModalProps> = ({
  isOpen,
  onClose,
  onAuth,
  platform,
  className = ''
}) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      await onAuth(email, password, isSignUp);
      // Add haptic feedback for mobile
      if (platform.capabilities.hapticFeedback && 'vibrate' in navigator) {
        navigator.vibrate(50);
      }
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Authentication failed');
      // Add error haptic feedback for mobile
      if (platform.capabilities.hapticFeedback && 'vibrate' in navigator) {
        navigator.vibrate([100, 50, 100]);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setEmail('');
    setPassword('');
    setError('');
    setIsSignUp(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center ${className}`}>
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={handleClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white rounded-3xl p-8 mx-4 w-full max-w-md shadow-2xl">
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors"
          aria-label="Close modal"
        >
          <span className="text-xl">×</span>
        </button>

        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {isSignUp ? 'Create Account' : 'Welcome Back'}
          </h2>
          <p className="text-gray-600">
            {isSignUp 
              ? 'Join Uncover to save your favorites' 
              : 'Sign in to access your favorites'
            }
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email field */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              placeholder="Enter your email"
              required
            />
          </div>

          {/* Password field */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              placeholder="Enter your password"
              required
              minLength={6}
            />
          </div>

          {/* Error message */}
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {/* Submit button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 px-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
          >
            {isLoading ? 'Please wait...' : (isSignUp ? 'Create Account' : 'Sign In')}
          </button>

          {/* Toggle mode */}
          <div className="text-center">
            <button
              type="button"
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-sm text-blue-600 hover:text-blue-700 transition-colors"
            >
              {isSignUp 
                ? 'Already have an account? Sign in' 
                : "Don't have an account? Sign up"
              }
            </button>
          </div>
        </form>

        {/* Biometric auth for mobile */}
        {platform.capabilities.biometricAuth && (
          <div className="mt-6 pt-6 border-t border-gray-200">
            <button
              type="button"
              className="w-full py-3 px-4 bg-gray-100 text-gray-700 font-medium rounded-xl hover:bg-gray-200 transition-colors flex items-center justify-center space-x-2"
            >
              <span>🔒</span>
              <span>Use Biometric Authentication</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default BaseAuthModal;
