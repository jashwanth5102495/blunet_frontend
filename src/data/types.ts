
export interface Lesson {
  id: string;
  title: string;
  duration: string;
  content: string;
  syntax: { title: string; content: string }[];
  liveCode: string;
  liveCodeExplanation: string;
  language?: 'html' | 'python' | 'java' | 'bash';
  liveCodeIsJsSnippet?: boolean;
  terminalCommands?: string[];
}

export interface CourseModule {
  id?: string;
  title: string;
  duration: string;
  topics: string[];
  lessons?: Lesson[];
  description?: string;
}

export interface Course {
  id: string;
  courseId?: string;
  title: string;
  category: string;
  level: string;
  description: string;
  technologies: string[];
  price: number;
  originalPrice?: number;
  duration: string;
  projects: number;
  image: string;
  rating: number;
  students: number;
  maxStudents: number;
  instructor: string | { name: string };
  certification?: string;
  premiumFeatures?: string[];
  modules?: CourseModule[];
  confirmationStatus?: string;
  paymentStatus?: string;
  transactionId?: string;
  progress?: number;
  status?: string;
  enrollmentDate?: string;
  paymentMethod?: string;
  adminConfirmedBy?: string;
  adminConfirmedAt?: string;
  enrollmentConfirmationStatus?: string;
  enrollmentStatus?: string;
  paymentId?: string;
  icon?: any; // For AuthorTools
}
