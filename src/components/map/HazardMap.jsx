import { useRef, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import L from 'leaflet';
import PropTypes from 'prop-types';
import 'leaflet/dist/leaflet.css';

// Custom dark mode tile layer
const DARK_MODE_TILES = 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';
const DARK_MODE_ATTRIBUTION = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>';

const defaultCenter = [28.6139, 77.2090];

// Map updater for smooth animations
const MapUpdater = ({ center, selectedHazard }) => {
  const map = useMap();

  useEffect(() => {
    if (selectedHazard) {
      const pos = [
        selectedHazard.location.coordinates[1],
        selectedHazard.location.coordinates[0],
      ];
      map.flyTo(pos, 17, { duration: 1.5 });
    } else if (center) {
      map.flyTo(center, map.getZoom(), { duration: 1 });
    }
  }, [center, selectedHazard, map]);

  return null;
};

MapUpdater.propTypes = {
  center: PropTypes.array,
  selectedHazard: PropTypes.object,
};

// Main map content component
const MapContent = ({
  center,
  hazards,
  userLocation,
  selectedHazard,
  onMarkerClick,
  mapRef,
}) => {
  // Create pulse circle markers for hazards
  const getMarkerIcon = (type, severity) => {
    let color = '#EF4444'; // Default red for accidents
    
    if (type === 'pothole' || type === 'roadblock') color = '#F59E0B'; // Amber
    if (type === 'police' || type === 'police_checking') color = '#3B82F6'; // Blue
    if (type === 'waterlogging') color = '#06B6D4'; // Cyan

    const size = severity === 'critical' ? 28 : severity === 'high' ? 24 : 20;
    const pulseAnimation = severity === 'critical' || severity === 'high';

    return L.divIcon({
      className: 'custom-marker',
      html: `
        <div class="marker-container">
          <div class="marker-pulse ${pulseAnimation ? 'animate-pulse-ring' : ''}" 
               style="background-color: ${color}; width: ${size}px; height: ${size}px;">
          </div>
          <div class="marker-glow" 
               style="background-color: ${color}; width: ${size}px; height: ${size}px; 
                      filter: blur(8px) drop-shadow(0 0 12px ${color});">
          </div>
        </div>
      `,
      iconSize: [size, size],
      iconAnchor: [size / 2, size / 2],
    });
  };

  // User location marker - pulsing blue dot
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
      {/* Dark Mode Tile Layer */}
      <TileLayer
        attribution={DARK_MODE_ATTRIBUTION}
        url={DARK_MODE_TILES}
      />

      <MapUpdater
        center={!selectedHazard ? center : null}
        selectedHazard={selectedHazard}
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
              if (mapRef.current) {
                mapRef.current.flyTo(
                  [
                    hazard.location.coordinates[1],
                    hazard.location.coordinates[0],
                  ],
                  17,
                  { duration: 1.5 }
                );
              }
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
};

const HazardMap = ({
  userLocation,
  hazards = [],
  onMapLoad,
  onMarkerClick,
  selectedHazard,
}) => {
  const mapRef = useRef(null);

  const center = userLocation
    ? [userLocation.lat, userLocation.lng]
    : defaultCenter;

  return (
    <div className="absolute inset-0 w-full h-full">
      <MapContainer
        center={center}
        zoom={15}
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
