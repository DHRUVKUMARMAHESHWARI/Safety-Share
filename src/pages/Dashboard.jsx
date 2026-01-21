import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { FaTrophy, FaMedal, FaCar, FaMapMarkedAlt, FaCheckDouble, FaExclamationTriangle, FaBell, FaCog } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { getDashboardData } from '../services/communityService';
import styles from './Dashboard.module.css';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
      user: null,
      recentReports: [],
      activityData: [],
      leaderboard: [] // Placeholder if we want to show it here
  });

  useEffect(() => {
    const fetchData = async () => {
        try {
            const res = await getDashboardData();
            if (res.success) {
                setData(prev => ({
                    ...prev,
                    user: res.data.user,
                    recentReports: res.data.recentReports,
                    activityData: res.data.activityData
                }));
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };
    fetchData();
  }, []);
  
  const containerVariants = {
      hidden: { opacity: 0 },
      visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
      hidden: { y: 20, opacity: 0 },
      visible: { y: 0, opacity: 1 }
  };

  if (loading) {
      return (
          <div className={styles.dashboardContainer} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <div className="skeleton" style={{ width: '100px', height: '100px', borderRadius: '50%' }}></div>
          </div>
      );
  }

  const { user: stats, recentReports, activityData } = data;

  return (
    <div className={styles.dashboardContainer}>
      {/* 1. Header Section */}
      <header className={styles.header}>
          <div className={styles.headerContent}>
              <div className={styles.userInfo}>
                  <div className={styles.avatarRing}>
                      <div className={styles.avatar}>
                          {user?.name?.charAt(0) || 'U'}
                      </div>
                  </div>
                  <div className={styles.userDetails}>
                      <h1>{user?.name || 'Safe Driver'}</h1>
                      <div className={styles.levelBadge}>
                          <FaMedal color="#fcd34d" /> Level {stats?.level || 1} Scout
                      </div>
                      <div className={styles.xpContainer}>
                          <div className={styles.xpBar}>
                              <motion.div 
                                className={styles.xpProgress} 
                                initial={{ width: 0 }}
                                animate={{ width: `${(stats?.xp % 500) / 5}%` }}
                                transition={{ duration: 1, delay: 0.5 }}
                              ></motion.div>
                          </div>
                          <small style={{ opacity: 0.8 }}>{stats?.xp || 0} XP</small>
                      </div>
                  </div>
              </div>

              <div className={styles.quickStats}>
                  {[
                      { label: 'Reports', value: stats?.stats?.reportsCount || 0, color: '#10b981' },
                      { label: 'Validations', value: stats?.stats?.validationsCount || 0, color: '#6366f1' },
                      { label: 'Alerts', value: stats?.stats?.alertsReceived || 0, color: '#f59e0b' }
                  ].map((stat, i) => (
                      <motion.div 
                         key={i} 
                         className={styles.statCard}
                         initial={{ scale: 0.8, opacity: 0 }}
                         animate={{ scale: 1, opacity: 1 }}
                         transition={{ delay: 0.3 + (i * 0.1) }}
                      >
                          <span className={styles.statValue} style={{ color: stat.color }}>{stat.value}</span>
                          <span className={styles.statLabel}>{stat.label}</span>
                      </motion.div>
                  ))}
              </div>
          </div>
      </header>

      {/* 2. Main Content Grid */}
      <motion.div 
         className={styles.gridContainer}
         variants={containerVariants}
         initial="hidden"
         animate="visible"
      >
          {/* COLUMN 1 */}
          <div className={styles.gridColumn}>
              {/* Activity Chart */}
              <motion.div className={styles.dashCard} variants={itemVariants}>
                  <h3 className={styles.cardTitle}>Your Activity</h3>
                  <div style={{ height: 200, width: '100%' }}>
                      <ResponsiveContainer>
                          <AreaChart data={activityData}>
                              <defs>
                                <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                                </linearGradient>
                              </defs>
                              <Tooltip />
                              <Area type="monotone" dataKey="val" stroke="#6366f1" fillOpacity={1} fill="url(#colorVal)" strokeWidth={3} />
                              <Area type="monotone" dataKey="reports" stroke="#f97316" fill="transparent" strokeWidth={3} />
                          </AreaChart>
                      </ResponsiveContainer>
                  </div>
              </motion.div>

              {/* Achievements */}
              <motion.div className={styles.dashCard} variants={itemVariants}>
                  <h3 className={styles.cardTitle}><FaTrophy color="#f59e0b" /> Achievements</h3>
                  <div className={styles.badgeGrid}>
                      {(stats?.achievements || []).length > 0 ? stats.achievements.map((badge, i) => (
                          <div key={i} className={`${styles.badge} ${styles.badgeUnlocked}`}>
                              <span className={styles.badgeIcon}>🏆</span>
                              <small style={{ fontSize: '0.7rem' }}>{badge.achievementId}</small>
                          </div>
                      )) : (
                          <p style={{ gridColumn: 'span 3', textAlign: 'center', opacity: 0.5, padding: '20px' }}>No achievements yet. Keep reporting!</p>
                      )}
                  </div>
              </motion.div>
          </div>

          {/* COLUMN 2 */}
          <div className={styles.gridColumn}>
              {/* Recent Reports */}
              <motion.div className={styles.dashCard} variants={itemVariants}>
                  <h3 className={styles.cardTitle}>Recent Reports</h3>
                  <div className={styles.reportList}>
                      {recentReports.length > 0 ? recentReports.map((r, i) => (
                          <div key={i} className={styles.reportItem}>
                              <div className={styles.reportIcon} style={{ background: r.type === 'pothole' ? '#f97316' : '#ef4444' }}>
                                 <FaExclamationTriangle size={14} />
                              </div>
                              <div className={styles.reportInfo}>
                                  <div className={styles.reportType}>{r.type.replace('_', ' ')}</div>
                                  <div className={styles.reportLoc}>{r.location.coordinates[1].toFixed(4)}, {r.location.coordinates[0].toFixed(4)}</div>
                              </div>
                              <span className={`${styles.statusBadge} ${styles['status-'+r.status]}`}>
                                  {r.status}
                              </span>
                          </div>
                      )) : (
                          <p style={{ textAlign: 'center', opacity: 0.5 }}>No recent reports.</p>
                      )}
                  </div>
              </motion.div>

              {/* Leaderboard - Link to full leaderboard */}
              <motion.div className={styles.dashCard} variants={itemVariants}>
                  <h3 className={styles.cardTitle}>Community</h3>
                  <div style={{ textAlign: 'center', padding: '20px' }}>
                      <FaTrophy size={48} color="#fcd34d" style={{ marginBottom: '16px' }} />
                      <p>View how you rank against other road guardians.</p>
                      <button 
                        className="btn btn-primary" 
                        style={{ width: '100%', marginTop: '16px' }}
                        onClick={() => navigate('/leaderboard')}
                      >
                          View Leaderboard
                      </button>
                  </div>
              </motion.div>
          </div>

          {/* COLUMN 3 */}
          <div className={styles.gridColumn}>
              {/* Quick Actions */}
              <motion.div className={styles.dashCard} variants={itemVariants}>
                  <h3 className={styles.cardTitle}>Quick Actions</h3>
                  <div className={styles.quickActionsGrid}>
                      <Link to="/map" className={styles.actionBtn}>
                          <FaMapMarkedAlt size={24} color="#6366f1" />
                          <span>View Map</span>
                      </Link>
                      <button className={styles.actionBtn} onClick={() => navigate('/map?report=true')}>
                          <FaExclamationTriangle size={24} color="#f97316" />
                          <span>New Report</span>
                      </button>
                      <button className={styles.actionBtn} onClick={() => navigate('/map?validate=true')}>
                          <FaCheckDouble size={24} color="#10b981" />
                          <span>Validate</span>
                      </button>
                      <button className={styles.actionBtn} onClick={() => navigate('/profile')}>
                          <FaCog size={24} color="#6b7280" />
                          <span>Settings</span>
                      </button>
                  </div>
              </motion.div>

              {/* Impact Stats */}
              <motion.div className={styles.dashCard} variants={itemVariants}>
                  <h3 className={styles.cardTitle}>Your Impact</h3>
                  <div className={styles.statsGrid}>
                      <div className={styles.impactCard}>
                          <div className={styles.impactValue}>{stats?.stats?.kmDriven || 0}</div>
                          <div className={styles.impactLabel}>Km Driven</div>
                      </div>
                      <div className={styles.impactCard}>
                          <div className={styles.impactValue}>{stats?.stats?.reportsCount || 0}</div>
                          <div className={styles.impactLabel}>Hazards</div>
                      </div>
                      <div className={styles.impactCard}>
                          <div className={styles.impactValue}>{stats?.points || 0}</div>
                          <div className={styles.impactLabel}>Points</div>
                      </div>
                      <div className={styles.impactCard}>
                          <div className={styles.impactValue}>Lvl {stats?.level || 1}</div>
                          <div className={styles.impactLabel}>Rank</div>
                      </div>
                  </div>
              </motion.div>
          </div>
      </motion.div>
    </div>
  );
};

export default Dashboard;

