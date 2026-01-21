import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Play } from 'lucide-react';
import styles from './Landing.module.css';

const HeroSection = () => {
    return (
        <section className={styles.hero}>
            <div className={styles.heroBackground}>
                <div className={styles.blob1}></div>
                <div className={styles.blob2}></div>
            </div>
            
            <div className={styles.container}>
                <div className={styles.heroContent}>
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <h1 className={styles.heroTitle}>
                            Drive <span className={styles.gradientText}>Safer</span> <br /> Together
                        </h1>
                    </motion.div>

                    <motion.p 
                        className={styles.heroSubtitle}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                    >
                        Community-powered real-time road hazard alerts. 
                        Join the network that keeps thousands of drivers safe every day.
                    </motion.p>

                    <motion.div 
                        className={styles.heroActions}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                    >
                        <Link to="/register" className={`${styles.btn} ${styles.btnPrimary}`}>
                            Get Started <ArrowRight size={20} />
                        </Link>
                        <button className={`${styles.btn} ${styles.btnOutline}`}>
                            <Play size={20} fill="currentColor" /> Watch Demo
                        </button>
                    </motion.div>

                    <motion.div 
                        className={styles.statsRow}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1, delay: 0.6 }}
                    >
                        <div className={styles.statBadge}>
                            <span className={styles.pulsePoint}></span>
                            <strong>50K+</strong> Active Users
                        </div>
                        <div className={styles.statBadge}>
                            <strong>1M+</strong> Hazards Reported
                        </div>
                    </motion.div>
                </div>

                <motion.div 
                    className={styles.heroVisual}
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 1 }}
                >
                    {/* Placeholder for 3D/Lottie Element */}
                    <div className={styles.mockupContainer}>
                         <div className={styles.mockupCard}>
                             <div className={styles.mockupHeader}>
                                 <div className={styles.dot}></div>
                                 <div className={styles.dot}></div>
                             </div>
                             <div className={styles.mockupMap}>
                                 <div className={styles.marker} style={{top: '40%', left: '50%'}}>⚠️</div>
                                 <div className={styles.marker} style={{top: '60%', left: '30%'}}>🚧</div>
                                 <div className={styles.car}>🚗</div>
                                 <div className={styles.routeLine}></div>
                             </div>
                             <div className={styles.mockupAlert}>
                                 <span>⚠️ Pothole Ahead</span>
                             </div>
                         </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default HeroSection;
