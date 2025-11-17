import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FloatingLines from './FloatingLines';
import toast, { Toaster } from 'react-hot-toast';

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
      toast.error('Please fill in all required fields correctly', {
        duration: 3000,
        position: 'top-center',
      });
      return;
    }

    setIsSaving(true);
    setError('');

    const stored = localStorage.getItem('currentUser');
    const token = localStorage.getItem('authToken');
    if (!stored || !token) {
      const errorMsg = 'Not authenticated. Please login again.';
      setError(errorMsg);
      toast.error(errorMsg, {
        duration: 4000,
        position: 'top-center',
      });
      setIsSaving(false);
      return;
    }

    let user: any;
    try { user = JSON.parse(stored); } catch {}
    const id = user?._id || user?.id;
    if (!id) {
      const errorMsg = 'Missing student id.';
      setError(errorMsg);
      toast.error(errorMsg, {
        duration: 4000,
        position: 'top-center',
      });
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
        toast.error(msg, {
          duration: 4000,
          position: 'top-center',
        });
        setIsSaving(false);
        return;
      }

      // Update localStorage with complete profile
      const updatedUser = { ...user, ...data.data, isAuthenticated: true };
      localStorage.setItem('currentUser', JSON.stringify(updatedUser));

      toast.success('Profile setup complete! Redirecting... 🎉', {
        duration: 2000,
        position: 'top-center',
      });

      // Navigate to portal
      setTimeout(() => {
        navigate('/student-portal');
      }, 1000);
    } catch (err) {
      console.error('Setup save error:', err);
      const errorMsg = 'Unable to save. Please try again.';
      setError(errorMsg);
      toast.error(errorMsg, {
        duration: 4000,
        position: 'top-center',
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <Toaster />
      <div className="grid grid-cols-1 lg:grid-cols-2 min-h-screen">
        
        {/* LEFT SIDE - FloatingLines Animation */}
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

        {/* RIGHT SIDE - Setup Form */}
        <div className="bg-white text-gray-900 flex items-center justify-center px-6 py-12 rounded-tl-3xl lg:rounded-none overflow-y-auto">
          <div className="w-full max-w-md">
            
            {/* Header */}
            <div className="text-center mb-6">
              <div className="text-2xl font-semibold tracking-[0.35em]">BLUNET</div>
              <p className="text-xs text-gray-500 mt-3">
                Complete your profile to continue
              </p>
            </div>

            {/* User Info Display */}
            {userInfo && (
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
                <p className="text-sm text-gray-700">
                  <strong>Name:</strong> {userInfo.firstName} {userInfo.lastName}
                </p>
                <p className="text-sm text-gray-700">
                  <strong>Email:</strong> {userInfo.email}
                </p>
              </div>
            )}

            {/* Form */}
            <form onSubmit={onSubmit} className="space-y-4">
              {/* Show username/email/password for LOCAL auth users ONLY */}
              {!isGoogleAuth && (
                <>
                  {/* Username */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Username *</label>
                    <input
                      type="text"
                      name="username"
                      value={form.username || ''}
                      onChange={onChange}
                      className={`w-full px-4 py-3 bg-gray-100 border rounded-md ${
                        errors.username ? 'border-red-400' : 'border-gray-200'
                      }`}
                      placeholder="Choose a username"
                    />
                    {errors.username && <p className="mt-1 text-sm text-red-600">{errors.username}</p>}
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email Address *</label>
                    <input
                      type="email"
                      name="email"
                      value={form.email || ''}
                      onChange={onChange}
                      className={`w-full px-4 py-3 bg-gray-100 border rounded-md ${
                        errors.email ? 'border-red-400' : 'border-gray-200'
                      }`}
                      placeholder="Enter your email"
                    />
                    {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
                  </div>

                  {/* Password */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Password *</label>
                    <input
                      type="password"
                      name="password"
                      value={form.password || ''}
                      onChange={onChange}
                      className={`w-full px-4 py-3 bg-gray-100 border rounded-md ${
                        errors.password ? 'border-red-400' : 'border-gray-200'
                      }`}
                      placeholder="Create a password"
                    />
                    {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
                  </div>

                  {/* Confirm Password */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password *</label>
                    <input
                      type="password"
                      name="confirmPassword"
                      value={form.confirmPassword || ''}
                      onChange={onChange}
                      className={`w-full px-4 py-3 bg-gray-100 border rounded-md ${
                        errors.confirmPassword ? 'border-red-400' : 'border-gray-200'
                      }`}
                      placeholder="Confirm your password"
                    />
                    {errors.confirmPassword && <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>}
                  </div>

                  <div className="flex items-center gap-3 my-4">
                    <div className="h-px flex-1 bg-gray-200"></div>
                    <span className="text-xs text-gray-500">Additional Information</span>
                    <div className="h-px flex-1 bg-gray-200"></div>
                  </div>
                </>
              )}

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
                <input
                  type="tel"
                  name="phone"
                  value={form.phone}
                  onChange={onChange}
                  className={`w-full px-4 py-3 bg-gray-100 border rounded-md ${
                    errors.phone ? 'border-red-400' : 'border-gray-200'
                  }`}
                  placeholder="Enter your phone number"
                />
                {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone}</p>}
              </div>

              {/* Date of Birth */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth *</label>
                <input
                  type="date"
                  name="dateOfBirth"
                  value={form.dateOfBirth}
                  onChange={onChange}
                  className={`w-full px-4 py-3 bg-gray-100 border rounded-md ${
                    errors.dateOfBirth ? 'border-red-400' : 'border-gray-200'
                  }`}
                />
                {errors.dateOfBirth && <p className="mt-1 text-sm text-red-600">{errors.dateOfBirth}</p>}
              </div>

              {/* Education */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Education Level *</label>
                <select
                  name="education"
                  value={form.education}
                  onChange={onChange}
                  className={`w-full px-4 py-3 bg-gray-100 border rounded-md ${
                    errors.education ? 'border-red-400' : 'border-gray-200'
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
                {errors.education && <p className="mt-1 text-sm text-red-600">{errors.education}</p>}
              </div>

              {/* Experience */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Experience Level</label>
                <select
                  name="experience"
                  value={form.experience}
                  onChange={onChange}
                  className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-md"
                >
                  <option value="beginner">Beginner (0-1 years)</option>
                  <option value="intermediate">Intermediate (1-3 years)</option>
                  <option value="advanced">Advanced (3+ years)</option>
                </select>
              </div>

              {/* Address Section - Collapsible */}
              <div className="pt-4">
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-px flex-1 bg-gray-200"></div>
                  <span className="text-xs text-gray-500">Address (Optional)</span>
                  <div className="h-px flex-1 bg-gray-200"></div>
                </div>
                
                <div className="space-y-3">
                  <input
                    type="text"
                    name="address.street"
                    value={form.address.street}
                    onChange={onChange}
                    placeholder="Street Address"
                    className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-md"
                  />

                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="text"
                      name="address.city"
                      value={form.address.city}
                      onChange={onChange}
                      placeholder="City"
                      className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-md"
                    />
                    <input
                      type="text"
                      name="address.state"
                      value={form.address.state}
                      onChange={onChange}
                      placeholder="State"
                      className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-md"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="text"
                      name="address.zipCode"
                      value={form.address.zipCode}
                      onChange={onChange}
                      placeholder="ZIP Code"
                      className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-md"
                    />
                    <input
                      type="text"
                      name="address.country"
                      value={form.address.country}
                      onChange={onChange}
                      placeholder="Country"
                      className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-md"
                    />
                  </div>
                </div>
              </div>

              {error && (
                <div className="mt-3 p-3 bg-red-100 border border-red-200 text-red-600 text-sm rounded-md">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={isSaving}
                className="w-full mt-4 bg-black text-white py-3 rounded-md font-medium hover:bg-gray-900 disabled:opacity-60 transition-colors"
              >
                {isSaving ? 'Saving...' : 'Complete Setup'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentSetup;