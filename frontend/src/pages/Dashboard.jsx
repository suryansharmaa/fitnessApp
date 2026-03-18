import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { pageVariants } from './Home';
import AnimatedProgressRing from '../components/ui/AnimatedProgressRing';
import { Flame, Activity, Zap, Loader2 } from 'lucide-react';

export default function Dashboard({ user }) {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    dailyGoal: 650,
    dailyBurn: 0,
    workoutGoalTime: 90,
    workoutActualTime: 0,
    heatmapData: Array.from({ length: 7 }, () => Array(12).fill(0))
  });

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch('http://localhost:8080/api/user/progress', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const progress = await res.json();
          setData(progress);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProgress();
  }, []);

  if (loading) return <div className="flex h-64 items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-brand-500" /></div>;

  // Calculate percentages
  const burnProgress = Math.min((data.dailyBurn / data.dailyGoal) * 100, 100) || 0;
  const timeProgress = Math.min((data.workoutActualTime / data.workoutGoalTime) * 100, 100) || 0;

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="max-w-5xl mx-auto"
    >
      <header className="mb-10">
        <h2 className="text-3xl font-bold tracking-tight text-white mb-2">Welcome back, {user?.name || 'Alex'}.</h2>
        <p className="text-zinc-400">Here's your activity overview for this week.</p>
      </header>

      <div className="bento-grid">
        {/* Heatmap Section */}
        <div className="bento-item col-span-1 md:col-span-2 md:row-span-2 justify-between">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-zinc-100 flex items-center gap-2">
              <Activity className="w-5 h-5 text-brand-500" /> Activity Heatmap
            </h3>
            <span className="text-sm font-medium text-zinc-400">Last 12 Weeks</span>
          </div>
          
          <div className="flex-1 flex flex-col justify-end">
            <div className="flex gap-2 items-end">
              <div className="flex flex-col justify-between text-xs text-zinc-500 pr-2 pb-2 font-medium h-[168px]">
                <span>Mon</span>
                <span>Wed</span>
                <span>Fri</span>
              </div>
              <div className="flex gap-2 flex-1 overflow-x-auto no-scrollbar pb-2">
                {data.heatmapData[0].map((_, colIndex) => (
                  <div key={colIndex} className="flex flex-col gap-2">
                    {data.heatmapData.map((row, rowIndex) => {
                      const level = row[colIndex];
                      const colors = ['bg-zinc-800', 'bg-violet-900', 'bg-violet-600', 'bg-violet-400'];
                      return (
                        <motion.div
                          key={`${colIndex}-${rowIndex}`}
                          initial={{ opacity: 0, scale: 0.5 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.4, delay: (colIndex * 7 + rowIndex) * 0.005 }}
                          className={`w-4 h-4 rounded-sm ${colors[level]} cursor-pointer hover:ring-2 ring-white/50 transition-all`}
                          title={`Activity level: ${level}`}
                        />
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Daily Calorie Goal */}
        <div className="bento-item flex flex-col items-center justify-center text-center">
          <h3 className="text-md font-medium text-zinc-400 w-full text-left mb-4 flex items-center gap-2">
            <Flame className="w-4 h-4 text-orange-500" /> Daily Burn
          </h3>
          <AnimatedProgressRing progress={burnProgress} size={140} color="#f97316" strokeWidth={14}>
            <span className="text-2xl font-bold text-white">{data.dailyBurn}</span>
            <span className="text-xs text-zinc-500 uppercase font-semibold">of {data.dailyGoal} kcal</span>
          </AnimatedProgressRing>
        </div>

        {/* Daily Workout Goal */}
        <div className="bento-item flex flex-col items-center justify-center text-center">
          <h3 className="text-md font-medium text-zinc-400 w-full text-left mb-4 flex items-center gap-2">
            <Zap className="w-4 h-4 text-brand-500" /> Workout Time
          </h3>
          <AnimatedProgressRing progress={timeProgress} size={140} color="#8b5cf6" strokeWidth={14}>
            <span className="text-2xl font-bold text-white">{data.workoutActualTime}m</span>
            <span className="text-xs text-zinc-500 uppercase font-semibold">of {data.workoutGoalTime}m</span>
          </AnimatedProgressRing>
        </div>
      </div>
    </motion.div>
  );
}

