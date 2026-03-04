"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Home from "../pages/Home";

export default function Preloader() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 2 second timer then fade out
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence mode="wait">
      {isLoading ? (
        <motion.div
          key="preloader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
          className="fixed inset-0 z-9999 bg-[#1C1D20] flex items-center justify-center"
        >
          {/* Welcome Text with ;) on same line */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-center"
          >
            <h1 className="text-white text-5xl md:text-7xl font-bold tracking-tight mb-4 flex items-center justify-center gap-3">
              Welcome
              <motion.span
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                  duration: 0.4,
                  delay: 0.6,
                  type: "spring",
                  stiffness: 200,
                }}
                className="text-[#1C1D20] font-bold"
                style={{
                  textShadow: "0 0 0 3px #fff, 0 0 0 6px #1C1D20",
                  WebkitTextStroke: "2px white",
                }}
              >
                ;)
              </motion.span>
            </h1>
          </motion.div>
        </motion.div>
      ) : (
        <motion.div
          key="home"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
        >
          <Home />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
