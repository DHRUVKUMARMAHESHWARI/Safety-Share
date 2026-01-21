import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaDownload, FaTimes } from 'react-icons/fa';
import styles from './InstallPrompt.module.css';

const InstallPrompt = () => {
    const [deferredPrompt, setDeferredPrompt] = useState(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        window.addEventListener('beforeinstallprompt', (e) => {
            // Prevent Chrome 67 and earlier from automatically showing the prompt
            e.preventDefault();
            // Stash the event so it can be triggered later.
            setDeferredPrompt(e);
            
            // Show prompt after a delay if not already installed (check simple boolean)
            // Ideally check local storage if user dismissed it before
            const hasDismissed = localStorage.getItem('installPromptDismissed');
            if (!hasDismissed) {
                setTimeout(() => setIsVisible(true), 3000); // Show after 3s
            }
        });
    }, []);

    const handleInstallClick = async () => {
        if (!deferredPrompt) return;
        // Show the prompt
        deferredPrompt.prompt();
        // Wait for the user to respond to the prompt
        const { outcome } = await deferredPrompt.userChoice;
        if (outcome === 'accepted') {
            console.log('User accepted the A2HS prompt');
        } else {
            console.log('User dismissed the A2HS prompt');
        }
        setDeferredPrompt(null);
        setIsVisible(false);
    };

    const handleDismiss = () => {
        setIsVisible(false);
        localStorage.setItem('installPromptDismissed', 'true');
    };

    if (!isVisible) return null;

    return (
        <AnimatePresence>
            <motion.div 
               className={styles.overlay}
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
            >
                <motion.div 
                   className={styles.card}
                   initial={{ y: 50, scale: 0.9 }}
                   animate={{ y: 0, scale: 1 }}
                >
                    <div className={styles.iconArea}>
                        <div className={styles.appIcon}>SR</div>
                    </div>
                    <div className={styles.content}>
                        <h3>Install SafeRoute</h3>
                        <p>Get the full experience with offline maps and instant alerts.</p>
                    </div>
                    <div className={styles.actions}>
                        <button onClick={handleDismiss} className={styles.linkDismiss}>Maybe later</button>
                        <button onClick={handleInstallClick} className={styles.btnInstall}>
                            <FaDownload /> Install App
                        </button>
                    </div>
                    <button onClick={handleDismiss} className={styles.closeBtn}><FaTimes /></button>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default InstallPrompt;
