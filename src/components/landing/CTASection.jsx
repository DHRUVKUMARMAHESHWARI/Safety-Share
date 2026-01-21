import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import styles from './Landing.module.css';

const CTASection = () => {
    return (
        <section className={styles.ctaSection}>
            <div className={styles.container}>
                <div className={styles.ctaContent}>
                    <h2>Ready to Drive Safer?</h2>
                    <p>Join thousands of smart drivers protecting their journey today.</p>
                    
                    <div className={styles.ctaForm}>
                        <input type="email" placeholder="Enter your email" className={styles.ctaInput} />
                        <Link to="/register" className={styles.ctaButton}>
                            Get Started <ArrowRight size={20} />
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default CTASection;
