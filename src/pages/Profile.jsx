import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Settings, Shield, MapPin, Award, CheckCircle, TrendingUp, Edit2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const Profile = () => {
  const { user } = useAuth();
  
  // Mock stats - in real app fetch from service
  const userStats = {
      reports: 42,
      validations: 156,
      xp: 12500,
      safetyScore: 98
  };

  return (
    <div className="min-h-screen bg-bg-primary pt-24 pb-28 px-4 font-sans text-white overflow-x-hidden">
      
      {/* Cinematic Background Glow */}
      <div className="fixed inset-0 pointer-events-none">
         <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-accent-violet/10 rounded-full blur-[120px]"></div>
      </div>

      <div className="relative z-10 max-w-2xl mx-auto space-y-10">
         
         {/* Task 1: Hero Section (Identity) */}
         <motion.div 
           initial={{ opacity: 0, scale: 0.95 }}
           animate={{ opacity: 1, scale: 1 }}
           className="flex flex-col items-center text-center"
         >
             <div className="relative">
                 <div className="w-28 h-28 rounded-full border-4 border-bg-primary shadow-[0_0_40px_rgba(139,92,246,0.6)] overflow-hidden z-20 relative">
                    <div className="w-full h-full bg-gradient-to-br from-indigo-500 to-accent-violet flex items-center justify-center text-4xl font-bold">
                        {user?.name?.charAt(0) || 'U'}
                    </div>
                 </div>
                 {/* Violet Outer Glow Ring */}
                 <div className="absolute inset-0 rounded-full border-2 border-accent-violet/50 blur-sm scale-110 z-10"></div>
                 
                 <Link to="/settings" className="absolute bottom-0 right-0 z-30 bg-bg-primary p-2 rounded-full border border-white/10 text-white hover:text-accent-violet transition-colors shadow-lg">
                    <Settings size={18} />
                 </Link>
             </div>

             <h1 className="text-3xl font-extrabold mt-6 text-white tracking-tight">
                 {user?.name || 'Safe Driver'}
             </h1>

             {/* Scout Badge */}
             <div className="mt-3 inline-flex items-center space-x-2 bg-white/5 border border-white/10 px-4 py-1.5 rounded-full backdrop-blur-md">
                 <Shield size={14} className="text-accent-danger" fill="#F59E0B" />
                 <span className="text-sm font-bold text-white tracking-wide">ELITE SCOUT</span>
             </div>
         </motion.div>

         {/* Task 2: The Stats Grid */}
         <div className="grid grid-cols-2 gap-4">
             <StatCard 
               label="Reports" 
               value={userStats.reports} 
               icon={MapPin} 
               color="text-blue-400" 
               delay={0.1}
             />
             <StatCard 
               label="Validations" 
               value={userStats.validations} 
               icon={CheckCircle} 
               color="text-green-400" 
               delay={0.2} 
             />
             <StatCard 
               label="Total XP" 
               value={userStats.xp.toLocaleString()} 
               icon={TrendingUp} 
               color="text-accent-violet" 
               delay={0.3} 
             />
             <StatCard 
               label="Safety Score" 
               value={userStats.safetyScore} 
               icon={Award} 
               color="text-accent-danger" 
               delay={0.4} 
             />
         </div>

         {/* Recent Activity Mini List (Optional filler) */}
         <div>
            <div className="flex items-center justify-between mb-4 px-2">
               <h3 className="font-bold text-lg text-white">Recent Contributions</h3>
               <button className="text-xs text-accent-violet font-semibold">View All</button>
            </div>
            <div className="space-y-3">
               {[1, 2].map((_, i) => (
                  <div key={i} className="glass-card p-4 rounded-2xl flex items-center justify-between hover:bg-white/5 transition-colors group">
                      <div className="flex items-center space-x-3">
                         <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-text-secondary group-hover:text-white transition-colors">
                            <MapPin size={18} />
                         </div>
                         <div>
                            <div className="font-semibold text-sm">Pothole on Main St</div>
                            <div className="text-xs text-text-secondary">Confirmed 2h ago</div>
                         </div>
                      </div>
                      <div className="text-accent-violet font-bold text-sm">+20 XP</div>
                  </div>
               ))}
            </div>
         </div>

      </div>
    </div>
  );
};

const StatCard = ({ label, value, icon: Icon, color, delay }) => (
    <motion.div
       initial={{ opacity: 0, y: 20 }}
       animate={{ opacity: 1, y: 0 }}
       transition={{ delay }}
       className="glass-card relative p-6 rounded-2xl overflow-hidden group hover:bg-white/5 transition-colors"
    >
        {/* Subtle Violet Corner Glow */}
        <div className="absolute top-0 right-0 w-16 h-16 bg-accent-violet/10 blur-[30px] -mr-8 -mt-8 rounded-full"></div>

        <div className={`mb-3 ${color}`}>
            <Icon size={24} />
        </div>
        <div className="text-2xl font-extrabold text-white mb-1 tracking-tight">{value}</div>
        <div className="text-xs font-semibold text-text-secondary uppercase tracking-wider">{label}</div>
    </motion.div>
);

export default Profile;
