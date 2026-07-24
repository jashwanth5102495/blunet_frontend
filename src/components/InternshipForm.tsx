import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  User,
  Building2,
  GraduationCap,
  Phone,
  Mail,
  Percent,
  Briefcase,
  Send,
  CheckCircle,
  ArrowLeft,
  Sparkles
} from 'lucide-react';

const JOB_ROLES = [
  'Artificial Intelligence / Machine Learning',
  'Data Science & Analytics',
  'Full Stack Development',
  'Frontend Development',
  'Backend Development',
  'Mobile App Development',
  'DevOps & Cloud Engineering',
  'Cyber Security',
  'Blockchain Development',
  'Software Engineering',
  'Networking & Infrastructure',
  'UI/UX Design',
  'Web Design',
  'Graphic Design',
  'Internet of Things (IoT)',
  'Embedded Systems',
  'Game Development',
  'Robotics & Automation',
  'Computer Vision',
  'Natural Language Processing',
  'Database Administration',
  'Cloud Computing',
  'Digital Marketing',
  'AR / VR Development',
  'Quantum Computing',
  'Big Data Engineering',
];

interface FormData {
  name: string;
  collegeName: string;
  ugCourse: string;
  contactNumber: string;
  email: string;
  ugPercentage: string;
  interestedRole: string;
}

