import { BookOpen, Code, FileText, Target, Users, Briefcase } from "lucide-react";
import React from 'react'
import RadialOrbitalTimeline from "../components/ui/radial-orbital-timeline";
import CrystalCursor from "../components/ui/crystal-cursor";
import { TestimonialsColumn } from "../components/ui/testimonials-columns-1";
import SentinelHero from "../components/SentinelHero";

const testimonials = [
  {
    text: "This ERP revolutionized our operations, streamlining finance and inventory. The cloud-based platform keeps us productive, even remotely.",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150&h=150",
    name: "Briana Patton",
    role: "Operations Manager",
  },
  {
    text: "Implementing this ERP was smooth and quick. The customizable, user-friendly interface made team training effortless.",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150&h=150",
    name: "Bilal Ahmed",
    role: "IT Manager",
  },
  {
    text: "The support team is exceptional, guiding us through setup and providing ongoing assistance, ensuring our satisfaction.",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=150&h=150",
    name: "Saman Malik",
    role: "Customer Support Lead",
  },
  {
    text: "This ERP's seamless integration enhanced our business operations and efficiency. Highly recommend for its intuitive interface.",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=150&h=150",
    name: "Omar Raza",
    role: "CEO",
  },
  {
    text: "Its robust features and quick support have transformed our workflow, making us significantly more efficient.",
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150&h=150",
    name: "Zainab Hussain",
    role: "Project Manager",
  },
  {
    text: "The smooth implementation exceeded expectations. It streamlined processes, improving overall business performance.",
    image: "https://images.unsplash.com/photo-1554151228-14d9def656e4?auto=format&fit=crop&q=80&w=150&h=150",
    name: "Aliza Khan",
    role: "Business Analyst",
  },
  {
    text: "Our business functions improved with a user-friendly design and positive customer feedback.",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150&h=150",
    name: "Farhan Siddiqui",
    role: "Marketing Director",
  },
  {
    text: "They delivered a solution that exceeded expectations, understanding our needs and enhancing our operations.",
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=150&h=150",
    name: "Sana Sheikh",
    role: "Sales Manager",
  },
  {
    text: "Using this ERP, our online presence and conversions significantly improved, boosting business performance.",
    image: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=150&h=150",
    name: "Hassan Ali",
    role: "E-commerce Manager",
  },
];

const firstColumn = testimonials.slice(0, 3);
const secondColumn = testimonials.slice(3, 6);
const thirdColumn = testimonials.slice(6, 9);

const timelineData = [
  {
    id: 1,
    title: "Core Concepts",
    date: "Phase 1",
    content: "Master the foundational principles and theoretical knowledge required for success.",
    category: "Learning",
    icon: BookOpen,
    relatedIds: [2],
    status: "completed" as const,
    energy: 100,
  },
  {
    id: 2,
    title: "Practical Coding",
    date: "Phase 2",
    content: "Apply theory through hands-on projects and real-world coding implementations.",
    category: "Development",
    icon: Code,
    relatedIds: [1, 3],
    status: "in-progress" as const,
    energy: 90,
  },
  {
    id: 3,
    title: "Resume Building",
    date: "Phase 3",
    content: "Craft a standout resume highlighting your newly acquired skills and portfolio projects.",
    category: "Preparation",
    icon: FileText,
    relatedIds: [2, 4],
    status: "pending" as const,
    energy: 60,
  },
  {
    id: 4,
    title: "Interview Readiness",
    date: "Phase 4",
    content: "Prepare comprehensively for both technical challenges and behavioral questions.",
    category: "Preparation",
    icon: Target,
    relatedIds: [3, 5],
    status: "pending" as const,
    energy: 40,
  },
  {
    id: 5,
    title: "Mock Interviews",
    date: "Phase 5",
    content: "Participate in simulated interview environments with feedback from industry experts.",
    category: "Practice",
    icon: Users,
    relatedIds: [4, 6],
    status: "pending" as const,
    energy: 20,
  },
  {
    id: 6,
    title: "Career Placement",
    date: "Phase 6",
    content: "Connect directly with our network of top companies to secure your dream role.",
    category: "Placement",
    icon: Briefcase,
    relatedIds: [5],
    status: "pending" as const,
    energy: 10,
  },
];

const StudentPage: React.FC = () => {
  return (
    <div className="bg-hero-bg min-h-screen">
      <SentinelHero />

      <div className="relative w-full min-h-screen bg-black flex items-center justify-center">
      {/* Left Side Testimonials */}
      <div className="hidden lg:flex absolute left-0 top-0 bottom-0 items-center justify-center pointer-events-none z-0 px-4">
        <div className="flex gap-4 xl:gap-8 [mask-image:linear-gradient(to_bottom,transparent,black_15%,black_85%,transparent)] max-h-screen overflow-hidden">
          <TestimonialsColumn testimonials={firstColumn} duration={25} className="w-64 xl:w-72" />
          <TestimonialsColumn testimonials={secondColumn} duration={35} className="hidden xl:block w-72" />
        </div>
      </div>

      <CrystalCursor className="relative z-10 w-full max-w-4xl mx-auto h-screen flex items-center justify-center bg-transparent">
        <div className="relative z-10 w-full h-full flex items-center justify-center">
          <RadialOrbitalTimeline timelineData={timelineData} />
        </div>
      </CrystalCursor>

      {/* Right Side Testimonials */}
      <div className="hidden lg:flex absolute right-0 top-0 bottom-0 items-center justify-center pointer-events-none z-0 px-4">
        <div className="flex gap-4 xl:gap-8 [mask-image:linear-gradient(to_bottom,transparent,black_15%,black_85%,transparent)] max-h-screen overflow-hidden">
          <TestimonialsColumn testimonials={secondColumn} duration={30} className="hidden xl:block w-72" />
          <TestimonialsColumn testimonials={thirdColumn} duration={20} className="w-64 xl:w-72" />
        </div>
      </div>
      
      {/* Mobile/Small Screen Testimonials (Bottom) */}
      <div className="xl:hidden absolute bottom-0 left-0 right-0 h-40 pointer-events-none z-0 overflow-hidden [mask-image:linear-gradient(to_top,black,transparent)]">
          <div className="flex gap-4 justify-center">
             {/* We could add a horizontal scroller here if needed, but for now we keep the focus on the sides for large screens */}
          </div>
      </div>
    </div>
  </div>
);
};

export default StudentPage;
