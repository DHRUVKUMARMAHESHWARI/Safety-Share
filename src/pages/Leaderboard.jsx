import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Medal, Crown, TrendingUp } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Leaderboard = () => {
  const { user } = useAuth();
  const [leaders, setLeaders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Mock data for "Cinematic" feel
  const MOCK_LEADERS = [
    { _id: '1', name: 'Alex Driver', points: 15200, level: 'Legend', avatar: 'A' },
    { _id: '2', name: 'Sarah Miles', points: 12800, level: 'Expert', avatar: 'S' },
    { _id: '3', name: 'Raj Kumar', points: 10500, level: 'Pro', avatar: 'R' },
    { _id: '4', name: 'Mike Chen', points: 8200, level: 'Scout', avatar: 'M' },
    { _id: '5', name: 'Elena G', points: 7100, level: 'Scout', avatar: 'E' },
    { _id: '6', name: 'Tom H', points: 6300, level: 'Rookie', avatar: 'T' },
    { _id: '7', name: 'Lisa W', points: 5200, level: 'Rookie', avatar: 'L' },
    { _id: '8', name: 'Davide B', points: 4100, level: 'Rookie', avatar: 'D' }, // Added more for scroll
    { _id: '9', name: 'Jenny K', points: 3000, level: 'Novice', avatar: 'J' },
  ];

  useEffect(() => {
    // Simulate API fetch
    setTimeout(() => {
      setLeaders(MOCK_LEADERS);
      setLoading(false);
    }, 800);
  }, []);

  const top3 = leaders.slice(0, 3);
  const rest = leaders.slice(3);

  // Reorder top 3 for podium visualization: [2, 1, 3] layout
  // But strictly, we can just use Flex order or CSS Grid.
  // 1st is center/largest. 2nd is left. 3rd is right.

  return (
    <div className="min-h-screen bg-bg-primary pt-24 pb-32 px-4 font-sans text-white overflow-hidden relative">
      
      {/* Cinematic Background Glows */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-accent-violet/10 rounded-full blur-[120px]"></div>
      </div>

      <div className="max-w-3xl mx-auto relative z-10">
        <header className="text-center mb-10">
          <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-white to-gray-400 mb-2">
            Top Contributors
          </h1>
          <p className="text-text-secondary">Community heroes making roads safer</p>
        </header>

        {loading ? (
           <div className="animate-pulse flex justify-center space-x-4 mt-20">
              <div className="w-24 h-32 bg-white/5 rounded-2xl"></div>
              <div className="w-28 h-40 bg-white/5 rounded-2xl -mt-8"></div>
              <div className="w-24 h-32 bg-white/5 rounded-2xl"></div>
           </div>
        ) : (
          <>
            {/* Task 1: The Top 3 Podium */}
            <div className="flex justify-center items-end space-x-2 md:space-x-6 mb-12 transform scale-95 md:scale-100">
               
               {/* Rank 2 */}
               <PodiumCard user={top3[1]} rank={2} delay={0.2} color="#94A3B8" />

               {/* Rank 1 (Center) */}
               <PodiumCard user={top3[0]} rank={1} delay={0.1} color="#F59E0B" isFirst />

               {/* Rank 3 */}
               <PodiumCard user={top3[2]} rank={3} delay={0.3} color="#B45309" />
               
            </div>

            {/* Task 2: The List View (Rank 4+) */}
            <div className="space-y-3">
              {rest.map((user, index) => (
                <motion.div
                  key={user._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + (index * 0.05) }}
                  className="glass-card flex items-center p-4 rounded-xl hover:bg-white/10 transition-colors border-white/5"
                >
                   <div className="w-8 text-center font-bold text-text-secondary">
                      {index + 4}
                   </div>
                   <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center font-bold mx-4 border border-white/10">
                      {user.avatar}
                   </div>
                   <div className="flex-1">
                      <h4 className="font-bold text-white text-sm md:text-base">{user.name}</h4>
                      <div className="flex items-center space-x-2 mt-0.5">
                         <span className="text-[10px] md:text-xs font-bold text-accent-danger bg-accent-danger/10 px-2 py-0.5 rounded border border-accent-danger/20">
                            {user.level.toUpperCase()}
                         </span>
                      </div>
                   </div>
                   <div className="text-right">
                      <div className="font-bold text-white tabular-nums">{user.points.toLocaleString()}</div>
                      <div className="text-xs text-text-secondary">XP</div>
                   </div>
                </motion.div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Task 3: Interactive Statistics Sticky Bar (User Rank) */}
      <motion.div 
         initial={{ y: 100 }}
         animate={{ y: 0 }}
         transition={{ delay: 1, type: "spring", stiffness: 200, damping: 20 }}
         className="fixed bottom-20 md:bottom-24 left-4 right-4 z-40"
      >
         <div className="glass-dock rounded-2xl p-4 max-w-3xl mx-auto backdrop-blur-3xl bg-[#0a0a0a]/90 border-accent-violet/30 shadow-[0_0_30px_rgba(0,0,0,0.5)]">
            <div className="flex items-center justify-between mb-2">
               <div className="flex items-center space-x-4">
                  <div className="text-xs font-bold text-text-secondary uppercase tracking-wider">Your Rank</div>
                  <div className="text-xl font-extrabold text-white">#142</div>
               </div>
               <div className="text-right">
                   <div className="text-sm font-bold text-white">1,250 XP</div>
                   <div className="text-xs text-text-secondary">Next: 2,000 XP</div>
               </div>
            </div>
            
            {/* XP Progress Bar */}
            <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
               <div 
                  className="h-full bg-gradient-to-r from-accent-violet to-indigo-500"
                  style={{ width: '62%' }}
               ></div>
            </div>
         </div>
      </motion.div>

    </div>
  );
};

const PodiumCard = ({ user, rank, delay, color, isFirst = false }) => (
  <motion.div
    initial={{ y: 100, opacity: 0 }}
    animate={{ y: 0, opacity: 1 }}
    transition={{ delay, type: "spring", stiffness: 150, damping: 15 }}
    className={`relative flex flex-col items-center p-4 rounded-2xl glass-card backdrop-blur-2xl border-white/10
       ${isFirst ? 'w-32 md:w-40 h-56 md:h-64 -mt-8 z-10' : 'w-24 md:w-32 h-44 md:h-52 z-0'}
    `}
    style={{
       boxShadow: isFirst ? `0 0 40px ${color}30` : 'none',
       borderColor: isFirst ? `${color}40` : 'rgba(255,255,255,0.1)'
    }}
  >
     {isFirst && (
        <div className="absolute -top-6">
           <Crown size={32} color="#F59E0B" fill="#F59E0B" className="drop-shadow-[0_0_10px_rgba(245,158,11,0.6)] animate-bounce" />
        </div>
     )}

     <div className={`
        rounded-full flex items-center justify-center font-bold text-white border-2 mb-3
        ${isFirst ? 'w-16 h-16 text-2xl border-accent-danger/50 shadow-[0_0_20px_rgba(245,158,11,0.3)]' : 'w-12 h-12 text-lg border-white/20'}
     `}
      style={{ backgroundColor: `${color}20` }}
     >
        {user.avatar}
     </div>
     
     <div className={`font-bold text-white text-center leading-tight mb-1 ${isFirst ? 'text-lg' : 'text-sm'}`}>
        {user.name}
     </div>
     
     <div className="text-xs font-semibold text-text-secondary mb-3">
        {user.level.toUpperCase()}
     </div>

     <div className={`mt-auto font-extrabold text-white tabular-nums ${isFirst ? 'text-xl' : 'text-base'}`}>
        {user.points.toLocaleString()}
     </div>

     <div className="absolute -bottom-3 w-8 h-8 rounded-full flex items-center justify-center font-bold text-white text-sm border border-white/10 shadow-lg"
        style={{ backgroundColor: color }}
     >
        {rank}
     </div>
  </motion.div>
);

export default Leaderboard;
