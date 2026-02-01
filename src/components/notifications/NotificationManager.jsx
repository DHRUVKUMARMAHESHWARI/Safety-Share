import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { subscribeToPushNotifications } from '../../services/pushService';

const NotificationManager = () => {
    const [isSubscribed, setIsSubscribed] = useState(false);

    useEffect(() => {
        // Check initial status
        if ('serviceWorker' in navigator && 'PushManager' in window) {
             navigator.serviceWorker.ready.then(registration => {
                 registration.pushManager.getSubscription().then(subscription => {
                     setIsSubscribed(!!subscription);
                 });
             });
        }
    }, []);

    const handleSubscribe = async () => {
        const success = await subscribeToPushNotifications();
        if (success) {
            setIsSubscribed(true);
            toast.success("Notifications Enabled!");
        } else {
            toast.error("Failed to enable notifications. Please check your browser settings or reload.");
        }
    };

    if (isSubscribed) return null; // Don't show if already done

    return (
        <div className="fixed bottom-20 left-4 right-4 z-50 md:left-auto md:right-4 md:w-80">
            <div className="bg-[#1e1e1e] border border-white/10 rounded-xl p-4 shadow-xl flex items-center justify-between">
                <div>
                    <h4 className="text-white font-bold text-sm">Enable Alerts</h4>
                    <p className="text-gray-400 text-xs">Get notified about nearby hazards.</p>
                </div>
                <button 
                    onClick={handleSubscribe}
                    className="bg-primary text-white text-xs font-bold px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                >
                    Enable
                </button>
            </div>
        </div>
    );
};

export default NotificationManager;
