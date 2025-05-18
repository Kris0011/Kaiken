
import { ReactNode } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { AlertCircle, BarChart, CalendarDays, Home, ListFilter } from 'lucide-react';
import MainLayout from './MainLayout';

interface AdminLayoutProps {
  children: ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };
  
  return (
    <MainLayout requireAuth={true} requireAdmin={true}>
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar */}
          <aside className="w-full md:w-64 shrink-0">
            <div className="bg-card rounded-lg shadow-sm p-4 sticky top-20">
              <h2 className="font-medium text-lg mb-4 flex items-center">
                <AlertCircle size={18} className="mr-2 text-accent" />
                Admin Panel
              </h2>
              <nav className="space-y-1">
                <Link 
                  to="/admin/dashboard" 
                  className={`flex items-center space-x-2 px-3 py-2 rounded-md w-full ${
                    isActive('/admin/dashboard') 
                      ? 'bg-accent text-accent-foreground' 
                      : 'hover:bg-muted transition-colors'
                  }`}
                >
                  <BarChart size={18} />
                  <span>Dashboard</span>
                </Link>
                <Link 
                  to="/admin/events" 
                  className={`flex items-center space-x-2 px-3 py-2 rounded-md w-full ${
                    isActive('/admin/events') 
                      ? 'bg-accent text-accent-foreground' 
                      : 'hover:bg-muted transition-colors'
                  }`}
                >
                  <CalendarDays size={18} />
                  <span>Manage Events</span>
                </Link>
                <Link 
                  to="/admin/trades" 
                  className={`flex items-center space-x-2 px-3 py-2 rounded-md w-full ${
                    isActive('/admin/trades') 
                      ? 'bg-accent text-accent-foreground' 
                      : 'hover:bg-muted transition-colors'
                  }`}
                >
                  <ListFilter size={18} />
                  <span>All Trades</span>
                </Link>
                <Link 
                  to="/" 
                  className="flex items-center space-x-2 px-3 py-2 rounded-md w-full hover:bg-muted transition-colors"
                >
                  <Home size={18} />
                  <span>Back to Site</span>
                </Link>
              </nav>
            </div>
          </aside>
          
          {/* Content */}
          <div className="flex-grow">
            {children}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default AdminLayout;
