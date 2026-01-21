import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { FaUser, FaLock, FaBell, FaShieldAlt, FaMoon, FaGlobe, FaEdit, FaCamera, FaSave, FaTrash, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import Select from 'react-select';
import toast from 'react-hot-toast';
import styles from './Profile.module.css';

const Profile = () => {
  const { user, updateUserProfile } = useAuth();
  const [activeTab, setActiveTab] = useState('account');
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
      name: '',
      phone: '',
      vehicleType: 'car',
      licenseNumber: ''
  });

  useEffect(() => {
      if (user) {
          setFormData({
              name: user.name || '',
              phone: user.phone || '',
              vehicleType: user.profile?.vehicleType || 'car',
              licenseNumber: user.profile?.licenseNumber || ''
          });
      }
  }, [user]);

  // Mock Settings States (Keeping mock as they aren't in Schema yet)
  const [notifications, setNotifications] = useState({
      email: true,
      push: true,
      hazards: true,
      achievements: true
  });
  
  const [privacy, setPrivacy] = useState({
      publicProfile: true,
      shareLocation: false
  });

  // Animation Variants
  const tabVariants = {
      hidden: { x: -20, opacity: 0 },
      visible: { x: 0, opacity: 1 },
      exit: { x: 20, opacity: 0 }
  };

  const handleSave = async () => {
      try {
          await updateUserProfile(formData);
          setIsEditing(false);
      } catch (err) {
          console.error(err);
      }
  };

  const vehicleOptions = [
      { value: 'car', label: 'Car' },
      { value: 'bike', label: 'Bike' },
      { value: 'scooter', label: 'Scooter' },
      { value: 'truck', label: 'Truck' },
      { value: 'other', label: 'Other' }
  ];

  return (
    <div className={styles.container}>
      {/* Sidebar Navigation */}
      <div className={styles.sidebar}>
          <div className={styles.userInfo}>
               <div className={styles.avatarWrapper}>
                   <div className={styles.avatar}>{user?.name?.charAt(0) || 'U'}</div>
                   <button className={styles.uploadBtn}><FaCamera /></button>
               </div>
               <h3>{user?.name || 'Safe Driver'}</h3>
               <p>{user?.email || 'user@example.com'}</p>
          </div>
          
          <nav className={styles.navMenu}>
              {[
                  { id: 'account', icon: FaUser, label: 'Account' },
                  { id: 'notifications', icon: FaBell, label: 'Notifications' },
                  { id: 'privacy', icon: FaShieldAlt, label: 'Privacy' },
                  { id: 'appearance', icon: FaMoon, label: 'Appearance' },
                  { id: 'about', icon: FaGlobe, label: 'About' }
              ].map(item => (
                  <button 
                      key={item.id}
                      className={`${styles.navItem} ${activeTab === item.id ? styles.active : ''}`}
                      onClick={() => setActiveTab(item.id)}
                  >
                      <item.icon /> {item.label}
                  </button>
              ))}
          </nav>
      </div>

      {/* Main Content Area */}
      <div className={styles.content}>
          <div className={styles.header}>
              <h2>{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Settings</h2>
          </div>
          
          <AnimatePresence mode='wait'>
            <motion.div 
               key={activeTab}
               variants={tabVariants}
               initial="hidden"
               animate="visible"
               exit="exit"
               transition={{ duration: 0.2 }}
               className={styles.tabPanel}
            >
                {/* ACCOUNT TAB */}
                {activeTab === 'account' && (
                    <div className={styles.panelContent}>
                        <div className={styles.formGroup}>
                            <label>Full Name</label>
                            <input 
                                type="text" 
                                value={formData.name} 
                                onChange={(e) => setFormData({...formData, name: e.target.value})}
                                className={styles.input} 
                                disabled={!isEditing} 
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label>Email Address</label>
                            <input type="email" value={user?.email || ''} className={styles.input} disabled />
                            <small>Email cannot be changed</small>
                        </div>
                        <div className={styles.formGroup}>
                            <label>Phone Number</label>
                            <input 
                                type="tel" 
                                value={formData.phone} 
                                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                                className={styles.input} 
                                disabled={!isEditing} 
                            />
                        </div>
                        
                        <div className={styles.sectionHeader}>Vehicle Information</div>
                        <div className={styles.formGroup}>
                            <label>Vehicle Type</label>
                            <Select 
                                options={vehicleOptions}
                                value={vehicleOptions.find(o => o.value === formData.vehicleType)}
                                onChange={(val) => setFormData({...formData, vehicleType: val.value})}
                                isDisabled={!isEditing}
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label>License Number</label>
                            <input 
                                type="text" 
                                value={formData.licenseNumber} 
                                onChange={(e) => setFormData({...formData, licenseNumber: e.target.value})}
                                className={styles.input} 
                                disabled={!isEditing} 
                            />
                        </div>

                        <div className={styles.actionRow}>
                             {isEditing ? (
                                 <button onClick={handleSave} className="btn btn-primary"><FaSave /> Save Changes</button>
                             ) : (
                                 <button onClick={() => setIsEditing(true)} className="btn btn-secondary"><FaEdit /> Edit Profile</button>
                             )}
                        </div>
                    </div>
                )}

                {/* NOTIFICATIONS TAB */}
                {activeTab === 'notifications' && (
                    <div className={styles.panelContent}>
                         <div className={styles.toggleRow}>
                             <div>
                                 <h4>Push Notifications</h4>
                                 <p>Receive alerts on your device</p>
                             </div>
                             <label className={styles.switch}>
                                 <input 
                                    type="checkbox" 
                                    checked={notifications.push} 
                                    onChange={() => setNotifications({...notifications, push: !notifications.push})}
                                 />
                                 <span className={styles.slider}></span>
                             </label>
                         </div>
                         <div className={styles.toggleRow}>
                             <div>
                                 <h4>Email Updates</h4>
                                 <p>Weekly digest and promotions</p>
                             </div>
                             <label className={styles.switch}>
                                 <input 
                                    type="checkbox" 
                                    checked={notifications.email} 
                                    onChange={() => setNotifications({...notifications, email: !notifications.email})}
                                 />
                                 <span className={styles.slider}></span>
                             </label>
                         </div>
                    </div>
                )}

                {/* PRIVACY TAB */}
                {activeTab === 'privacy' && (
                    <div className={styles.panelContent}>
                        <div className={styles.radioGroup}>
                             <label>Profile Visibility</label>
                             <div className={styles.radioOption}>
                                 <input type="radio" name="vis" checked={privacy.publicProfile} onChange={() => {}} />
                                 <span>Public (Everyone)</span>
                             </div>
                             <div className={styles.radioOption}>
                                 <input type="radio" name="vis" />
                                 <span>Community (Users only)</span>
                             </div>
                        </div>

                        <div className={styles.dangerZone}>
                             <h4>Danger Zone</h4>
                             <button className={`${styles.btnDanger} btn`}><FaTrash /> Delete Account</button>
                        </div>
                    </div>
                )}
            </motion.div>
          </AnimatePresence>
      </div>
    </div>
  );
};

export default Profile;
