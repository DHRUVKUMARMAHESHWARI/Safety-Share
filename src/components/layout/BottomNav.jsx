import { useNavigate, useLocation } from 'react-router-dom';
import { FaHome, FaMapMarkedAlt, FaPlus, FaTrophy, FaUser } from 'react-icons/fa';
import styles from './BottomNav.module.css';

const BottomNav = () => {
    const navigate = useNavigate();
    const location = useLocation();

    // Hide if on login/register or large screens (handled by media query in CSS)
    if (['/login', '/register'].includes(location.pathname)) return null;

    const navItems = [
        { id: '/', icon: FaHome, label: 'Home' },
        { id: '/map', icon: FaMapMarkedAlt, label: 'Map' },
        { id: 'action', icon: FaPlus, label: '', isAction: true }, // Opens quick report
        { id: '/leaderboard', icon: FaTrophy, label: 'Leaders' },
        { id: '/dashboard', icon: FaUser, label: 'Profile' }
    ];

    const handleClick = (item) => {
        if (item.isAction) {
            navigate('/map?report=true');
        } else {
            navigate(item.id);
        }
    };

    return (
        <nav className={styles.bottomNav}>
            {navItems.map(item => (
                <button 
                    key={item.id} 
                    className={`${styles.navItem} ${location.pathname === item.id ? styles.active : ''} ${item.isAction ? styles.actionBtn : ''}`}
                    onClick={() => handleClick(item)}
                >
                    <item.icon size={item.isAction ? 24 : 20} />
                    {!item.isAction && <span className={styles.label}>{item.label}</span>}
                </button>
            ))}
        </nav>
    );
};

export default BottomNav;
