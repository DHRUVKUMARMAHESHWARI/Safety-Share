import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Construction, AlertTriangle, Shield, Camera, MapPin } from 'lucide-react';
import PropTypes from 'prop-types';
import { reportHazard } from '../../services/hazardService';
import toast from 'react-hot-toast';

const ReportDrawer = ({ isOpen, onClose, userLocation, onSuccess, hazardTypes }) => {
  const [selectedType, setSelectedType] = useState(null);
  const [severity, setSeverity] = useState('medium');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const iconMap = {
    pothole: Construction,
    accident: AlertTriangle,
    roadblock: AlertTriangle,
    police_checking: Shield,
  };

  const handleTypeSelect = (typeId) => {
    setSelectedType(typeId);
  };

  const handleSubmit = async () => {
    if (!selectedType) {
      toast.error('Please select a hazard type');
      return;
    }

    if (!userLocation) {
      toast.error('Location not available');
      return;
    }

    setIsSubmitting(true);

    const formData = new FormData();
    formData.append('type', selectedType);
    formData.append('severity', severity);
    formData.append('description', description || `${selectedType} reported`);
    formData.append('location', JSON.stringify({
      lat: userLocation.lat,
      lng: userLocation.lng
    }));

    try {
      await reportHazard(formData);

      toast.success('Hazard reported successfully!');
      setSelectedType(null);
      setDescription('');
      setSeverity('medium');
      onClose();
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error('Error reporting hazard:', error);
      toast.error('Failed to report hazard');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
          />

          {/* Drawer */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 z-50 glass-card rounded-t-3xl max-h-[85vh] overflow-y-auto"
          >
            {/* Handle & Header - Solid Background for Readability */}
            <div className="sticky top-0 bg-[#050505] z-10 pt-3 pb-4 px-6 border-b border-white/10 shadow-xl">
              <div className="w-12 h-1.5 bg-white/20 rounded-full mx-auto mb-4" />
              
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-display font-bold text-white tracking-tight">Quick Report</h2>
                  <p className="text-sm text-gray-400 mt-1">Help keep roads safe for everyone</p>
                </div>
                <button
                  onClick={onClose}
                  className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all duration-200"
                >
                  <X size={20} className="text-white" />
                </button>
              </div>
            </div>

            {/* Content - Added pb-32 for Button Visibility */}
            <div className="p-6 pb-32 space-y-8 bg-[#050505]">
              {/* Hazard Type Selection */}
              <div className="space-y-3">
                <label className="text-sm font-semibold text-gray-300 uppercase tracking-wider">Select Hazard Type</label>
                <div className="grid grid-cols-2 gap-3">
                  {hazardTypes.map((type) => {
                    const Icon = iconMap[type.id] || AlertTriangle;
                    const isSelected = selectedType === type.id;
                    
                    return (
                      <motion.button
                        key={type.id}
                        onClick={() => handleTypeSelect(type.id)}
                        whileTap={{ scale: 0.95 }}
                        className={`relative p-4 rounded-2xl transition-all duration-200 ${
                          isSelected
                            ? 'bg-white/10 border-2 shadow-lg shadow-violet-500/10'
                            : 'bg-white/5 border border-white/10 hover:bg-white/10'
                        }`}
                        style={{
                          borderColor: isSelected ? type.color : 'rgba(255,255,255,0.1)',
                        }}
                      >
                        <div className="flex flex-col items-center space-y-2">
                          <div
                            className={`w-14 h-14 rounded-full flex items-center justify-center transition-all duration-200 ${
                              isSelected ? 'scale-110' : ''
                            }`}
                            style={{
                              backgroundColor: isSelected ? type.color : 'rgba(255,255,255,0.1)',
                              boxShadow: isSelected ? `0 0 20px ${type.color}40` : 'none'
                            }}
                          >
                            <Icon size={24} className="text-white" />
                          </div>
                          <span
                            className={`text-sm font-semibold transition-colors ${
                              isSelected ? 'text-white' : 'text-gray-400'
                            }`}
                          >
                            {type.label}
                          </span>
                        </div>
                        
                        {/* Selected Indicator */}
                        {isSelected && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="absolute top-2 right-2 w-6 h-6 rounded-full bg-white flex items-center justify-center shadow-sm"
                          >
                            <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: type.color }} />
                          </motion.div>
                        )}
                      </motion.button>
                    );
                  })}
                </div>
              </div>

              {/* Severity Selection */}
              {selectedType && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-3"
                >
                  <label className="text-sm font-semibold text-gray-300 uppercase tracking-wider">Severity Level</label>
                  <div className="flex space-x-2">
                    {['low', 'medium', 'high', 'critical'].map((level) => (
                      <button
                        key={level}
                        onClick={() => setSeverity(level)}
                        className={`flex-1 py-3 rounded-xl font-semibold text-sm transition-all duration-200 border ${
                          severity === level
                            ? 'bg-[#8B5CF6] border-[#8B5CF6] text-white shadow-lg shadow-violet-500/20'
                            : 'bg-white/5 border-transparent text-gray-400 hover:bg-white/10'
                        }`}
                      >
                        {level.charAt(0).toUpperCase() + level.slice(1)}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Description */}
              {selectedType && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="space-y-3"
                >
                  <label className="text-sm font-semibold text-gray-300 uppercase tracking-wider">
                    Additional Details
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Provide more details about this hazard..."
                    rows={3}
                    className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-accent-violet transition-colors placeholder-gray-600 resize-none"
                  />
                </motion.div>
              )}

              {/* Location Info */}
              {userLocation && (
                <div className="flex items-center space-x-3 p-4 rounded-xl bg-white/5 border border-white/10">
                  <div className="w-10 h-10 rounded-full bg-[#8B5CF6]/20 flex items-center justify-center text-[#8B5CF6]">
                     <MapPin size={20} />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-white">Current Location</p>
                    <p className="text-xs text-gray-400 font-mono mt-0.5">
                      {userLocation.lat.toFixed(6)}, {userLocation.lng.toFixed(6)}
                    </p>
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <button
                onClick={handleSubmit}
                disabled={!selectedType || isSubmitting}
                className={`w-full py-4 text-lg font-bold rounded-xl transition-all shadow-lg active:scale-95 ${
                    !selectedType || isSubmitting 
                    ? 'bg-white/10 text-gray-500 cursor-not-allowed' 
                    : 'bg-gradient-to-r from-accent-violet to-indigo-600 text-white shadow-violet-500/30 hover:shadow-violet-500/50'
                }`}
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Reporting...</span>
                  </div>
                ) : (
                  'Report Hazard'
                )}
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

ReportDrawer.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  userLocation: PropTypes.shape({
    lat: PropTypes.number.isRequired,
    lng: PropTypes.number.isRequired,
  }),
  onSuccess: PropTypes.func,
  hazardTypes: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      color: PropTypes.string.isRequired,
    })
  ).isRequired,
};

export default ReportDrawer;
