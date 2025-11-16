import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';

// Declare global objects
declare global {
  interface Window {
    google: any;
    Razorpay: any;
  }
}

const BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

interface StudentDetails {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  education: string;
  experience: string;
  username: string;
  password: string;
  confirmPassword: string;
}

const StudentRegistration = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const selectedCourse = location.state?.selectedCourse;
  
  const [step, setStep] = useState(1);

  const [studentDetails, setStudentDetails] = useState<StudentDetails>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    education: '',
    experience: '',
    username: '',
    password: '',
    confirmPassword: ''
  });

  const [errors, setErrors] = useState<Partial<StudentDetails>>({});
  const [isLoading, setIsLoading] = useState(false);



  const handleInputChange = (field: keyof StudentDetails, value: string) => {
    setStudentDetails(prev => ({ ...prev, [field]: value }));
    // Clear error when user types
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateStep1 = () => {
    const newErrors: Partial<StudentDetails> = {};
    
    if (!studentDetails.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!studentDetails.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!studentDetails.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(studentDetails.email)) {
      newErrors.email = 'Email is invalid';
    }
    if (!studentDetails.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^[0-9]{10}$/.test(studentDetails.phone.replace(/\D/g, ''))) {
      newErrors.phone = 'Phone number must be 10 digits';
    }
    if (!studentDetails.dateOfBirth) newErrors.dateOfBirth = 'Date of birth is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors: Partial<StudentDetails> = {};
    
    if (!studentDetails.education.trim()) newErrors.education = 'Education is required';
    if (!studentDetails.username.trim()) {
      newErrors.username = 'Username is required';
    } else if (studentDetails.username.length < 4) {
      newErrors.username = 'Username must be at least 4 characters';
    } else {
      // Check if username looks like an email
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const hasEmailDomain = /\.(com|in|org|net|edu|gov|co|uk|us|ca|au|de|fr|jp|cn|br|ru|it|es|nl|se|no|dk|fi|pl|be|ch|at|nz|za|sg|hk|tw|kr|mx|ar|cl|pe|ve|ec|bo|py|uy|cr|pa|do|pr|gt|hn|ni|sv|bz|jm|tt|gd|lc|vc|bb|ag|kn|dm|ws|to|tv|fm|gg|je|im|ac|io|ai|sh|tc|vg|ky|bm|ms|pn|gs|fk|gi|mt|cy|mc|va|sm|li|ad|is|fo|gl|pm|bl|mf|sx|cw|aw|bq|gp|mq|re|yt|tf|wf|pf|nc|vu|sb|fj|ki|nr|pw|mh|mp|gu|as|um|pr|vi|cx|cc|nf|ck|nu|tk|tp|mn|kp|bd|bt|bn|kh|tl|mm|la|mv|np|pk|lk|af|am|az|bh|ge|ir|iq|il|jo|kw|kg|lb|om|qa|sa|sy|tj|tm|ae|uz|ye|dz|ao|bj|bw|bf|bi|cm|cv|cf|td|km|cg|cd|ci|dj|eg|gq|er|et|ga|gm|gh|gn|gw|ke|ls|lr|ly|mg|mw|ml|mr|mu|yt|ma|mz|na|ne|ng|rw|st|sn|sc|sl|so|ss|sd|sz|tz|tg|tn|ug|zm|zw)$/i;
      
      if (emailPattern.test(studentDetails.username)) {
        newErrors.username = 'Username cannot be an email address. Please use a unique username instead.';
      } else if (hasEmailDomain.test(studentDetails.username)) {
        newErrors.username = 'Username cannot contain email domains like .com, .in, etc.';
      }
    }
    if (!studentDetails.password.trim()) {
      newErrors.password = 'Password is required';
    } else if (studentDetails.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    if (studentDetails.password !== studentDetails.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (step === 1 && validateStep1()) {
      setStep(2);
    } else if (step === 2 && validateStep2()) {
      setStep(3);
    } else if (step === 3) {
      handleRegistrationSubmit();
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };



  const handleRegistrationSubmit = async () => {
    if (!validateStep2()) return;
    
    setIsLoading(true);
    
    try {
      // Prepare registration data for backend (without mandatory course enrollment)
      const registrationData = {
        firstName: studentDetails.firstName,
        lastName: studentDetails.lastName,
        email: studentDetails.email,
        phone: studentDetails.phone,
        username: studentDetails.username,
        password: studentDetails.password,
        dateOfBirth: studentDetails.dateOfBirth,
        education: studentDetails.education,
        experience: studentDetails.experience,
        address: {
          street: '123 Main St', // Default values - you can add form fields for these
          city: 'City',
          state: 'State',
          zipCode: '12345',
          country: 'United States'
        }
      };

      console.log(registrationData);

      // Call backend API to register student
      const response = await fetch(`${BASE_URL}/api/students/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(registrationData)
      });

      let result: any = null;
      let rawText = '';
      try {
        result = await response.json();
      } catch (parseError) {
        // Fallback to text when response is not JSON
        rawText = await response.text();
      }

      if (!response.ok) {
        const errorMessage = (result && (result.message || result.error)) || rawText || `Registration failed. Status ${response.status}`;
        console.error('Registration failed:', errorMessage);
        setErrors({ email: errorMessage || 'Registration failed. Please try again.' });
        return;
      }

      if (result && result.success) {
        console.log('Student registered successfully in database:', result.data);
        
        // Store user data locally for immediate access
        const userData = {
          ...result.data.student,
          isAuthenticated: false,
          token: result.data.token
        };
        localStorage.setItem('currentUser', JSON.stringify(userData));
        
        setStep(3); // Move to final step (registration complete)
      } else {
        const errMsg = (result && result.message) || 'Registration failed. Please try again.';
        console.error('Registration failed:', errMsg);
        setErrors({ email: errMsg });
      }
    } catch (err) {
      console.error('Registration error:', err);
      const fallbackMessage = err instanceof Error ? err.message : 'Unable to connect to server. Please try again.';
      setErrors({ email: fallbackMessage });
    } finally {
      setIsLoading(false);
    }
  };

  const renderStep1 = () => (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">First Name *</label>
          <input
            type="text"
            value={studentDetails.firstName}
            onChange={(e) => handleInputChange('firstName', e.target.value)}
            className={`w-full px-4 py-3 bg-white/80 border rounded-xl text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 transition-colors ${
              errors.firstName ? 'border-red-400 focus:border-red-400 focus:ring-red-200' : 'border-gray-200 focus:border-gray-300 focus:ring-black/10'
            }`}
            placeholder="Enter your first name"
          />
          {errors.firstName && <p className="mt-1 text-sm text-red-400">{errors.firstName}</p>}
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Last Name *</label>
          <input
            type="text"
            value={studentDetails.lastName}
            onChange={(e) => handleInputChange('lastName', e.target.value)}
            className={`w-full px-4 py-3 bg-white/80 border rounded-xl text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 transition-colors ${
              errors.lastName ? 'border-red-400 focus:border-red-400 focus:ring-red-200' : 'border-gray-200 focus:border-gray-300 focus:ring-black/10'
            }`}
            placeholder="Enter your last name"
          />
          {errors.lastName && <p className="mt-1 text-sm text-red-400">{errors.lastName}</p>}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Email Address *</label>
        <input
          type="email"
          value={studentDetails.email}
          onChange={(e) => handleInputChange('email', e.target.value)}
          className={`w-full px-4 py-3 bg-white/80 border rounded-xl text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 transition-colors ${
            errors.email ? 'border-red-400 focus:border-red-400 focus:ring-red-200' : 'border-gray-200 focus:border-gray-300 focus:ring-black/10'
          }`}
          placeholder="Enter your email address"
        />
        {errors.email && <p className="mt-1 text-sm text-red-400">{errors.email}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number *</label>
        <input
          type="tel"
          value={studentDetails.phone}
          onChange={(e) => handleInputChange('phone', e.target.value)}
          className={`w-full px-4 py-3 bg-white/80 border rounded-xl text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 transition-colors ${
            errors.phone ? 'border-red-400 focus:border-red-400 focus:ring-red-200' : 'border-gray-200 focus:border-gray-300 focus:ring-black/10'
          }`}
          placeholder="Enter your phone number"
        />
        {errors.phone && <p className="mt-1 text-sm text-red-400">{errors.phone}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Date of Birth *</label>
        <input
          type="date"
          value={studentDetails.dateOfBirth}
          onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
          className={`w-full px-4 py-3 bg-white/80 border rounded-xl text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 transition-colors ${
            errors.dateOfBirth ? 'border-red-400 focus:border-red-400 focus:ring-red-200' : 'border-gray-200 focus:border-gray-300 focus:ring-black/10'
          }`}
          placeholder="Select your date of birth"
        />
        {errors.dateOfBirth && <p className="mt-1 text-sm text-red-400">{errors.dateOfBirth}</p>}
      </div>
    </motion.div>
  );

  const renderStep2 = () => (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
    >
      <div>
        <label htmlFor="education-select" className="block text-sm font-medium text-gray-700 mb-2">Education *</label>
        <select
          id="education-select"
          value={studentDetails.education}
          onChange={(e) => handleInputChange('education', e.target.value)}
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

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Experience Level
        </label>
        <select
          id="experience-select"
          aria-label="Experience Level"
          value={studentDetails.experience}
          onChange={(e) => handleInputChange('experience', e.target.value)}
          className="w-full px-4 py-3 bg-white/80 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-gray-300 transition-colors"
        >
          <option value="">Select your experience level</option>
          <option value="beginner">Beginner (0-1 years)</option>
          <option value="intermediate">Intermediate (1-3 years)</option>
          <option value="advanced">Advanced (3+ years)</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Username *</label>
        <input
          type="text"
          value={studentDetails.username}
          onChange={(e) => handleInputChange('username', e.target.value)}
          className={`w-full px-4 py-3 bg-white/80 border rounded-xl text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 transition-colors ${
            errors.username ? 'border-red-400 focus:border-red-400 focus:ring-red-200' : 'border-gray-200 focus:border-gray-300 focus:ring-black/10'
          }`}
          placeholder="Create a unique username"
        />
        {errors.username && <p className="mt-1 text-sm text-red-400">{errors.username}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Password *</label>
        <input
          type="password"
          value={studentDetails.password}
          onChange={(e) => handleInputChange('password', e.target.value)}
          className={`w-full px-4 py-3 bg-white/80 border rounded-xl text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 transition-colors ${
            errors.password ? 'border-red-400 focus:border-red-400 focus:ring-red-200' : 'border-gray-200 focus:border-gray-300 focus:ring-black/10'
          }`}
          placeholder="Create a password"
        />
        {errors.password && <p className="mt-1 text-sm text-red-400">{errors.password}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password *</label>
        <input
          type="password"
          value={studentDetails.confirmPassword}
          onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
          className={`w-full px-4 py-3 bg-white/80 border rounded-xl text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 transition-colors ${
            errors.confirmPassword ? 'border-red-400 focus:border-red-400 focus:ring-red-200' : 'border-gray-200 focus:border-gray-300 focus:ring-black/10'
          }`}
          placeholder="Confirm your password"
        />
        {errors.confirmPassword && <p className="mt-1 text-sm text-red-400">{errors.confirmPassword}</p>}
      </div>
    </motion.div>
  );

  const renderStep3 = () => (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
    >
      <div className="text-center">
        <div className="text-6xl mb-4">🎉</div>
        <h3 className="text-2xl font-bold text-white mb-4">Registration Complete!</h3>
        <p className="text-gray-300 mb-8">
          Welcome to our learning platform! Your account has been created successfully.
        </p>
        
        <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-6 mb-8">
          <h4 className="text-lg font-semibold text-white mb-2">What's Next?</h4>
          <p className="text-gray-300 text-sm mb-4">
            You can now access your student portal to browse and purchase courses, track your progress, and start learning!
          </p>
          {selectedCourse && (
            <div className="mt-4 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
              <p className="text-blue-400 font-medium mb-2">Course Available for Purchase:</p>
              <p className="text-white">{selectedCourse.title}</p>
              <p className="text-gray-300 text-sm mt-1">
                You can purchase this course from your student portal.
              </p>
            </div>
          )}
        </div>
        
        <div className="flex gap-4 justify-center">
          <motion.button
            onClick={() => navigate('/student-portal')}
            className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg shadow-blue-500/25"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Go to Student Portal
          </motion.button>
          
          <motion.button
            onClick={() => navigate('/student-login')}
            className="px-6 py-3 bg-gray-700 text-white rounded-lg font-semibold hover:bg-gray-600 transition-colors"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Login Now
          </motion.button>
        </div>
      </div>
    </motion.div>
  );

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
            <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900">Student Registration</h1>
            <p className="text-sm sm:text-base text-gray-500">Join our learning community</p>
          </motion.div>

          {/* Progress Steps */}
          <div className="flex items-center justify-center mb-8">
            {[1, 2, 3].map((stepNumber) => (
              <div key={stepNumber} className="flex items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-colors ${
                  step >= stepNumber ? 'bg-gray-900 text-white border-gray-900' : 'bg-white text-gray-500 border-gray-300'
                }`}>
                  {stepNumber}
                </div>
                {stepNumber < 3 && (
                  <div className={`w-16 h-[2px] mx-2 transition-colors ${
                    step > stepNumber ? 'bg-gray-900' : 'bg-gray-300'
                  }`}></div>
                )}
              </div>
            ))}
          </div>

          {/* Form */}
          <motion.div
            className="bg-white/60 backdrop-blur-xl border border-white/40 rounded-3xl p-6 sm:p-8 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.25)]"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {step === 1 && (
              <>
                <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-6">Personal Information</h2>
                {renderStep1()}
              </>
            )}
            {step === 2 && (
              <>
                <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-6">Account Details</h2>
                {renderStep2()}
              </>
            )}
            {step === 3 && renderStep3()}

            {/* Navigation Buttons */}
            {step < 3 && (
              <div className="flex justify-between mt-8">
                <motion.button
                  onClick={handleBack}
                  disabled={step === 1}
                  className="px-6 py-3 rounded-xl border border-gray-300 bg-white/80 text-gray-700 font-semibold hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Back
                </motion.button>
                <motion.button
                  onClick={step === 2 ? handleRegistrationSubmit : handleNext}
                  disabled={isLoading}
                  className="px-8 py-3 rounded-xl bg-gradient-to-b from-gray-900 to-gray-700 text-white font-semibold hover:from-gray-800 hover:to-gray-600 transition-all duration-300 shadow-[0_10px_25px_-10px_rgba(0,0,0,0.35)] disabled:opacity-50"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {isLoading ? 'Processing...' : (step === 2 ? 'Complete Registration' : 'Next')}
                </motion.button>
              </div>
            )}

            {/* Login Link */}
            <div className="mt-8 text-center">
              <p className="text-gray-600">
                Already have an account?{' '}
                <button
                  onClick={() => navigate('/student-login')}
                  className="text-gray-900 underline decoration-gray-300 hover:decoration-gray-500"
                >
                  Sign in here
                </button>
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default StudentRegistration;