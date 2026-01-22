import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Shield, AlertTriangle, Users, Navigation, Check, Eye, UserCheck, TrendingDown } from 'lucide-react';
import CountUp from 'react-countup';

const Home = () => {
  const [scrollPos, setScrollPos] = useState(0);
  
  useEffect(() => {
    const handleScroll = () => setScrollPos(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Phone section starts at 800px
  const phoneVisible = scrollPos >= 800;
  
  // Story phases - each 600px
  const getPhase = (start) => Math.min(Math.max((scrollPos - start) / 600, 0), 1);
  const phase1 = getPhase(1200);
  const phase2 = getPhase(1800);
  const phase3 = getPhase(2400);
  const phase4 = getPhase(3000);
  const phase5 = getPhase(3600);

  return (
    <div className="relative bg-[#0a0a0a] text-white selection:bg-violet-500/30">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[30%] w-[1000px] h-[1000px] bg-violet-600/8 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[10%] right-[-5%] w-[800px] h-[800px] bg-indigo-600/6 rounded-full blur-[100px]"></div>
      </div>

      {/* HERO */}
      <section className="h-[100vh] flex flex-col items-center justify-center sticky top-0 z-10">
        <motion.div 
          animate={{ opacity: scrollPos > 500 ? 0 : 1 }}
          className="text-center px-4 max-w-6xl space-y-8"
        >
          <div className="inline-flex items-center space-x-2 bg-red-500/10 border border-red-500/20 rounded-full px-4 py-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute h-full w-full rounded-full bg-red-500 opacity-75"></span>
              <span className="relative rounded-full h-2.5 w-2.5 bg-red-500"></span>
            </span>
            <span className="text-sm font-semibold text-red-400">843 Hazards Detected Today</span>
          </div>

          <h1 className="text-[clamp(2.5rem,8vw,6rem)] font-black tracking-tighter leading-[1.1]">
            <span className="block text-white/90">Roads are Unpredictable.</span>
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-indigo-400">
              Your GPS shouldn't be.
            </span>
          </h1>

          <p className="text-[clamp(1rem,2vw,1.25rem)] text-gray-400 max-w-2xl mx-auto">
            Community-powered navigation that sees what your GPS can't: potholes, accidents, hazards—validated in real-time.
          </p>

          <button className="inline-flex items-center space-x-3 bg-gradient-to-r from-violet-600 to-indigo-600 px-8 py-4 rounded-full font-bold text-lg shadow-[0_0_40px_rgba(139,92,246,0.4)]">
            <Navigation fill="currentColor" size={22} />
            <span>Start Driving Safer</span>
          </button>
        </motion.div>
      </section>

      {/* Spacer */}
      <div className="h-[100vh]"></div>

      {/* PHONE SECTION - STICKY */}
      <div className="relative h-[3400px]">
        <div className="sticky top-[25vh] h-[60vh] flex items-center justify-center z-20">
          
          {/* Tooltips */}
          <Tooltip active={phase1 > 0.2 && phase1 < 0.9} pos="left" color="red" icon={AlertTriangle} title="Pothole Detected" desc="Reported 3 min ago" />
          <Tooltip active={phase2 > 0.2 && phase2 < 0.9} pos="right" color="blue" icon={Shield} title="Police Checkpoint" desc="5 drivers confirmed" />
          <Tooltip active={phase3 > 0.2 && phase3 < 0.9} pos="left" color="orange" icon={AlertTriangle} title="Accident Alert" desc="Right lane blocked" />
          <Tooltip active={phase4 > 0.2 && phase4 < 0.9} pos="right" color="violet" icon={UserCheck} title="Validating" desc="Scout verification" />
          <Tooltip active={phase5 > 0.2} pos="top" color="green" icon={Check} title="Safe Route Active" desc="Avoiding 3 hazards" />

          {/* Phone */}
          <motion.div 
            animate={{
              scale: phoneVisible ? 1 : 0.7,
              opacity: phoneVisible ? 1 : 0
            }}
            className="relative w-[300px] aspect-[9/19] bg-[#0D0D0D] rounded-[2.5rem] border-[6px] border-gray-900 shadow-2xl overflow-hidden"
          >
            <div className="absolute top-3 left-1/2 -translate-x-1/2 w-28 h-7 bg-black rounded-full z-50"></div>
            
            <div className="absolute inset-0 flex flex-col">
              {/* Map */}
              <div className="flex-1 relative bg-[#0a0a0a]">
                <svg className="absolute inset-0 w-full h-full">
                  <motion.path 
                    d="M 170 520 Q 160 480, 155 440 Q 150 400, 165 360 Q 180 320, 170 280 Q 160 240, 175 200 Q 185 160, 170 120"
                    fill="none"
                    stroke="#8B5CF6"
                    strokeWidth="5"
                    strokeDasharray="12,8"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 2 }}
                  />
                </svg>

                {/* Markers */}
                {phase1 > 0 && <Marker top="35%" left="45%" color="red" icon={AlertTriangle} shake={phase1 > 0.2 && phase1 < 0.8} />}
                {phase2 > 0 && <Marker top="50%" left="52%" color="blue" icon={Shield} />}
                {phase3 > 0 && <Marker top="25%" left="48%" color="orange" icon={AlertTriangle} />}
                
                {/* Success overlay */}
                <motion.div animate={{ opacity: phase5 }} className="absolute inset-0 bg-emerald-500/20 flex items-center justify-center">
                  <div className="w-24 h-24 rounded-full bg-emerald-500/20 border-4 border-emerald-500 flex items-center justify-center">
                    <Check className="text-emerald-400" size={48} strokeWidth={3} />
                  </div>
                </motion.div>
              </div>

              {/* Bottom Sheet */}
              <motion.div 
                animate={{ backgroundColor: phase5 > 0.5 ? 'rgba(16,185,129,0.1)' : 'rgba(13,13,13,0.95)' }}
                className="h-44 rounded-t-3xl p-5 border-t border-white/10"
              >
                <div className="w-12 h-1 bg-white/20 rounded-full mx-auto mb-3"></div>
                
                <AnimatePresence mode="wait">
                  {phase1 > 0 && phase2 < 0.3 && <NotifCard key="1" icon={AlertTriangle} color="red" title="Pothole Detected" sub="3 min ago • 98% Confidence" />}
                  {phase2 > 0.3 && phase3 < 0.3 && <NotifCard key="2" icon={Shield} color="blue" title="Police Checkpoint" sub="Verified by 5 drivers" />}
                  {phase3 > 0.3 && phase4 < 0.3 && <NotifCard key="3" icon={AlertTriangle} color="orange" title="Accident Alert" sub="Right lane blocked" />}
                  {phase4 > 0.3 && phase5 < 0.3 && <ValidatingCard key="4" progress={phase4} />}
                  {phase5 > 0.3 && <NotifCard key="5" icon={Check} color="green" title="Route Recalculated" sub="Avoiding 3 hazards • +2 min ETA" success />}
                </AnimatePresence>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* FEATURES */}
      <section className="relative z-30 max-w-6xl mx-auto px-6 py-20 space-y-12">
        <div className="grid md:grid-cols-2 gap-6">
          <ProblemCard icon={Eye} problem="Blind Spots" solution="Real-Time Eyes" desc="14K+ drivers sharing live data" />
          <ProblemCard icon={AlertTriangle} problem="Fake Reports" solution="Scout Verification" desc="2% false positive rate" premium />
        </div>
        
        <div className="p-12 rounded-3xl border border-white/10 bg-gradient-to-br from-violet-500/10 to-indigo-500/5">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <Stat icon={TrendingDown} value={2847} label="Accidents Prevented" />
            <Stat icon={MapPin} value={156} label="Roads Monitored" suffix="K" />
            <Stat icon={Users} value={14205} label="Active Scouts" />
          </div>
        </div>
      </section>

      <footer className="border-t border-white/10 bg-black/90 py-12">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-8">
          <div><h2 className="text-2xl font-bold">SafeRoute</h2><p className="text-gray-500 text-sm">Making roads predictable. © 2026</p></div>
          <div className="text-sm text-gray-400">Built by drivers, for drivers.</div>
        </div>
      </footer>
    </div>
  );
};

const Tooltip = ({ active, pos, color, icon: Icon, title, desc }) => {
  const posMap = { left: '-left-64 top-1/4', right: '-right-64 top-1/2', top: 'left-1/2 -translate-x-1/2 -top-28' };
  const colorMap = {
    red: 'border-red-500/30 bg-red-500/20',
    blue: 'border-blue-500/30 bg-blue-500/20',
    orange: 'border-orange-500/30 bg-orange-500/20',
    violet: 'border-violet-500/30 bg-violet-500/20',
    green: 'border-emerald-500/30 bg-emerald-500/20'
  };
  const iconMap = {
    red: 'bg-red-500/20 text-red-400',
    blue: 'bg-blue-500/20 text-blue-400',
    orange: 'bg-orange-500/20 text-orange-400',
    violet: 'bg-violet-500/20 text-violet-400',
    green: 'bg-emerald-500/20 text-emerald-400'
  };

  return (
    <motion.div animate={{ opacity: active ? 1 : 0 }} className={`absolute ${posMap[pos]} hidden md:block pointer-events-none z-50`}>
      <div className={`bg-[#0D0D0D] border rounded-2xl p-4 max-w-[240px] ${colorMap[color]}`}>
        <div className="flex items-start gap-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${iconMap[color]}`}><Icon size={20} /></div>
          <div><h4 className="font-bold text-white text-sm">{title}</h4><p className="text-xs text-gray-400">{desc}</p></div>
        </div>
      </div>
    </motion.div>
  );
};

const Marker = ({ top, left, color, icon: Icon, shake }) => {
  const colorMap = {
    red: 'bg-red-500/30 border-red-500 shadow-[0_0_25px_rgba(239,68,68,0.6)] text-red-400',
    blue: 'bg-blue-500/30 border-blue-500 shadow-[0_0_25px_rgba(59,130,246,0.6)] text-blue-400',
    orange: 'bg-orange-500/30 border-orange-500 shadow-[0_0_25px_rgba(249,115,22,0.6)] text-orange-400'
  };

  return (
    <motion.div 
      animate={shake ? { x: [-2, 2, -2, 2, 0] } : {}}
      transition={{ repeat: Infinity, duration: 0.5 }}
      style={{ top, left }} 
      className="absolute -translate-x-1/2"
    >
      <div className={`relative w-10 h-10 rounded-full border-2 flex items-center justify-center ${colorMap[color]}`}>
        <Icon size={20} />
        <motion.div animate={{ scale: [1, 1.4, 1], opacity: [0.6, 0, 0.6] }} transition={{ repeat: Infinity, duration: 2 }} className="absolute inset-0 rounded-full bg-current opacity-40" />
      </div>
    </motion.div>
  );
};

const NotifCard = ({ icon: Icon, color, title, sub, success }) => {
  const colorMap = {
    red: 'bg-red-500/20 text-red-400',
    blue: 'bg-blue-500/20 text-blue-400',
    orange: 'bg-orange-500/20 text-orange-400',
    green: 'bg-emerald-500/20 text-emerald-400'
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-3">
      <div className="flex items-center gap-3">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${colorMap[color]}`}><Icon size={24} /></div>
        <div><h4 className={`font-bold text-base ${success ? 'text-emerald-400' : 'text-white'}`}>{title}</h4><p className="text-xs text-gray-400">{sub}</p></div>
      </div>
      {!success && <div className="flex gap-2">
        <button className="h-11 flex-1 bg-white/10 rounded-xl text-sm font-bold text-gray-300"><span>✕</span> Ignore</button>
        <button className={`h-11 flex-1 rounded-xl text-sm font-bold text-white ${color === 'red' ? 'bg-violet-600' : color === 'blue' ? 'bg-blue-600' : 'bg-orange-600'}`}><span>✓</span> Confirm</button>
      </div>}
      {success && <div className="h-11 bg-emerald-600/20 border border-emerald-500/30 rounded-xl flex items-center justify-center gap-2 text-sm font-bold text-emerald-400"><Check size={18} /> Safe Route Active</div>}
    </motion.div>
  );
};

const ValidatingCard = ({ progress }) => (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
    <div className="flex items-center gap-3">
      <div className="w-12 h-12 rounded-xl bg-violet-500/20 flex items-center justify-center text-violet-400"><UserCheck size={24} /></div>
      <div><h4 className="font-bold text-white text-base">Validating Reports</h4><p className="text-xs text-gray-400">Scout verification...</p></div>
    </div>
    <div className="h-2 bg-white/10 rounded-full overflow-hidden">
      <motion.div className="h-full bg-gradient-to-r from-violet-600 to-indigo-600" animate={{ width: progress > 0.3 ? '100%' : '0%' }} transition={{ duration: 1.5 }} />
    </div>
  </motion.div>
);

const ProblemCard = ({ icon: Icon, problem, solution, desc, premium }) => {
  const [show, setShow] = useState(false);
  return (
    <div onClick={() => setShow(!show)} className={`p-8 rounded-3xl border cursor-pointer ${premium ? 'border-violet-500/30 bg-gradient-to-br from-violet-500/10 to-indigo-500/5' : 'border-white/10 bg-white/5'}`}>
      <AnimatePresence mode="wait">
        {!show ? (
          <motion.div key="prob" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="w-14 h-14 rounded-2xl bg-red-500/20 text-red-400 flex items-center justify-center mb-4"><Icon size={28} /></div>
            <h3 className="text-2xl font-bold text-white mb-3">The Problem: {problem}</h3>
            <p className="text-gray-400">Traditional GPS can't see hazards. You're driving blind.</p>
            <p className="text-violet-400 font-semibold text-sm mt-4">Tap to see solution →</p>
          </motion.div>
        ) : (
          <motion.div key="sol" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="w-14 h-14 rounded-2xl bg-violet-500/20 text-violet-400 flex items-center justify-center mb-4"><Icon size={28} /></div>
            <h3 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-violet-400 to-indigo-400 mb-3">SafeRoute: {solution}</h3>
            <p className="text-gray-300">{desc}</p>
            <p className="text-gray-500 font-semibold text-sm mt-4">Tap to see problem →</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const Stat = ({ icon: Icon, value, label, suffix = '' }) => (
  <div className="space-y-3">
    <div className="w-12 h-12 rounded-xl bg-violet-500/20 text-violet-400 flex items-center justify-center mx-auto"><Icon size={24} /></div>
    <div className="text-5xl font-black text-white font-mono"><CountUp end={value} duration={2.5} separator="," />{suffix}</div>
    <div className="text-xs text-gray-400 uppercase tracking-widest">{label}</div>
  </div>
);

export default Home;