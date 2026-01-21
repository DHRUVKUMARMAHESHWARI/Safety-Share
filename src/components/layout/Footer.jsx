import { Github, Twitter, Linkedin, Heart } from 'lucide-react';
import styles from '../landing/Landing.module.css';

const Footer = () => {
    return (
        <footer className={styles.footer}>
            <div className={styles.container}>
                <div className={styles.footerGrid}>
                    <div className={styles.col}>
                        <h3 className={styles.logo}>SafeRoute</h3>
                        <p>Making roads safer, together. The world's fastest growing community-driven navigation assistant.</p>
                        <div className={styles.socials}>
                            <a href="#"><Twitter size={20} /></a>
                            <a href="#"><Github size={20} /></a>
                            <a href="#"><Linkedin size={20} /></a>
                        </div>
                    </div>
                    
                    <div className={styles.col}>
                        <h4>Product</h4>
                        <a href="#">Features</a>
                        <a href="#">App</a>
                        <a href="#">Live Map</a>
                        <a href="#">Pricing</a>
                    </div>
                    
                    <div className={styles.col}>
                        <h4>Company</h4>
                        <a href="#">About</a>
                        <a href="#">Careers</a>
                        <a href="#">Blog</a>
                        <a href="#">Contact</a>
                    </div>
                    
                    <div className={styles.col}>
                        <h4>Legal</h4>
                        <a href="#">Privacy</a>
                        <a href="#">Terms</a>
                        <a href="#">Security</a>
                    </div>
                </div>
                
                <div className={styles.copyright}>
                    <p>© 2026 SafeRoute Inc. All rights reserved.</p>
                    <p className={styles.madeWith}>Taking care of you on the road <Heart size={14} fill="#ef4444" color="#ef4444" /></p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
