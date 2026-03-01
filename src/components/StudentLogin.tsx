import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import FloatingLines from './FloatingLines';
import ModernClock from './ModernClock';
import { useGoogleLogin } from '@react-oauth/google';
import toast, { Toaster } from 'react-hot-toast';

const BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

// ── Fire-and-forget error reporter ─────────────────────────────────
// Sends client-side errors to the backend so they appear in Railway logs.
// Never throws, never blocks UI.
function reportClientError(
  action: string,
  error: unknown,
  metadata: Record<string, unknown> = {}
) {
  try {
    const payload = {
      source: 'StudentLogin',
      action,
      error: error instanceof Error
        ? { name: error.name, message: error.message, stack: error.stack?.substring(0, 500) }
        : String(error),
      metadata: {
        ...metadata,
        url: window.location.href,
        timestamp: new Date().toISOString(),
        googleClientIdSet: Boolean(import.meta.env.VITE_GOOGLE_CLIENT_ID),
        backendUrl: BASE_URL,
      },
    };
    // Fire-and-forget — don't await, don't catch
    fetch(`${BASE_URL}/api/log/client-error`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    }).catch(() => { /* silently ignore if backend is unreachable */ });
  } catch {
    // Never let reporting break the UI
  }
}

interface GoogleLoginButtonProps {
  onSuccess: (tokenResponse: any) => void;
  onError: () => void;
  isGoogleLoading: boolean;
  googleClientId: string;
}

const GoogleLoginButton: React.FC<GoogleLoginButtonProps> = ({ onSuccess, onError, isGoogleLoading }) => {
  const login = useGoogleLogin({
    onSuccess,
    onError,
  });

  return (
    <button
      type="button"
      onClick={() => login()}
      disabled={isGoogleLoading}
      className="w-full flex items-center justify-center gap-3 px-4 py-3 
               bg-white border border-gray-300 rounded-md 
               text-gray-700 font-medium text-sm
               hover:bg-gray-50 hover:border-gray-400 
               transition-all duration-200
               disabled:opacity-60 disabled:cursor-not-allowed
               shadow-sm"
    >
      <img 
        src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" 
        alt="Google" 
        className="w-5 h-5" 
      />
      <span>{isGoogleLoading ? 'Signing in...' : 'Continue with Google'}</span>
    </button>
  );
};

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

  const handleGoogleSuccess = async (tokenResponse: any) => {
    try {
      setIsGoogleLoading(true);
      setError('');

      // ── Stage 1: Fetch user info from Google ──────────────
      reportClientError('google-login:stage1:start', 'info', {
        hasAccessToken: Boolean(tokenResponse?.access_token),
        tokenResponseKeys: tokenResponse ? Object.keys(tokenResponse) : [],
      });

      let userInfo: any;
      try {
        const userInfoResponse = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: {
            Authorization: `Bearer ${tokenResponse.access_token}`,
          },
        });
        if (!userInfoResponse.ok) {
          const text = await userInfoResponse.text().catch(() => '');
          reportClientError('google-login:stage1:userinfo-failed', text, {
            status: userInfoResponse.status,
            statusText: userInfoResponse.statusText,
          });
          throw new Error(`Google userinfo request failed (${userInfoResponse.status}): ${text}`);
        }
        userInfo = await userInfoResponse.json();
        reportClientError('google-login:stage1:userinfo-ok', 'info', {
          hasEmail: Boolean(userInfo?.email),
          hasSub: Boolean(userInfo?.sub),
        });
      } catch (userInfoErr) {
        reportClientError('google-login:stage1:userinfo-exception', userInfoErr, {
          stage: 'fetching Google userinfo',
        });
        throw userInfoErr;
      }

      // ── Stage 2: Send to backend /google-login ────────────
      let resp: Response;
      try {
        resp = await fetch(`${BASE_URL}/api/students/google-login`, {
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
      } catch (fetchErr) {
        reportClientError('google-login:stage2:fetch-exception', fetchErr, {
          stage: 'POST /api/students/google-login',
          backendUrl: BASE_URL,
        });
        throw fetchErr;
      }

      // ── Stage 3: Parse backend response ───────────────────
      const data = await resp.json().catch(async () => {
        const raw = await resp.text().catch(() => '');
        reportClientError('google-login:stage3:json-parse-failed', raw, {
          status: resp.status,
          contentType: resp.headers.get('content-type'),
        });
        return { raw };
      });

      if (!resp.ok || !data?.success) {
        const msg = data?.message || data?.error || 'Google login failed.';
        reportClientError('google-login:stage3:backend-rejected', msg, {
          status: resp.status,
          success: data?.success,
          dataKeys: data ? Object.keys(data) : [],
        });
        setError(msg);
        toast.error(msg, {
          duration: 4000,
          position: 'top-center',
        });
        setIsGoogleLoading(false);
        return;
      }

      // ── Stage 4: Store session & navigate ─────────────────
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
      reportClientError('google-login:unhandled-exception', e);
      const errorMsg = 'Unable to login with Google. Please try again.';
      setError(errorMsg);
      toast.error(errorMsg, {
        duration: 4000,
        position: 'top-center',
      });
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const handleGoogleError = () => {
    reportClientError('google-login:popup-error', 'Google OAuth popup failed or was cancelled', {
      googleClientIdSet: Boolean(import.meta.env.VITE_GOOGLE_CLIENT_ID),
      currentOrigin: window.location.origin,
    });
    const errorMsg = 'Google login failed. Please try again.';
    setError(errorMsg);
    toast.error(errorMsg, {
      duration: 4000,
      position: 'top-center',
    });
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

              {/* Scheduled Maintenance Notice Removed */}

              <div className="mb-4">
                {googleClientId ? (
                  <GoogleLoginButton
                    onSuccess={handleGoogleSuccess}
                    onError={handleGoogleError}
                    isGoogleLoading={isGoogleLoading}
                    googleClientId={googleClientId}
                  />
                ) : (
                  <button
                    type="button"
                    disabled
                    className="w-full flex items-center justify-center gap-3 px-4 py-3 
                   bg-white border border-gray-300 rounded-md 
                   text-gray-700 font-medium text-sm
                   disabled:opacity-60 disabled:cursor-not-allowed
                   shadow-sm"
                  >
                    <img src="/icons8-google.svg" alt="Google" className="w-5 h-5" />
                    <span>Google login unavailable</span>
                  </button>
                )}
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


