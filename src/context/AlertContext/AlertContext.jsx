import { createContext, useContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import useLocationTracking from '../../hooks/useLocationTracking';
import useVoiceAlert from '../../hooks/useVoiceAlert';
import { useAuth } from '../AuthContext';
import { toast } from 'react-hot-toast';

const AlertContext = createContext(null);

export const AlertProvider = ({ children }) => {
    const [currentAlerts, setCurrentAlerts] = useState([]);
    const [alertHistory, setAlertHistory] = useState([]);
    const [activeAlert, setActiveAlert] = useState(null);
    const { speak, playSound, isVoiceEnabled, toggleVoice } = useVoiceAlert();

    const handleNewAlerts = (newAlerts) => {
        // newAlerts comes from the server response
        if (!newAlerts || newAlerts.length === 0) return;
        
        // Take the highest priority alert
        // Sort by severity (critical > high) and distance (closest first)
        const sorted = [...newAlerts].sort((a,b) => {
             const severityScore = { critical: 3, high: 2, medium: 1, low: 0 };
             if (severityScore[b.severity] !== severityScore[a.severity]) {
                 return severityScore[b.severity] - severityScore[a.severity];
             }
             return a.distance - b.distance;
        });
        
        const topAlert = sorted[0];
        
        if (topAlert) {
            setActiveAlert(topAlert);
            addToHistory(topAlert);
            
            // Trigger Voice/Sound
            if (topAlert.alertLevel === 'urgent') {
                playSound('alarm');
                speak(topAlert.voiceMessage, 'urgent');
            } else if (topAlert.alertLevel === 'warning') {
                playSound('beep');
                speak(topAlert.voiceMessage);
            } else {
                playSound('chime');
            }
        }
        
        setCurrentAlerts(newAlerts);
    };

    const addToHistory = (alert) => {
        setAlertHistory(prev => {
            const newHistory = [
                { ...alert, timestamp: new Date().toISOString() }, 
                ...prev
            ].slice(0, 10); // Keep last 10
            
            localStorage.setItem('alertHistory', JSON.stringify(newHistory));
            return newHistory;
        });
    };

    // Load history on mount
    useEffect(() => {
        const saved = localStorage.getItem('alertHistory');
        if (saved) setAlertHistory(JSON.parse(saved));
    }, []);

    const dismissAlert = () => {
        setActiveAlert(null);
    };

    const { user } = useAuth();

    // Use custom hook to start tracking logic
    // We pass handleNewAlerts as callback and user presence as condition
    const tracking = useLocationTracking(handleNewAlerts, !!user);

    return (
        <AlertContext.Provider value={{
            activeAlert,
            dismissAlert,
            alertHistory,
            currentAlerts,
            isVoiceEnabled,
            toggleVoice,
            tracking // Expose tracking info (speed, isMoving) to UI
        }}>
            {children}
        </AlertContext.Provider>
    );
};

AlertProvider.propTypes = {
    children: PropTypes.node.isRequired
};

export const useAlerts = () => useContext(AlertContext);
