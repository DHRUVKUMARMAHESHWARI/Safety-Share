import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaWifi, FaCloudDownloadAlt } from 'react-icons/fa';

const OfflineBanner = () => {
    const [isOnline, setIsOnline] = useState(navigator.onLine);

    useEffect(() => {
        const handleOnline = () => setIsOnline(true);
        const handleOffline = () => setIsOnline(false);

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    if (isOnline) return null;

    return (
        <AnimatePresence>
            {!isOnline && (
                <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    style={{
                        background: '#1f2937',
                        color: 'white',
                        textAlign: 'center',
                        fontSize: '0.85rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        padding: '8px',
                        position: 'fixed',
                        top: 0, 
                        left: 0, 
                        right: 0,
                        zIndex: 10000
                    }}
                >
                    <FaWifi style={{ opacity: 0.7 }} /> 
                    You are offline. Maps will work in previously visited areas.
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default OfflineBanner;
