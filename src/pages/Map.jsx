import { useState, useEffect, useCallback } from 'react';
import HazardMap from '../components/map/HazardMap';
import ReportDrawer from '../components/hazards/ReportDrawer';
import HazardDetails from '../components/hazards/HazardDetails';
import { getNearbyHazards } from '../services/hazardService';
import { Plus, X, Layers, User as UserIcon } from 'lucide-react';
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
  const [isSidePanelOpen, setIsSidePanelOpen] = useState(() => window.innerWidth > 768);
  const [isReportDrawerOpen, setIsReportDrawerOpen] = useState(false);
  const [selectedHazard, setSelectedHazard] = useState(null);
  const [filters, setFilters] = useState({
    pothole: true, 
    accident: true, 
    roadblock: true, 
    waterlogging: true, 
    police: true
  });

  // Handle Query Params
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('report') === 'true') {
      setIsReportDrawerOpen(true);
    }
    if (params.get('validate') === 'true') {
      toast('Tap on a nearby marker to validate it!', { icon: '🔍' });
    }
  }, [location.search]);

  // Real-time location with smooth updates
  useEffect(() => {
    if (!navigator.geolocation) {
      toast.error('Geolocation is not supported by your browser');
      return;
    }

    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        setUserLocation({ 
          lat: pos.coords.latitude, 
          lng: pos.coords.longitude 
        });
      },
      (err) => {
        console.error('Geolocation error:', err);
        toast.error('Unable to get your location');
      },
      { 
        enableHighAccuracy: true, 
        timeout: 10000,
        maximumAge: 0
      }
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
      console.error('Error fetching hazards:', e);
    }
  }, [userLocation]);

  useEffect(() => {
    if (userLocation) {
      fetchHazards();
      const timer = setInterval(fetchHazards, 15000);
      return () => clearInterval(timer);
    }
  }, [userLocation, fetchHazards]);

  // Handlers
  const toggleFilter = (type) => {
    setFilters(prev => ({...prev, [type]: !prev[type]}));
  };

  // Filter hazards for display
  const displayedHazards = hazards.filter(h => 
    filters[h.type.replace('_', '')] !== false
  );

  return (
    <div className="relative w-full h-screen overflow-hidden bg-[#0D0D0D]">
      {/* Full Screen Map */}
      <HazardMap 
        userLocation={userLocation}
        hazards={displayedHazards}
        onMarkerClick={(h) => setSelectedHazard(h)}
        selectedHazard={selectedHazard}
      />

      {/* Floating Top Bar */}
      <div className="absolute top-4 left-4 right-4 z-20 flex items-center justify-between">
        {/* User Chip */}
        <div className="glass-card rounded-full px-4 py-2 flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-br from-[#8B5CF6] to-[#C084FC] rounded-full flex items-center justify-center">
            <span className="text-white font-semibold text-sm">
              {user?.name?.charAt(0).toUpperCase() || 'G'}
            </span>
          </div>
          <span className="text-sm font-semibold text-white">
            {user?.name || 'Guest'}
          </span>
        </div>

        {/* Filter Toggle */}
        <button
          onClick={() => setIsSidePanelOpen(!isSidePanelOpen)}
          className="glass-card rounded-full w-10 h-10 flex items-center justify-center hover:bg-white/10 transition-all duration-200"
        >
          <Layers size={20} className="text-white" />
        </button>
      </div>

      {/* Side Panel - Filters & Stats */}
      <AnimatePresence>
        {isSidePanelOpen && (
          <motion.div
            initial={{ x: -350, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -350, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="absolute top-20 left-4 z-20 w-80 max-h-[calc(100vh-6rem)] overflow-y-auto"
          >
            <div className="glass-card rounded-2xl p-6 space-y-6">
              {/* Quick Stats */}
              <div className="space-y-3">
                <h3 className="text-lg font-display font-bold text-white">Quick Stats</h3>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-white/5 rounded-xl p-4 text-center border border-white/10">
                    <div className="text-2xl font-bold text-[#8B5CF6]">{hazards.length}</div>
                    <div className="text-xs text-gray-400 mt-1">Nearby Hazards</div>
                  </div>
                  <div className="bg-white/5 rounded-xl p-4 text-center border border-white/10">
                    <div className="text-2xl font-bold text-[#10B981]">Safe</div>
                    <div className="text-xs text-gray-400 mt-1">Route Status</div>
                  </div>
                </div>
              </div>

              {/* Filters */}
              <div className="space-y-3">
                <h3 className="text-lg font-display font-bold text-white">Filters</h3>
                <div className="space-y-2">
                  {HAZARD_TYPES.map(type => (
                    <div 
                      key={type.id}
                      onClick={() => toggleFilter(type.id)}
                      className="flex items-center justify-between p-3 rounded-lg bg-white/5 hover:bg-white/10 cursor-pointer transition-all duration-200 border border-white/10"
                    >
                      <div className="flex items-center space-x-3">
                        <div 
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: type.color }}
                        />
                        <span className="text-sm font-medium text-white">{type.label}</span>
                      </div>
                      
                      {/* Toggle Switch */}
                      <div 
                        className={`w-11 h-6 rounded-full transition-all duration-300 relative ${
                          filters[type.id] ? 'bg-[#8B5CF6]' : 'bg-white/20'
                        }`}
                      >
                        <div 
                          className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-all duration-300 ${
                            filters[type.id] ? 'left-5' : 'left-0.5'
                          }`}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Action Button (FAB) */}
      <div className="absolute bottom-24 right-6 z-30">
        <motion.button
          onClick={() => setIsReportDrawerOpen(!isReportDrawerOpen)}
          whileTap={{ scale: 0.9 }}
          className={`w-16 h-16 rounded-full flex items-center justify-center shadow-2xl transition-all duration-300 ${
            isReportDrawerOpen 
              ? 'bg-red-500 rotate-45' 
              : 'bg-gradient-to-br from-[#8B5CF6] to-[#C084FC]'
          }`}
          style={{
            boxShadow: isReportDrawerOpen 
              ? '0 8px 32px rgba(239, 68, 68, 0.5)' 
              : '0 8px 32px rgba(139, 92, 246, 0.5)'
          }}
        >
          <Plus size={28} className="text-white" />
        </motion.button>
      </div>

      {/* Report Drawer */}
      <ReportDrawer
        isOpen={isReportDrawerOpen}
        onClose={() => setIsReportDrawerOpen(false)}
        userLocation={userLocation}
        onSuccess={fetchHazards}
        hazardTypes={HAZARD_TYPES}
      />

      {/* Hazard Details Bottom Sheet */}
      <AnimatePresence>
        {selectedHazard && (
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="absolute bottom-0 left-0 right-0 z-40 glass-card rounded-t-3xl"
          >
            {/* Handle */}
            <div className="w-12 h-1.5 bg-white/30 rounded-full mx-auto mt-3 mb-4" />
            
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
