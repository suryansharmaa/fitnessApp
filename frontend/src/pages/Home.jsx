import { motion, useMotionValue, useTransform } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import MagneticButton from '../components/ui/MagneticButton';
import { ArrowRight, Activity, Zap, Shield, Smartphone } from 'lucide-react';

export const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut", staggerChildren: 0.1 } },
  exit: { opacity: 0, y: -20, transition: { duration: 0.3, ease: "easeIn" } }
};

const itemVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

function FloatingCard() {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotateX = useTransform(y, [-100, 100], [10, -10]);
  const rotateY = useTransform(x, [-100, 100], [-10, 10]);

  return (
    <motion.div
      style={{ x, y, rotateX, rotateY, z: 100 }}
      drag
      dragConstraints={{ top: 0, right: 0, bottom: 0, left: 0 }}
      dragElastic={0.1}
      whileTap={{ cursor: "grabbing" }}
      className="relative w-64 h-80 rounded-3xl glass-card p-6 cursor-grab flex flex-col justify-between shadow-2xl border border-white/10 overflow-hidden group"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-violet-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      <div className="relative z-10 flex justify-between items-start">
        <div className="p-3 bg-zinc-900/80 rounded-2xl glass shadow-lg">
          <Activity className="w-6 h-6 text-brand-500" />
        </div>
        <div className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-xs font-semibold border border-green-500/30">
          Perfect Form
        </div>
      </div>

      <div className="relative z-10 mt-auto">
        <h3 className="text-xl font-bold text-white mb-2 tracking-tight">Deadlift Master</h3>
        <p className="text-sm text-zinc-400 mb-4">Focus on your posterior chain and maintain a neutral spine.</p>

        <div className="w-full bg-zinc-800 rounded-full h-1.5 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: "75%" }}
            transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
            className="bg-brand-500 h-full rounded-full"
          />
        </div>
        <div className="flex justify-between items-center mt-2 text-xs font-medium text-zinc-500">
          <span>Progress</span>
          <span className="text-white">75%</span>
        </div>
      </div>

      <div className="absolute -top-12 -right-12 w-32 h-32 bg-brand-500/20 rounded-full blur-3xl" />
      <div className="absolute -bottom-12 -left-12 w-32 h-32 bg-fuchsia-500/20 rounded-full blur-3xl" />
    </motion.div>
  );
}

export default function Home() {
  const navigate = useNavigate();

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="w-full flex flex-col"
    >
      {/* HERO SECTION */}
      <section className="min-h-[90vh] flex flex-col lg:flex-row items-center justify-center gap-16 lg:gap-24 max-w-7xl mx-auto px-4 w-full">
        <div className="flex-1 text-center lg:text-left z-10 mt-20 lg:mt-0">
          <motion.div variants={itemVariants} className="inline-block mb-4 px-4 py-1.5 rounded-full glass border border-white/10 text-sm font-medium text-zinc-300">
            <span className="relative flex h-2 w-2 inline-block mr-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-500"></span>
            </span>
            Next-gen fitness tracking
          </motion.div>

          <motion.h1 variants={itemVariants} className="text-5xl lg:text-7xl font-extrabold tracking-tight mb-6 leading-[1.1]">
            Shape Your <br className="hidden lg:block" />
            <span className="text-gradient">Future Body.</span>
          </motion.h1>

          <motion.p variants={itemVariants} className="text-lg lg:text-xl text-zinc-400 max-w-xl mx-auto lg:mx-0 mb-10 leading-relaxed tracking-wide">
            Experience fitness tracking redefined. High-fidelity motion design, smart analytics, and adaptive workout plans tailored to your goals.
          </motion.p>

          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
            <MagneticButton variant="accent" onClick={() => navigate('/login')}>
              Get Started
              <ArrowRight className="w-4 h-4 ml-2" />
            </MagneticButton>
            <MagneticButton variant="secondary" onClick={() => navigate('/library')}>
              Explore Workouts
            </MagneticButton>
          </motion.div>
        </div>

        <motion.div
          variants={itemVariants}
          className="flex-1 flex justify-center items-center relative w-full perspective-1000 mb-20 lg:mb-0"
        >
          <div className="absolute inset-0 bg-gradient-to-tr from-brand-600/20 to-fuchsia-600/20 rounded-full blur-[100px] -z-10 transform scale-75" />
          <FloatingCard />
        </motion.div>
      </section>

      {/* FEATURES SECTION (Makes the page scrollable) */}
      <section className="py-32 bg-zinc-950/50 border-t border-white/5 relative">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">Built for <span className="text-gradient">Performance</span></h2>
            <p className="text-zinc-400 max-w-2xl mx-auto text-lg">We didn't just build another single-page tracker. We built a robust, multi-faceted platform designed to scale with your gains.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="glass-card p-8 flex flex-col items-center text-center">
              <Zap className="w-12 h-12 text-brand-500 mb-6" />
              <h3 className="text-xl font-bold text-white mb-3">Lightning Fast</h3>
              <p className="text-zinc-400">Powered by Vite and React, experience zero-latency transitions between massive libraries of data.</p>
            </div>
            <div className="glass-card p-8 flex flex-col items-center text-center">
              <Shield className="w-12 h-12 text-fuchsia-500 mb-6" />
              <h3 className="text-xl font-bold text-white mb-3">Secure Cloud Sync</h3>
              <p className="text-zinc-400">Your Heatmap data and saved matrices are securely backed up to an encrypted MongoDB Atlas cluster.</p>
            </div>
            <div className="glass-card p-8 flex flex-col items-center text-center">
              <Smartphone className="w-12 h-12 text-violet-400 mb-6" />
              <h3 className="text-xl font-bold text-white mb-3">Responsive Design</h3>
              <p className="text-zinc-400">Whether you are on a 4K monitor or an iPhone mini, the layout perfectly adapts and remains scrollable.</p>
            </div>
          </div>
        </div>
      </section>

      {/* HUGE FOOTER */}
      <footer className="bg-zinc-950 py-20 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center">
                <Activity className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-xl tracking-tight">Fitness<span className="text-violet-400">App</span></span>
            </div>
            <p className="text-zinc-500 max-w-md">The ultimate multi-page dynamic MERN application for modern fitness tracking.</p>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-6">Platform</h4>
            <ul className="space-y-4 text-zinc-500">
              <li><button onClick={() => navigate('/dashboard')} className="hover:text-brand-400 transition-colors">Dashboard</button></li>
              <li><button onClick={() => navigate('/planner')} className="hover:text-brand-400 transition-colors">Smart Planner</button></li>
              <li><button onClick={() => navigate('/library')} className="hover:text-brand-400 transition-colors">Exercise Library</button></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-6">Legal</h4>
            <ul className="space-y-4 text-zinc-500">
              <li className="cursor-not-allowed">Privacy Policy</li>
              <li className="cursor-not-allowed">Terms of Service</li>
              <li className="cursor-not-allowed">Cookie Settings</li>
            </ul>
          </div>
        </div>
      </footer>
    </motion.div>
  );
}
