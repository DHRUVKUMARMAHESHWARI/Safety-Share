import PropTypes from 'prop-types';
import { formatDistanceToNow } from 'date-fns';
import { Navigation, Clock, ChevronDown } from 'lucide-react';
import ValidationCard from './ValidationCard';

const HazardDetails = ({ hazard, onClose, onUpdate }) => {
    if (!hazard) return null;

    const navigateTo = () => {
        window.open(`https://www.google.com/maps/dir/?api=1&destination=${hazard.location.coordinates[1]},${hazard.location.coordinates[0]}`, '_blank');
    };

    return (
        <div className="flex flex-col h-full text-white max-h-[75vh]">
            {/* Header / Drag Handle Area */}
            <div className="flex items-center justify-between px-5 pt-4 pb-2 shrink-0">
               {/* Drag Handle (Visual Only) */}
               <div className="w-12 h-1.5 rounded-full bg-white/20 absolute left-1/2 -translate-x-1/2 top-3"></div>
               
               {/* Close Button - Explicit */}
               <div className="ml-auto">
                   <button 
                     onClick={onClose}
                     className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-white transition-colors"
                   >
                       <ChevronDown size={24} />
                   </button>
               </div>
            </div>

            {/* Scrollable Content */}
            <div className="overflow-y-auto px-5 pb-24 scrollbar-hide">
                {/* Validation Card (The Interaction Core) */}
                <ValidationCard hazard={hazard} onClose={onClose} onUpdate={onUpdate} />

                <div className="h-px bg-white/10 my-4" />

                {/* Additional Details */}
                <div className="space-y-4">
                    <div className="flex items-start justify-between">
                        <div>
                        <h4 className="font-bold text-sm text-text-secondary mb-1">Description</h4>
                        <p className="text-sm leading-relaxed text-gray-200">
                            {hazard.description || 'No additional details provided.'}
                        </p>
                        </div>
                    </div>

                    {hazard.photoUrl && (
                        <div className="rounded-xl overflow-hidden border border-white/10 h-48 w-full shrink-0">
                        <img 
                            src={`${import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000'}${hazard.photoUrl}`} 
                            alt="Hazard Evidence" 
                            className="w-full h-full object-cover"
                        />
                        </div>
                    )}

                    <div className="flex items-center justify-between text-xs text-text-secondary">
                        <div className="flex items-center space-x-1">
                            <Clock size={14} />
                            <span>{formatDistanceToNow(new Date(hazard.createdAt), { addSuffix: true })}</span>
                        </div>
                        {hazard.distanceMeters && (
                        <span>{Math.round(hazard.distanceMeters)}m away</span>
                        )}
                    </div>

                    <button 
                    onClick={navigateTo}
                    className="w-full py-4 rounded-xl border border-white/10 hover:bg-white/5 transition-colors flex items-center justify-center space-x-2 font-bold text-sm mb-4"
                    >
                        <Navigation size={18} />
                        <span>Navigate There</span>
                    </button>
                    
                    {/* Extra padding to ensure bottom nav doesn't cover content */}
                    <div className="h-4"></div>
                </div>
            </div>
        </div>
    );
};

HazardDetails.propTypes = {
    hazard: PropTypes.object,
    onClose: PropTypes.func,
    onUpdate: PropTypes.func
};

export default HazardDetails;
