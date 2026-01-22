import { useState, useEffect, useCallback, useRef } from 'react';
import HazardMap from '../components/map/HazardMap';
import ReportDrawer from '../components/hazards/ReportDrawer';
import HazardDetails from '../components/hazards/HazardDetails';
import { getNearbyHazards } from '../services/hazardService';
import { Plus, Layers, Filter, Navigation } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useLocation } from 'react-router-dom';
import { toast } from 'react-hot-toast';

const HAZARD_TYPES = [
  { id: 'pothole', label: 'Pothole', color: '#F59E0B', emoji: '🕳️' },
  { id: 'accident', label: 'Accident', color: '#EF4444', emoji: '🚨' },
  { id: 'roadblock', label: 'Roadblock', color: '#F59E0B', emoji: '🚧' },
  { id: 'police', label: 'Police', color: '#3B82F6', emoji: '👮' },
  { id: 'waterlogging', label: 'Water Logging', color: '#06B6D4', emoji: '🌊' },
  { id: 'construction', label: 'Construction', color: '#F97316', emoji: '🏗️' },
];

const MapPage = () => {
  const { user } = useAuth();
  const location = useLocation();
  const [userLocation, setUserLocation] = useState(null);
  const [hazards, setHazards] = useState([]);
  const watchIdRef = useRef(null);
  
  // UI States
  const [showFilters, setShowFilters] = useState(false);
  const [isReportDrawerOpen, setIsReportDrawerOpen] = useState(false);
  const [selectedHazard, setSelectedHazard] = useState(null);
  const [filters, setFilters] = useState({
    pothole: true, accident: true, roadblock: true, waterlogging: true, police: true, construction: true
  });

  // Handle Query Params
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('report') === 'true') setIsReportDrawerOpen(true);
  }, [location.search]);

  // Robust Geolocation Handler
  const startWatchingLocation = useCallback(() => {
      if (!navigator.geolocation) {
          toast.error('Geolocation not supported');
          return;
      }

      // Clear existing watch if any
      if (watchIdRef.current) navigator.geolocation.clearWatch(watchIdRef.current);

      const success = (pos) => {
          setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
      };

      const error = (err) => {
          console.warn('High Accuracy Geo failed, retrying low accuracy...', err);
          if (err.code === 3) { // Timeout
              // Retry with low accuracy
               navigator.geolocation.getCurrentPosition(
                  success, 
                  (e) => toast.error('Location failed: ' + e.message),
                  { enableHighAccuracy: false, timeout: 10000 }
               );
          }
      };

      // Try High Accuracy first
      watchIdRef.current = navigator.geolocation.watchPosition(
          success,
          error,
          { enableHighAccuracy: true, timeout: 15000, maximumAge: 5000 }
      );
  }, []);

  useEffect(() => {
      startWatchingLocation();
      return () => {
          if (watchIdRef.current) navigator.geolocation.clearWatch(watchIdRef.current);
      };
  }, [startWatchingLocation]);

  // Recenter Handler
  const handleRecenter = () => {
      if (userLocation) {
          // Force MapUpdater to see a change or just rely on passed prop if HazardMap handles it
          // Actually, we pass userLocation to HazardMap. 
          // If we want to force flyTo, we might need to temporarily clear center or set a flag,
          // OR better: call getCurrentPosition again to ensure freshness and update state
          toast('Locating...', { icon: '🛰️' });
          navigator.geolocation.getCurrentPosition(
              (pos) => {
                  setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
                  // HazardMap detects change in userLocation and usually centers if logic allows
                  // We can pass a "forceCenter" prop or timestamp if needed, but usually update is enough
              },
              (err) => {
                  toast.error("Couldn't find you. Check GPS settings.");
              },
              { enableHighAccuracy: true, timeout: 5000 }
          );
      } else {
          startWatchingLocation(); // Try restarting the watch
      }
  };

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
  const displayedHazards = hazards.filter(h => {
      // Handle snake_case to matches keys in filters
      const key = h.type === 'police_checking' ? 'police' : h.type;
      return filters[key] !== false;
  });

  return (
    <div className="relative w-full h-[100dvh] overflow-hidden bg-bg-primary">
      
      {/* 1. Full Screen Map */}
      <div className="absolute inset-0 z-0">
         <HazardMap 
           userLocation={userLocation}
           hazards={displayedHazards}
           onMarkerClick={(h) => setSelectedHazard(h)}
           selectedHazard={selectedHazard}
           // Pass timestamp to force re-render/center if strictly needed, or handle in component
           recenterTrigger={Date.now()} 
         />
         {/* Subtle Overlay */}
         <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-bg-primary/20 via-transparent to-transparent h-32"></div>
      </div>

      {/* 2. Map Controls (Right Side) */}
      <div className="absolute right-4 top-28 flex flex-col space-y-3 z-30">
        <div className="relative">
           <ControlBtn onClick={() => setShowFilters(!showFilters)} active={showFilters}>
             <Filter size={20} />
           </ControlBtn>
           
           <AnimatePresence>
             {showFilters && (
               <motion.div
                 initial={{ opacity: 0, x: 20 }}
                 animate={{ opacity: 1, x: 0 }}
                 exit={{ opacity: 0, x: 20 }}
                 className="absolute right-14 top-0 glass-card rounded-2xl p-4 w-48 backdrop-blur-3xl"
               >
                 <h4 className="text-xs font-bold text-text-secondary uppercase mb-3 text-left">Map Filters</h4>
                 <div className="space-y-2">
                   {HAZARD_TYPES.map(type => (
                     <div key={type.id} onClick={() => toggleFilter(type.id)} className="flex items-center justify-between cursor-pointer group hover:bg-white/5 p-1 rounded transition-colors">
                        <div className="flex items-center space-x-2">
                          <span>{type.emoji}</span>
                          <span className={`text-sm ${filters[type.id] ? 'text-white' : 'text-text-secondary'}`}>{type.label}</span>
                        </div>
                        <div className={`w-2 h-2 rounded-full transition-colors ${filters[type.id] ? 'bg-accent-violet' : 'bg-white/10'}`}></div>
                     </div>
                   ))}
                 </div>
               </motion.div>
             )}
           </AnimatePresence>
        </div>

        <ControlBtn onClick={handleRecenter}>
          <Navigation size={20} className={!userLocation ? "opacity-50" : ""} />
        </ControlBtn>

        <ControlBtn>
          <Layers size={20} />
        </ControlBtn>
      </div>

      {/* 3. Redesigned FAB */}
      <div className="absolute bottom-24 right-5 z-40">
        <motion.button
          onClick={() => setIsReportDrawerOpen(true)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="w-14 h-14 rounded-full glass-card flex items-center justify-center text-white border border-accent-violet/50 shadow-[0_4px_20px_rgba(139,92,246,0.3)] bg-gradient-to-br from-accent-violet/20 to-indigo-600/20 backdrop-blur-md hover:border-accent-violet transition-all duration-300"
        >
          <Plus size={28} className="text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]" />
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

      {/* 5. Hazard Details */}
      <AnimatePresence>
        {selectedHazard && (
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="absolute bottom-4 left-4 right-4 z-50 glass-card rounded-3xl overflow-hidden max-h-[80vh] md:max-w-md md:left-1/2 md:-translate-x-1/2 border-t border-white/10"
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

const ControlBtn = ({ children, onClick, active }) => (
  <motion.button
     whileTap={{ scale: 0.9 }}
     onClick={onClick}
     className={`w-11 h-11 rounded-full glass-card flex items-center justify-center hover:bg-white/10 transition-colors border-white/5 shadow-lg ${active ? 'text-accent-violet border-accent-violet/50' : 'text-white'}`}
  >
    {children}
  </motion.button>
);

export default MapPage;
