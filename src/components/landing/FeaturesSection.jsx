import { motion } from 'framer-motion';
import { Bell, Users, Radar, EyeOff } from 'lucide-react';
import styles from './Landing.module.css';

const features = [
    {
        icon: Bell,
        title: "Real-Time Alerts",
        desc: "Voice alerts before you reach hazards.",
        gradient: "linear-gradient(135deg, #FF9A9E 0%, #FECFEF 99%, #FECFEF 100%)",
        color: "#db2777"
    },
    {
        icon: Users,
        title: "Community Driven",
        desc: "Report and validate hazards together.",
        gradient: "linear-gradient(120deg, #a1c4fd 0%, #c2e9fb 100%)",
        color: "#2563eb"
    },
    {
        icon: Radar,
        title: "Smart Detection",
        desc: "AI-powered route monitoring.",
        gradient: "linear-gradient(120deg, #84fab0 0%, #8fd3f4 100%)",
        color: "#059669"
    },
    {
        icon: EyeOff,
        title: "Zero Distraction",
        desc: "Hands-free voice notifications.",
        gradient: "linear-gradient(to top, #fbc2eb 0%, #a6c1ee 100%)",
        color: "#7c3aed"
    }
];

const FeaturesSection = () => {
    return (
        <section className={styles.section}>
            <div className={styles.container}>
                <div className={styles.sectionHeader}>
                     <h2>How SafeRoute Keeps You <span className={styles.gradientText}>Safe</span></h2>
                </div>
                
                <div className={styles.grid}>
                    {features.map((f, i) => (
                        <motion.div 
                            key={i}
                            className={styles.featureCard}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            whileHover={{ y: -10 }}
                        >
                            <div className={styles.iconWrapper} style={{ background: f.gradient, color: 'white' }}>
                                <f.icon size={28} />
                            </div>
                            <h3>{f.title}</h3>
                            <p>{f.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default FeaturesSection;
