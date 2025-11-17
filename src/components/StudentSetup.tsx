import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

interface SetupForm {
  username?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  phone: string;
  dateOfBirth: string;
  education: string;
  experience: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
}

const StudentSetup: React.FC = () => {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState<{ firstName: string; lastName: string; email: string; authProvider?: string } | null>(null);
  const [isGoogleAuth, setIsGoogleAuth] = useState(false);
  const [form, setForm] = useState<SetupForm>({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    dateOfBirth: '',
    education: '',
    experience: 'beginner',
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'United States'
    }
  });
  const [errors, setErrors] = useState<Partial<Record<keyof SetupForm | 'phone' | 'dateOfBirth' | 'education', string>>>({});
  const [error, setError] = useState<string>('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('currentUser');
    if (!stored) {
      navigate('/student-login');
      return;
    }
    try {
      const user = JSON.parse(stored);
      
      // Determine if user is Google authenticated
      const isGoogle = user?.authProvider === 'google';
      setIsGoogleAuth(isGoogle);
      
      setUserInfo({
        firstName: user?.firstName || '',
        lastName: user?.lastName || '',
        email: user?.email || '',
        authProvider: user?.authProvider || 'local'
      });
      
      // Pre-fill existing data
      if (user?.phone) setForm(f => ({ ...f, phone: user.phone }));
      if (user?.dateOfBirth) setForm(f => ({ ...f, dateOfBirth: user.dateOfBirth.split('T')[0] }));
      if (user?.education) setForm(f => ({ ...f, education: user.education }));
      if (user?.experience) setForm(f => ({ ...f, experience: user.experience }));
      
      // For local auth users, pre-fill username and email
      if (!isGoogle) {
        if (user?.username) setForm(f => ({ ...f, username: user.username }));
        if (user?.email) setForm(f => ({ ...f, email: user.email }));
      }
      
      if (user?.address) {
        setForm(f => ({
          ...f,
          address: {
            street: user.address.street || '',
            city: user.address.city || '',
            state: user.address.state || '',
            zipCode: user.address.zipCode || '',
            country: user.address.country || 'United States'
          }
        }));
      }
    } catch {}
  }, [navigate]);

  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // Handle nested address fields
    if (name.startsWith('address.')) {
      const addressField = name.split('.')[1];
      setForm(prev => ({
        ...prev,
        address: {
          ...prev.address,
          [addressField]: value
        }
      }));
    } else {
      setForm(prev => ({ ...prev, [name]: value }));
    }
    
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
    if (error) setError('');
  };

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof SetupForm | 'phone' | 'dateOfBirth' | 'education', string>> = {};

    // Required fields for everyone
    if (!form.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^[0-9]{10}$/.test(form.phone.replace(/\D/g, ''))) {
      newErrors.phone = 'Phone number must be 10 digits';
    }

    if (!form.dateOfBirth) {
      newErrors.dateOfBirth = 'Date of birth is required';
    }

    if (!form.education) {
      newErrors.education = 'Education level is required';
    }

    // Additional validation for local auth users
    if (!isGoogleAuth) {
      if (!form.username?.trim()) {
        newErrors.username = 'Username is required';
      } else if (form.username.length < 4) {
        newErrors.username = 'Username must be at least 4 characters';
      }

      if (!form.email?.trim()) {
        newErrors.email = 'Email is required';
      } else if (!/\S+@\S+\.\S+/.test(form.email)) {
        newErrors.email = 'Email is invalid';
      }

      if (!form.password?.trim()) {
        newErrors.password = 'Password is required';
      } else if (form.password.length < 6) {
        newErrors.password = 'Password must be at least 6 characters';
      }

      if (form.password !== form.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) {
      return;
    }

    setIsSaving(true);
    setError('');

    const stored = localStorage.getItem('currentUser');
    const token = localStorage.getItem('authToken');
    if (!stored || !token) {
      setError('Not authenticated. Please login again.');
      setIsSaving(false);
      return;
    }

    let user: any;
    try { user = JSON.parse(stored); } catch {}
    const id = user?._id || user?.id;
    if (!id) {
      setError('Missing student id.');
      setIsSaving(false);
      return;
    }

    try {
      const resp = await fetch(`${BASE_URL}/api/students/profile/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...form,
          // Only include username/email/password for local auth users
          ...(isGoogleAuth ? {} : {
            username: form.username,
            email: form.email,
            password: form.password
          })
        })
      });
      const data = await resp.json().catch(async () => ({ raw: await resp.text() }));
      if (!resp.ok || !data?.success) {
        const msg = data?.message || data?.error || 'Could not save setup details.';
        setError(msg);
        setIsSaving(false);
        return;
      }

      // Update localStorage with complete profile
      const updatedUser = { ...user, ...data.data, isAuthenticated: true };
      localStorage.setItem('currentUser', JSON.stringify(updatedUser));

      // Navigate to portal
      navigate('/student-portal');
    } catch (err) {
      console.error('Setup save error:', err);
      setError('Unable to save. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-200 via-blue-50 to-white text-gray-900">
      <div className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <motion.div
            className="text-center mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900">Complete Your Profile</h1>
            <p className="text-sm sm:text-base text-gray-500 mt-2">
              Welcome{userInfo?.firstName ? `, ${userInfo.firstName}` : ''}! Please provide a few more details to complete your registration.
            </p>
          </motion.div>

          {/* User Info Display */}
          {userInfo && (
            <motion.div
              className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <p className="text-sm text-gray-700">
                <strong>Name:</strong> {userInfo.firstName} {userInfo.lastName}
              </p>
              <p className="text-sm text-gray-700">
                <strong>Email:</strong> {userInfo.email}
              </p>
            </motion.div>
          )}

          {/* Form */}
          <motion.div
            className="bg-white/60 backdrop-blur-xl border border-white/40 rounded-3xl p-6 sm:p-8 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.25)]"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <form onSubmit={onSubmit} className="space-y-6">
              {/* Show username/email/password for LOCAL auth users ONLY */}
              {!isGoogleAuth && (
                <>
                  {/* Username */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Username *</label>
                    <input
                      type="text"
                      name="username"
                      value={form.username || ''}
                      onChange={onChange}
                      className={`w-full px-4 py-3 bg-white/80 border rounded-xl text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 transition-colors ${
                        errors.username ? 'border-red-400 focus:border-red-400 focus:ring-red-200' : 'border-gray-200 focus:border-gray-300 focus:ring-black/10'
                      }`}
                      placeholder="Choose a username"
                    />
                    {errors.username && <p className="mt-1 text-sm text-red-400">{errors.username}</p>}
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email Address *</label>
                    <input
                      type="email"
                      name="email"
                      value={form.email || ''}
                      onChange={onChange}
                      className={`w-full px-4 py-3 bg-white/80 border rounded-xl text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 transition-colors ${
                        errors.email ? 'border-red-400 focus:border-red-400 focus:ring-red-200' : 'border-gray-200 focus:border-gray-300 focus:ring-black/10'
                      }`}
                      placeholder="Enter your email"
                    />
                    {errors.email && <p className="mt-1 text-sm text-red-400">{errors.email}</p>}
                  </div>

                  {/* Password */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Password *</label>
                    <input
                      type="password"
                      name="password"
                      value={form.password || ''}
                      onChange={onChange}
                      className={`w-full px-4 py-3 bg-white/80 border rounded-xl text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 transition-colors ${
                        errors.password ? 'border-red-400 focus:border-red-400 focus:ring-red-200' : 'border-gray-200 focus:border-gray-300 focus:ring-black/10'
                      }`}
                      placeholder="Create a password"
                    />
                    {errors.password && <p className="mt-1 text-sm text-red-400">{errors.password}</p>}
                  </div>

                  {/* Confirm Password */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password *</label>
                    <input
                      type="password"
                      name="confirmPassword"
                      value={form.confirmPassword || ''}
                      onChange={onChange}
                      className={`w-full px-4 py-3 bg-white/80 border rounded-xl text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 transition-colors ${
                        errors.confirmPassword ? 'border-red-400 focus:border-red-400 focus:ring-red-200' : 'border-gray-200 focus:border-gray-300 focus:ring-black/10'
                      }`}
                      placeholder="Confirm your password"
                    />
                    {errors.confirmPassword && <p className="mt-1 text-sm text-red-400">{errors.confirmPassword}</p>}
                  </div>

                  <hr className="my-6 border-gray-200" />
                </>
              )}

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number *</label>
                <input
                  type="tel"
                  name="phone"
                  value={form.phone}
                  onChange={onChange}
                  className={`w-full px-4 py-3 bg-white/80 border rounded-xl text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 transition-colors ${
                    errors.phone ? 'border-red-400 focus:border-red-400 focus:ring-red-200' : 'border-gray-200 focus:border-gray-300 focus:ring-black/10'
                  }`}
                  placeholder="Enter your phone number"
                />
                {errors.phone && <p className="mt-1 text-sm text-red-400">{errors.phone}</p>}
              </div>

              {/* Date of Birth */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Date of Birth *</label>
                <input
                  type="date"
                  name="dateOfBirth"
                  value={form.dateOfBirth}
                  onChange={onChange}
                  className={`w-full px-4 py-3 bg-white/80 border rounded-xl text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 transition-colors ${
                    errors.dateOfBirth ? 'border-red-400 focus:border-red-400 focus:ring-red-200' : 'border-gray-200 focus:border-gray-300 focus:ring-black/10'
                  }`}
                />
                {errors.dateOfBirth && <p className="mt-1 text-sm text-red-400">{errors.dateOfBirth}</p>}
              </div>

              {/* Education */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Education Level *</label>
                <select
                  name="education"
                  value={form.education}
                  onChange={onChange}
                  className={`w-full px-4 py-3 bg-white/80 border rounded-xl text-gray-900 focus:outline-none focus:ring-2 transition-colors ${
                    errors.education ? 'border-red-400 focus:border-red-400 focus:ring-red-200' : 'border-gray-200 focus:border-gray-300 focus:ring-black/10'
                  }`}
                >
                  <option value="">Select your education level</option>
                  <option value="high-school">High School</option>
                  <option value="diploma">Diploma</option>
                  <option value="bachelors">Bachelor's Degree</option>
                  <option value="masters">Master's Degree</option>
                  <option value="phd">PhD</option>
                  <option value="other">Other</option>
                </select>
                {errors.education && <p className="mt-1 text-sm text-red-400">{errors.education}</p>}
              </div>

              {/* Experience */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Experience Level</label>
                <select
                  name="experience"
                  value={form.experience}
                  onChange={onChange}
                  className="w-full px-4 py-3 bg-white/80 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-gray-300 transition-colors"
                >
                  <option value="beginner">Beginner (0-1 years)</option>
                  <option value="intermediate">Intermediate (1-3 years)</option>
                  <option value="advanced">Advanced (3+ years)</option>
                </select>
              </div>

              {/* Address Fields */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Address (Optional)</h3>
                
                <input
                  type="text"
                  name="address.street"
                  value={form.address.street}
                  onChange={onChange}
                  placeholder="Street Address"
                  className="w-full px-4 py-3 bg-white/80 border border-gray-200 rounded-xl text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-gray-300 transition-colors"
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    name="address.city"
                    value={form.address.city}
                    onChange={onChange}
                    placeholder="City"
                    className="w-full px-4 py-3 bg-white/80 border border-gray-200 rounded-xl text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-gray-300 transition-colors"
                  />
                  <input
                    type="text"
                    name="address.state"
                    value={form.address.state}
                    onChange={onChange}
                    placeholder="State"
                    className="w-full px-4 py-3 bg-white/80 border border-gray-200 rounded-xl text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-gray-300 transition-colors"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    name="address.zipCode"
                    value={form.address.zipCode}
                    onChange={onChange}
                    placeholder="ZIP Code"
                    className="w-full px-4 py-3 bg-white/80 border border-gray-200 rounded-xl text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-gray-300 transition-colors"
                  />
                  <input
                    type="text"
                    name="address.country"
                    value={form.address.country}
                    onChange={onChange}
                    placeholder="Country"
                    className="w-full px-4 py-3 bg-white/80 border border-gray-200 rounded-xl text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-gray-300 transition-colors"
                  />
                </div>
              </div>

              {error && (
                <div className="p-3 bg-red-100 border border-red-200 text-red-600 text-sm rounded-md">
                  {error}
                </div>
              )}

              <motion.button
                type="submit"
                disabled={isSaving}
                className="w-full px-8 py-3 rounded-xl bg-gradient-to-b from-gray-900 to-gray-700 text-white font-semibold hover:from-gray-800 hover:to-gray-600 transition-all duration-300 shadow-[0_10px_25px_-10px_rgba(0,0,0,0.35)] disabled:opacity-50"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {isSaving ? 'Saving...' : 'Complete Setup'}
              </motion.button>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default StudentSetup;