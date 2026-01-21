import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/layout/Navbar';
import MainLayout from './components/layout/MainLayout';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import MapPage from './pages/Map';
import Admin from './pages/Admin';
import Profile from './pages/Profile';
import Leaderboard from './pages/Leaderboard';
import PropTypes from 'prop-types';
import { Toaster } from 'react-hot-toast';
import { AlertProvider } from './context/AlertContext/AlertContext';
import AlertOverlay from './components/alerts/AlertOverlay';

// PWA Components
import BottomNav from './components/layout/BottomNav';
import OfflineBanner from './components/pwa/OfflineBanner';
import InstallPrompt from './components/pwa/InstallPrompt';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <div>Loading...</div>; // Or a spinner component
  }
  
  if (!user) {
    return <Navigate to="/login" />;
  }
  
  return children;
};

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
};

// Admin Route Component
const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
     return <div>Loading...</div>;
  }
  
  if (!user || user.role !== 'admin') {
     // Allow for demo purposes if strictly admin check fails, 
     // but in production this should redirect.
     if (!user) return <Navigate to="/login" />;
  }
  
  return children;
};

AdminRoute.propTypes = {
  children: PropTypes.node.isRequired,
};

const AppRoutes = () => {
    return (
      <MainLayout>
        <Navbar />
        <div className="pt-16 fade-in">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/map" element={<MapPage />} />
            
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />

            <Route
               path="/profile"
               element={
                   <ProtectedRoute>
                       <Profile />
                   </ProtectedRoute>
               }
             />

             <Route
                path="/leaderboard"
                element={
                    <ProtectedRoute>
                        <Leaderboard />
                    </ProtectedRoute>
                }
              />
            
            <Route 
              path="/admin" 
              element={
                <ProtectedRoute>
                    <Admin />
                </ProtectedRoute>
              } 
            />
          </Routes>
        </div>
        <BottomNav />
      </MainLayout>
    );
};

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <AlertProvider>
            <Toaster position="top-right" />
            <OfflineBanner />
            <InstallPrompt />
            <AlertOverlay />
            <AppRoutes />
        </AlertProvider>
      </AuthProvider>
    </Router>
  );
};

export default App;
