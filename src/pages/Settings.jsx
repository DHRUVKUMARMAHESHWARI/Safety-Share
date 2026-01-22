import { motion } from 'framer-motion';
import { Bell, Lock, LogOut, ChevronRight, User, Mail, Smartphone } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Settings = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-bg-primary pt-24 pb-28 px-4 font-sans text-white">
            <div className="max-w-xl mx-auto">
                <header className="mb-8">
                    <h1 className="text-3xl font-extrabold mb-2">Account Settings</h1>
                    <p className="text-text-secondary">Manage your preferences and security</p>
                </header>

                <div className="space-y-8">
                    {/* Profile Edit Section */}
                    <section>
                        <h2 className="text-sm font-bold text-text-secondary uppercase mb-4 tracking-wider">Profile Information</h2>
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-xs font-semibold text-gray-400 ml-1">Full Name</label>
                                <div className="relative">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                                    <input 
                                        type="text" 
                                        defaultValue={user?.name}
                                        className="w-full bg-black/40 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-accent-violet transition-colors placeholder-gray-600"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-semibold text-gray-400 ml-1">Email Address</label>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                                    <input 
                                        type="email" 
                                        defaultValue={user?.email}
                                        disabled
                                        className="w-full bg-black/20 border border-white/5 rounded-xl py-3 pl-12 pr-4 text-gray-400 cursor-not-allowed"
                                    />
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Preferences List */}
                    <section>
                        <h2 className="text-sm font-bold text-text-secondary uppercase mb-4 tracking-wider">Preferences</h2>
                        <div className="glass-card rounded-2xl overflow-hidden border border-white/10">
                            <SettingsItem icon={Bell} label="Notifications" toggle />
                            <div className="h-px bg-white/5 w-full"></div>
                            <SettingsItem icon={Lock} label="Privacy & Security" />
                        </div>
                    </section>

                    {/* Logout */}
                    <motion.button 
                        whileTap={{ scale: 0.98 }}
                        onClick={handleLogout}
                        className="w-full py-4 text-red-500 text-sm font-bold bg-red-500/5 hover:bg-red-500/10 border border-red-500/20 rounded-xl transition-all flex items-center justify-center space-x-2"
                    >
                        <LogOut size={16} />
                        <span>Sign Out</span>
                    </motion.button>
                    
                    <div className="text-center text-xs text-gray-600 pt-4">
                        Version 2.4.0 (Build 2024)
                    </div>
                </div>
            </div>
        </div>
    );
};

const SettingsItem = ({ icon: Icon, label, toggle }) => (
    <div className="flex items-center justify-between p-4 hover:bg-white/5 cursor-pointer transition-colors group">
        <div className="flex items-center space-x-4">
            <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-gray-400 group-hover:text-white transition-colors">
                <Icon size={16} />
            </div>
            <span className="font-semibold text-gray-200 group-hover:text-white transition-colors">{label}</span>
        </div>
        
        {toggle ? (
            <div className="w-10 h-6 bg-accent-violet rounded-full relative">
                <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm"></div>
            </div>
        ) : (
            <ChevronRight size={18} className="text-gray-600 group-hover:text-gray-400" />
        )}
    </div>
);

export default Settings;
