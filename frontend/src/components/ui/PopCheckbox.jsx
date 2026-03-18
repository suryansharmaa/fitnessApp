import { useState } from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import clsx from 'clsx';

export default function PopCheckbox({ checked: propChecked, onChange: propOnChange, label }) {
  const [localChecked, setLocalChecked] = useState(false);
  const isControlled = propChecked !== undefined;
  const isChecked = isControlled ? propChecked : localChecked;

  const handleChange = () => {
    if (isControlled) {
      propOnChange?.(!propChecked);
    } else {
      setLocalChecked(!localChecked);
    }
  };

  return (
    <label className="flex items-center gap-3 cursor-pointer group" onClick={(e) => e.stopPropagation()}>
      <div 
        className={clsx(
          "relative flex items-center justify-center w-6 h-6 rounded-md border-2 transition-colors duration-200",
          isChecked ? "border-brand-500 bg-brand-500" : "border-zinc-600 group-hover:border-zinc-500"
        )}
        onClick={handleChange}
      >
        <motion.div
          initial={false}
          animate={isChecked ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
          transition={{ type: "spring", stiffness: 400, damping: 20 }}
          className="pointer-events-none"
        >
          <Check className="w-4 h-4 text-white" strokeWidth={3} />
        </motion.div>
        
        {isChecked && (
          <motion.div
            initial={{ scale: 0.8, opacity: 0.8 }}
            animate={{ scale: 1.6, opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="absolute inset-0 rounded-md border-2 border-brand-500 pointer-events-none"
          />
        )}
      </div>
      {label && (
        <span 
          onClick={handleChange}
          className={clsx(
            "font-medium transition-colors duration-200",
            isChecked ? "text-slate-50 line-through opacity-70" : "text-zinc-300 group-hover:text-slate-50"
          )}
        >
          {label}
        </span>
      )}
    </label>
  );
}