const InternshipForm = () => {
  const navigate = useNavigate();

  const FALLBACK_BACKEND_URL =
    import.meta.env.DEV
      ? 'http://localhost:5000'
      : (typeof window !== 'undefined' ? window.location.origin : 'http://localhost:5000');
  const BASE_URL = import.meta.env.VITE_BACKEND_URL || FALLBACK_BACKEND_URL;

  const [formData, setFormData] = useState<FormData>({
    name: '',
    collegeName: '',
    ugCourse: '',
    contactNumber: '',
    email: '',
    ugPercentage: '',
    interestedRole: ''
  });

  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear field error on change
    if (errors[name as keyof FormData]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
    if (submitError) setSubmitError(null);
  };

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof FormData, string>> = {};

    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.collegeName.trim()) newErrors.collegeName = 'College name is required';
    if (!formData.ugCourse.trim()) newErrors.ugCourse = 'UG Course is required';

    if (!formData.contactNumber.trim()) {
      newErrors.contactNumber = 'Contact number is required';
    } else if (!/^\+?\d{7,15}$/.test(formData.contactNumber.replace(/[\s-]/g, ''))) {
      newErrors.contactNumber = 'Enter a valid phone number';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Enter a valid email address';
    }

    if (!formData.ugPercentage.trim()) {
      newErrors.ugPercentage = 'UG Percentage is required';
    } else {
      const pct = Number(formData.ugPercentage);
      if (isNaN(pct) || pct < 0 || pct > 100) {
        newErrors.ugPercentage = 'Percentage must be 0–100';
      }
    }

    if (!formData.interestedRole) newErrors.interestedRole = 'Please select a role';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const res = await fetch(`${BASE_URL}/api/internship-forms`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          ugPercentage: Number(formData.ugPercentage)
        })
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setSubmitted(true);
      } else {
        setSubmitError(data.message || 'Submission failed. Please try again.');
      }
    } catch {
      setSubmitError('Network error. Please check your connection and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Success State
  if (submitted) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="max-w-lg w-full text-center"
        >
          <div className="bg-gradient-to-br from-gray-900/80 to-gray-800/40 backdrop-blur-xl border border-green-500/30 rounded-3xl p-12 shadow-2xl">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              className="w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6"
            >
              <CheckCircle className="w-10 h-10 text-white" />
            </motion.div>
            <h2 className="text-3xl font-bold mb-3 bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
              Application Submitted!
            </h2>
            <p className="text-gray-300 mb-8">
              Thank you for applying. We've received your internship application and will review it shortly.
              You'll hear from us via email.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <motion.button
                onClick={() => navigate('/career')}
                className="px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl font-medium transition-all duration-200"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                ← Back to Careers
              </motion.button>
              <motion.button
                onClick={() => navigate('/')}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-xl font-medium transition-all duration-200"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                Go to Home
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  const inputBaseClass =
    'w-full bg-white/5 border rounded-xl px-4 py-3.5 text-white placeholder-white/30 focus:outline-none focus:ring-2 transition-all duration-200';
  const inputNormal = `${inputBaseClass} border-white/10 focus:ring-blue-500/50 focus:border-blue-500/50`;
  const inputError = `${inputBaseClass} border-red-500/50 focus:ring-red-500/50 focus:border-red-500/50`;

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-600/8 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-purple-600/8 rounded-full blur-[120px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-600/5 rounded-full blur-[150px]" />
      </div>

      <div className="relative z-10 max-w-2xl mx-auto px-4 py-16 sm:py-20">
        {/* Back button */}
        <motion.button
          onClick={() => navigate('/career')}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center text-white/60 hover:text-white mb-8 transition-colors duration-200 group"
        >
          <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform duration-200" />
          Back to Careers
        </motion.button>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center bg-gradient-to-r from-blue-500/15 to-purple-500/15 border border-blue-500/25 rounded-full px-5 py-2 mb-5">
            <Sparkles className="w-4 h-4 text-blue-400 mr-2" />
            <span className="text-blue-400 text-sm font-medium">Internship Application</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Apply for Internship
            </span>
          </h1>
          <p className="text-gray-400 max-w-md mx-auto">
            Fill out the form below to apply for an internship at BluNet IT Services.
            All fields are required.
          </p>
        </motion.div>

        {/* Form Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="bg-gradient-to-br from-gray-900/70 to-gray-800/30 backdrop-blur-xl border border-white/10 rounded-3xl p-8 sm:p-10 shadow-2xl"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name */}
            <div>
              <label htmlFor="intern-name" className="flex items-center text-sm font-medium text-white/80 mb-2">
                <User className="w-4 h-4 mr-2 text-blue-400" />
                Full Name
              </label>
              <input
                type="text"
                id="intern-name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your full name"
                className={errors.name ? inputError : inputNormal}
                maxLength={100}
              />
              {errors.name && <p className="text-red-400 text-xs mt-1.5">{errors.name}</p>}
            </div>

            {/* College Name */}
            <div>
              <label htmlFor="intern-college" className="flex items-center text-sm font-medium text-white/80 mb-2">
                <Building2 className="w-4 h-4 mr-2 text-purple-400" />
                College Name
              </label>
              <input
                type="text"
                id="intern-college"
                name="collegeName"
                value={formData.collegeName}
                onChange={handleChange}
                placeholder="Enter your college name"
                className={errors.collegeName ? inputError : inputNormal}
                maxLength={200}
              />
              {errors.collegeName && <p className="text-red-400 text-xs mt-1.5">{errors.collegeName}</p>}
            </div>

            {/* UG Course */}
            <div>
              <label htmlFor="intern-course" className="flex items-center text-sm font-medium text-white/80 mb-2">
                <GraduationCap className="w-4 h-4 mr-2 text-emerald-400" />
                UG Course
              </label>
              <input
                type="text"
                id="intern-course"
                name="ugCourse"
                value={formData.ugCourse}
                onChange={handleChange}
                placeholder="e.g. B.Tech Computer Science"
                className={errors.ugCourse ? inputError : inputNormal}
                maxLength={100}
              />
              {errors.ugCourse && <p className="text-red-400 text-xs mt-1.5">{errors.ugCourse}</p>}
            </div>

            {/* Contact Number & Email — side by side on desktop */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label htmlFor="intern-phone" className="flex items-center text-sm font-medium text-white/80 mb-2">
                  <Phone className="w-4 h-4 mr-2 text-cyan-400" />
                  Contact Number
                </label>
                <input
                  type="tel"
                  id="intern-phone"
                  name="contactNumber"
                  value={formData.contactNumber}
                  onChange={handleChange}
                  placeholder="+91 9876543210"
                  className={errors.contactNumber ? inputError : inputNormal}
                  maxLength={15}
                />
                {errors.contactNumber && <p className="text-red-400 text-xs mt-1.5">{errors.contactNumber}</p>}
              </div>
              <div>
                <label htmlFor="intern-email" className="flex items-center text-sm font-medium text-white/80 mb-2">
                  <Mail className="w-4 h-4 mr-2 text-amber-400" />
                  Email
                </label>
                <input
                  type="email"
                  id="intern-email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  className={errors.email ? inputError : inputNormal}
                  maxLength={100}
                />
                {errors.email && <p className="text-red-400 text-xs mt-1.5">{errors.email}</p>}
              </div>
            </div>

            {/* UG Percentage & Interested Role — side by side */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label htmlFor="intern-percentage" className="flex items-center text-sm font-medium text-white/80 mb-2">
                  <Percent className="w-4 h-4 mr-2 text-pink-400" />
                  UG Percentage
                </label>
                <input
                  type="number"
                  id="intern-percentage"
                  name="ugPercentage"
                  value={formData.ugPercentage}
                  onChange={handleChange}
                  placeholder="e.g. 85"
                  className={errors.ugPercentage ? inputError : inputNormal}
                  min={0}
                  max={100}
                  step="0.01"
                />
                {errors.ugPercentage && <p className="text-red-400 text-xs mt-1.5">{errors.ugPercentage}</p>}
              </div>
              <div>
                <label htmlFor="intern-role" className="flex items-center text-sm font-medium text-white/80 mb-2">
                  <Briefcase className="w-4 h-4 mr-2 text-orange-400" />
                  Interested Job Role / Domain
                </label>
                <select
                  id="intern-role"
                  name="interestedRole"
                  value={formData.interestedRole}
                  onChange={handleChange}
                  className={`${errors.interestedRole ? inputError : inputNormal} appearance-none cursor-pointer`}
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='rgba(255,255,255,0.5)' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'right 14px center'
                  }}
                >
                  <option value="" className="bg-gray-900 text-white/50">Select a domain</option>
                  {JOB_ROLES.map(role => (
                    <option key={role} value={role} className="bg-gray-900 text-white">{role}</option>
                  ))}
                </select>
                {errors.interestedRole && <p className="text-red-400 text-xs mt-1.5">{errors.interestedRole}</p>}
              </div>
            </div>

            {/* Submit error */}
            {submitError && (
              <div className="bg-red-900/20 border border-red-500/30 rounded-xl p-4 text-red-300 text-sm">
                {submitError}
              </div>
            )}

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 px-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-600 disabled:to-gray-700 text-white font-semibold text-lg rounded-xl transition-all duration-300 flex items-center justify-center disabled:cursor-not-allowed shadow-lg shadow-blue-600/20 hover:shadow-blue-600/30"
              whileHover={!isSubmitting ? { scale: 1.02 } : {}}
              whileTap={!isSubmitting ? { scale: 0.98 } : {}}
            >
              {isSubmitting ? (
                <div className="flex items-center space-x-3">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Submitting...</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Send className="w-5 h-5" />
                  <span>Submit Application</span>
                </div>
              )}
            </motion.button>
          </form>
        </motion.div>

        {/* Footer note */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center text-white/30 text-xs mt-6"
        >
          Your information is safe with us and will only be used for internship evaluation.
        </motion.p>
      </div>
    </div>
  );
};

export default InternshipForm;
