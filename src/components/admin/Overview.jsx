import { useState, useEffect } from 'react';
import { getAdminStats, getTrends } from '../../services/adminService';
import { 
    Chart as ChartJS, 
    CategoryScale, 
    LinearScale, 
    PointElement, 
    LineElement, 
    BarElement,
    Title, 
    Tooltip, 
    Legend, 
    ArcElement 
} from 'chart.js';
import { Line, Pie, Bar } from 'react-chartjs-2';
import styles from './Overview.module.css';

ChartJS.register(
    CategoryScale, 
    LinearScale, 
    PointElement, 
    LineElement, 
    BarElement,
    Title, 
    Tooltip, 
    Legend, 
    ArcElement
);

const Overview = () => {
    const [stats, setStats] = useState(null);
    const [trends, setTrends] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetch = async () => {
            try {
                const s = await getAdminStats();
                const t = await getTrends('month');
                setStats(s.data);
                setTrends(t.data);
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        };
        fetch();
    }, []);

    if (loading || !stats) return <div className="p-4">Loading dashboard...</div>;

    // Charts Data Prep
    const pieData = {
        labels: stats.byType.map(x => x._id.replace('_', ' ')),
        datasets: [{
            data: stats.byType.map(x => x.count),
            backgroundColor: [
                '#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6', '#a855f7'
            ]
        }]
    };

    const lineData = {
        labels: trends.map(x => x._id),
        datasets: [
            {
                label: 'Reports',
                data: trends.map(x => x.count),
                borderColor: '#2563eb',
                tension: 0.3
            }
        ]
    };
    
    // Severity Bar Chart
    const barData = {
        labels: stats.bySeverity.map(x => x._id),
        datasets: [{
            label: 'Counts',
            data: stats.bySeverity.map(x => x.count),
            backgroundColor: ['rgba(255, 99, 132, 0.5)', 'rgba(255, 159, 64, 0.5)', 'rgba(54, 162, 235, 0.5)'],
            borderColor: ['rgb(255, 99, 132)', 'rgb(255, 159, 64)', 'rgb(54, 162, 235)'],
            borderWidth: 1
        }]
    };

    return (
        <div className={styles.container}>
            <div className={styles.statsGrid}>
                <div className={styles.card}>
                    <h3>Total Hazards</h3>
                    <p className={styles.statValue}>{stats.counts.total}</p>
                </div>
                <div className={styles.card}>
                    <h3>Active Now</h3>
                    <p className={`${styles.statValue} ${styles.danger}`}>{stats.counts.active}</p>
                </div>
                <div className={styles.card}>
                    <h3>Pending Review</h3>
                    <p className={`${styles.statValue} ${styles.warning}`}>{stats.counts.active}</p>
                </div>
                <div className={styles.card}>
                    <h3>Resolved</h3>
                    <p className={`${styles.statValue} ${styles.success}`}>{stats.counts.resolved}</p>
                </div>
                 <div className={styles.card}>
                    <h3>Active Users (24h)</h3>
                    <p className={styles.statValue}>{stats.counts.activeUsers}</p>
                </div>
            </div>

            <div className={styles.chartsGrid}>
                 <div className={styles.chartCard}>
                     <h3>Reports Trend (30 Days)</h3>
                     <Line data={lineData} />
                 </div>
                 <div className={styles.chartCard}>
                     <h3>Hazards by Type</h3>
                     <div className={styles.pieContainer}>
                        <Pie data={pieData} />
                     </div>
                 </div>
                 <div className={styles.chartCard}>
                     <h3>By Severity</h3>
                     <Bar data={barData} />
                 </div>
            </div>

            <div className={styles.section}>
                <h3>Top Reporters</h3>
                <div className={styles.list}>
                    {stats.topReporters.map((rep, i) => (
                        <div key={i} className={styles.listItem}>
                            <span>{i+1}. {rep.name}</span>
                            <span className={styles.countBadge}>{rep.count} reports</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Overview;
