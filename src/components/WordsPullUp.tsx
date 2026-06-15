import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

interface WordsPullUpProps {
  text: string;
  className?: string;
}

const WordsPullUp: React.FC<WordsPullUpProps> = ({ text, className = '' }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-10%" });

  const words = text.split(' ');

  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08 },
    },
  };

  const child = {
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        ease: [0.16, 1, 0.3, 1],
      },
    },
    hidden: {
      opacity: 0,
      y: 20,
    },
  };

  return (
    <motion.div
      ref={ref}
      style={{ display: "flex", flexWrap: "wrap" }}
      variants={container}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      className={className}
    >
      {words.map((word, index) => {
        let content: React.ReactNode = word;
        
        // Custom styling for Prisma as requested
        if (word === "Prisma*") {
          content = (
            <>
              Prism
              <span className="relative inline-block">
                a
                <span className="absolute top-[0.65em] -right-[0.3em] text-[0.31em]">
                  *
                </span>
              </span>
            </>
          );
        }

        return (
          <motion.span variants={child} key={index} style={{ display: "inline-block", marginRight: index !== words.length - 1 ? "0.25em" : "0" }}>
            {content}
          </motion.span>
        );
      })}
    </motion.div>
  );
};

export default WordsPullUp;
