import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { pageVariants } from './Home';
import MagneticButton from '../components/ui/MagneticButton';
import PopCheckbox from '../components/ui/PopCheckbox';
import { Sparkles, Dumbbell, Target, Loader2, ListChecks } from 'lucide-react';
import clsx from 'clsx';

function ToggleGroup({ options, selected, onChange }) {
  return (
    <div className="flex bg-zinc-900/50 p-1 rounded-2xl border border-white/5">
      {options.map((opt) => (
        <button
          key={opt.value}
          onClick={(e) => {
            e.preventDefault();
            onChange(opt.value);
          }}
          className={clsx(
            "relative flex-1 py-3 text-sm font-semibold transition-colors z-10 rounded-xl",
            selected === opt.value ? "text-white" : "text-zinc-400 hover:text-zinc-200"
          )}
        >
          {selected === opt.value && (
            <motion.div
              layoutId={`toggle-bg-${options[0].value}-${options[1].value}`}
              className="absolute inset-0 bg-brand-500 rounded-xl -z-10 shadow-[0_0_15px_rgba(139,92,246,0.3)]"
            />
          )}
          <span className="relative z-20 flex items-center justify-center gap-2">
            {opt.icon} {opt.label}
          </span>
        </button>
      ))}
    </div>
  );
}

export default function SmartPlanner() {
  const [goal, setGoal] = useState('muscle');
  const [equipment, setEquipment] = useState('yes');
  const [generating, setGenerating] = useState(false);
  const [plan, setPlan] = useState(null);

  const handleGenerate = async (e) => {
    e.preventDefault();
    setGenerating(true);
    
    try {
      // Connect to the new backend algorithm
      const res = await fetch('http://localhost:8080/api/planner', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ goal, equipment })
      });
      
      if (!res.ok) throw new Error("Backend unavailable");
      const data = await res.json();
      setPlan(data);
    } catch (err) {
      console.warn("Backend fell back to mock due to error:", err);
      // Fallback if backend / MongoDB isn't running locally
      await new Promise(resolve => setTimeout(resolve, 1500));
      setPlan({
        title: `${goal === 'muscle' ? 'Hypertrophy' : 'Fat Burn'} Matrix (Fallback)`,
        duration: '45 mins',
        exercises: [
          { name: 'Barbell Squats', sets: '3', reps: '10' },
          { name: 'Incline Dumbbell Press', sets: '3', reps: '12' },
          { name: 'Pull-ups', sets: '3', reps: 'To Failure' },
          { name: 'Bulgarian Split Squats', sets: '2', reps: '12 / leg' },
          { name: 'Plank', sets: '3', reps: '60s' }
        ]
      });
    } finally {
      setGenerating(false);
    }
  };

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="max-w-4xl mx-auto"
    >
      <h2 className="text-4xl font-extrabold mb-2 tracking-tight flex items-center gap-3">
        Smart Planner 
        <span className="px-3 py-1 flex items-center gap-1 text-sm font-bold bg-gradient-to-r from-brand-500 to-fuchsia-500 text-white pb-1.5 pt-2 rounded-full shadow-[0_0_20px_rgba(139,92,246,0.4)]">
          <Sparkles className="w-3.5 h-3.5" /> AI
        </span>
      </h2>
      <p className="text-zinc-400 mb-10 text-lg">Generate hyper-personalized workouts instantly based on your inputs.</p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <form onSubmit={handleGenerate} className="glass-card p-8 flex flex-col gap-8 h-fit">
          <div className="space-y-3">
            <label className="text-sm font-medium text-zinc-300 flex items-center gap-2">
              <Target className="w-4 h-4 text-brand-400" /> Primary Goal
            </label>
            <ToggleGroup 
              options={[
                { value: 'muscle', label: 'Build Muscle' },
                { value: 'weight', label: 'Lose Weight' }
              ]}
              selected={goal}
              onChange={setGoal}
            />
          </div>

          <div className="space-y-3">
            <label className="text-sm font-medium text-zinc-300 flex items-center gap-2">
              <Dumbbell className="w-4 h-4 text-brand-400" /> Equipment Availability
            </label>
            <ToggleGroup 
              options={[
                { value: 'yes', label: 'Full Gym' },
                { value: 'no', label: 'Bodyweight Only' }
              ]}
              selected={equipment}
              onChange={setEquipment}
            />
          </div>

          <MagneticButton variant="accent" className="w-full mt-4" disabled={generating}>
            {generating ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Synthesizing Plan...
              </>
            ) : (
              'Generate Workout Plan'
            )}
          </MagneticButton>
        </form>

        <AnimatePresence mode="wait">
          {plan ? (
            <motion.div 
              key="result"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-zinc-900 border border-brand-500/20 rounded-3xl p-8 relative overflow-hidden flex flex-col"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-brand-500/10 rounded-full blur-3xl" />
              
              <div className="mb-6 border-b border-white/5 pb-6">
                <span className="text-brand-400 font-mono text-sm tracking-wider uppercase mb-1 block">Generated Routine</span>
                <h3 className="text-2xl font-bold text-white mb-2">{plan.title}</h3>
                <span className="px-3 py-1 bg-zinc-800 rounded-full text-xs font-medium text-zinc-300">
                  Est. Time: {plan.duration}
                </span>
              </div>

              <div className="space-y-4 flex-1">
                {plan.exercises.map((ex, i) => (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    key={ex.name + i} 
                    className="flex items-center justify-between p-4 rounded-xl glass-card bg-zinc-900/40 hover:bg-zinc-800/60 transition-colors"
                  >
                    <PopCheckbox label={ex.name} />
                    <div className="text-right flex flex-col bg-zinc-950 px-3 py-1.5 rounded-lg border border-white/5">
                      <span className="text-xs text-zinc-500 font-semibold mb-0.5">{ex.sets} SETS</span>
                      <span className="text-sm font-bold text-brand-300">{ex.reps}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="border-2 border-dashed border-zinc-800 rounded-[2rem] flex flex-col items-center justify-center p-12 text-center h-full min-h-[400px]"
            >
              <div className="w-16 h-16 rounded-2xl bg-zinc-900 flex items-center justify-center mb-6 border border-zinc-800">
                <ListChecks className="w-8 h-8 text-zinc-600" />
              </div>
              <h3 className="text-xl font-medium text-zinc-300 mb-2">Awaiting Parameters</h3>
              <p className="text-zinc-500 max-w-xs">Fill in your physical goals and available equipment to generate an optimized routine.</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

