import React from 'react';
import { XMarkIcon, AcademicCapIcon, CreditCardIcon, CalendarIcon, UserIcon, EnvelopeIcon, PhoneIcon, IdentificationIcon } from '@heroicons/react/24/outline';
import { normalizeCourseKey, getCourseTitleFromKey } from '../data/courseAssignments';

interface Student {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  studentId: string;
  enrolledCourses: Array<{
    courseId: {
      _id: string;
      title: string;
      courseId: string;
    };
    enrollmentDate: string;
    progress: number;
    status: string;
  }>;
  paymentHistory: Array<{
    courseId: {
      _id: string;
      title: string;
    };
    amount: number;
    paymentMethod: string;
    transactionId: string;
    paymentDate: string;
    status: string;
  }>;
  createdAt: string;
  referralCode?: string;
}

interface StudentDetailModalProps {
  student: Student | null;
  isOpen: boolean;
  onClose: () => void;
}

const StudentDetailModal: React.FC<StudentDetailModalProps> = ({ student, isOpen, onClose }) => {
  if (!isOpen || !student) return null;

  const totalAmountPaid = student.paymentHistory?.reduce((sum, payment) => sum + payment.amount, 0) || 0;
  const completedPayments = student.paymentHistory?.filter(payment => payment.status === 'completed').length || 0;
  const activeCourses = student.enrolledCourses?.filter(course => course.status === 'active').length || 0;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden border border-white/10">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
          
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-2xl">
                {student.firstName ? student.firstName.charAt(0).toUpperCase() : 'S'}
              </span>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">
                {student.firstName} {student.lastName}
              </h2>
              <p className="text-white/80">{student.email}</p>
              <p className="text-white/60 text-sm">Student ID: {student.studentId}</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-blue-500/20 rounded-lg p-4 border border-blue-500/30">
              <div className="flex items-center space-x-2 mb-2">
                <AcademicCapIcon className="w-5 h-5 text-blue-400" />
                <span className="text-blue-400 font-medium">Active Courses</span>
              </div>
              <p className="text-2xl font-bold text-white">{activeCourses}</p>
            </div>
            
            <div className="bg-green-500/20 rounded-lg p-4 border border-green-500/30">
              <div className="flex items-center space-x-2 mb-2">
                <CreditCardIcon className="w-5 h-5 text-green-400" />
                <span className="text-green-400 font-medium">Total Paid</span>
              </div>
              <p className="text-2xl font-bold text-white">₹{totalAmountPaid.toLocaleString()}</p>
            </div>
            
            <div className="bg-purple-500/20 rounded-lg p-4 border border-purple-500/30">
              <div className="flex items-center space-x-2 mb-2">
                <CreditCardIcon className="w-5 h-5 text-purple-400" />
                <span className="text-purple-400 font-medium">Payments</span>
              </div>
              <p className="text-2xl font-bold text-white">{completedPayments}</p>
            </div>
            
            <div className="bg-orange-500/20 rounded-lg p-4 border border-orange-500/30">
              <div className="flex items-center space-x-2 mb-2">
                <CalendarIcon className="w-5 h-5 text-orange-400" />
                <span className="text-orange-400 font-medium">Member Since</span>
              </div>
              <p className="text-sm font-bold text-white">
                {new Date(student.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>

          {/* Personal Information */}
          <div className="bg-white/5 rounded-lg p-6 mb-6 border border-white/10">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center space-x-2">
              <UserIcon className="w-5 h-5" />
              <span>Personal Information</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-3">
                <EnvelopeIcon className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-gray-400 text-sm">Email</p>
                  <p className="text-white">{student.email}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <PhoneIcon className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-gray-400 text-sm">Phone</p>
                  <p className="text-white">{student.phone}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <IdentificationIcon className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-gray-400 text-sm">Student ID</p>
                  <p className="text-white">{student.studentId}</p>
                </div>
              </div>
              {student.referralCode && (
                <div className="flex items-center space-x-3">
                  <div className="w-5 h-5 bg-orange-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-bold">R</span>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Referral Code Used</p>
                    <p className="text-orange-400 font-medium">{student.referralCode}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Purchased Courses */}
          <div className="bg-white/5 rounded-lg p-6 mb-6 border border-white/10">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center space-x-2">
              <CreditCardIcon className="w-5 h-5" />
              <span>Purchased Courses ({student.paymentHistory?.filter(payment => payment.status === 'completed').length || 0})</span>
            </h3>
            {student.paymentHistory && student.paymentHistory.filter(payment => payment.status === 'completed').length > 0 ? (
              <div className="space-y-4">
                {student.paymentHistory
                  .filter(payment => payment.status === 'completed')
                  .map((payment, index) => (
                    <div key={index} className="bg-black/30 rounded-lg p-4 border border-white/10">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h4 className="text-white font-medium text-lg">
                            {payment.courseId?.title || getCourseTitleFromKey(normalizeCourseKey(payment.courseId)) || 'Course Title N/A'}
                          </h4>
                          <p className="text-gray-400 text-sm">
                            Course ID: {payment.courseId?.courseId || 'N/A'}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-green-400 font-bold text-lg">
                            ₹{payment.amount.toLocaleString()}
                          </p>
                          <span className="px-2 py-1 bg-green-500/20 text-green-300 rounded-full text-xs font-medium">
                            Purchased
                          </span>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <p className="text-gray-400">Purchase Date</p>
                          <p className="text-white">{new Date(payment.paymentDate).toLocaleDateString()}</p>
                        </div>
                        <div>
                          <p className="text-gray-400">Payment Method</p>
                          <p className="text-white">{payment.paymentMethod}</p>
                        </div>
                        <div>
                          <p className="text-gray-400">Transaction ID</p>
                          <p className="text-white font-mono text-xs">{payment.transactionId}</p>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <CreditCardIcon className="w-12 h-12 text-gray-500 mx-auto mb-3" />
                <p className="text-gray-400">No courses purchased yet</p>
              </div>
            )}
          </div>

          {/* Enrolled Courses */}
          <div className="bg-white/5 rounded-lg p-6 mb-6 border border-white/10">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center space-x-2">
              <AcademicCapIcon className="w-5 h-5" />
              <span>Enrolled Courses ({student.enrolledCourses?.length || 0})</span>
            </h3>
            {student.enrolledCourses && student.enrolledCourses.length > 0 ? (
              <div className="space-y-4">
                {student.enrolledCourses.map((enrollment, index) => (
                  <div key={index} className="bg-black/30 rounded-lg p-4 border border-white/10">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h4 className="text-white font-medium text-lg">
                          {enrollment.courseId?.title || getCourseTitleFromKey(normalizeCourseKey(enrollment.courseId)) || 'Course Title N/A'}
                        </h4>
                        <p className="text-gray-400 text-sm">
                          Course ID: {enrollment.courseId?.courseId || 'N/A'}
                        </p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        enrollment.status === 'active' ? 'bg-green-500/20 text-green-300' :
                        enrollment.status === 'completed' ? 'bg-blue-500/20 text-blue-300' :
                        enrollment.status === 'paused' ? 'bg-yellow-500/20 text-yellow-300' :
                        'bg-gray-500/20 text-gray-300'
                      }`}>
                        {enrollment.status || 'active'}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-gray-400 text-sm">Enrollment Date</p>
                        <p className="text-white">{new Date(enrollment.enrollmentDate).toLocaleDateString()}</p>
                      </div>
                      <div>
                        <p className="text-gray-400 text-sm">Progress</p>
                        <div className="flex items-center space-x-2">
                          <div className="flex-1 bg-gray-700 rounded-full h-2">
                            <div 
                              className="bg-green-500 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${enrollment.progress || 0}%` }}
                            ></div>
                          </div>
                          <span className="text-green-400 font-semibold text-sm">
                            {enrollment.progress || 0}%
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <AcademicCapIcon className="w-12 h-12 text-gray-500 mx-auto mb-3" />
                <p className="text-gray-400">No courses enrolled yet</p>
              </div>
            )}
          </div>

          {/* Payment History */}
          <div className="bg-white/5 rounded-lg p-6 border border-white/10">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center space-x-2">
              <CreditCardIcon className="w-5 h-5" />
              <span>Payment History ({student.paymentHistory?.length || 0})</span>
            </h3>
            {student.paymentHistory && student.paymentHistory.length > 0 ? (
              <div className="space-y-4">
                {student.paymentHistory.map((payment, index) => (
                  <div key={index} className="bg-black/30 rounded-lg p-4 border border-white/10">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h4 className="text-white font-medium">
                          {payment.courseId?.title || 'Course Payment'}
                        </h4>
                        <p className="text-gray-400 text-sm">
                          Transaction ID: {payment.transactionId}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-green-400">
                          ₹{payment.amount.toLocaleString()}
                        </p>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          payment.status === 'completed' ? 'bg-green-500/20 text-green-300' :
                          payment.status === 'pending' ? 'bg-yellow-500/20 text-yellow-300' :
                          payment.status === 'failed' ? 'bg-red-500/20 text-red-300' :
                          'bg-gray-500/20 text-gray-300'
                        }`}>
                          {payment.status}
                        </span>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-400">Payment Method</p>
                        <p className="text-white capitalize">{payment.paymentMethod}</p>
                      </div>
                      <div>
                        <p className="text-gray-400">Payment Date</p>
                        <p className="text-white">{new Date(payment.paymentDate).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <CreditCardIcon className="w-12 h-12 text-gray-500 mx-auto mb-3" />
                <p className="text-gray-400">No payment history available</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDetailModal;