import { useState, useEffect } from 'react';
import { Routes, Route, useLocation, Navigate, useNavigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Navbar from './components/layout/Navbar';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import ExerciseLibrary from './pages/ExerciseLibrary';
import SmartPlanner from './pages/SmartPlanner';
import AuthPage from './pages/AuthPage';

export default function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  
  // Check for saved login on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        localStorage.removeItem('user');
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-slate-50 font-sans selection:bg-brand-500/30">
      <Navbar user={user} onLogout={handleLogout} />
      
      <main className="pt-16 pb-0 w-full">
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={!user ? <AuthPage setAuth={setUser} /> : <Navigate to="/dashboard" />} />
            
            {/* Protected Routes */}
            <Route path="/dashboard" element={user ? <div className="max-w-7xl mx-auto px-4 py-8"><Dashboard user={user} /></div> : <Navigate to="/login" />} />
            <Route path="/library" element={user ? <div className="max-w-7xl mx-auto px-4 py-8"><ExerciseLibrary /></div> : <Navigate to="/login" />} />
            <Route path="/planner" element={user ? <div className="max-w-7xl mx-auto px-4 py-8"><SmartPlanner /></div> : <Navigate to="/login" />} />
          </Routes>
        </AnimatePresence>
      </main>
    </div>
  );
}
