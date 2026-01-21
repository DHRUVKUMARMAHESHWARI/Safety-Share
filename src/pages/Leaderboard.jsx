import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaTrophy, FaMedal, FaCrown, FaArrowUp, FaArrowDown, FaFire, FaStar, FaShieldAlt } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { getLeaderboard } from '../services/communityService';
import styles from './Leaderboard.module.css';

const Leaderboard = () => {
  const { user } = useAuth();
  const [timeFilter, setTimeFilter] = useState('weekly');
  const [leaders, setLeaders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaders = async () => {
        try {
            const res = await getLeaderboard();
            if (res.success) {
                setLeaders(res.data);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };
    fetchLeaders();
  }, []);

  const podiumVariants = {
      hidden: { y: 50, opacity: 0 },
      visible: { y: 0, opacity: 1, transition: { duration: 0.6, staggerChildren: 0.2 } }
  };

  if (loading) {
      return <div className={styles.container}><div className="skeleton" style={{height: '400px', width: '100%', borderRadius: '12px'}}></div></div>;
  }

  const topThree = leaders.slice(0, 3);
  const remaining = leaders.slice(3);

  return (
    <div className={styles.container}>
      {/* 1. Header & Podium */}
      <header className={styles.header}>
          <div className={styles.titleWrapper}>
              <h1><FaTrophy color="#fbbf24" /> Top Contributors</h1>
              <p>Compete with the community for safer roads</p>
          </div>
      </header>

      <div className={styles.podiumSection}>
          <motion.div 
             className={styles.podium}
             variants={podiumVariants}
             initial="hidden"
             animate="visible"
          >
              {/* Position 2 */}
              {topThree[1] && (
                <motion.div className={`${styles.podiumStep} ${styles.step2}`} variants={podiumVariants}>
                    <div className={styles.podiumAvatarWrapper}>
                         <div className={styles.podiumAvatar}>{topThree[1].name.charAt(0)}</div>
                    </div>
                    <div className={styles.podiumBlock}>
                         <div className={styles.rankNum}>2</div>
                         <div className={styles.uName}>{topThree[1].name}</div>
                         <div className={styles.uPoints}>{topThree[1].points} XP</div>
                    </div>
                </motion.div>
              )}

              {/* Position 1 */}
              {topThree[0] && (
                <motion.div className={`${styles.podiumStep} ${styles.step1}`} variants={podiumVariants}>
                    <div className={styles.podiumAvatarWrapper}>
                         <FaCrown className={styles.crown} color="#fbbf24" />
                         <div className={styles.podiumAvatar}>{topThree[0].name.charAt(0)}</div>
                    </div>
                    <div className={styles.podiumBlock}>
                         <div className={styles.rankNum}>1</div>
                         <div className={styles.uName}>{topThree[0].name}</div>
                         <div className={styles.uPoints} style={{ fontSize: '1rem', fontWeight: 800 }}>{topThree[0].points} XP</div>
                    </div>
                </motion.div>
              )}

              {/* Position 3 */}
              {topThree[2] && (
                <motion.div className={`${styles.podiumStep} ${styles.step3}`} variants={podiumVariants}>
                    <div className={styles.podiumAvatarWrapper}>
                         <div className={styles.podiumAvatar}>{topThree[2].name.charAt(0)}</div>
                    </div>
                    <div className={styles.podiumBlock}>
                         <div className={styles.rankNum}>3</div>
                         <div className={styles.uName}>{topThree[2].name}</div>
                         <div className={styles.uPoints}>{topThree[2].points} XP</div>
                    </div>
                </motion.div>
              )}
          </motion.div>
      </div>

      {/* 2. Main Content Grid */}
      <div className={styles.grid}>
          {/* List Column */}
          <div className={styles.listSection}>
              <div className={styles.filterBar}>
                  <div className={styles.tabs}>
                      {['Today', 'This Week', 'All Time'].map(t => (
                          <button 
                             key={t} 
                             className={`${styles.tabBtn} ${timeFilter === t.toLowerCase().replace(' ', '') ? styles.activeTab : ''}`}
                             onClick={() => setTimeFilter(t.toLowerCase().replace(' ', ''))}
                          >
                              {t}
                          </button>
                      ))}
                  </div>
              </div>

              <div className={styles.lList}>
                  {remaining.length > 0 ? remaining.map((u, i) => (
                      <motion.div 
                         key={u._id} 
                         className={`${styles.lRow} ${u._id === user?.id ? styles.currentUserRow : ''}`}
                         initial={{ opacity: 0, x: -20 }}
                         animate={{ opacity: 1, x: 0 }}
                         transition={{ delay: i * 0.1 }}
                      >
                          <div className={styles.rankCol}>{i + 4}</div>
                          <div className={styles.userCol}>
                              <div className={styles.rowAvatar}>{u.name.charAt(0)}</div>
                              <div className={styles.nameInfo}>
                                  <strong>{u.name} {u._id === user?.id && <span style={{ fontSize: '0.7em', background: '#6366f1', color: 'white', padding: '2px 6px', borderRadius: '4px' }}>YOU</span>}</strong>
                                  <span className={styles.badge}><FaShieldAlt size={10} /> Level {u.level || 1}</span>
                              </div>
                          </div>
                          <div className={styles.pointsCol}>
                              <strong>{u.points} XP</strong>
                          </div>
                      </motion.div>
                  )) : (
                      <p style={{ textAlign: 'center', opacity: 0.5, padding: '40px' }}>Join the community to start ranking!</p>
                  )}
              </div>
          </div>

          {/* Sidebar Stats Column */}
          <div className={styles.sidebarStats}>
              <div className={styles.statCard}>
                  <h3>Quick Tips</h3>
                  <div className={styles.rankBox}>
                      <div className={styles.rankSub}>Report hazards to earn 50 XP. Validate others to earn 10 XP. Accuracy matters!</div>
                  </div>
              </div>

              <div className={`${styles.statCard} ${styles.challengeBox}`}>
                  <h3>Current Season</h3>
                  <div className={styles.challengeTitle}>Winter Guardian</div>
                  <p style={{ fontSize: '0.9rem', color: '#4b5563' }}>Season ends in 14 days. Top 10 users get a special badge.</p>
                  
                  <div className={styles.progressBar}>
                      <div className={styles.progressFill} style={{ width: '45%' }}></div>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: 600 }}>
                      <span>Season Progress</span>
                      <span style={{ color: '#be185d' }}>14d left</span>
                  </div>
              </div>

              <div className={`${styles.statCard} ${styles.communityCard}`}>
                   <h3>Hall of Fame</h3>
                   <div className={styles.featuredUser}>
                       <div className={styles.fAvatar}>SR</div>
                       <strong>SafeRoute Team</strong>
                       <p style={{ fontSize: '0.85rem', color: '#6b7280', margin: '4px 0 10px' }}>"Keeping the roads safe together."</p>
                   </div>
              </div>
          </div>
      </div>
    </div>
  );
};

export default Leaderboard;

