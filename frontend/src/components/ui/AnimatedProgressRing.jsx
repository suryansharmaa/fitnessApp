import { motion } from 'framer-motion';

export default function AnimatedProgressRing({ 
  progress = 0, // 0 to 100
  size = 120, 
  strokeWidth = 12, 
  color = "#8b5cf6",
  trackColor = "rgba(255, 255, 255, 0.1)",
  children
}) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  // Convert progress (0-100) to 0-1 for Framer Motion
  const fill = progress / 100;

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="transparent"
          stroke={trackColor}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />
        {/* Animated fill */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="transparent"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: circumference * (1 - fill) }}
          transition={{ type: "spring", stiffness: 60, damping: 20, delay: 0.2 }}
        />
      </svg>
      {/* Centered content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        {children}
      </div>
    </div>
  );
}
