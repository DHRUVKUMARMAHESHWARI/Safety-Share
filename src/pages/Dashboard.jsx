import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { AlertTriangle, Shield, TrendingUp, MapPin, Award } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getUserStats } from '../services/gamificationService';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    points: 0,
    level: 'Rookie',
    reports: 0,
    alertsRecieved: 0,
    nextLevelPoints: 1000
  });

  // Mock data for visual dev
  useEffect(() => {
    // In real app, fetch from API
    setTimeout(() => {
        setStats({
            points: 1250,
            level: 'Scout',
            reports: 42,
            alertsRecieved: 128,
            nextLevelPoints: 2000
        });
    }, 500);
  }, []);

  const progress = (stats.points / stats.nextLevelPoints) * 100;

  return (
    <div className="min-h-screen bg-bg-primary pt-24 pb-28 px-4 font-sans text-white">
      
      {/* Cinematic Background Glows */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 right-0 w-[400px] h-[400px] bg-accent-violet/10 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-20 left-0 w-[300px] h-[300px] bg-accent-danger/5 rounded-full blur-[80px]"></div>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto space-y-8">
        
        {/* Header Section */}
        <header className="flex items-center justify-between">
           <div>
             <h1 className="text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">
               Dashboard
             </h1>
             <p className="text-text-secondary mt-1">Welcome back, {user?.name}</p>
           </div>
           
           <div className="flex items-center space-x-2 glass-dock px-4 py-2">
             <Shield className="text-accent-violet" size={18} />
             <span className="font-bold text-sm tracking-wide">{stats.level.toUpperCase()}</span>
           </div>
        </header>

        {/* Level Progress Card */}
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card rounded-3xl p-8 flex flex-col md:flex-row items-center justify-between"
        >
           <div className="flex items-center space-x-6 mb-6 md:mb-0">
              <div className="w-24 h-24 md:w-32 md:h-32 shadow-[0_0_30px_rgba(139,92,246,0.3)] rounded-full text-center">
                 <CircularProgressbar
                    value={progress}
                    text={`${Math.round(progress)}%`}
                    styles={buildStyles({
                        textSize: '22px',
                        pathColor: '#8B5CF6',
                        textColor: '#FFFFFF',
                        trailColor: 'rgba(255, 255, 255, 0.1)',
                        pathTransitionDuration: 1.5,
                    })}
                 />
              </div>
              <div>
                 <h2 className="text-2xl font-bold text-white mb-1">Level Progress</h2>
                 <p className="text-text-secondary text-sm">
                    {stats.points} / {stats.nextLevelPoints} XP to next level
                 </p>
              </div>
           </div>

           <div className="flex space-x-4">
              <div className="text-center p-4 rounded-2xl bg-white/5 border border-white/10 min-w-[100px]">
                 <TrendingUp className="mx-auto text-accent-violet mb-2" size={24} />
                 <div className="text-2xl font-bold">{stats.points}</div>
                 <div className="text-xs text-text-secondary">Total XP</div>
              </div>
              <div className="text-center p-4 rounded-2xl bg-white/5 border border-white/10 min-w-[100px]">
                 <Award className="mx-auto text-accent-danger mb-2" size={24} />
                 <div className="text-2xl font-bold">12</div>
                 <div className="text-xs text-text-secondary">Badges</div>
              </div>
           </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatsCard icon={AlertTriangle} label="Hazards Reported" value={stats.reports} color="#F59E0B" delay={0.1} />
            <StatsCard icon={Shield} label="Alerts Received" value={stats.alertsRecieved} color="#8B5CF6" delay={0.2} />
            <StatsCard icon={MapPin} label="Km Traveled" value="1,240" color="#3B82F6" delay={0.3} />
            <StatsCard icon={Award} label="Safety Score" value="98" color="#10B981" delay={0.4} />
        </div>

        {/* Recent Activity (Mock) */}
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ delay: 0.5 }}
           className="glass-card rounded-3xl p-6"
        >
           <h3 className="text-xl font-bold mb-6">Recent Activity</h3>
           <div className="space-y-4">
              {[1, 2, 3].map((_, i) => (
                 <div key={i} className="flex items-center justify-between p-4 rounded-xl hover:bg-white/5 transition-colors border border-transparent hover:border-white/5">
                    <div className="flex items-center space-x-4">
                       <div className="w-10 h-10 rounded-full bg-accent-violet/20 flex items-center justify-center text-accent-violet">
                          <AlertTriangle size={20} />
                       </div>
                       <div>
                          <p className="font-semibold text-white">Reported a Pothole</p>
                          <p className="text-xs text-text-secondary">2 hours ago • Verified by 3 users</p>
                       </div>
                    </div>
                    <div className="text-accent-violet font-bold text-sm">+50 XP</div>
                 </div>
              ))}
           </div>
        </motion.div>

      </div>
    </div>
  );
};

const StatsCard = ({ icon: Icon, label, value, color, delay }) => (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay }}
      className="glass-card p-5 rounded-2xl flex flex-col items-center justify-center text-center space-y-2 hover:bg-white/5 transition-colors"
    >
        <div className="w-10 h-10 rounded-full flex items-center justify-center mb-1" style={{ backgroundColor: `${color}20`, color: color }}>
            <Icon size={20} />
        </div>
        <div className="text-3xl font-extrabold text-white">{value}</div>
        <div className="text-xs font-bold text-text-secondary uppercase tracking-wider">{label}</div>
    </motion.div>
);

export default Dashboard;
