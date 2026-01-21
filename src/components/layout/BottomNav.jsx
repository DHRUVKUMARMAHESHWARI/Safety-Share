import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Map, LayoutDashboard, Trophy, Shield, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const BottomNav = () => {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) return null; // Don't show dock for guests/unauth if specific to app features

  const links = [
    { path: '/map', label: 'Map', icon: Map },
    { path: '/dashboard', label: 'Home', icon: LayoutDashboard }, // Profile is effectively the dashboard/home
    { path: '/leaderboard', label: 'Top', icon: Trophy },
    ...(user.role === 'admin' ? [{ path: '/admin', label: 'Admin', icon: Shield }] : [])
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <div className="fixed bottom-6 left-0 right-0 z-50 flex justify-center pointer-events-none">
      <motion.div 
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, type: "spring", stiffness: 300, damping: 20 }}
        className="pointer-events-auto glass-dock px-6 py-3 flex items-center space-x-2 md:space-x-6"
      >
        {links.map(({ path, label, icon: Icon }) => {
          const active = isActive(path);
          return (
            <Link 
              key={path} 
              to={path}
              className="relative group flex flex-col items-center justify-center w-12 h-12 md:w-14 md:h-14 rounded-full transition-all duration-300"
            >
              {active && (
                <motion.div
                  layoutId="dock-highlight"
                  className="absolute inset-0 bg-accent-violet/20 rounded-full blur-md"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              
              <div className={`relative z-10 transition-transform duration-200 ${active ? 'scale-110' : 'group-hover:scale-105'}`}>
                <Icon 
                  size={24} 
                  className={`transition-colors duration-300 ${active ? 'text-accent-violet drop-shadow-[0_0_8px_rgba(139,92,246,0.5)]' : 'text-text-secondary group-hover:text-white'}`}
                />
              </div>

              {/* Tooltip for desktop */}
              <span className="absolute -top-10 opacity-0 group-hover:opacity-100 transition-opacity bg-black/80 px-2 py-1 rounded text-xs text-white pointer-events-none whitespace-nowrap md:block hidden">
                {label}
              </span>
            </Link>
          );
        })}
      </motion.div>
    </div>
  );
};

export default BottomNav;
