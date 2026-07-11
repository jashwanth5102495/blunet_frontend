// @ts-nocheck
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"; 
import { Badge } from "@/components/ui/badge"; 
import { Card } from "@/components/ui/card"; 
import { animate, motion, useMotionValue } from "framer-motion"; 
import { ChevronLeft, ChevronRight, Clock } from "lucide-react"; 
import { useEffect, useRef, useState, useCallback } from "react"; 
import { useNavigate } from "react-router-dom";
import { INITIAL_COURSES } from "../../data/courses";
 
interface CardData { 
  id: string | number; 
  title: string; 
  description: string; 
  category: string; 
  image: string; 
  author: { 
    name: string; 
    avatar: string; 
  }; 
  date: string; 
  readTime: string; 
  link: string;
} 
 
// Map the real courses from /courses page to the slider format
const originalCards: CardData[] = INITIAL_COURSES.map(course => ({
  id: course.id,
  title: course.title,
  description: course.description,
  category: course.category.toUpperCase(),
  image: course.image,
  author: { 
    name: course.instructor || "Industry Expert", 
    avatar: "https://github.com/shadcn.png" 
  },
  date: "Enrollment Open",
  readTime: course.duration,
  link: "/courses",
  courseId: course.id
}));

// Triple the cards for smooth looping
const cards = [...originalCards, ...originalCards, ...originalCards];
 
