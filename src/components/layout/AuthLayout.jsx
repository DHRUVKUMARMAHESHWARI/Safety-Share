import PropTypes from 'prop-types';
import styles from './AuthLayout.module.css';

const AuthLayout = ({ children, title, subtitle }) => {
  return (
    <div className={styles.container}>
      <div className={styles.formSection}>
        <div className={styles.formContainer}>
          <div className={styles.header}>
            <h1 className={styles.title}>{title}</h1>
            <p className={styles.subtitle}>{subtitle}</p>
          </div>
          {children}
        </div>
      </div>
      <div className={styles.imageSection}>
        <div className={styles.content}>
            <h2>SafeRoute</h2>
            <p>Navigate with confidence. Your safety is our priority.</p>
        </div>
        <div className={styles.overlay}></div>
      </div>
    </div>
  );
};

AuthLayout.propTypes = {
  children: PropTypes.node.isRequired,
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string,
};

export default AuthLayout;
