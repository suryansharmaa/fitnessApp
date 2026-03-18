import { motion } from 'framer-motion';
import { NavLink } from 'react-router-dom';
import { Activity, LayoutDashboard, Library, Sparkles, LogOut } from 'lucide-react';
import clsx from 'clsx';

const navItems = [
  { path: '/', name: 'Home', icon: Activity },
  { path: '/dashboard', name: 'Dashboard', icon: LayoutDashboard },
  { path: '/library', name: 'Library', icon: Library },
  { path: '/planner', name: 'Smart Planner', icon: Sparkles },
];

export default function Navbar({ user, onLogout }) {
  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="fixed top-0 inset-x-0 z-50 h-16 border-b border-white/10 glass bg-zinc-950/50 flex items-center justify-between px-6 lg:px-12"
    >
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center">
          <Activity className="w-5 h-5 text-white" />
        </div>
        <span className="font-bold text-lg tracking-tight">Fitness<span className="text-violet-400">App</span></span>
      </div>

      <div className="hidden md:flex items-center space-x-1 glass-card px-2 py-1.5 rounded-full bg-zinc-900/40">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => clsx(
              "relative px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200",
              isActive ? "text-white" : "text-zinc-400 hover:text-white"
            )}
          >
            {({ isActive }) => (
              <>
                <span className="relative z-10 flex items-center gap-2">
                  <item.icon className="w-4 h-4" />
                  <span className="hidden lg:inline">{item.name}</span>
                </span>
                {isActive && (
                  <motion.div
                    layoutId="navbar-indicator"
                    className="absolute inset-0 bg-white/10 rounded-full z-0"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
              </>
            )}
          </NavLink>
        ))}
      </div>

      <div className="flex items-center gap-4">
        {user ? (
          <>
            <span className="text-sm font-medium text-zinc-300 hidden sm:block">Hi, {user.name}</span>
            <button
              onClick={onLogout}
              className="p-2 rounded-full hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors"
              title="Log out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </>
        ) : (
          <div className="w-8" />
        )}
      </div>
    </motion.nav>
  );
}

