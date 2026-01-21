import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { FaUserCircle, FaBars, FaTimes } from 'react-icons/fa';
import { useState } from 'react';
import styles from './Navbar.module.css';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/login');
        setIsMobileMenuOpen(false);
    };

    // Active link style helper
    const isActive = (path) => location.pathname === path ? styles.activeLink : '';

    return (
        <nav className={styles.navbar}>
            <div className={`container ${styles.container}`}>
                <Link to="/" className={styles.logo}>
                    Safe<span>Route</span>
                </Link>

                {/* Desktop Links */}
                <div className={styles.links}>
                    <Link to="/map" className={`${styles.linkItem} ${isActive('/map')}`}>Map</Link>
                    {user ? (
                        <>
                            <Link to="/dashboard" className={`${styles.linkItem} ${isActive('/dashboard')}`}>Dashboard</Link>
                            <Link to="/leaderboard" className={`${styles.linkItem} ${isActive('/leaderboard')}`}>Leaderboard</Link>
                            {user.role === 'admin' && (
                                <Link to="/admin" className={`${styles.linkItem} ${isActive('/admin')}`}>Admin</Link>
                            )}
                            
                            <div className={styles.profileDropdown}>
                                <button onClick={() => navigate('/profile')} className={styles.profileBtn}>
                                    <div className={styles.avatarMini}>{user.name.charAt(0)}</div>
                                </button>
                            </div>

                            <button onClick={handleLogout} className="btn btn-secondary btn-sm" style={{padding: '8px 16px', fontSize: '0.9rem'}}>
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className={styles.linkItem}>Login</Link>
                            <motion.button 
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => navigate('/register')}
                                className="btn btn-primary"
                                style={{ padding: '8px 20px' }}
                            >
                                Sign Up
                            </motion.button>
                        </>
                    )}
                </div>

                {/* Mobile Menu Toggle */}
                <button 
                    className={styles.mobileToggle}
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                >
                    {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
                </button>
            </div>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div 
                        className={styles.mobileMenu}
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                    >
                        <Link to="/map" onClick={() => setIsMobileMenuOpen(false)}>Map</Link>
                        {user ? (
                            <>
                                <Link to="/dashboard" onClick={() => setIsMobileMenuOpen(false)}>Dashboard</Link>
                                <Link to="/leaderboard" onClick={() => setIsMobileMenuOpen(false)}>Leaderboard</Link>
                                <Link to="/profile" onClick={() => setIsMobileMenuOpen(false)}>Profile</Link>
                                {user.role === 'admin' && <Link to="/admin" onClick={() => setIsMobileMenuOpen(false)}>Admin</Link>}
                                <button onClick={handleLogout} className="btn btn-secondary" style={{width: '100%', marginTop: '10px'}}>Logout</button>
                            </>
                        ) : (
                            <>
                                <Link to="/login" onClick={() => setIsMobileMenuOpen(false)}>Login</Link>
                                <Link to="/register" onClick={() => setIsMobileMenuOpen(false)} style={{color: 'var(--primary)', fontWeight: 'bold'}}>Sign Up</Link>
                            </>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};

export default Navbar;
