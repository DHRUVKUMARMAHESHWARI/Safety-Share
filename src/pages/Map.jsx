import { useState, useEffect, useCallback } from 'react';
import HazardMap from '../components/map/HazardMap';
import ReportHazardModal from '../components/hazards/ReportHazardModal';
import HazardDetails from '../components/hazards/HazardDetails';
import { getNearbyHazards } from '../services/hazardService';
import { FaPlus, FaBell, FaCog, FaLayerGroup, FaDotCircle } from 'react-icons/fa';
import { AlertTriangle, Construction, Droplet, Shield, X, MapPin } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useLocation } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import styles from './MapPage.module.css';

const HAZARD_TYPES = [
    { id: 'pothole', label: 'Pothole', color: '#f97316', icon: Construction },
    { id: 'accident', label: 'Accident', color: '#ef4444', icon: AlertTriangle },
    { id: 'roadblock', label: 'Roadblock', color: '#eab308', icon: AlertTriangle }, // reusing icon for generic warning
    { id: 'waterlogging', label: 'Flooding', color: '#06b6d4', icon: Droplet },
    { id: 'police', label: 'Police', color: '#3b82f6', icon: Shield }
];

const MapPage = () => {
  const { user } = useAuth();
  const location = useLocation();
  const [userLocation, setUserLocation] = useState(null);
  const [hazards, setHazards] = useState([]);
  
  // UI States
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSidePanelOpen, setIsSidePanelOpen] = useState(true);
  const [isReporting, setIsReporting] = useState(false);
  const [selectedHazard, setSelectedHazard] = useState(null);
  const [filters, setFilters] = useState({
      pothole: true, accident: true, roadblock: true, waterlogging: true, police: true
  });
  
  // Presetting report type from Radial Menu
  const [preSelectedType, setPreSelectedType] = useState(null);

  // Handle Query Params
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('report') === 'true') {
        setIsReporting(true);
    }
    if (params.get('validate') === 'true') {
        toast('Tap on a nearby marker to validate it!', { icon: '🔍' });
    }
  }, [location.search]);

  // Real-time location
  useEffect(() => {
    if (!navigator.geolocation) return;
    const watchId = navigator.geolocation.watchPosition(
      (pos) => setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      (err) => console.error(err),
      { enableHighAccuracy: true, timeout: 10000 }
    );
    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  // Use dummy location for dev if needed
  useEffect(() => {
     if(!userLocation) {
         // Default to New Delhi centers if location denied/not prompt yet
         // setUserLocation({ lat: 28.6139, lng: 77.2090 });
     }
  }, [userLocation]);

  // Fetch Logic
  const fetchHazards = useCallback(async () => {
      if (!userLocation) return;
      try {
          const res = await getNearbyHazards(userLocation.lat, userLocation.lng, 10);
          setHazards(res.data);
      } catch (e) {
          console.error(e);
      }
  }, [userLocation]);

  useEffect(() => {
      if(userLocation) {
          fetchHazards();
          const timer = setInterval(fetchHazards, 15000);
          return () => clearInterval(timer);
      }
  }, [userLocation, fetchHazards]);

  // Handlers
  const toggleFilter = (type) => {
      setFilters(prev => ({...prev, [type]: !prev[type]}));
  };

  const handleFabClick = () => {
      setIsMenuOpen(!isMenuOpen);
  };

  const initReport = (type) => {
      setPreSelectedType(type);
      setIsMenuOpen(false);
      setIsReporting(true);
      setSelectedHazard(null);
  };

  // Filter hazards for display
  const displayedHazards = hazards.filter(h => filters[h.type.replace('_', '')] !== false); // subtle logic fix for type names matching filter keys

  return (
    <div className={styles.container}>
      {/* 1. Full Screen Map */}
      <HazardMap 
        userLocation={userLocation}
        hazards={displayedHazards}
        onMarkerClick={(h) => setSelectedHazard(h)}
        selectedHazard={selectedHazard}
      />

      {/* 2. Floating Top Bar */}
      <div className={styles.topBar}>
          <div className={styles.topBarElement}>
              <div className={styles.userChip}>
                  <div className={styles.avatar}>{user?.name?.charAt(0) || 'G'}</div>
                  <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>{user?.name || 'Guest'}</span>
              </div>
          </div>
          
          <div className={styles.topBarElement} onClick={() => setIsSidePanelOpen(!isSidePanelOpen)} style={{cursor:'pointer'}}>
             <FaLayerGroup color="#6b7280" />
          </div>
      </div>

      {/* 3. Floating Side Panel (Filters & Stats) */}
      <AnimatePresence>
          {isSidePanelOpen && (
              <motion.div 
                 className={styles.sidePanel}
                 initial={{ x: -350, opacity: 0 }}
                 animate={{ x: 0, opacity: 1 }}
                 exit={{ x: -350, opacity: 0 }}
                 transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              >
                  <div className={styles.panelSection}>
                      <h3>Quick Stats</h3>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                          <div className="card" style={{ padding: '12px', textAlign: 'center', background: '#f9fafb' }}>
                              <strong style={{ fontSize: '1.2rem', color: '#6366f1' }}>{hazards.length}</strong>
                              <p style={{ fontSize: '0.75rem', color: '#6b7280' }}>Nearby Hazards</p>
                          </div>
                          <div className="card" style={{ padding: '12px', textAlign: 'center', background: '#f9fafb' }}>
                              <strong style={{ fontSize: '1.2rem', color: '#10b981' }}>Safe</strong>
                              <p style={{ fontSize: '0.75rem', color: '#6b7280' }}>Route Status</p>
                          </div>
                      </div>
                  </div>

                  <div className={styles.panelSection}>
                      <h3>Filters</h3>
                      {HAZARD_TYPES.map(type => (
                          <div key={type.id} className={styles.filterRow} onClick={() => toggleFilter(type.id)}>
                              <div className={styles.filterLabel}>
                                  <div className={styles.dot} style={{ background: type.color }}></div>
                                  {type.label}
                              </div>
                              <div style={{ 
                                  width: '40px', height: '22px', 
                                  background: filters[type.id] ? '#6366f1' : '#e5e7eb', 
                                  borderRadius: '20px', position: 'relative', transition: 'all 0.3s' 
                              }}>
                                  <div style={{ 
                                      width: '18px', height: '18px', background: 'white', borderRadius: '50%', 
                                      position: 'absolute', top: '2px', left: filters[type.id] ? '20px' : '2px', transition: 'all 0.3s'
                                  }}></div>
                              </div>
                          </div>
                      ))}
                  </div>

                  <div className={styles.panelSection}>
                      <h3>View Options</h3>
                      <button className="btn btn-secondary" style={{ width: '100%', fontSize: '0.9rem' }}>
                          <MapPin size={16} /> My Reports
                      </button>
                  </div>
              </motion.div>
          )}
      </AnimatePresence>

      {/* 4. FAB & Radial Menu */}
      <div className={styles.fabContainer}>
          <AnimatePresence>
              {isMenuOpen && (
                  <div className={styles.radialMenu}>
                      {HAZARD_TYPES.map((type, i) => (
                          <motion.div 
                             key={type.id}
                             className={styles.menuItem}
                             initial={{ opacity: 0, x: 20, scale: 0.8 }}
                             animate={{ opacity: 1, x: 0, scale: 1 }}
                             exit={{ opacity: 0, scale: 0.5 }}
                             transition={{ delay: i * 0.05 }}
                          >
                              <span className={styles.menuLabel}>{type.label}</span>
                              <button 
                                className={styles.menuBtn} 
                                style={{ background: type.color }}
                                onClick={() => initReport(type.id)}
                              >
                                  <type.icon size={20} />
                              </button>
                          </motion.div>
                      ))}
                  </div>
              )}
          </AnimatePresence>

          <motion.button 
             className={`${styles.fab} ${isMenuOpen ? styles.fabActive : ''}`}
             onClick={handleFabClick}
             whileTap={{ scale: 0.9 }}
          >
              {isMenuOpen ? <X size={24} /> : <FaPlus size={24} />}
          </motion.button>
      </div>

      {/* 5. Reporting Modal */}
      {isReporting && userLocation && (
        <ReportHazardModal 
            location={userLocation}
            preSelectedType={preSelectedType} // Need to update Modal to accept this
            onClose={() => setIsReporting(false)}
            onSuccess={fetchHazards}
        />
      )}

      {/* 6. Hazard Details Panel (Replaces generic modal) */}
      <AnimatePresence>
        {selectedHazard && (
            <motion.div 
               className={styles.bottomSheet}
               initial={{ y: '100%' }}
               animate={{ y: 0 }}
               exit={{ y: '100%' }}
               transition={{ type: 'spring', damping: 25, stiffness: 300 }}
               style={{ transform: 'none' }} // Override specific style if needed
            >
                <div className={styles.sheetHandle}></div>
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
