import React, { useState, useEffect } from 'react';
import AdminPanel from './AdminPanel';
import Header from './Header';

interface LoginAttempt {
  timestamp: number;
  ip: string;
}

const SecureAdminPanel: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loginAttempts, setLoginAttempts] = useState<LoginAttempt[]>([]);
  const [isBlocked, setIsBlocked] = useState(false);
  const [blockTimeRemaining, setBlockTimeRemaining] = useState(0);

  const BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

  // Security constants
  const CORRECT_USER_ID = '8328246413';
  const CORRECT_PASSWORD = '9441206407';
  const MAX_ATTEMPTS = 3;
  const BLOCK_DURATION = 15 * 60 * 1000; // 15 minutes in milliseconds
  const ATTEMPT_WINDOW = 5 * 60 * 1000; // 5 minutes in milliseconds

  // Check authentication status on component mount
  useEffect(() => {
    const authToken = sessionStorage.getItem('admin_auth_token');
    const authTimestamp = sessionStorage.getItem('admin_auth_timestamp');
    
    if (authToken && authTimestamp) {
      const tokenAge = Date.now() - parseInt(authTimestamp);
      // Token expires after 2 hours
      if (tokenAge < 2 * 60 * 60 * 1000) {
        setIsAuthenticated(true);
      } else {
        // Clear expired token
        sessionStorage.removeItem('admin_auth_token');
        sessionStorage.removeItem('admin_auth_timestamp');
      }
    }

    // Check for existing login attempts and blocks
    const storedAttempts = localStorage.getItem('admin_login_attempts');
    if (storedAttempts) {
      const attempts = JSON.parse(storedAttempts);
      setLoginAttempts(attempts);
      checkBlockStatus(attempts);
    }
  }, []);

  // Check if user is currently blocked
  const checkBlockStatus = (attempts: LoginAttempt[]) => {
    const now = Date.now();
    const recentAttempts = attempts.filter(attempt => 
      now - attempt.timestamp < ATTEMPT_WINDOW
    );

    if (recentAttempts.length >= MAX_ATTEMPTS) {
      const lastAttempt = Math.max(...recentAttempts.map(a => a.timestamp));
      const blockEndTime = lastAttempt + BLOCK_DURATION;
      
      if (now < blockEndTime) {
        setIsBlocked(true);
        setBlockTimeRemaining(Math.ceil((blockEndTime - now) / 1000));
        
        // Start countdown timer
        const timer = setInterval(() => {
          const remaining = Math.ceil((blockEndTime - Date.now()) / 1000);
          if (remaining <= 0) {
            setIsBlocked(false);
            setBlockTimeRemaining(0);
            clearInterval(timer);
            // Clear old attempts
            const filteredAttempts = attempts.filter(attempt => 
              Date.now() - attempt.timestamp < ATTEMPT_WINDOW
            );
            setLoginAttempts(filteredAttempts);
            localStorage.setItem('admin_login_attempts', JSON.stringify(filteredAttempts));
          } else {
            setBlockTimeRemaining(remaining);
          }
        }, 1000);
      }
    }
  };

  // Input sanitization function
  const sanitizeInput = (input: string): string => {
    return input
      .replace(/[<>\"'%;()&+]/g, '') // Remove potentially dangerous characters
      .trim()
      .substring(0, 50); // Limit length
  };

  // Record failed login attempt
  const recordFailedAttempt = () => {
    const attempt: LoginAttempt = {
      timestamp: Date.now(),
      ip: 'client' // In a real app, you'd get the actual IP
    };

    const updatedAttempts = [...loginAttempts, attempt];
    setLoginAttempts(updatedAttempts);
    localStorage.setItem('admin_login_attempts', JSON.stringify(updatedAttempts));
    checkBlockStatus(updatedAttempts);
  };

  // Handle login submission
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isBlocked) {
      setError(`Too many failed attempts. Please wait ${Math.ceil(blockTimeRemaining / 60)} minutes.`);
      return;
    }

    setIsLoading(true);
    setError('');

    // Sanitize inputs
    const sanitizedUserId = sanitizeInput(userId);
    const sanitizedPassword = sanitizeInput(password);

    // Simulate processing time to prevent timing attacks
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));

    // Skip local credential check — rely on backend auth
    if (!sanitizedUserId || !sanitizedPassword) {
      setError('Please enter both User ID and Password.');
      setIsLoading(false);
      return;
    }

    // Authenticate with backend to obtain JWT for secured APIs
    try {
      const resp = await fetch(`${BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: sanitizedUserId, password: sanitizedPassword })
      });

      const data = await resp.json();
      if (resp.ok && data?.success && data?.data?.token) {
        const token = data.data.token;
        sessionStorage.setItem('admin_auth_token', token);
        sessionStorage.setItem('admin_auth_timestamp', Date.now().toString());

        // Clear login attempts on successful login
        setLoginAttempts([]);
        localStorage.removeItem('admin_login_attempts');

        setIsAuthenticated(true);
        setUserId('');
        setPassword('');
      } else {
        recordFailedAttempt();
        setError(data?.message || 'Authentication failed on server.');
      }
    } catch (err) {
      console.error('Admin login error:', err);
      recordFailedAttempt();
      setError('Network or server error during authentication.');
    }

    setIsLoading(false);
  };

  // Handle logout
  const handleLogout = () => {
    sessionStorage.removeItem('admin_auth_token');
    sessionStorage.removeItem('admin_auth_timestamp');
    setIsAuthenticated(false);
    setUserId('');
    setPassword('');
  };

  // Format time remaining for display
  const formatTimeRemaining = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  if (isAuthenticated) {
    return (
      <>
        <Header />
        <div className="relative">
          {/* Logout button */}
          <div className="absolute top-4 right-4 z-50">
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors duration-200 text-sm font-medium"
            >
              🔒 Secure Logout
            </button>
          </div>
          <AdminPanel />
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Security Warning */}
          <div className="mb-6 p-4 bg-red-900/20 border border-red-500/30 rounded-lg">
            <div className="flex items-center space-x-2 text-red-400">
              <span className="text-xl">🔒</span>
              <span className="font-semibold">Secure Admin Access</span>
            </div>
            <p className="text-red-300 text-sm mt-1">
              This is a protected area. Unauthorized access is prohibited.
            </p>
          </div>

          {/* Login Form */}
          <div className="bg-black/40 backdrop-blur-lg border border-white/20 rounded-xl p-8 shadow-2xl">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-white mb-2">Admin Portal</h1>
              <p className="text-white/60">Enter your credentials to continue</p>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-900/30 border border-red-500/50 rounded-lg">
                <p className="text-red-300 text-sm">{error}</p>
              </div>
            )}

            {isBlocked && (
              <div className="mb-6 p-4 bg-yellow-900/30 border border-yellow-500/50 rounded-lg">
                <div className="flex items-center space-x-2 text-yellow-300">
                  <span className="text-xl">⏰</span>
                  <span className="font-semibold">Account Temporarily Locked</span>
                </div>
                <p className="text-yellow-200 text-sm mt-1">
                  Time remaining: {formatTimeRemaining(blockTimeRemaining)}
                </p>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label htmlFor="userId" className="block text-white/80 text-sm font-medium mb-2">
                  User ID
                </label>
                <input
                  type="text"
                  id="userId"
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your User ID"
                  required
                  disabled={isLoading || isBlocked}
                  maxLength={50}
                  autoComplete="off"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-white/80 text-sm font-medium mb-2">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your Password"
                  required
                  disabled={isLoading || isBlocked}
                  maxLength={50}
                  autoComplete="off"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading || isBlocked}
                className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-600 disabled:to-gray-700 text-white font-semibold rounded-lg transition-all duration-200 transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Authenticating...</span>
                  </div>
                ) : (
                  '🔐 Secure Login'
                )}
              </button>
            </form>

            {/* Security Info */}
            <div className="mt-6 pt-6 border-t border-white/10">
              <div className="text-center text-white/40 text-xs space-y-1">
                <p>🛡️ Protected by advanced security measures</p>
                <p>🔒 Session expires after 2 hours of inactivity</p>
                <p>⚠️ Maximum 3 login attempts per 5 minutes</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SecureAdminPanel;