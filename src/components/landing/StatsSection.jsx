import CountUp from 'react-countup';
import styles from './Landing.module.css';

const StatsSection = () => {
    return (
        <section className={styles.statsSection}>
            <div className={styles.statsOverlay}></div>
            <div className={styles.container}>
                <div className={styles.statsGrid}>
                    <div className={styles.statItem}>
                        <h3>
                            <CountUp end={50000} duration={2.5} separator="," />+
                        </h3>
                        <p>Active Users</p>
                    </div>
                    <div className={styles.statItem}>
                        <h3>
                            <CountUp end={1000000} duration={2.5} separator="," />+
                        </h3>
                        <p>Alerts Sent</p>
                    </div>
                    <div className={styles.statItem}>
                        <h3>
                            <CountUp end={500000} duration={2.5} separator="," />+
                        </h3>
                        <p>Hazards Reported</p>
                    </div>
                    <div className={styles.statItem}>
                        <h3>
                            <CountUp end={95} duration={3} suffix="%" />
                        </h3>
                        <p>Accuracy Rate</p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default StatsSection;
