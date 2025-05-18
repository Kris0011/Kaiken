import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { ModeToggle } from '../ModeToggle';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Home,
  CalendarDays,
  User,
  LogOut,
  Settings,
  ChevronDown,
  PieChart,
  Wallet
} from 'lucide-react';
import HeartCoin from '../HeartCoin';

const Navbar = () => {
  const { isAuthenticated, user, logout, isAdmin } = useAuth();
  const location = useLocation();



  return (
    <nav className="border-b border-border sticky top-0 z-30 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <div className="bg-accent rounded-full p-1.5">
            <PieChart size={20} className="text-accent-foreground" />
          </div>
          <span className="text-xl font-bold">Kaiken</span>
        </Link>

        <div className="hidden md:flex items-center space-x-6">
          <Link
            to="/"
            className={`flex items-center space-x-1 hover:text-accent ${location.pathname === '/' ? 'text-accent font-medium' : ''}`}
          >
            <Home size={18} />
            <span>Home</span>
          </Link>
          <Link
            to="/events"
            className={`flex items-center space-x-1 hover:text-accent ${location.pathname === '/events' || location.pathname.startsWith('/events/') ? 'text-accent font-medium' : ''}`}
          >
            <CalendarDays size={18} />
            <span>Events</span>
          </Link>
          {isAuthenticated && (
            <Link
              to="/my-trades"
              className={`flex items-center space-x-1 hover:text-accent ${location.pathname === '/my-trades' ? 'text-accent font-medium' : ''}`}
            >
              <User size={18} />
              <span>My Trades</span>
            </Link>
          )}
        </div>

        <div className="flex items-center space-x-4">
          {isAuthenticated && (
            <div className="bg-muted/50 rounded-full px-3 py-1.5 flex items-center">
              <Wallet size={16} className="mr-1.5 text-accent" />
              <HeartCoin amount={user.walletBalance} />
            </div>
          )}

          <ModeToggle />

          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex items-center space-x-2">
                  <span>{user?.username}</span>
                  <ChevronDown size={16} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {isAdmin && (
                  <>
                    <DropdownMenuItem asChild>
                      <Link to="/admin/dashboard" className="w-full flex items-center">
                        <Settings size={16} className="mr-2" />
                        <span>Admin Dashboard</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                  </>
                )}
                <DropdownMenuItem asChild>
                  <Link to="/my-trades" className="w-full flex items-center">
                    <User size={16} className="mr-2" />
                    <span>My Trades</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={logout} className="text-destructive focus:text-destructive">
                  <LogOut size={16} className="mr-2" />
                  <span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center space-x-4">
              <Link to="/login">
                <Button variant="outline">Log in</Button>
              </Link>
              <Link to="/register" className="hidden sm:block">
                <Button>Sign up</Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;