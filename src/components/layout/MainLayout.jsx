import { Outlet } from 'react-router-dom';
import PropTypes from 'prop-types';

const MainLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-[#0D0D0D] text-white">
      {/* Background Gradient Overlay */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#8B5CF6]/20 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#F59E0B]/10 rounded-full blur-[120px]"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10">
        {children || <Outlet />}
      </div>
    </div>
  );
};

MainLayout.propTypes = {
  children: PropTypes.node,
};

export default MainLayout;
