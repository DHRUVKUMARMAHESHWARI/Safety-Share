import { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, X } from 'lucide-react';
import { validateHazard } from '../../services/hazardService';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const ValidationCard = ({ hazard, onClose, onUpdate }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  // Determine if user has already voted or is the reporter
  const reporterId = hazard.reportedBy?._id || hazard.reportedBy;
  const isReporter = user?._id === reporterId || user?.id === reporterId;
  
  const hasConfirmed = hazard.confirmations?.some(c => c.userId === user?._id || c.userId === user?.id);
  const hasRejected = hazard.rejections?.some(r => r.userId === user?._id || r.userId === user?.id);
  const hasVoted = hasConfirmed || hasRejected;

  const canVote = !isReporter && !hasVoted;

  const handleValidation = async (action) => {
    if (!canVote) return;
    
    setLoading(true);
    try {
      await validateHazard(hazard._id, action);
      
      if (action === 'confirm') {
         toast.success("Thanks for confirming! +10 XP");
      } else {
         toast("Marked as resolved", { icon: '🧹' });
      }

      onUpdate && onUpdate();
      // Don't close immediately, let them see the state change? Or close?
      // Closing is better UX usually
      setTimeout(() => onClose && onClose(), 500);
      
    } catch (error) {
       console.error(error);
       toast.error(error.response?.data?.error || "Validation failed");
    } finally {
       setLoading(false);
    }
  };

  const confirmCount = hazard.confirmations?.length || 0;
  const score = confirmCount + 1; // +1 includes reporter
  const confidence = Math.min((score / 5) * 100, 100); 

  const getHazardIcon = (type) => {
    switch(type) {
        case 'pothole': return { emoji: '🕳️' };
        case 'accident': return { emoji: '🚨' };
        case 'police': 
        case 'police_checking': return { emoji: '👮' };
        case 'roadblock': return { emoji: '🚧' };
        case 'waterlogging': return { emoji: '🌊' };
        case 'construction': return { emoji: '🏗️' };
        default: return { emoji: '⚠️' };
    }
  }

  return (
    <div className="p-1">
       <div className="flex items-center space-x-4 mb-4">
           <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl bg-white/10 border border-white/10`}>
              {getHazardIcon(hazard.type).emoji}
           </div>
           <div>
               <h3 className="font-bold text-lg text-white capitalize">{hazard.type.replace('_', ' ')}</h3>
               <p className="text-xs text-text-secondary">
                   Reported by {hazard.reportedBy?.name || 'Unknown User'} 
                   {isReporter && <span className="ml-2 text-accent-violet font-bold">(You)</span>}
               </p>
           </div>
       </div>

       {/* Trust Indicator */}
       <div className="mb-6 bg-white/5 p-3 rounded-xl border border-white/5">
           <div className="flex justify-between text-xs font-semibold text-text-secondary mb-1">
               <span>Community Confidence</span>
               <span>{score} verifications</span>
           </div>
           <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
               <div 
                 className={`h-full rounded-full transition-all duration-500 ${confidence > 70 ? 'bg-green-500' : confidence > 30 ? 'bg-accent-violet' : 'bg-yellow-500'}`}
                 style={{ width: `${confidence}%` }}
               ></div>
           </div>
       </div>

       {/* Actions */}
       <div className="flex gap-3">
           <button 
             onClick={() => handleValidation('confirm')}
             disabled={loading || !canVote}
             className={`flex-1 py-3 rounded-xl font-bold flex items-center justify-center space-x-2 transition-all active:scale-95 shadow-lg
                ${hasConfirmed 
                    ? 'bg-green-500 text-white cursor-default' 
                    : canVote 
                        ? 'bg-accent-violet hover:bg-violet-600 text-white shadow-violet-500/20' 
                        : 'bg-white/5 text-gray-500 cursor-not-allowed border border-white/5'
                }
             `}
           >
               {loading && !hasVoted ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : (
                   <>
                     <Check size={20} />
                     <span>{hasConfirmed ? 'Confirmed' : 'It\'s there'}</span>
                   </>
               )}
           </button>
           
           <button 
             onClick={() => handleValidation('resolve')}
             disabled={loading || !canVote}
             className={`flex-1 py-3 rounded-xl font-bold flex items-center justify-center space-x-2 transition-all active:scale-95 border
                ${hasRejected 
                    ? 'bg-red-500/20 border-red-500/50 text-white cursor-default'
                    : canVote 
                        ? 'bg-white/10 hover:bg-white/20 text-white border-white/10' 
                        : 'bg-white/5 text-gray-500 cursor-not-allowed border-white/5'
                }
             `}
           >
              <X size={20} className={hasRejected ? "text-white" : "text-gray-300"} />
              <span>{hasRejected ? 'Voted No' : 'Resolved'}</span>
           </button>
       </div>
       
       {!canVote && (
           <p className="text-center text-xs text-text-secondary mt-3">
               {isReporter ? "You reported this hazard." : "You have already voted on this report."}
           </p>
       )}
    </div>
  );
};

export default ValidationCard;
