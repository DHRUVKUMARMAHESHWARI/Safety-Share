import { useRef, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import L from 'leaflet';
import PropTypes from 'prop-types';
import styles from './HazardMap.module.css';

// Fix for default Leaflet marker icons not loading in webpack/vite environments sometimes
// (Though we are using divIcons, good to have just in case)
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

const defaultCenter = [28.6139, 77.2090]; // New Delhi [lat, lng]

// Component to handle map center updates
const MapUpdater = ({ center }) => {
    const map = useMap();
    useEffect(() => {
        if (center) {
            map.setView(center, map.getZoom()); // Keep current zoom
        }
    }, [center, map]);
    return null;
};

MapUpdater.propTypes = {
    center: PropTypes.arrayOf(PropTypes.number)
};

const HazardMap = ({ 
    userLocation, 
    hazards, 
    onMapLoad, 
    onMarkerClick, 
    selectedHazard 
}) => {
  const mapRef = useRef(null);

  // Convert userLocation obj {lat, lng} to array [lat, lng]
  const center = userLocation ? [userLocation.lat, userLocation.lng] : defaultCenter;

  const getMarkerIcon = (type, severity) => {
      let color = '#ef4444';
      if (type === 'pothole') color = '#f97316';
      if (type === 'construction') color = '#eab308';
      if (type === 'police_checking') color = '#3b82f6';
      if (type === 'waterlogging') color = '#06b6d4';
      
      const size = severity === 'critical' ? 24 : severity === 'high' ? 20 : 16;
      
      return L.divIcon({
          className: styles.customMarker,
          html: `<div class="${styles.markerCircle}" style="background-color: ${color}; width: ${size}px; height: ${size}px;"></div>`,
          iconSize: [size, size],
          iconAnchor: [size/2, size/2] // Center
      });
  };

  const userIcon = L.divIcon({
      className: styles.customMarker,
      html: `<div class="${styles.userLocationMarker}"></div>`,
      iconSize: [20, 20],
      iconAnchor: [10, 10]
  });

  return (
    <div className={styles.mapContainer}>
        <MapContainer 
            center={center} 
            zoom={15} 
            style={{ width: '100%', height: '100%' }}
            zoomControl={false}
            ref={mapRef}
            whenCreated={(map) => {
                mapRef.current = map;
                if (onMapLoad) onMapLoad(map);
            }}
        >
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            
            <MapUpdater center={!selectedHazard ? center : null} />

            {/* User Location Marker */}
            {userLocation && (
                <Marker 
                    position={[userLocation.lat, userLocation.lng]} 
                    icon={userIcon}
                />
            )}

            {/* Hazard Markers */}
            {hazards.map((hazard) => (
                <Marker
                    key={hazard._id}
                    position={[hazard.location.coordinates[1], hazard.location.coordinates[0]]}
                    icon={getMarkerIcon(hazard.type, hazard.severity)}
                    eventHandlers={{
                        click: () => onMarkerClick(hazard),
                    }}
                />
            ))}
        </MapContainer>
    </div>
  );
};

HazardMap.propTypes = {
  userLocation: PropTypes.object,
  hazards: PropTypes.array,
  onMapLoad: PropTypes.func,
  onMarkerClick: PropTypes.func,
  selectedHazard: PropTypes.object,
  onCloseInfo: PropTypes.func
};

export default HazardMap;
