import { Outlet } from 'react-router-dom';
import { motion } from 'motion/react';

export const AuthLayout = () => {
  return (
    <div className="min-h-screen flex items-center justify-center font-body-md text-on-surface antialiased bg-surface-container-lowest relative overflow-hidden">
      {/* Dynamic Animated Background Colors */}
      <div className="absolute inset-0 z-0 pointer-events-none" style={{ backgroundImage: 'radial-gradient(at 0% 0%, rgba(132, 85, 239, 0.05) 0px, transparent 50%), radial-gradient(at 100% 100%, rgba(0, 88, 190, 0.05) 0px, transparent 50%)' }}></div>
      
      {/* Animated Orbs */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          x: [0, 50, 0],
          y: [0, 30, 0],
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -top-[10%] -left-[10%] w-[40%] h-[50%] bg-primary/10 rounded-full blur-[120px] z-0"
      />
      
      <motion.div
        animate={{
          scale: [1, 1.3, 1],
          x: [0, -60, 0],
          y: [0, -40, 0],
        }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        className="absolute -bottom-[10%] -right-[10%] w-[45%] h-[55%] bg-secondary/10 rounded-full blur-[120px] z-0"
      />

      <motion.div
        animate={{
          opacity: [0.3, 0.6, 0.3],
          scale: [1, 1.1, 1],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[30%] left-[30%] w-[40%] h-[40%] bg-primary-fixed-dim/10 rounded-full blur-[100px] z-0 pointer-events-none mix-blend-multiply"
      />

      {/* Main Content */}
      <div className="relative z-10 w-full flex justify-center">
        <Outlet />
      </div>
    </div>
  );
};
