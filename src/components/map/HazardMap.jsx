import { useRef, useEffect, useState, useCallback } from 'react';
import { MapContainer, TileLayer, Marker, useMap, Circle } from 'react-leaflet';
import L from 'leaflet';
import PropTypes from 'prop-types';
import 'leaflet/dist/leaflet.css';

// Custom dark mode tile layer (CartoDB Dark Matter)
const DARK_MODE_TILES = 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';
const DARK_MODE_ATTRIBUTION = '&copy; OpenStreetMap &copy; CARTO';

const defaultCenter = [28.6139, 77.2090]; // New Delhi Fallback

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
  showUserRadius,
  userRadiusSize,
}) => {
  
  const getMarkerIcon = (type, severity, isSelected) => {
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
    const scale = isSelected ? 1.2 : 1;

    return L.divIcon({
      className: 'custom-marker',
      html: `
        <div class="epicenter-marker" style="color: ${color}; transform: scale(${scale}); transition: transform 0.3s ease;">
          <div class="epicenter-core">${emoji}</div>
          ${isPulse ? '<div class="epicenter-ripple pulse-animation"></div>' : '<div class="epicenter-ripple" style="width: 40px; height: 40px; opacity: 0.1;"></div>'}
        </div>
      `,
      iconSize: [40, 40],
      iconAnchor: [20, 20],
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

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'critical': return '#EF4444';
      case 'high': return '#F59E0B';
      case 'medium': return '#F59E0B';
      case 'low': return '#10B981';
      default: return '#6B7280';
    }
  };

  const formatType = (type) => {
    return type.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

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

      {/* User Location Marker with optional radius */}
      {userLocation && (
        <>
          {showUserRadius && (
            <Circle
              center={[userLocation.lat, userLocation.lng]}
              radius={userRadiusSize || 500}
              pathOptions={{
                color: '#3B82F6',
                fillColor: '#3B82F6',
                fillOpacity: 0.1,
                weight: 2,
              }}
            />
          )}
          <Marker
            position={[userLocation.lat, userLocation.lng]}
            icon={userIcon}
            zIndexOffset={1000}
          >
            <Popup>
              <div className="text-sm font-medium text-gray-900">Your Location</div>
            </Popup>
          </Marker>
        </>
      )}

      {/* Hazard Markers */}
      {hazards.map((hazard) => {
        const isSelected = selectedHazard?._id === hazard._id;
        return (
          <Marker
            key={hazard._id}
            position={[
              hazard.location.coordinates[1],
              hazard.location.coordinates[0],
            ]}
            icon={getMarkerIcon(hazard.type, hazard.severity, isSelected)}
            eventHandlers={{
              click: () => {
                if (onMarkerClick) onMarkerClick(hazard);
              },
            }}
          >

          </Marker>
        );
      })}
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
  showUserRadius: PropTypes.bool,
  userRadiusSize: PropTypes.number,
};

const HazardMap = ({
  userLocation,
  hazards = [],
  onMapLoad,
  onMarkerClick,
  selectedHazard,
  recenterTrigger,
  showUserRadius = false,
  userRadiusSize = 500,
  enableZoomControls = false,
  enableFullscreen = false,
  onMapInteraction,
}) => {
  const mapRef = useRef(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef(null);

  const center = userLocation
    ? [userLocation.lat, userLocation.lng]
    : defaultCenter;

  // Recenter to user location
  const recenterToUser = useCallback(() => {
    if (mapRef.current && userLocation) {
      mapRef.current.flyTo([userLocation.lat, userLocation.lng], 16, {
        duration: 1.5,
      });
    }
  }, [userLocation]);

  // Toggle fullscreen
  const toggleFullscreen = useCallback(() => {
    if (!containerRef.current) return;

    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().then(() => {
        setIsFullscreen(true);
      }).catch(err => {
        console.error('Error entering fullscreen:', err);
      });
    } else {
      document.exitFullscreen().then(() => {
        setIsFullscreen(false);
      });
    }
  }, []);

  // Listen for fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  return (
    <div 
      ref={containerRef}
      className="absolute inset-0 w-full h-full bg-gray-900"
    >
      <MapContainer
        center={center}
        zoom={16}
        style={{ width: '100%', height: '100%' }}
        zoomControl={false}
        attributionControl={false}
        whenCreated={(map) => {
          mapRef.current = map;
          if (onMapLoad) onMapLoad(map);
          
          // Track map interactions
          if (onMapInteraction) {
            map.on('moveend', () => onMapInteraction({ type: 'moveend' }));
            map.on('zoomend', () => onMapInteraction({ type: 'zoomend', zoom: map.getZoom() }));
          }
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
          showUserRadius={showUserRadius}
          userRadiusSize={userRadiusSize}
        />
      </MapContainer>

      {/* Control Panel */}
      <div className="absolute top-4 right-4 flex flex-col gap-2 z-[1000]">
        {/* Zoom Controls */}
        {enableZoomControls && (
          <div className="bg-gray-800/90 backdrop-blur-sm rounded-lg shadow-lg overflow-hidden">
            <button
              onClick={() => mapRef.current?.zoomIn()}
              className="w-10 h-10 flex items-center justify-center text-white hover:bg-gray-700 transition-colors border-b border-gray-700"
              aria-label="Zoom in"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v12m6-6H6" />
              </svg>
            </button>
            <button
              onClick={() => mapRef.current?.zoomOut()}
              className="w-10 h-10 flex items-center justify-center text-white hover:bg-gray-700 transition-colors"
              aria-label="Zoom out"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 12H6" />
              </svg>
            </button>
          </div>
        )}

        {/* Recenter Button */}
        {userLocation && (
          <button
            onClick={recenterToUser}
            className="w-10 h-10 bg-blue-600/90 backdrop-blur-sm rounded-lg shadow-lg flex items-center justify-center text-white hover:bg-blue-700 transition-colors"
            aria-label="Recenter to your location"
            title="Recenter to your location"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </button>
        )}

        {/* Fullscreen Toggle */}
        {enableFullscreen && (
          <button
            onClick={toggleFullscreen}
            className="w-10 h-10 bg-gray-800/90 backdrop-blur-sm rounded-lg shadow-lg flex items-center justify-center text-white hover:bg-gray-700 transition-colors"
            aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
            title={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
          >
            {isFullscreen ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
              </svg>
            )}
          </button>
        )}
      </div>

      {/* Hazard Count Badge */}
      {hazards.length > 0 && (
        <div className="absolute bottom-4 left-4 z-[1000] bg-gray-800/90 backdrop-blur-sm px-4 py-2 rounded-lg shadow-lg">
          <div className="flex items-center gap-2 text-white">
            <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <span className="text-sm font-medium">{hazards.length} Active Hazard{hazards.length !== 1 ? 's' : ''}</span>
          </div>
        </div>
      )}

      <style>{`
        .custom-marker {
          background: transparent !important;
          border: none !important;
        }

        .epicenter-marker {
          position: relative;
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .epicenter-core {
          position: relative;
          z-index: 2;
          font-size: 24px;
          filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.5));
        }

        .epicenter-ripple {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          border-radius: 50%;
          background: currentColor;
          opacity: 0.2;
        }

        .pulse-animation {
          width: 60px;
          height: 60px;
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }

        @keyframes pulse {
          0%, 100% {
            opacity: 0.2;
            transform: translate(-50%, -50%) scale(1);
          }
          50% {
            opacity: 0.05;
            transform: translate(-50%, -50%) scale(1.3);
          }
        }

        .user-marker-container {
          position: relative;
          width: 24px;
          height: 24px;
        }

        .user-marker-pulse {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 24px;
          height: 24px;
          background: #3B82F6;
          border-radius: 50%;
          opacity: 0.3;
          animation: userPulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }

        .user-marker-dot {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 12px;
          height: 12px;
          background: #3B82F6;
          border: 2px solid white;
          border-radius: 50%;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
          z-index: 2;
        }

        @keyframes userPulse {
          0%, 100% {
            opacity: 0.3;
            transform: translate(-50%, -50%) scale(1);
          }
          50% {
            opacity: 0.1;
            transform: translate(-50%, -50%) scale(1.5);
          }
        }

        .leaflet-popup-content-wrapper {
          background: white;
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }

        .leaflet-popup-tip {
          background: white;
        }

        @media (max-width: 640px) {
          .epicenter-core {
            font-size: 20px;
          }
          
          .epicenter-marker {
            width: 32px;
            height: 32px;
          }
        }
      `}</style>
    </div>
  );
};

HazardMap.propTypes = {
  userLocation: PropTypes.object,
  hazards: PropTypes.array,
  onMapLoad: PropTypes.func,
  onMarkerClick: PropTypes.func,
  selectedHazard: PropTypes.object,
  recenterTrigger: PropTypes.any,
  showUserRadius: PropTypes.bool,
  userRadiusSize: PropTypes.number,
  enableZoomControls: PropTypes.bool,
  enableFullscreen: PropTypes.bool,
  onMapInteraction: PropTypes.func,
};

export default HazardMap;