
import { ReactNode, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import { useAuth } from '@/contexts/AuthContext';
import websocketService from '@/services/websocket';

interface MainLayoutProps {
  children: ReactNode;
  requireAuth?: boolean;
  requireAdmin?: boolean;
}

const MainLayout = ({ children, requireAuth = false, requireAdmin = false }: MainLayoutProps) => {
  const { isAuthenticated, isAdmin, loading } = useAuth();

  // console.log('MainLayout', { isAuthenticated, isAdmin, loading });
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Connect to WebSocket when authenticated
    if (isAuthenticated) {
      websocketService.connect();
    }

    return () => {
      if (isAuthenticated) {
        websocketService.disconnect();
      }
    };
  }, [isAuthenticated]);

  useEffect(() => {
    // Handle authentication and admin access requirements
    if (!loading) {
      if (requireAuth && !isAuthenticated) {
        navigate('/login', { state: { from: location.pathname } });
      } else if (requireAdmin && !isAdmin) {
        navigate('/');
      }
    }
  }, [isAuthenticated, isAdmin, loading, navigate, requireAuth, requireAdmin, location]);

  if (loading && (requireAuth || requireAdmin)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;
