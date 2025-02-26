import { FC, ReactNode } from "react";
import { motion } from "framer-motion";

interface PageTransitionProps {
  children: ReactNode;
}

export const PageTransition: FC<PageTransitionProps> = ({ children }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{
        duration: 0.15,
        ease: "easeInOut",
      }}
      className="h-full"
    >
      <motion.div
        initial={{ y: 20 }}
        animate={{ y: 0 }}
        exit={{ y: -20 }}
        transition={{
          duration: 0.15,
          ease: "easeInOut",
        }}
        className="h-full p-6"
      >
        {children}
      </motion.div>
    </motion.div>
  );
}; 