export function CardsSlider() { 
  const containerRef = useRef<HTMLDivElement>(null); 
  const [width, setWidth] = useState(0); 
  const x = useMotionValue(0); 
  const navigate = useNavigate();
  const [isPaused, setIsPaused] = useState(false);
  const controls = useRef<any>(null);
  
  const handleCardClick = (card: any) => {
    navigate('/courses', { state: { selectedCourseId: card.courseId } });
  };
  
  useEffect(() => { 
    if (containerRef.current) { 
      // Calculate scroll width for a single set of cards
      const singleSetWidth = (containerRef.current.scrollWidth / 3);
      setWidth(singleSetWidth);
      
      // Start initial position at the middle set
      x.set(-singleSetWidth);
    } 
  }, []); 
 
  const startAutoScroll = useCallback(() => {
    if (isPaused) return;
    
    const currentX = x.get();
    const targetX = currentX - 100; // Small increment for smooth continuous feel
    
    controls.current = animate(x, targetX, {
      duration: 2,
      ease: "linear",
      onComplete: () => {
        // Infinite loop logic
        if (Math.abs(x.get()) >= width * 2) {
          x.set(-width);
        }
        startAutoScroll();
      }
    });
  }, [isPaused, width, x]);

  useEffect(() => {
    if (width > 0) {
      startAutoScroll();
    }
    return () => controls.current?.stop();
  }, [width, startAutoScroll]);
 
  const scrollTo = (direction: "left" | "right") => { 
    controls.current?.stop();
    const currentX = x.get(); 
    const containerWidth = containerRef.current?.offsetWidth || 0; 
    const scrollAmount = containerWidth * 0.5; 
 
    let newX = direction === "left" ? currentX + scrollAmount : currentX - scrollAmount; 
 
    animate(x, newX, { 
      type: "spring", 
      stiffness: 300, 
      damping: 30, 
      onComplete: () => {
        // Reset position if out of bounds for loop
        if (x.get() > -width / 2) x.set(x.get() - width);
        if (x.get() < -width * 1.5) x.set(x.get() + width);
        startAutoScroll();
      }
    }); 
  }; 
 
  return ( 
    <div className="w-full max-w-7xl mx-auto p-8 relative group/slider overflow-hidden"> 
      {/* Navigation Arrows */} 
      <div className="absolute top-1/2 -translate-y-1/2 left-2 z-20 opacity-0 group-hover/slider:opacity-100 transition-opacity duration-300"> 
        <button 
          onClick={() => scrollTo("left")} 
          className="h-12 w-12 rounded-full bg-background/80 backdrop-blur-md border border-border/50 shadow-lg flex items-center justify-center hover:bg-background hover:scale-110 transition-all active:scale-95" 
          aria-label="Scroll left" 
        > 
          <ChevronLeft className="w-6 h-6" /> 
        </button> 
      </div> 
      <div className="absolute top-1/2 -translate-y-1/2 right-2 z-20 opacity-0 group-hover/slider:opacity-100 transition-opacity duration-300"> 
        <button 
          onClick={() => scrollTo("right")} 
          className="h-12 w-12 rounded-full bg-background/80 backdrop-blur-md border border-border/50 shadow-lg flex items-center justify-center hover:bg-background hover:scale-110 transition-all active:scale-95" 
          aria-label="Scroll right" 
        > 
          <ChevronRight className="w-6 h-6" /> 
        </button> 
      </div> 
 
      <motion.div 
        ref={containerRef} 
        className="cursor-grab active:cursor-grabbing px-4 py-8 -mx-4 -my-8" 
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        whileTap={{ cursor: "grabbing" }} 
      > 
        <motion.div 
          drag="x" 
          dragConstraints={{ right: 0, left: -width * 3 }} 
          dragElastic={0.1} 
          style={{ x }} 
          className="flex gap-6" 
          onDragStart={() => controls.current?.stop()}
          onDragEnd={() => {
            // Re-center for loop if needed
            if (x.get() > -width / 2) x.set(x.get() - width);
            if (x.get() < -width * 1.5) x.set(x.get() + width);
            startAutoScroll();
          }}
        > 
          {cards.map((card, idx) => ( 
            <motion.div 
              key={`${card.id}-${idx}`} 
              className="min-w-[320px] max-w-[320px] h-[420px]" 
              whileHover={{ y: -10, transition: { duration: 0.3 } }} 
            > 
              <Card className="group relative h-full overflow-hidden rounded-3xl border-border/50 bg-card/30 backdrop-blur-md transition-all duration-500 hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/10"> 
                {/* Image Section */} 
                <div className="relative h-48 overflow-hidden"> 
                  <motion.img 
                    src={card.image} 
                    alt={card.title} 
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" 
                  /> 
                  <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent opacity-60 transition-opacity duration-300 group-hover:opacity-40" /> 
 
                  <div className="absolute top-4 left-4"> 
                    <Badge 
                      variant="secondary" 
                      className="bg-background/50 backdrop-blur-md border-white/10 text-xs font-medium px-3 py-1" 
                    > 
                      {card.category} 
                    </Badge> 
                  </div> 
 
                  {/* Hover Overlay Action */} 
                  <div className="absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-[2px] opacity-0 transition-opacity duration-300 group-hover:opacity-100"> 
                    <motion.button 
                      whileHover={{ scale: 1.05 }} 
                      whileTap={{ scale: 0.95 }} 
                      onClick={() => handleCardClick(card)}
                      className="flex items-center gap-2 rounded-full bg-white/90 px-5 py-2 text-sm font-semibold text-black shadow-lg" 
                    > 
                      View Details 
                    </motion.button> 
                  </div> 
                </div> 
 
                {/* Content Section */} 
                <div className="p-6 flex flex-col h-[calc(100%-12rem)] justify-between"> 
                  <div className="space-y-3" onClick={() => handleCardClick(card)}> 
                    <h3 className="text-xl font-bold leading-tight tracking-tight text-foreground transition-colors group-hover:text-primary"> 
                      {card.title} 
                    </h3> 
                    <p className="line-clamp-3 text-sm text-muted-foreground leading-relaxed"> 
                      {card.description} 
                    </p> 
                  </div> 
 
                  <div className="pt-4 mt-auto border-t border-border/50 flex items-center justify-between"> 
                    <div className="flex flex-col"> 
                      <span className="text-xs font-semibold text-foreground"> 
                        {card.author.name} 
                      </span> 
                      <span className="text-[10px] text-muted-foreground"> 
                        {card.date} 
                      </span> 
                    </div> 
                    <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground bg-secondary/50 px-2.5 py-1 rounded-full"> 
                      <Clock className="h-3 w-3" /> 
                      <span>{card.readTime}</span> 
                    </div> 
                  </div> 
                </div> 
              </Card> 
            </motion.div> 
          ))} 
        </motion.div> 
      </motion.div> 
    </div> 
  ); 
} 
