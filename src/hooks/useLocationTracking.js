import { useState, useEffect, useRef } from 'react';
import { updateTracking } from '../services/trackingService';

const useLocationTracking = (onAlertsReceived, shouldTrack = true) => {
    const [location, setLocation] = useState(null);
    const [speed, setSpeed] = useState(0);
    const [heading, setHeading] = useState(0);
    const [isMoving, setIsMoving] = useState(false);
    const [error, setError] = useState(null);
    
    // Refs for calculating speed/heading if not provided by browser
    const lastPositionRef = useRef(null);
    const isTrackingRef = useRef(false);

    // Helper to calculate distance
    const calculateDistance = (lat1, lon1, lat2, lon2) => {
        const R = 6371e3; // metres
        const φ1 = lat1 * Math.PI/180;
        const φ2 = lat2 * Math.PI/180;
        const Δφ = (lat2-lat1) * Math.PI/180;
        const Δλ = (lon2-lon1) * Math.PI/180;
        const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
                Math.cos(φ1) * Math.cos(φ2) *
                Math.sin(Δλ/2) * Math.sin(Δλ/2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        return R * c;
    }

    useEffect(() => {
        if (!navigator.geolocation) {
            setError('Geolocation is not supported');
            return;
        }

        const success = async (position) => {
            const { latitude, longitude, speed: geoSpeed, heading: geoHeading } = position.coords;
            const now = Date.now();
            
            const newLocation = { lat: latitude, lng: longitude };
            
            // Speed calculation fallback
            let currentSpeed = geoSpeed; // in m/s
            let currentHeading = geoHeading;

            if (currentSpeed === null && lastPositionRef.current) {
                const { lat: lastLat, lng: lastLng, timestamp: lastTime } = lastPositionRef.current;
                const dist = calculateDistance(lastLat, lastLng, latitude, longitude);
                const timeDiff = (now - lastTime) / 1000; // seconds
                if (timeDiff > 0) {
                    currentSpeed = dist / timeDiff;
                }
            }
            
            // Normalize speed to km/h for logic checks
            const speedKmh = (currentSpeed || 0) * 3.6;
            const moving = speedKmh > 5;

            setLocation(newLocation);
            setSpeed(speedKmh);
            setHeading(currentHeading || 0); // Keep 0 if null
            setIsMoving(moving);

            // Store for next loop
            lastPositionRef.current = { lat: latitude, lng: longitude, timestamp: now };

            // Send update to server only if tracking is enabled and user is authenticated (shouldTrack)
            if (isTrackingRef.current && shouldTrack) {
                 try {
                     const result = await updateTracking({
                         location: newLocation,
                         speed: currentSpeed || 0, // send m/s
                         heading: currentHeading || 0,
                         isMoving: moving,
                         routePolyline: '' // TODO: Integration with navigation context to get polyline
                     });
                     
                     if (result.success && result.alerts && result.alerts.length > 0) {
                         onAlertsReceived(result.alerts);
                     }
                 } catch (err) {
                     // Silent fail for now to avoid console spam if auth token expired mid-session
                     if (err.response && err.response.status !== 401) {
                        console.error("Tracking update failed", err);
                     }
                 }
            }
        };

        const watchId = navigator.geolocation.watchPosition(success, (err) => setError(err.message), {
            enableHighAccuracy: true,
            maximumAge: 2000,
            timeout: 5000
        });

        isTrackingRef.current = true; // Start tracking immediately

        return () => {
            isTrackingRef.current = false;
            navigator.geolocation.clearWatch(watchId);
        };
    }, [shouldTrack]); // Re-run if auth state changes

    return { location, speed, heading, isMoving, error };
};

export default useLocationTracking;
