import { useRef, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import clsx from 'clsx';

export default function MagneticButton({ children, className, onClick, variant = 'primary' }) {
  const ref = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  // Spring physics for smooth return
  const xSpring = useSpring(x, { stiffness: 150, damping: 15, mass: 0.1 });
  const ySpring = useSpring(y, { stiffness: 150, damping: 15, mass: 0.1 });

  const handleMouseMove = (e) => {
    if (!ref.current) return;
    const { clientX, clientY } = e;
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    
    // Calculate distance from center
    const xPos = clientX - (left + width / 2);
    const yPos = clientY - (top + height / 2);
    
    // Magnetic pull strength (higher divisor = less pull)
    x.set(xPos * 0.3);
    y.set(yPos * 0.3);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    x.set(0);
    y.set(0);
  };

  const baseStyles = "relative font-semibold py-3 px-8 rounded-full flex items-center justify-center gap-2 transition-colors duration-300";
  const variants = {
    primary: "bg-white text-zinc-950 hover:bg-zinc-200",
    secondary: "glass text-white hover:bg-zinc-800",
    accent: "bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white shadow-[0_0_20px_rgba(139,92,246,0.3)] hover:shadow-[0_0_30px_rgba(139,92,246,0.5)] border border-white/20"
  };

  return (
    <motion.button
      ref={ref}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      style={{ x: xSpring, y: ySpring }}
      whileTap={{ scale: 0.95 }}
      className={clsx(baseStyles, variants[variant], className)}
    >
      <span className="relative z-10">{children}</span>
      {isHovered && variant === 'primary' && (
        <motion.div 
          layoutId="button-glow"
          className="absolute inset-0 bg-white/50 blur-xl rounded-full -z-10"
        />
      )}
    </motion.button>
  );
}
