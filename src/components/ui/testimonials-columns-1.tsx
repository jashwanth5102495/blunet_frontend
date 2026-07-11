"use client"; 
import React from "react"; 
import { motion } from "motion/react"; 
 
 
export const TestimonialsColumn = (props: { 
  className?: string; 
  testimonials: { text: string; image: string; name: string; role: string }[]; 
  duration?: number; 
}) => { 
  return ( 
    <div className={props.className}> 
      <motion.div 
        animate={{ 
          translateY: "-50%", 
        }} 
        transition={{ 
          duration: props.duration || 10, 
          repeat: Infinity, 
          ease: "linear", 
          repeatType: "loop", 
        }} 
        className="flex flex-col gap-6 pb-6" 
      > 
        {[ 
          ...new Array(2).fill(0).map((_, index) => ( 
            <React.Fragment key={index}> 
              {props.testimonials.map(({ text, image, name, role }, i) => ( 
                <div className="p-10 rounded-3xl border border-white/10 bg-zinc-900/50 shadow-lg shadow-primary/10 w-full backdrop-blur-sm" key={i}> 
                  <div className="text-gray-300">{text}</div> 
                  <div className="mt-5">
                    <div className="font-medium tracking-tight leading-5 text-white">{name}</div>
                    <div className="leading-5 opacity-60 tracking-tight text-gray-400">{role}</div>
                  </div> 
                </div> 
              ))} 
            </React.Fragment> 
          )), 
        ]} 
      </motion.div> 
    </div> 
  ); 
}; 
