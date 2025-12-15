import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import FloatingLines from './FloatingLines';
import ModernClock from './ModernClock';
import { useGoogleLogin } from '@react-oauth/google';
import toast, { Toaster } from 'react-hot-toast';

const BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

const StudentLogin = () => {
  const navigate = useNavigate();
  const [loginData, setLoginData] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginData(prev => ({
      ...prev,
      [name]: value
    }));
    if (error) setError('');
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const usernameTrim = loginData.username.trim();
    const passwordTrim = loginData.password;
    const isEmail = usernameTrim.includes('@');

    const payload: Record<string, string> = {
      password: passwordTrim,
      usernameOrEmail: usernameTrim,
      ...(isEmail ? { email: usernameTrim } : { username: usernameTrim })
    };

    try {
      const response = await fetch(`${BASE_URL}/api/students/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      let result = null;
      let rawText = '';
      try {
        result = await response.json();
      } catch {
        rawText = await response.text();
      }

      if (!(response.ok && result && result.success)) {
        const errMsg =
          (result && (result.message || result.error)) ||
          rawText ||
          `Login failed (${response.status}).`;
        setError(errMsg);
        toast.error(errMsg, {
          duration: 4000,
          position: 'top-center',
        });
        return;
      }

      const userData = {
        ...result.data.student,
        isAuthenticated: true,
        token: result.data.token
      };
      localStorage.setItem('currentUser', JSON.stringify(userData));
      if (userData.token) localStorage.setItem('authToken', userData.token);

      toast.success('Login successful! Welcome back 👋', {
        duration: 2000,
        position: 'top-center',
      });

      navigate('/student-portal');
    } catch (err) {
      console.error('Login error:', err);
      const errorMsg = 'Unable to connect to server. Please try again.';
      setError(errorMsg);
      toast.error(errorMsg, {
        duration: 4000,
        position: 'top-center',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const googleLogin = googleClientId ? useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        setIsGoogleLoading(true);
        setError('');
        // Get user info from Google using the access token
        const userInfoResponse = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: {
            Authorization: `Bearer ${tokenResponse.access_token}`,
          },
        });
        const userInfo = await userInfoResponse.json();
        // Send the access token or user info to your backend
        const resp = await fetch(`${BASE_URL}/api/students/google-login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({ 
            accessToken: tokenResponse.access_token,
            userInfo: userInfo
          })
        });
        const data = await resp.json().catch(async () => ({ raw: await resp.text() }));
        if (!resp.ok || !data?.success) {
          const msg = data?.message || data?.error || 'Google login failed.';
          setError(msg);
          toast.error(msg, {
            duration: 4000,
            position: 'top-center',
          });
          setIsGoogleLoading(false);
          return;
        }
        const { student, token, needsSetup } = data.data;
        const userData = { ...student, isAuthenticated: true, token };
        localStorage.setItem('currentUser', JSON.stringify(userData));
        if (token) localStorage.setItem('authToken', token);
        const requiresSetup = needsSetup || student.setupRequired;
        toast.success('Google login successful! 🎉', {
          duration: 2000,
          position: 'top-center',
        });
        if (requiresSetup) {
          navigate('/student-setup');
        } else {
          navigate('/student-portal');
        }
      } catch (e) {
        console.error('Google login error:', e);
        const errorMsg = 'Unable to login with Google. Please try again.';
        setError(errorMsg);
        toast.error(errorMsg, {
          duration: 4000,
          position: 'top-center',
        });
      } finally {
        setIsGoogleLoading(false);
      }
    },
    onError: () => {
      console.log('Google Login Failed');
      const errorMsg = 'Google login failed. Please try again.';
      setError(errorMsg);
      toast.error(errorMsg, {
        duration: 4000,
        position: 'top-center',
      });
    },
  }) : () => {
    const msg = 'Google login is not configured.';
    setError(msg);
    toast.error(msg, { duration: 3000, position: 'top-center' });
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <Toaster />
      <div>
        <div className="grid grid-cols-1 lg:grid-cols-2 min-h-screen">

          {/* LEFT SIDE (Clock Centered Here) */}
          <div className="relative hidden lg:block h-full">
            <FloatingLines
              enabledWaves={['top', 'middle', 'bottom']}
              lineCount={[8, 12, 14]}
              lineDistance={[10, 8, 6]}
              bendRadius={5.0}
              bendStrength={-0.4}
              interactive={true}
              parallax={true}
              animationSpeed={0.8}
            />

            {/* Black overlay */}
            <div className="absolute inset-0 pointer-events-none bg-gradient-to-r from-black/50 via-black/25 to-transparent" />
          </div>

          {/* RIGHT - Login panel */}
          <div className="bg-white text-gray-900 flex items-center justify-center px-6 py-12 rounded-tl-3xl lg:rounded-none">
            <div className="w-full max-w-md">

              <div className="text-center mb-6">
                <div className="text-2xl font-semibold tracking-[0.35em]">BLUNET</div>
                <p className="text-xs text-gray-500 mt-3">
                  Welcome back! Please login to continue
                </p>
              </div>

              {/* Scheduled Maintenance Notice */}
              <div className="mb-6 rounded-lg border border-yellow-300 bg-yellow-50 text-yellow-900 p-4">
                <h4 className="font-semibold text-sm">Notice: Scheduled Maintenance</h4>
                <p className="mt-2 text-xs">
                  Our servers are currently undergoing maintenance as we work to update our systems and enhance the overall user experience.
                </p>
                <p className="mt-2 text-xs">
                  During this time, the student login page will be temporarily unavailable. For project submissions or any questions, kindly reach out to us via email. Students may submit their project Git repository URL through email as well.
                </p>
                <p className="mt-2 text-xs">We appreciate your patience and understanding as we work to improve our platform.</p>
              </div>

              <div className="mb-4">
                <button
                  type="button"
                  onClick={() => googleLogin()}
                  disabled={isGoogleLoading || !googleClientId}
                  className="w-full flex items-center justify-center gap-3 px-4 py-3 
               bg-white border border-gray-300 rounded-md 
               text-gray-700 font-medium text-sm
               hover:bg-gray-50 hover:border-gray-400 
               transition-all duration-200
               disabled:opacity-60 disabled:cursor-not-allowed
               shadow-sm"
                >
                  {/* Google icon from your SVG file */}
                  <img src="/icons8-google.svg" alt="Google" className="w-5 h-5" />
                  <span>{isGoogleLoading ? 'Signing in...' : (googleClientId ? 'Continue with Google' : 'Google login unavailable')}</span>
                </button>
              </div>

              <div className="flex items-center gap-3 mb-4">
                <div className="h-px flex-1 bg-gray-200"></div>
                <span className="text-xs text-gray-500">or</span>
                <div className="h-px flex-1 bg-gray-200"></div>
              </div>

              <form onSubmit={handleLogin}>
                <div className="space-y-3">
                  <input
                    type="text"
                    name="username"
                    value={loginData.username}
                    onChange={handleInputChange}
                    placeholder="Username or email"
                    required
                    className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-md"
                  />

                  <input
                    type="password"
                    name="password"
                    value={loginData.password}
                    onChange={handleInputChange}
                    placeholder="Password"
                    required
                    className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-md"
                  />
                </div>

                {error && (
                  <div className="mt-3 p-3 bg-red-100 border border-red-200 text-red-600 text-sm rounded-md">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isLoading || isGoogleLoading}
                  className="w-full mt-4 bg-black text-white py-3 rounded-md font-medium hover:bg-gray-900 disabled:opacity-60"
                >
                  {isLoading ? 'Logging in…' : 'Log in'}
                </button>
              </form>

              <div className="mt-4 text-center">
                <button
                  onClick={() => alert('Forgot password? Contact support.')}
                  className="text-gray-600 hover:text-gray-900 text-sm"
                >
                  Forgot password?
                </button>
              </div>

              {/* Sign Up Call-to-Action */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <p className="text-center text-sm text-gray-600">
                  Don't have an account?{' '}
                  <button
                    onClick={() => navigate('/student-registration')}
                    className="font-bold text-black hover:underline"
                  >
                    Sign up
                  </button>
                </p>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentLogin;


