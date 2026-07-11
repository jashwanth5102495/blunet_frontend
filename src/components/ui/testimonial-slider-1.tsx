"use client"; 
 
import * as React from "react"; 
import { useState } from "react"; 
import { motion, AnimatePresence } from "framer-motion"; 
import { ArrowLeft, ArrowRight } from "lucide-react"; 
import { cn } from "@/lib/utils"; 
import { Button } from "@/components/ui/button"; 
 
// Define the type for a single review 
export type Review = { 
  id: string | number; 
  name: string; 
  affiliation: string; 
  quote: string; 
  imageSrc: string; 
  thumbnailSrc: string; 
}; 
 
// Define the props for the slider component 
interface TestimonialSliderProps { 
  reviews: Review[]; 
  /** Optional class name for the container */ 
  className?: string; 
} 
 
/** 
 * A reusable, animated testimonial slider component. 
 * It uses framer-motion for animations and is styled with 
 * shadcn/ui theme variables. 
 */ 
export const TestimonialSlider = ({ 
  reviews, 
  className, 
}: TestimonialSliderProps) => { 
  const [currentIndex, setCurrentIndex] = useState(0); 
  // 'direction' helps framer-motion understand slide direction (next vs. prev) 
  const [direction, setDirection] = useState<"left" | "right">("right"); 
 
  const activeReview = reviews[currentIndex]; 
 
  const handleNext = () => { 
    setDirection("right"); 
    setCurrentIndex((prev) => (prev + 1) % reviews.length); 
  }; 
 
  const handlePrev = () => { 
    setDirection("left"); 
    setCurrentIndex((prev) => (prev - 1 + reviews.length) % reviews.length); 
  }; 
 
  const handleThumbnailClick = (index: number) => { 
    // Determine direction for animation 
    setDirection(index > currentIndex ? "right" : "left"); 
    setCurrentIndex(index); 
  }; 
 
  // Get the next 3 reviews for the thumbnails, excluding the current one 
  const thumbnailReviews = reviews 
    .filter((_, i) => i !== currentIndex) 
    .slice(0, 3); 
 
  // Animation variants for the main image 
  const imageVariants = { 
    enter: (direction: "left" | "right") => ({ 
      y: direction === "right" ? "100%" : "-100%", 
      opacity: 0, 
    }), 
    center: { y: 0, opacity: 1 }, 
    exit: (direction: "left" | "right") => ({ 
      y: direction === "right" ? "-100%" : "100%", 
      opacity: 0, 
    }), 
  }; 
 
  // Animation variants for the text content 
  const textVariants = { 
    enter: (direction: "left" | "right") => ({ 
      x: direction === "right" ? 50 : -50, 
      opacity: 0, 
    }), 
    center: { x: 0, opacity: 1 }, 
    exit: (direction: "left" | "right") => ({ 
      x: direction === "right" ? -50 : 50, 
      opacity: 0, 
    }), 
  }; 
 
  return ( 
    <div 
      className={cn( 
        "relative w-full min-h-[650px] md:min-h-[600px] overflow-hidden bg-transparent text-foreground", 
        className 
      )} 
    > 
      <div className="grid grid-cols-1 md:grid-cols-12 gap-12 h-full items-center"> 
        {/* === Left Column: Meta and Thumbnails === */} 
        <div className="md:col-span-2 flex flex-col justify-between order-2 md:order-1 h-full py-8"> 
          <div className="flex flex-row md:flex-col justify-between md:justify-start space-x-4 md:space-x-0 md:space-y-6"> 
            {/* Pagination */} 
            <span className="text-sm text-muted-foreground font-mono"> 
              {String(currentIndex + 1).padStart(2, "0")} /{" "} 
              {String(reviews.length).padStart(2, "0")} 
            </span> 
            {/* Vertical "Reviews" Text */} 
            <h2 className="text-sm font-bold tracking-[0.2em] uppercase [writing-mode:vertical-rl] md:rotate-180 hidden md:block text-gray-500"> 
              Officers
            </h2> 
          </div> 
 
          {/* Thumbnail Navigation */} 
          <div className="flex flex-row md:flex-col space-x-2 md:space-x-0 md:space-y-3 mt-8 md:mt-0"> 
            {thumbnailReviews.map((review) => { 
              // Find the original index to navigate to 
              const originalIndex = reviews.findIndex( 
                (r) => r.id === review.id 
              ); 
              return ( 
                <button 
                  key={review.id} 
                  onClick={() => handleThumbnailClick(originalIndex)} 
                  className="overflow-hidden rounded-xl w-16 h-20 md:w-24 md:h-32 opacity-40 hover:opacity-100 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#3b82f6] focus:ring-offset-2 focus:ring-offset-background grayscale hover:grayscale-0" 
                  aria-label={`View review from ${review.name}`} 
                > 
                  <img 
                    src={review.thumbnailSrc} 
                    alt={review.name} 
                    className="w-full h-full object-cover" 
                  /> 
                </button> 
              ); 
            })} 
          </div> 
        </div> 
 
        {/* === Center Column: Main Image === */} 
        <div className="md:col-span-5 relative h-[450px] md:h-[600px] order-1 md:order-2"> 
          <AnimatePresence initial={false} custom={direction}> 
            <motion.img 
              key={currentIndex} 
              src={activeReview.imageSrc} 
              alt={activeReview.name} 
              custom={direction} 
              variants={imageVariants} 
              initial="enter" 
              animate="center" 
              exit="exit" 
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }} 
              className="absolute inset-0 w-full h-full object-cover rounded-[2.5rem] border border-white/10 shadow-2xl" 
            /> 
          </AnimatePresence> 
        </div> 
 
        {/* === Right Column: Text and Navigation === */} 
        <div className="md:col-span-5 flex flex-col justify-between md:pl-12 order-3 md:order-3 h-full py-12"> 
          {/* Text Content */} 
          <div className="relative overflow-hidden pt-4 md:pt-12"> 
            <AnimatePresence initial={false} custom={direction} mode="wait"> 
              <motion.div 
                key={currentIndex} 
                custom={direction} 
                variants={textVariants} 
                initial="enter" 
                animate="center" 
                exit="exit" 
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }} 
              > 
                <p className="text-sm font-bold tracking-widest text-[#3b82f6] uppercase"> 
                  {activeReview.affiliation} 
                </p> 
                <h3 className="text-4xl md:text-5xl font-bold mt-4 text-white tracking-tight"> 
                  {activeReview.name} 
                </h3> 
                <div className="h-1 w-12 bg-[#3b82f6] rounded-full my-8" />
                <blockquote className="text-xl md:text-3xl font-medium leading-relaxed text-gray-300 italic"> 
                  "{activeReview.quote}" 
                </blockquote> 
              </motion.div> 
            </AnimatePresence> 
          </div> 
 
          {/* Navigation Buttons */} 
          <div className="flex items-center space-x-4 mt-12 md:mt-0"> 
            <Button 
              variant="outline" 
              size="icon" 
              className="rounded-full w-14 h-14 border-white/10 bg-white/5 text-white hover:bg-white/10 hover:border-white/20 transition-all" 
              onClick={handlePrev} 
              aria-label="Previous review" 
            > 
              <ArrowLeft className="w-6 h-6" /> 
            </Button> 
            <Button 
              variant="default" 
              size="icon" 
              className="rounded-full w-14 h-14 bg-[#3b82f6] text-black hover:bg-[#3b82f6]/90 transition-all hover:scale-110 active:scale-95 shadow-[0_0_20px_rgba(59,130,246,0.3)]" 
              onClick={handleNext} 
              aria-label="Next review" 
            > 
              <ArrowRight className="w-6 h-6" /> 
            </Button> 
          </div> 
        </div> 
      </div> 
    </div> 
  ); 
}; 
