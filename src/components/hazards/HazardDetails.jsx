import PropTypes from 'prop-types';
import { formatDistanceToNow } from 'date-fns';
import { FaCheck, FaTimes, FaMapSigns, FaThumbsUp, FaThumbsDown } from 'react-icons/fa';
import { validateHazard } from '../../services/hazardService';
import toast from 'react-hot-toast';
import styles from './HazardDetails.module.css';

const HazardDetails = ({ hazard, onClose, onUpdate }) => {
    if (!hazard) return null;
    
    const getSeverityColor = (s) => {
        if(s === 'critical') return '#ef4444';
        if(s === 'high') return '#f97316';
        return '#3b82f6';
    }

    const handleAction = async (action) => {
        try {
            // For validation we need current location. 
            // In a real app we'd get this from navigator.geolocation freshly
            // Let's assume we pass what we have or get it now.
            navigator.geolocation.getCurrentPosition(async (pos) => {
                const loc = { lat: pos.coords.latitude, lng: pos.coords.longitude };
                await validateHazard(hazard._id, action, loc);
                toast.success(`Vote recorded: ${action}`);
                if (onUpdate) onUpdate(); // Refresh map/data
            }, () => {
                toast.error('Location needed to validate');
            });
        } catch (error) {
            toast.error(error.response?.data?.error || 'Action failed');
        }
    }

    const confirmCount = hazard.confirmations?.length || 0;
    const rejectCount = hazard.rejections?.length || 0;
    const score = confirmCount - rejectCount;

    return (
        <div className={styles.panel}>
            <div className={styles.header}>
                <h2 className={styles.title}>{hazard.type.replace('_', ' ').toUpperCase()}</h2>
                <button onClick={onClose} className={styles.closeBtn}><FaTimes /></button>
            </div>
            
            <div className={styles.badge} style={{ backgroundColor: getSeverityColor(hazard.severity) }}>
                {hazard.severity} severity
            </div>

            <div className={styles.meta}>
                <span>Reported {formatDistanceToNow(new Date(hazard.createdAt))} ago</span>
                <span>•</span>
                <span>{Math.round(hazard.distanceMeters || 0)}m away</span>
            </div>

            {hazard.photoUrl && (
                <div className={styles.imageContainer}>
                     <img src={`${import.meta.env.VITE_API_URL.replace('/api', '')}${hazard.photoUrl}`} alt="Hazard" />
                </div>
            )}

            <p className={styles.description}>
                {hazard.description || 'No description provided.'}
            </p>

            <div className={styles.stats}>
                <div className={styles.statItem}>
                    <FaThumbsUp className={styles.iconGood} /> {confirmCount}
                </div>
                <div className={styles.statItem}>
                    <FaThumbsDown className={styles.iconBad} /> {rejectCount}
                </div>
                <div className={styles.statItem}>
                    Confidence: {score > 0 ? 'High' : 'Low'}
                </div>
            </div>

            <div className={styles.actions}>
                <button className={styles.actionBtn} onClick={() => handleAction('confirm')}>
                    <FaCheck /> Confirm
                </button>
                <button className={styles.actionBtn} onClick={() => handleAction('reject')}>
                    <FaTimes /> Not There
                </button>
                <button className={styles.actionBtn} onClick={() => window.open(`https://www.google.com/maps/dir/?api=1&destination=${hazard.location.coordinates[1]},${hazard.location.coordinates[0]}`)} >
                    <FaMapSigns /> Navigate
                </button>
            </div>
        </div>
    );
};

HazardDetails.propTypes = {
    hazard: PropTypes.object,
    onClose: PropTypes.func.isRequired,
    onUpdate: PropTypes.func
};

export default HazardDetails;
