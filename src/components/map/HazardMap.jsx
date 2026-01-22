import { useRef, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import L from 'leaflet';
import PropTypes from 'prop-types';
import 'leaflet/dist/leaflet.css';

// Custom dark mode tile layer (CartoDB Dark Matter)
const DARK_MODE_TILES = 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';
const DARK_MODE_ATTRIBUTION = '&copy; OpenStreetMap &copy; CARTO';

const defaultCenter = [28.6139, 77.2090]; // New Delhi Fallback

// Map updater for smooth animations
// Map updater for smooth animations
const MapUpdater = ({ center, selectedHazard, recenterTrigger }) => {
  const map = useMap();

  useEffect(() => {
    if (selectedHazard) {
      const pos = [
        selectedHazard.location.coordinates[1],
        selectedHazard.location.coordinates[0],
      ];
      map.flyTo(pos, 17, { duration: 1.5, easeLinearity: 0.25 });
    } else if (center) {
      // Don't fly on every small update, maybe pan?
      // flyTo is good for big jumps. For tracking, maybe setView or panTo is better?
      // But flyTo is cinematically smooth.
      map.flyTo(center, map.getZoom(), { duration: 1 });
    }
  }, [center, selectedHazard, map, recenterTrigger]);

  return null;
};

MapUpdater.propTypes = {
  center: PropTypes.array,
  selectedHazard: PropTypes.object,
    recenterTrigger: PropTypes.any,
};

// Main map content component
const MapContent = ({
  center,
  hazards,
  userLocation,
  selectedHazard,
  onMarkerClick,
  mapRef,
    recenterTrigger,
}) => {
  
  const getMarkerIcon = (type, severity) => {
    let color = '#EF4444'; // Red (Accident/Critical)
    let emoji = '⚠️';

    switch (type) {
        case 'pothole': color = '#F59E0B'; emoji = '🕳️'; break;
        case 'roadblock': color = '#F59E0B'; emoji = '🚧'; break;
        case 'police': 
        case 'police_checking': color = '#3B82F6'; emoji = '👮'; break;
        case 'waterlogging': color = '#06B6D4'; emoji = '🌊'; break;
        case 'construction': color = '#F97316'; emoji = '🏗️'; break;
        case 'accident': color = '#EF4444'; emoji = '🚨'; break;
        default: break;
    }

    // Critical/High severity -> Larger ripple
    const isPulse = severity === 'critical' || severity === 'high';

    return L.divIcon({
      className: 'custom-marker', // Base class to remove leaflet defaults
      html: `
        <div class="epicenter-marker" style="color: ${color}">
          <div class="epicenter-core">${emoji}</div>
          ${isPulse ? '<div class="epicenter-ripple pulse-animation"></div>' : '<div class="epicenter-ripple" style="width: 40px; height: 40px; opacity: 0.1;"></div>'}
        </div>
      `,
      iconSize: [40, 40],
      iconAnchor: [20, 20], // Center it
    });
  };

  // User location marker
  const userIcon = L.divIcon({
    className: 'custom-marker',
    html: `
      <div class="user-marker-container">
        <div class="user-marker-pulse"></div>
        <div class="user-marker-dot"></div>
      </div>
    `,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
  });

  return (
    <>
      <TileLayer
        attribution={DARK_MODE_ATTRIBUTION}
        url={DARK_MODE_TILES}
      />

      <MapUpdater
        center={!selectedHazard ? center : null}
        selectedHazard={selectedHazard}
            recenterTrigger={recenterTrigger}
      />

      {/* User Location Marker */}
      {userLocation && (
        <Marker
            position={[userLocation.lat, userLocation.lng]}
            icon={userIcon}
            zIndexOffset={1000}
        />
      )}

      {/* Hazard Markers */}
      {hazards.map((hazard) => (
        <Marker
          key={hazard._id}
          position={[
            hazard.location.coordinates[1],
            hazard.location.coordinates[0],
          ]}
          icon={getMarkerIcon(hazard.type, hazard.severity)}
          eventHandlers={{
            click: () => {
              if (onMarkerClick) onMarkerClick(hazard);
            },
          }}
        />
      ))}
    </>
  );
};

MapContent.propTypes = {
  center: PropTypes.array,
  hazards: PropTypes.array,
  userLocation: PropTypes.object,
  selectedHazard: PropTypes.object,
  onMarkerClick: PropTypes.func,
  mapRef: PropTypes.object,
    recenterTrigger: PropTypes.any,
};

const HazardMap = ({
  userLocation,
  hazards = [],
  onMapLoad,
  onMarkerClick,
  selectedHazard,
    recenterTrigger,
}) => {
  const mapRef = useRef(null);

  const center = userLocation
    ? [userLocation.lat, userLocation.lng]
    : defaultCenter;

  return (
    <div className="absolute inset-0 w-full h-full bg-bg-primary">
      <MapContainer
        center={center}
        zoom={16} // Closer zoom for city driving
        style={{ width: '100%', height: '100%' }}
        zoomControl={false}
        attributionControl={false}
        whenCreated={(map) => {
          mapRef.current = map;
          if (onMapLoad) onMapLoad(map);
        }}
      >
        <MapContent
          center={center}
          hazards={hazards}
          userLocation={userLocation}
          selectedHazard={selectedHazard}
          onMarkerClick={onMarkerClick}
          mapRef={mapRef}
          recenterTrigger={recenterTrigger}
        />
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
};

export default HazardMap;
