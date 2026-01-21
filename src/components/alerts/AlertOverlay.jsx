import { useAlerts } from '../../context/AlertContext/AlertContext';
import { FaExclamationTriangle, FaTimes, FaVolumeUp, FaVolumeMute, FaCarCrash, FaRoad, FaWater, FaHardHat } from 'react-icons/fa';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import styles from './AlertOverlay.module.css';

const ICON_MAP = {
    pothole: FaExclamationTriangle,
    accident: FaCarCrash,
    roadblock: FaRoad,
    police_checking: FaExclamationTriangle,
    waterlogging: FaWater,
    construction: FaHardHat
};

const AlertOverlay = () => {
    const { activeAlert, dismissAlert, tracking, isVoiceEnabled, toggleVoice } = useAlerts();
    const [progress, setProgress] = useState(100);

    // Auto dismiss countdown
    useEffect(() => {
        if (activeAlert) {
            setProgress(100);
            const duration = 8000; // 8s
            const interval = 100;
            const step = (100 * interval) / duration;
            
            const timer = setInterval(() => {
                setProgress(prev => {
                    if (prev <= 0) {
                        clearInterval(timer);
                        dismissAlert();
                        return 0;
                    }
                    return prev - step;
                });
            }, interval);

            return () => clearInterval(timer);
        }
    }, [activeAlert, dismissAlert]);

    if (!activeAlert) return null;

    const isMoving = tracking.isMoving;
    const Icon = ICON_MAP[activeAlert.type] || FaExclamationTriangle;

    // Movement: Slide down/up variants
    const overlayVariants = {
        hidden: { opacity: 0, y: -50 },
        visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 30 } },
        exit: { opacity: 0, y: -50 }
    };

    // Full Card: Scale in
    const cardVariants = {
        hidden: { opacity: 0, scale: 0.8 },
        visible: { opacity: 1, scale: 1, transition: { type: 'spring' } },
        exit: { opacity: 0, scale: 0.8 }
    }

    // --- DRIVING MODE (Minimal Banner) ---
    // Show banner if moving OR if specifically set to banner mode
    // Requirement said: "Floating alert banner at top when moving"
    if (isMoving) {
        return (
            <AnimatePresence>
                <div className={styles.bannerContainer}>
                     <motion.div 
                        className={`${styles.banner} ${styles[activeAlert.severity]}`}
                        variants={overlayVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        drag="y"
                        dragConstraints={{ top: -100, bottom: 0 }}
                        onDragEnd={(_, info) => { if (info.offset.y < -50) dismissAlert() }}
                     >
                         <div className={styles.iconPulseWrapper}>
                             <div className={`${styles.pulseRing} ${styles['ring-'+activeAlert.severity]}`}></div>
                             <Icon size={24} className={styles.bannerIcon} />
                         </div>
                         
                         <div className={styles.bannerContent}>
                             <div className={styles.bannerTitle}>
                                 {activeAlert.type.replace('_', ' ').toUpperCase()} 
                                 <span className={styles.distBadge}>{Math.round(activeAlert.distance)}m</span>
                             </div>
                             <div className={styles.bannerSub}>{activeAlert.severity} severity</div>
                         </div>
                         
                         <div className={styles.bannerActions}>
                             <button onClick={dismissAlert} className={styles.closeBtn}>
                                 <FaTimes />
                             </button>
                             {/* Mini circular progress */}
                             <div style={{ width: 24, height: 24 }}>
                                 <CircularProgressbar 
                                    value={progress} 
                                    styles={buildStyles({ pathColor: 'rgba(0,0,0,0.3)', trailColor: 'transparent' })} 
                                 />
                             </div>
                         </div>
                     </motion.div>
                </div>
            </AnimatePresence>
        );
    }

    // --- STATIONARY MODE (Full Card Overlay) ---
    return (
        <AnimatePresence>
            <div className={styles.overlayBackdrop}>
                 <motion.div 
                    className={`${styles.card} ${styles['card-'+activeAlert.severity]}`}
                    variants={cardVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                 >
                     {/* Header with Distance Ring & Icon */}
                     <div className={styles.cardHeader}>
                         <div className={styles.distanceRingWrapper}>
                             <CircularProgressbar 
                                value={progress} 
                                text={`${Math.round(activeAlert.distance)}m`}
                                styles={buildStyles({ 
                                    pathColor: 'white', 
                                    trailColor: 'rgba(255,255,255,0.2)',
                                    textColor: 'white',
                                    textSize: '22px'
                                })} 
                             />
                         </div>
                         <div className={styles.mainIconWrapper}>
                             <motion.div 
                                animate={{ scale: [1, 1.2, 1] }} 
                                transition={{ repeat: Infinity, duration: 1.5 }}
                             >
                                 <Icon size={48} color="white" />
                             </motion.div>
                         </div>
                     </div>

                     <div className={styles.cardBody}>
                         <h2 className={styles.cardTitle}>{activeAlert.type.replace('_', ' ').toUpperCase()}</h2>
                         <p className={styles.cardSubtitle}>Approaching {activeAlert.severity} hazard</p>
                     </div>

                     <div className={styles.cardActions}>
                         <button onClick={toggleVoice} className={styles.actionIconBtn}>
                             {isVoiceEnabled ? <FaVolumeUp /> : <FaVolumeMute />}
                         </button>
                         <button onClick={dismissAlert} className={styles.dismissBigBtn}>
                             I SEE IT
                         </button>
                     </div>
                 </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default AlertOverlay;
