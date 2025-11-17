import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import FloatingLines from './FloatingLines';
import toast, { Toaster } from 'react-hot-toast';

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
    experience: 'beginner', // Set default value instead of empty string
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
    } else if (step === 1) {
      toast.error('Please fill in all required fields correctly', {
        duration: 3000,
        position: 'top-center',
      });
    } else if (step === 2 && validateStep2()) {
      setStep(3);
    } else if (step === 2) {
      toast.error('Please fill in all required fields correctly', {
        duration: 3000,
        position: 'top-center',
      });
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
        experience: studentDetails.experience || 'beginner', // Fallback to 'beginner' if empty
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
        toast.error(errorMessage, {
          duration: 4000,
          position: 'top-center',
        });
        setErrors({ email: errorMessage || 'Registration failed. Please try again.' });
        return;
      }

      if (result && result.success) {
        console.log('Student registered successfully in database:', result.data);
        
        // Store user data locally for immediate access
        const userData = {
          ...result.data.student,
          isAuthenticated: true, // Set to true so they can access student portal
          token: result.data.token
        };
        localStorage.setItem('currentUser', JSON.stringify(userData));
        
        // Also store the auth token separately
        if (result.data.token) {
          localStorage.setItem('authToken', result.data.token);
        }
        
        toast.success('Registration successful! 🎉', {
          duration: 3000,
          position: 'top-center',
        });
        
        setStep(3); // Move to final step (registration complete)
      } else {
        const errMsg = (result && result.message) || 'Registration failed. Please try again.';
        console.error('Registration failed:', errMsg);
        toast.error(errMsg, {
          duration: 4000,
          position: 'top-center',
        });
        setErrors({ email: errMsg });
      }
    } catch (err) {
      console.error('Registration error:', err);
      const fallbackMessage = err instanceof Error ? err.message : 'Unable to connect to server. Please try again.';
      toast.error(fallbackMessage, {
        duration: 4000,
        position: 'top-center',
      });
      setErrors({ email: fallbackMessage });
    } finally {
      setIsLoading(false);
    }
  };

  const renderStep1 = () => (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <input
            type="text"
            value={studentDetails.firstName}
            onChange={(e) => handleInputChange('firstName', e.target.value)}
            className={`w-full px-4 py-3 bg-gray-100 border rounded-md text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-1 transition-colors text-sm ${
              errors.firstName ? 'border-red-400 focus:ring-red-400' : 'border-gray-200 focus:ring-black'
            }`}
            placeholder="First name *"
          />
          {errors.firstName && <p className="mt-1 text-xs text-red-500">{errors.firstName}</p>}
        </div>
        
        <div>
          <input
            type="text"
            value={studentDetails.lastName}
            onChange={(e) => handleInputChange('lastName', e.target.value)}
            className={`w-full px-4 py-3 bg-gray-100 border rounded-md text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-1 transition-colors text-sm ${
              errors.lastName ? 'border-red-400 focus:ring-red-400' : 'border-gray-200 focus:ring-black'
            }`}
            placeholder="Last name *"
          />
          {errors.lastName && <p className="mt-1 text-xs text-red-500">{errors.lastName}</p>}
        </div>
      </div>

      <div>
        <input
          type="email"
          value={studentDetails.email}
          onChange={(e) => handleInputChange('email', e.target.value)}
          className={`w-full px-4 py-3 bg-gray-100 border rounded-md text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-1 transition-colors text-sm ${
            errors.email ? 'border-red-400 focus:ring-red-400' : 'border-gray-200 focus:ring-black'
          }`}
          placeholder="Email address *"
        />
        {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
      </div>

      <div>
        <input
          type="tel"
          value={studentDetails.phone}
          onChange={(e) => handleInputChange('phone', e.target.value)}
          className={`w-full px-4 py-3 bg-gray-100 border rounded-md text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-1 transition-colors text-sm ${
            errors.phone ? 'border-red-400 focus:ring-red-400' : 'border-gray-200 focus:ring-black'
          }`}
          placeholder="Phone number *"
        />
        {errors.phone && <p className="mt-1 text-xs text-red-500">{errors.phone}</p>}
      </div>

      <div>
        <input
          type="date"
          value={studentDetails.dateOfBirth}
          onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
          className={`w-full px-4 py-3 bg-gray-100 border rounded-md text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-1 transition-colors text-sm ${
            errors.dateOfBirth ? 'border-red-400 focus:ring-red-400' : 'border-gray-200 focus:ring-black'
          }`}
        />
        {errors.dateOfBirth && <p className="mt-1 text-xs text-red-500">{errors.dateOfBirth}</p>}
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-3">
      <div>
        <select
          id="education-select"
          value={studentDetails.education}
          onChange={(e) => handleInputChange('education', e.target.value)}
          className={`w-full px-4 py-3 bg-gray-100 border rounded-md text-gray-900 focus:outline-none focus:ring-1 transition-colors text-sm ${
            errors.education ? 'border-red-400 focus:ring-red-400' : 'border-gray-200 focus:ring-black'
          }`}
        >
          <option value="">Education level *</option>
          <option value="high-school">High School</option>
          <option value="diploma">Diploma</option>
          <option value="bachelors">Bachelor's Degree</option>
          <option value="masters">Master's Degree</option>
          <option value="phd">PhD</option>
          <option value="other">Other</option>
        </select>
        {errors.education && <p className="mt-1 text-xs text-red-500">{errors.education}</p>}
      </div>

      <div>
        <select
          id="experience-select"
          aria-label="Experience Level"
          value={studentDetails.experience}
          onChange={(e) => handleInputChange('experience', e.target.value)}
          className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-md text-gray-900 focus:outline-none focus:ring-1 focus:ring-black transition-colors text-sm"
        >
          <option value="beginner">Beginner (0-1 years)</option>
          <option value="intermediate">Intermediate (1-3 years)</option>
          <option value="advanced">Advanced (3+ years)</option>
        </select>
      </div>

      <div>
        <input
          type="text"
          value={studentDetails.username}
          onChange={(e) => handleInputChange('username', e.target.value)}
          className={`w-full px-4 py-3 bg-gray-100 border rounded-md text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-1 transition-colors text-sm ${
            errors.username ? 'border-red-400 focus:ring-red-400' : 'border-gray-200 focus:ring-black'
          }`}
          placeholder="Username *"
        />
        {errors.username && <p className="mt-1 text-xs text-red-500">{errors.username}</p>}
      </div>

      <div>
        <input
          type="password"
          value={studentDetails.password}
          onChange={(e) => handleInputChange('password', e.target.value)}
          className={`w-full px-4 py-3 bg-gray-100 border rounded-md text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-1 transition-colors text-sm ${
            errors.password ? 'border-red-400 focus:ring-red-400' : 'border-gray-200 focus:ring-black'
          }`}
          placeholder="Password *"
        />
        {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password}</p>}
      </div>

      <div>
        <input
          type="password"
          value={studentDetails.confirmPassword}
          onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
          className={`w-full px-4 py-3 bg-gray-100 border rounded-md text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-1 transition-colors text-sm ${
            errors.confirmPassword ? 'border-red-400 focus:ring-red-400' : 'border-gray-200 focus:ring-black'
          }`}
          placeholder="Confirm password *"
        />
        {errors.confirmPassword && <p className="mt-1 text-xs text-red-500">{errors.confirmPassword}</p>}
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6 text-center py-8">
      <div className="text-6xl mb-4">🎉</div>
      <h3 className="text-2xl font-bold text-gray-900 mb-4">Registration Complete!</h3>
      <p className="text-gray-600 mb-8">
        Welcome to our learning platform! Your account has been created successfully.
      </p>
      
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-8">
        <h4 className="text-lg font-semibold text-gray-900 mb-2">What's Next?</h4>
        <p className="text-gray-600 text-sm mb-4">
          You can now access your student portal to browse and purchase courses, track your progress, and start learning!
        </p>
        {selectedCourse && (
          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-blue-700 font-medium mb-2">Course Available for Purchase:</p>
            <p className="text-gray-900">{selectedCourse.title}</p>
            <p className="text-gray-600 text-sm mt-1">
              You can purchase this course from your student portal.
            </p>
          </div>
        )}
      </div>
      
      <div className="flex gap-3 justify-center">
        <button
          onClick={() => navigate('/student-portal')}
          className="px-8 py-3 bg-black text-white rounded-md font-medium hover:bg-gray-900 transition-colors text-sm"
        >
          Go to Student Portal
        </button>
        
        <button
          onClick={() => navigate('/student-login')}
          className="px-6 py-3 bg-white border border-gray-300 text-gray-700 rounded-md font-medium hover:bg-gray-50 transition-colors text-sm"
        >
          Login Now
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-black text-white">
      <Toaster />
      <div>
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

          {/* RIGHT SIDE - Registration Form */}
          <div className="bg-white text-gray-900 flex items-center justify-center px-6 py-12 rounded-tl-3xl lg:rounded-none overflow-y-auto">
            <div className="w-full max-w-md">

              {/* Header */}
              <motion.div
                className="text-center mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <div className="text-2xl font-semibold tracking-[0.35em]">BLUNET</div>
                <p className="text-xs text-gray-500 mt-3">
                  Create your account to get started
                </p>
              </motion.div>

              {/* Progress Steps */}
              <div className="flex items-center justify-center mb-6">
                {[1, 2, 3].map((stepNumber) => (
                  <div key={stepNumber} className="flex items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-colors ${
                      step >= stepNumber ? 'bg-black text-white' : 'bg-gray-200 text-gray-500'
                    }`}>
                      {stepNumber}
                    </div>
                    {stepNumber < 3 && (
                      <div className={`w-12 h-[2px] mx-1 transition-colors ${
                        step > stepNumber ? 'bg-black' : 'bg-gray-200'
                      }`}></div>
                    )}
                  </div>
                ))}
              </div>

              {/* Form Container */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                {step === 1 && (
                  <>
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h2>
                    {renderStep1()}
                  </>
                )}
                {step === 2 && (
                  <>
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Account Details</h2>
                    {renderStep2()}
                  </>
                )}
                {step === 3 && renderStep3()}

                {/* Navigation Buttons */}
                {step < 3 && (
                  <>
                    <div className="flex justify-between mt-6">
                      <button
                        onClick={handleBack}
                        disabled={step === 1}
                        className="px-6 py-2.5 rounded-md border border-gray-300 bg-white text-gray-700 font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm"
                      >
                        Back
                      </button>
                      <button
                        onClick={step === 2 ? handleRegistrationSubmit : handleNext}
                        disabled={isLoading}
                        className="px-8 py-2.5 rounded-md bg-black text-white font-medium hover:bg-gray-900 disabled:opacity-60 transition-colors text-sm"
                      >
                        {isLoading ? 'Processing...' : (step === 2 ? 'Complete Registration' : 'Next')}
                      </button>
                    </div>

                    {/* Sign In Link */}
                    <div className="mt-6 pt-6 border-t border-gray-200">
                      <p className="text-center text-sm text-gray-600">
                        Already have an account?{' '}
                        <button
                          onClick={() => navigate('/student-login')}
                          className="font-bold text-black hover:underline"
                        >
                          Sign in
                        </button>
                      </p>
                    </div>
                  </>
                )}
              </motion.div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentRegistration;