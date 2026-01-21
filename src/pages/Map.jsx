import { useState, useEffect, useCallback } from 'react';
import HazardMap from '../components/map/HazardMap';
import ReportDrawer from '../components/hazards/ReportDrawer';
import HazardDetails from '../components/hazards/HazardDetails';
import { getNearbyHazards } from '../services/hazardService';
import { Plus, Layers, Filter, Compass, Navigation } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useLocation } from 'react-router-dom';
import { toast } from 'react-hot-toast';

const HAZARD_TYPES = [
  { id: 'pothole', label: 'Pothole', color: '#F59E0B', emoji: '🕳️' },
  { id: 'accident', label: 'Accident', color: '#EF4444', emoji: '🚨' },
  { id: 'roadblock', label: 'Roadblock', color: '#F59E0B', emoji: '🚧' },
  { id: 'police', label: 'Police', color: '#3B82F6', emoji: '👮' },
];

const MapPage = () => {
  const { user } = useAuth();
  const location = useLocation();
  const [userLocation, setUserLocation] = useState(null);
  const [hazards, setHazards] = useState([]);
  
  // UI States
  const [showFilters, setShowFilters] = useState(false);
  const [isReportDrawerOpen, setIsReportDrawerOpen] = useState(false);
  const [selectedHazard, setSelectedHazard] = useState(null);
  const [filters, setFilters] = useState({
    pothole: true, accident: true, roadblock: true, waterlogging: true, police: true
  });

  // Handle Query Params
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('report') === 'true') setIsReportDrawerOpen(true);
  }, [location.search]);

  // Real-time location
  useEffect(() => {
    if (!navigator.geolocation) {
      toast.error('Geolocation not supported');
      return;
    }
    const watchId = navigator.geolocation.watchPosition(
      (pos) => setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      (err) => console.error('Geo error:', err),
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  // Fetch hazards
  const fetchHazards = useCallback(async () => {
    if (!userLocation) return;
    try {
      const res = await getNearbyHazards(userLocation.lat, userLocation.lng, 10);
      setHazards(res.data);
    } catch (e) {
      console.error('Fetch hazards error:', e);
    }
  }, [userLocation]);

  useEffect(() => {
    if (userLocation) {
      fetchHazards();
      const timer = setInterval(fetchHazards, 15000);
      return () => clearInterval(timer);
    }
  }, [userLocation, fetchHazards]);

  const toggleFilter = (type) => setFilters(prev => ({...prev, [type]: !prev[type]}));

  const displayedHazards = hazards.filter(h => filters[h.type.replace('_', '')] !== false);

  return (
    <div className="relative w-full h-[calc(100vh-0px)] overflow-hidden bg-bg-primary">
      
      {/* 1. Full Screen Map */}
      <div className="absolute inset-0 z-0">
         <HazardMap 
           userLocation={userLocation}
           hazards={displayedHazards}
           onMarkerClick={(h) => setSelectedHazard(h)}
           selectedHazard={selectedHazard}
         />
         {/* Map Overlay Gradient for Cinematic Feel */}
         <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-bg-primary/40 via-transparent to-bg-primary/80"></div>
      </div>

      {/* 2. Map Controls (Right Side) - Minimalist Glass Circles */}
      <div className="absolute right-4 top-28 flex flex-col space-y-3 z-30">
        
        {/* Toggle Filters */}
        <div className="relative">
           <motion.button
             whileTap={{ scale: 0.9 }}
             onClick={() => setShowFilters(!showFilters)}
             className={`w-12 h-12 rounded-full glass-panel flex items-center justify-center text-white hover:bg-white/10 transition-colors ${showFilters ? 'border-primary text-primary' : ''}`}
           >
             <Filter size={20} />
           </motion.button>
           
           {/* Filters Popout */}
           <AnimatePresence>
             {showFilters && (
               <motion.div
                 initial={{ opacity: 0, x: 20 }}
                 animate={{ opacity: 1, x: 0 }}
                 exit={{ opacity: 0, x: 20 }}
                 className="absolute right-14 top-0 glass-panel rounded-2xl p-4 w-48"
               >
                 <h4 className="text-xs font-bold text-text-secondary uppercase mb-3">Filter Hazards</h4>
                 <div className="space-y-2">
                   {HAZARD_TYPES.map(type => (
                     <div key={type.id} onClick={() => toggleFilter(type.id)} className="flex items-center justify-between cursor-pointer group">
                        <div className="flex items-center space-x-2">
                          <span style={{color: type.color}}>{type.emoji}</span>
                          <span className={`text-sm ${filters[type.id] ? 'text-white' : 'text-text-secondary'}`}>{type.label}</span>
                        </div>
                        <div className={`w-2 h-2 rounded-full ${filters[type.id] ? 'bg-primary' : 'bg-white/10'}`}></div>
                     </div>
                   ))}
                 </div>
               </motion.div>
             )}
           </AnimatePresence>
        </div>

        {/* Locate Me */}
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => {
             // Logic handled inside map component typically, but we can emit event or just rely on auto-center
             toast.success("Centering...");
          }}
          className="w-12 h-12 rounded-full glass-panel flex items-center justify-center text-white hover:bg-white/10 transition-colors"
        >
          <Navigation size={20} />
        </motion.button>

        {/* Layer/Style Toggle (Future) */}
        <motion.button
          whileTap={{ scale: 0.9 }}
          className="w-12 h-12 rounded-full glass-panel flex items-center justify-center text-white hover:bg-white/10 transition-colors"
        >
          <Layers size={20} />
        </motion.button>
      </div>

      {/* 3. Floating Action Button (FAB) for Reporting */}
      <div className="absolute bottom-24 right-5 z-40">
        <motion.button
          onClick={() => setIsReportDrawerOpen(true)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="w-16 h-16 rounded-full bg-gradient-to-r from-primary to-violet-400 text-white shadow-[0_0_30px_rgba(139,92,246,0.5)] flex items-center justify-center border border-white/20"
        >
          <Plus size={32} />
        </motion.button>
      </div>

      {/* 4. Report Drawer */}
      <ReportDrawer
        isOpen={isReportDrawerOpen}
        onClose={() => setIsReportDrawerOpen(false)}
        userLocation={userLocation}
        onSuccess={fetchHazards}
        hazardTypes={HAZARD_TYPES}
      />

      {/* 5. Hazard Details Bottom Sheet */}
      <AnimatePresence>
        {selectedHazard && (
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="absolute bottom-4 left-4 right-4 z-50 glass-panel rounded-3xl overflow-hidden max-h-[80vh] md:max-w-md md:left-1/2 md:-translate-x-1/2"
            style={{ borderBottom: 0, borderBottomLeftRadius: '24px', borderBottomRightRadius: '24px' }}
          >
            <div className="w-12 h-1 rounded-full bg-white/20 mx-auto mt-3 mb-1"></div>
            <HazardDetails 
              hazard={selectedHazard} 
              onClose={() => setSelectedHazard(null)} 
              onUpdate={fetchHazards}
            />
          </motion.div>
        )}
      </AnimatePresence>
    
    </div>
  );
};

export default MapPage;
