import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { motion } from 'framer-motion';
import { Bell, LogOut } from 'lucide-react';

const Navbar = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <nav className="fixed top-6 left-0 right-0 z-50 flex justify-center pointer-events-none">
      <motion.div 
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="pointer-events-auto glass-dock px-6 py-3 flex items-center justify-between space-x-8 min-w-[300px] md:min-w-[500px]"
      >
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-3 group">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-accent-violet to-indigo-600 flex items-center justify-center text-white font-bold text-lg shadow-[0_0_15px_rgba(139,92,246,0.5)]">
            S
          </div>
          <span className="font-sans font-extrabold text-lg tracking-tight text-white group-hover:text-accent-violet transition-colors">
            SafeRoute
          </span>
        </Link>

        {/* Right Actions */}
        <div className="flex items-center space-x-4">
          <button className="text-text-secondary hover:text-white transition-colors relative">
             <Bell size={20} />
             <span className="absolute top-0 right-0 w-2 h-2 bg-accent-danger rounded-full border border-bg-primary"></span>
          </button>
          
          {user ? (
            <div 
              onClick={() => navigate('/profile')} 
              className="w-9 h-9 rounded-full bg-white/10 border border-glass-border flex items-center justify-center text-sm font-bold text-white cursor-pointer hover:bg-white/20 transition-all"
            >
              {user.name.charAt(0).toUpperCase()}
            </div>
          ) : (
             <Link to="/login" className="text-sm font-semibold text-text-secondary hover:text-white transition-colors">
               Login
             </Link>
          )}
        </div>
      </motion.div>
    </nav>
  );
};

export default Navbar;
