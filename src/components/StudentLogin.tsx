import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import FloatingLines from './FloatingLines';
import ModernClock from './ModernClock';
import { GoogleLogin } from '@react-oauth/google';

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
        return;
      }

      const userData = {
        ...result.data.student,
        isAuthenticated: true,
        token: result.data.token
      };
      localStorage.setItem('currentUser', JSON.stringify(userData));
      if (userData.token) localStorage.setItem('authToken', userData.token);
      navigate('/student-portal');
    } catch (err) {
      console.error('Login error:', err);
      setError('Unable to connect to server. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse: any) => {
    try {
      setIsGoogleLoading(true);
      setError('');
      const idToken: string | undefined = credentialResponse?.credential;
      if (!idToken) {
        setError('Google login failed. No credential returned.');
        setIsGoogleLoading(false);
        return;
      }

      const resp = await fetch(`${BASE_URL}/api/students/google-login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ idToken })
      });

      const data = await resp.json().catch(async () => ({ raw: await resp.text() }));
      if (!resp.ok || !data?.success) {
        const msg = data?.message || data?.error || 'Google login failed.';
        setError(msg);
        setIsGoogleLoading(false);
        return;
      }

      const { student, token, setupRequired } = data.data;
      const userData = { ...student, isAuthenticated: true, token };
      localStorage.setItem('currentUser', JSON.stringify(userData));
      if (token) localStorage.setItem('authToken', token);

      if (setupRequired) {
        navigate('/student-setup');
      } else {
        navigate('/student-portal');
      }
    } catch (e) {
      console.error('Google login error:', e);
      setError('Unable to login with Google. Please try again.');
    } finally {
      setIsGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
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
                  Log in below or{' '}
                  <button
                    onClick={() => navigate('/student-registration')}
                    className="text-gray-700 hover:text-black underline"
                  >
                    sign up
                  </button>{' '}
                  to create an account
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

              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="flex items-center justify-center">
                  <GoogleLogin
                    onSuccess={handleGoogleSuccess}
                    onError={() => setError('Google login failed. Please try again.')}
                    useOneTap
                  />
                </div>

                <button type="button" className="flex items-center justify-center gap-2 border border-gray-200 rounded-md py-2 hover:bg-gray-50">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M22 12.06C22 6.5 17.52 2 11.94 2 6.36 2 2 6.5 2 12.06c0 4.98 3.64 9.1 8.4 9.96v-7.04H7.9v-2.92h2.5V9.9c0-2.5 1.48-3.86 3.76-3.86 1.1 0 2.24.2 2.24.2v2.48h-1.26c-1.24 0-1.62.78-1.62 1.58v1.9h2.76l-.44 2.92h-2.32V22c4.76-.86 8.44-4.98 8.44-9.94z" />
                  </svg>
                  <span className="text-sm">Facebook</span>
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

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentLogin;
