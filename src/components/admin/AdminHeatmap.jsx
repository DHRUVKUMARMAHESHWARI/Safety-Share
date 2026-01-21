import { useState, useRef, useEffect } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { getHeatmapData } from '../../services/adminService';
import styles from './AdminHeatmap.module.css';

// Note: leaflet.heat is a global plugin, usually loaded via script. 
// For pure React, we can simulate density with semi-transparent circles or use a wrapper.
// To keep it simple and robust without external script dependency issues:
// We will render high concentrations as large colored circles with low opacity overlapping.

const AdminHeatmap = () => {
    const [data, setData] = useState([]);
    
    useEffect(() => {
        const fetch = async () => {
            const res = await getHeatmapData();
            if (res.success) setData(res.data);
        };
        fetch();
    }, []);

    const getColor = (s) => {
        if(s === 'critical') return '#ef4444';
        if(s === 'high') return '#f97316';
        return '#3b82f6';
    }

    return (
        <div className={styles.container}>
            <MapContainer 
                center={[28.6139, 77.2090]} 
                zoom={11} 
                style={{ width: '100%', height: '100%' }}
            >
                 <TileLayer
                    attribution='&copy; OpenStreetMap'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                
                {data.map((p, i) => (
                    <CircleMarker 
                        key={i}
                        center={[p.lat, p.lng]}
                        pathOptions={{ 
                            color: getColor(p.severity), 
                            fillColor: getColor(p.severity), 
                            fillOpacity: 0.5,
                            stroke: false
                        }}
                        radius={20} // Large radius for "heat" feel
                    >
                         <Popup>
                            severity: {p.severity}
                        </Popup>
                    </CircleMarker>
                ))}
            </MapContainer>
        </div>
    );
};

export default AdminHeatmap;
