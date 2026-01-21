import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { 
    FaChartPie, FaExclamationTriangle, FaUsers, FaChartBar, FaFileAlt, 
    FaCog, FaSignOutAlt, FaArrowUp, FaClock, FaCheck, FaTrash, FaEye 
} from 'react-icons/fa';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { getAdminStats, getTrends, getPendingHazards, updateHazardStatus, deleteHazard } from '../services/adminService';
import { toast } from 'react-hot-toast';
import styles from './Admin.module.css';

const Admin = () => {
    const { user, logout } = useAuth();
    const [activeTab, setActiveTab] = useState('overview');
    const [stats, setStats] = useState(null);
    const [trends, setTrends] = useState([]);
    const [hazards, setHazards] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [statsRes, trendsRes, hazardsRes] = await Promise.all([
                getAdminStats(),
                getTrends('month'),
                getPendingHazards() // Simplified: fetching pending for the 'hazards' tab preview
            ]);

            if (statsRes.success) setStats(statsRes.data);
            if (trendsRes.success) setTrends(trendsRes.data);
            if (hazardsRes.success) setHazards(hazardsRes.data);
        } catch (err) {
            console.error(err);
            toast.error('Failed to fetch admin data');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleUpdateStatus = async (id, status) => {
        try {
            await updateHazardStatus(id, status);
            toast.success(`Hazard marked as ${status}`);
            fetchData();
        } catch (err) {
            toast.error('Failed to update status');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this report?')) return;
        try {
            await deleteHazard(id);
            toast.success('Hazard deleted');
            fetchData();
        } catch (err) {
            toast.error('Failed to delete hazard');
        }
    };

    if (loading && !stats) return <div className={styles.adminContainer} style={{display:'flex', justifyContent:'center', alignItems:'center'}}><div className="skeleton" style={{width:'200px', height:'200px'}}></div></div>;

    const hazardsByType = stats?.byType.map(t => ({
        name: t._id.charAt(0).toUpperCase() + t._id.slice(1).replace('_', ' '),
        value: t.count,
        color: t._id === 'pothole' ? '#f97316' : t._id === 'accident' ? '#ef4444' : '#3b82f6'
    })) || [];

    return (
        <div className={styles.adminContainer}>
            {/* Sidebar */}
            <aside className={styles.sidebar}>
                <div className={styles.logoArea}>
                    <h2>SafeRoute <span style={{fontSize:'0.7em', opacity:0.6}}>ADMIN</span></h2>
                </div>
                
                <nav className={styles.navMenu}>
                    {[
                        { id: 'overview', icon: FaChartPie, label: 'Overview' },
                        { id: 'hazards', icon: FaExclamationTriangle, label: 'Hazards' },
                        { id: 'users', icon: FaUsers, label: 'Users' }
                    ].map(item => (
                        <button 
                            key={item.id}
                            className={`${styles.navItem} ${activeTab === item.id ? styles.active : ''}`}
                            onClick={() => setActiveTab(item.id)}
                        >
                            <item.icon /> {item.label}
                        </button>
                    ))}
                </nav>
 
                <div className={styles.userProfile}>
                    <div className={styles.avatar}>{user?.name?.charAt(0)}</div>
                    <div className={styles.userInfo}>
                        <h4>{user?.name}</h4>
                        <span>Admin</span>
                    </div>
                    <button onClick={logout} style={{ marginLeft: 'auto', background: 'none', border: 'none', color: '#ef4444', cursor:'pointer' }}>
                        <FaSignOutAlt />
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className={styles.mainContent}>
                <header className={styles.topBar}>
                    <h1>{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}</h1>
                    <div style={{ fontSize: '0.9rem', color: '#6b7280' }}>
                        {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                    </div>
                </header>

                <div className={styles.pageArea}>
                    {activeTab === 'overview' && (
                        <>
                            {/* Top Stats */}
                            <div className={styles.statsGrid}>
                                <div className={styles.statCard}>
                                    <div className={styles.statHeader}>
                                        <div className={styles.statIcon} style={{ background: '#fff7ed', color: '#f97316' }}><FaExclamationTriangle /></div>
                                    </div>
                                    <div className={styles.statValue}>{stats?.counts?.total || 0}</div>
                                    <div style={{ color:'gray', fontSize:'0.9rem' }}>Total Hazards Reported</div>
                                </div>
                                <div className={styles.statCard}>
                                    <div className={styles.statHeader}>
                                        <div className={styles.statIcon} style={{ background: '#eff6ff', color: '#3b82f6' }}><FaUsers /></div>
                                    </div>
                                    <div className={styles.statValue}>{stats?.counts?.users || 0}</div>
                                    <div style={{ color:'gray', fontSize:'0.9rem' }}>Total Users</div>
                                </div>
                                <div className={styles.statCard}>
                                    <div className={styles.statHeader}>
                                        <div className={styles.statIcon} style={{ background: '#fff1f2', color: '#be123c' }}><FaClock /></div>
                                    </div>
                                    <div className={styles.statValue}>{stats?.counts?.pending || 0}</div>
                                    <div style={{ color:'gray', fontSize:'0.9rem' }}>Pending Reports</div>
                                </div>
                                <div className={styles.statCard}>
                                    <div className={styles.statHeader}>
                                        <div className={styles.statIcon} style={{ background: '#f0fdf4', color: '#10b981' }}><FaCheck /></div>
                                    </div>
                                    <div className={styles.statValue}>{stats?.counts?.resolved || 0}</div>
                                    <div style={{ color:'gray', fontSize:'0.9rem' }}>Resolved Hazards</div>
                                </div>
                            </div>

                            {/* Charts */}
                            <div className={styles.chartRow}>
                                <div className={styles.chartCard} style={{ gridColumn: 'span 2' }}>
                                    <div className={styles.chartHeader}>
                                         <h3>Hazard Trends (Last 30 Days)</h3>
                                    </div>
                                    <div style={{ height: 300, width: '100%' }}>
                                        <ResponsiveContainer>
                                            <LineChart data={trends}>
                                                <XAxis dataKey="_id" stroke="#9ca3af" />
                                                <YAxis stroke="#9ca3af" />
                                                <Tooltip contentStyle={{ borderRadius: '8px' }} />
                                                <Line type="monotone" dataKey="count" stroke="#3b82f6" strokeWidth={3} dot={true} />
                                            </LineChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>
                                
                                <div className={styles.chartCard}>
                                    <div className={styles.chartHeader}>
                                         <h3>Hazards by Type</h3>
                                    </div>
                                    <div style={{ height: 300, width: '100%' }}>
                                        <ResponsiveContainer>
                                            <PieChart>
                                                <Pie data={hazardsByType} dataKey="value" cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5}>
                                                    {hazardsByType.map((entry, index) => (
                                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                                    ))}
                                                </Pie>
                                                <Tooltip />
                                            </PieChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}

                    {activeTab === 'hazards' && (
                        <div className={styles.chartCard}>
                            <div className={styles.tableCard}>
                                <table className={styles.table}>
                                    <thead>
                                        <tr>
                                            <th>Type</th>
                                            <th>Location</th>
                                            <th>Severity</th>
                                            <th>Status</th>
                                            <th>Reported By</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {hazards.length > 0 ? hazards.map(h => (
                                            <tr key={h._id}>
                                                <td><strong>{h.type.replace('_', ' ')}</strong></td>
                                                <td>{h.location.coordinates[1].toFixed(4)}, {h.location.coordinates[0].toFixed(4)}</td>
                                                <td>
                                                    <span style={{ 
                                                        color: h.severity==='critical'?'#ef4444':h.severity==='high'?'#f97316':'#10b981',
                                                        fontWeight: 600
                                                    }}>
                                                        {h.severity}
                                                    </span>
                                                </td>
                                                <td><span className={`${styles.statusBadge} ${styles[h.status]}`}>{h.status}</span></td>
                                                <td style={{ color: '#6b7280' }}>{h.reportedBy?.name}</td>
                                                <td>
                                                    <button className={`${styles.actionBtn} ${styles.success}`} title="Activate" onClick={() => handleUpdateStatus(h._id, 'active')}><FaCheck /></button>
                                                    <button className={`${styles.actionBtn} ${styles.danger}`} title="Delete" onClick={() => handleDelete(h._id)}><FaTrash /></button>
                                                </td>
                                            </tr>
                                        )) : (
                                            <tr><td colSpan="6" style={{textAlign:'center', padding:'20px'}}>No pending hazards.</td></tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default Admin;

