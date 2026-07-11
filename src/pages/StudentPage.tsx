import React from 'react'
import { useNavigate } from "react-router-dom";
import SentinelHero from "../components/SentinelHero";
import { CpuArchitecture } from "../components/ui/cpu-architecture";
import { TestimonialsColumn } from "../components/ui/testimonials-columns-1";
import { motion } from "motion/react";
import { FlowHoverButton } from "../components/ui/flow-hover-button";
import { CardsSlider } from "../components/ui/cards-slider-shadcnui";
import { TestimonialSlider, type Review } from "../components/ui/testimonial-slider-1";
import { ContactCard } from "../components/ui/contact-card";
import { MailIcon, PhoneIcon, MapPinIcon } from 'lucide-react';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import Footer from "../components/Footer";

const testimonials = [
  {
    text: "This ERP revolutionized our operations, streamlining finance and inventory. The cloud-based platform keeps us productive, even remotely.",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150&h=150",
    name: "Puneeth",
    role: "Operations Manager",
  },
  {
    text: "Implementing this ERP was smooth and quick. The customizable, user-friendly interface made team training effortless.",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150&h=150",
    name: "Chandana",
    role: "IT Manager",
  },
  {
    text: "The support team is exceptional, guiding us through setup and providing ongoing assistance, ensuring our satisfaction.",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=150&h=150",
    name: "Tejaswini",
    role: "Customer Support Lead",
  },
  {
    text: "This ERP's seamless integration enhanced our business operations and efficiency. Highly recommend for its intuitive interface.",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=150&h=150",
    name: "Dhanush",
    role: "CEO",
  },
  {
    text: "Its robust features and quick support have transformed our workflow, making us significantly more efficient.",
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150&h=150",
    name: "Varshith",
    role: "Project Manager",
  },
  {
    text: "The smooth implementation exceeded expectations. It streamlined processes, improving overall business performance.",
    image: "https://images.unsplash.com/photo-1554151228-14d9def656e4?auto=format&fit=crop&q=80&w=150&h=150",
    name: "Aishwarya",
    role: "Business Analyst",
  },
  {
    text: "Our business functions improved with a user-friendly design and positive customer feedback.",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150&h=150",
    name: "Puneeth",
    role: "Marketing Director",
  },
  {
    text: "They delivered a solution that exceeded expectations, understanding our needs and enhancing our operations.",
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=150&h=150",
    name: "Chandana",
    role: "Sales Manager",
  },
  {
    text: "Using this ERP, our online presence and conversions significantly improved, boosting business performance.",
    image: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=150&h=150",
    name: "Tejaswini",
    role: "E-commerce Manager",
  },
];

const firstColumn = testimonials.slice(0, 3);
const secondColumn = testimonials.slice(3, 6);
const thirdColumn = testimonials.slice(6, 9);

const placementOfficers: Review[] = [
  {
    id: 1,
    name: "Dhanush",
    affiliation: "Director of Photography",
    quote: "Capturing the essence of student success through visual storytelling and professional documentation.",
    imageSrc: "https://media.licdn.com/dms/image/v2/D4D03AQFnmLdpZW78yA/profile-displayphoto-scale_200_200/B4DZvM8NB2JMAY-/0/1768669895649?e=2147483647&v=beta&t=5VGAB-2gYupLNaHvJHECollR25THd-3oR5wngGlQiY4",
    thumbnailSrc: "https://media.licdn.com/dms/image/v2/D4D03AQFnmLdpZW78yA/profile-displayphoto-scale_200_200/B4DZvM8NB2JMAY-/0/1768669895649?e=2147483647&v=beta&t=5VGAB-2gYupLNaHvJHECollR25THd-3oR5wngGlQiY4",
  },
  {
    id: 2,
    name: "Varshith",
    affiliation: "Founder",
    quote: "Building a bridge between academic excellence and industry demands to empower the next generation of engineers.",
    imageSrc: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS2vnSxNNVGZV2MXRjlGELl-NgLl5kXdpDR6A&s",
    thumbnailSrc: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS2vnSxNNVGZV2MXRjlGELl-NgLl5kXdpDR6A&s",
  },
  {
    id: 3,
    name: "Aishwarya",
    affiliation: "Lead Front-end",
    quote: "Ensuring our students master the art of building immersive and high-performance user interfaces.",
    imageSrc: "https://media.licdn.com/dms/image/v2/D4D03AQGVqrPPAGHtoQ/profile-displayphoto-scale_200_200/B4DZwhAkjaHwAY-/0/1770080338529?e=2147483647&v=beta&t=q-_6p1VCJ8NN8eHj9zUFwJZds_XpKez9Hy14SAIDp4M",
    thumbnailSrc: "https://media.licdn.com/dms/image/v2/D4D03AQGVqrPPAGHtoQ/profile-displayphoto-scale_200_200/B4DZwhAkjaHwAY-/0/1770080338529?e=2147483647&v=beta&t=q-_6p1VCJ8NN8eHj9zUFwJZds_XpKez9Hy14SAIDp4M",
  },
  {
    id: 4,
    name: "Puneeth",
    affiliation: "Product Owner",
    quote: "Guiding students through real-world product lifecycles and agile development methodologies.",
    imageSrc: "https://media.licdn.com/dms/image/v2/D4D03AQE-Z7-S1LSYNQ/profile-displayphoto-shrink_200_200/profile-displayphoto-shrink_200_200/0/1724143166545?e=2147483647&v=beta&t=6IPCwgOzblGt4p2fEdnY74gMbLyRHii5Ite3A39qQsY",
    thumbnailSrc: "https://media.licdn.com/dms/image/v2/D4D03AQE-Z7-S1LSYNQ/profile-displayphoto-shrink_200_200/profile-displayphoto-shrink_200_200/0/1724143166545?e=2147483647&v=beta&t=6IPCwgOzblGt4p2fEdnY74gMbLyRHii5Ite3A39qQsY",
  },
  {
    id: 5,
    name: "Chandana",
    affiliation: "CTO",
    quote: "Pushing the boundaries of what's possible with AI-assisted development and modern cloud architectures.",
    imageSrc: "https://media.licdn.com/dms/image/v2/D4D03AQEkTAbZLlSrLg/profile-displayphoto-scale_200_200/B4DZoHdu8BGgAY-/0/1761061833315?e=2147483647&v=beta&t=Rg1dBTvq9X2heyhuhBwG2DsEkG65v0vQ35hF2FSeYns",
    thumbnailSrc: "https://media.licdn.com/dms/image/v2/D4D03AQEkTAbZLlSrLg/profile-displayphoto-scale_200_200/B4DZoHdu8BGgAY-/0/1761061833315?e=2147483647&v=beta&t=Rg1dBTvq9X2heyhuhBwG2DsEkG65v0vQ35hF2FSeYns",
  }
];

const StudentPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-hero-bg min-h-screen">
      <SentinelHero />

      {/* Our Academy Section */}
      <section className="py-20 px-4 md:px-8 lg:px-16 bg-black relative overflow-hidden border-b border-white/5">
        {/* Background decorative elements */}
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500 rounded-full blur-[120px]" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500 rounded-full blur-[120px]" />
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Side: Content */}
            <div className="space-y-8">
              <div className="space-y-4">
                <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
                  Our <span className="inline-block bg-gradient-to-r from-[#3b82f6] via-[#60a5fa] to-[#93c5fd] bg-clip-text text-transparent [text-shadow:0_0_10px_rgba(59,130,246,0.35)]">Academy</span>
                </h2>
                <div className="h-1 w-20 bg-[#3b82f6] rounded-full [box-shadow:0_0_8px_rgba(59,130,246,0.5)]" />
              </div>
              
              <div className="space-y-6 text-gray-300 text-lg leading-relaxed">
                <p>
                  A modern learning ecosystem designed to transform students into industry-ready developers through structured hands-on training, real project workflows, AI-assisted development, cloud technologies, automation, and practical engineering practices.
                </p>
                <p>
                  We train students from strong programming fundamentals to the effective adoption of modern AI tools, helping them learn faster, build smarter, and work efficiently using today’s AI-powered development workflows.
                </p>
                <p>
                  Our implementation-first approach ensures students gain real practical experience instead of only theoretical knowledge.
                </p>
              </div>

              <div className="pt-4">
                <FlowHoverButton 
                  onClick={() => navigate('/courses')}
                  className="rounded-xl px-8 py-4"
                >
                  Explore Programs
                </FlowHoverButton>
              </div>
            </div>

            {/* Right Side: Box with CPU Architecture */}
            <div className="relative">
              <div className="relative group">
                {/* Glow effect behind the box - White shade */}
                <div className="absolute -inset-1 bg-white/20 rounded-[2.5rem] blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
                
                {/* Main container box */}
                <div className="relative bg-zinc-900/90 border border-white/20 rounded-[2rem] p-4 overflow-hidden backdrop-blur-xl shadow-[0_0_20px_rgba(255,255,255,0.05)]">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-white/30 to-transparent" />
                  
                  <div className="aspect-square w-full flex items-center justify-center bg-black/40 rounded-2xl border border-white/10 shadow-inner overflow-hidden">
                    <CpuArchitecture 
                      className="w-full h-full" 
                      text="Student"
                      animateLines={true}
                      animateMarkers={true}
                      animateText={true}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Courses Section */}
      <section className="py-24 px-4 md:px-8 lg:px-16 bg-black relative overflow-hidden border-b border-white/5">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
              Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#3b82f6] via-[#60a5fa] to-[#93c5fd] [text-shadow:0_0_10px_rgba(59,130,246,0.35)]">Courses</span>
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Choose from our selection of industry-leading programs designed to fast-track your engineering career.
            </p>
            <div className="h-1 w-20 bg-[#3b82f6] rounded-full mx-auto [box-shadow:0_0_8px_rgba(59,130,246,0.5)]" />
          </div>

          <CardsSlider />
        </div>
      </section>

      {/* Our Placement Officers Section */}
      {/* <section className="py-24 bg-black relative overflow-hidden border-b border-white/5">
        <div className="w-full relative z-10 px-4 md:px-12 lg:px-20">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
              Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#3b82f6] via-[#60a5fa] to-[#93c5fd] [text-shadow:0_0_10px_rgba(59,130,246,0.35)]">Placement Officers</span>
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Meet the dedicated team helping our students transition from learning to leading in the industry.
            </p>
            <div className="h-1 w-20 bg-[#3b82f6] rounded-full mx-auto [box-shadow:0_0_8px_rgba(59,130,246,0.5)]" />
          </div>

          <div className="w-full">
            <TestimonialSlider reviews={placementOfficers} />
          </div>
        </div>
      </section> */}

      {/* Testimonials Section */}
      <section className="bg-black py-24 relative overflow-hidden">
        <div className="w-full z-10 mx-auto px-4 md:px-12 lg:px-20">
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            whileInView={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }} 
            viewport={{ once: true }} 
            className="flex flex-col items-center justify-center mx-auto text-center mb-16" 
          > 
            <div className="flex justify-center mb-4"> 
              <div className="border border-white/10 py-1 px-4 rounded-lg text-sm text-gray-400 bg-white/5 backdrop-blur-sm">Testimonials</div> 
            </div> 
  
            <h2 className="text-3xl md:text-5xl font-bold tracking-tighter text-white"> 
              What our <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#3b82f6] via-[#60a5fa] to-[#93c5fd]">Students Say</span> 
            </h2> 
          </motion.div> 
  
          <div className="flex justify-center gap-10 mt-10 [mask-image:linear-gradient(to_bottom,transparent,black_20%,black_80%,transparent)] max-h-[900px] overflow-hidden w-full"> 
            <TestimonialsColumn testimonials={firstColumn} duration={20} className="flex-1" /> 
            <TestimonialsColumn testimonials={secondColumn} className="hidden md:block flex-1" duration={25} /> 
            <TestimonialsColumn testimonials={thirdColumn} className="hidden lg:block flex-1" duration={22} /> 
          </div> 
        </div>

        {/* Background glow */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[60%] h-[40%] bg-blue-500/10 rounded-full blur-[120px] pointer-events-none" />
      </section>

      {/* Contact Section */}
      <section className="py-24 px-4 md:px-8 lg:px-16 bg-black relative overflow-hidden">
        <div className="max-w-6xl mx-auto relative z-10">
          <ContactCard 
            title="Get in touch" 
            description="If you have any questions regarding our Services or need help, please fill out the form here. We do our best to respond within 1 business day." 
            className="rounded-none overflow-visible border-white/10 bg-zinc-900/30 backdrop-blur-xl"
            formSectionClassName="bg-zinc-950/50"
            contactInfo={[ 
              { 
                icon: MailIcon, 
                label: 'Email', 
                value: 'contact@21st.dev', 
              }, 
              { 
                icon: PhoneIcon, 
                label: 'Phone', 
                value: '+92 312 1234567', 
              }, 
              { 
                icon: MapPinIcon, 
                label: 'Address', 
                value: 'Faisalabad, Pakistan', 
              } 
            ]} 
          > 
            <form action="" className="w-full space-y-5 p-4"> 
              <div className="flex flex-col gap-2"> 
                <Label className="text-white text-sm font-semibold">Name</Label> 
                <Input type="text" className="bg-black/40 border-white/5 text-white focus-visible:ring-primary h-12" /> 
              </div> 
              <div className="flex flex-col gap-2"> 
                <Label className="text-white text-sm font-semibold">Email</Label> 
                <Input type="email" className="bg-black/40 border-white/5 text-white focus-visible:ring-primary h-12" /> 
              </div> 
              <div className="flex flex-col gap-2"> 
                <Label className="text-white text-sm font-semibold">Phone</Label> 
                <Input type="phone" className="bg-black/40 border-white/5 text-white focus-visible:ring-primary h-12" /> 
              </div> 
              <div className="flex flex-col gap-2"> 
                <Label className="text-white text-sm font-semibold">Message</Label> 
                <Textarea className="bg-black/40 border-white/5 text-white focus-visible:ring-primary min-h-[120px] resize-none" /> 
              </div> 
              <Button className="w-full bg-white hover:bg-white/90 text-black font-bold py-6 rounded-xl transition-all hover:scale-[1.01] shadow-xl" type="button"> 
                Submit 
              </Button> 
            </form> 
          </ContactCard>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default StudentPage;
