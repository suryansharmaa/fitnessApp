import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Loader2 } from 'lucide-react';

const categories = ['back', 'cardio', 'chest', 'lower arms', 'lower legs', 'neck', 'shoulders', 'upper arms', 'upper legs', 'waist'];

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const cardVariants = {
  hidden: { opacity: 0, y: 50 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 15 } }
};

export default function ExerciseLibrary() {
  const [selectedCategory, setSelectedCategory] = useState('back');
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const fetchExercises = async () => {
      setLoading(true);
      try {
        const res = await fetch(`http://localhost:8080/exercises?bodyPart=${selectedCategory}`);
        if (!res.ok) throw new Error('Network response was not ok');
        const data = await res.json();
        if (isMounted) setExercises(data.exercises || []);
      } catch (err) {
        console.error("Fetch failed", err);
        // Fallback mock data for visual demonstration if backend isn't running
        if (isMounted) {
          setExercises(Array.from({ length: 9 }).map((_, i) => ({
            name: `Sample Exercise ${i + 1}`,
            bodyPart: selectedCategory,
            equipment: 'dumbbell',
            gifUrl: 'https://via.placeholder.com/180?text=Workout+Animation'
          })));
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchExercises();
    return () => { isMounted = false; };
  }, [selectedCategory]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-7xl mx-auto"
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2">Exercise Library</h2>
          <p className="text-zinc-400">Master your form with our comprehensive collection.</p>
        </div>
        
        <div className="relative w-full md:w-auto">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
          <input 
            type="text" 
            placeholder="Search exercises..." 
            className="w-full md:w-64 pl-10 pr-4 py-2 bg-zinc-900 border border-zinc-800 rounded-full text-sm text-white focus:outline-none focus:ring-2 focus:ring-brand-500/50 transition-all"
          />
        </div>
      </div>

      {/* Filter Chips */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-4 mb-6">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors duration-200 border ${
              selectedCategory === cat 
                ? 'bg-brand-500 text-white border-brand-500' 
                : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:text-white hover:bg-zinc-800'
            }`}
          >
            {cat.charAt(0).toUpperCase() + cat.slice(1)}
          </button>
        ))}
      </div>

      {/* Exercise Grid with Staggered Load */}
      {loading ? (
        <div className="w-full h-64 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-brand-500" />
        </div>
      ) : (
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          {exercises.map((exercise, i) => (
            <motion.div 
              key={exercise.name + i} 
              variants={cardVariants}
              className="group glass-card overflow-hidden hover:border-brand-500/50 transition-colors"
            >
              <div className="aspect-square bg-zinc-950 flex items-center justify-center p-4">
                <img 
                  src={exercise.gifUrl} 
                  alt={exercise.name}
                  className="w-full h-full object-contain filter invert opacity-80 group-hover:opacity-100 transition-opacity"
                  loading="lazy"
                />
              </div>
              <div className="p-5 border-t border-white/5">
                <h3 className="font-semibold text-white capitalize mb-2 line-clamp-1">{exercise.name}</h3>
                <div className="flex gap-2">
                  <span className="px-2 py-1 bg-zinc-800 text-zinc-300 text-xs rounded uppercase font-medium">
                    {exercise.bodyPart}
                  </span>
                  <span className="px-2 py-1 bg-violet-900/40 text-violet-300 text-xs rounded uppercase font-medium">
                    {exercise.equipment}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </motion.div>
  );
}

