
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import AdminLayout from '@/components/Layout/AdminLayout';
import eventService, { Event } from '@/services/events';
import tradeService, { Trade } from '@/services/trades';
import { AlertCircle, TrendingUp, Users, BarChart as BarChartIcon, PieChart as PieChartIcon, Heart } from 'lucide-react';
import HeartCoin from '@/components/HeartCoin';

// Mock data for dashboard statistics
const getStatsFromData = (events: Event[], trades: Trade[]) => {
  const liveEvents = events.filter(event => event.status === 'live').length;
  const upcomingEvents = events.filter(event => event.status === 'upcoming').length;
  const resolvedEvents = events.filter(event => event.status === 'resolved').length;

  const totalTrades = trades.length;
  const pendingTrades = trades.filter(trade => trade.status === 'pending').length;
  const winningTrades = trades.filter(trade => trade.status === 'won').length;
  const losingTrades = trades.filter(trade => trade.status === 'lost').length;

  const totalVolume = events.reduce((sum, event) => sum + event.totalYesVolume + event.totalNoVolume, 0);

  // Extract unique user IDs from trades
  const uniqueUsers = new Set(trades.map(trade => trade.userId)).size;

  return {
    liveEvents,
    upcomingEvents,
    resolvedEvents,
    totalTrades,
    pendingTrades,
    winningTrades,
    losingTrades,
    totalVolume,
    uniqueUsers
  };
};

const AdminDashboardPage = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [trades, setTrades] = useState<Trade[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [eventsData, tradesData] = await Promise.all([
          eventService.getEvents(),
          tradeService.getAllTrades()
        ]);

        setEvents(eventsData);
        setTrades(tradesData);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setError('Failed to load dashboard data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <AdminLayout>
        <div className="space-y-6">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <div className="animate-pulse space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-24 bg-muted/30 rounded"></div>
              ))}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="h-64 bg-muted/30 rounded"></div>
              <div className="h-64 bg-muted/30 rounded"></div>
            </div>
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout>
        <div className="text-center py-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-destructive/10 mb-4">
            <AlertCircle size={32} className="text-destructive" />
          </div>
          <h1 className="text-2xl font-bold mb-2">Error Loading Dashboard</h1>
          <p className="text-muted-foreground mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
          >
            Try Again
          </button>
        </div>
      </AdminLayout>
    );
  }

  // Prepare stats and chart data
  const stats = getStatsFromData(events, trades);

  const eventStatusData = [
    { name: 'Live', value: stats.liveEvents, color: 'hsl(var(--accent))' },
    { name: 'Upcoming', value: stats.upcomingEvents, color: '#9333ea' },
    { name: 'Resolved', value: stats.resolvedEvents, color: '#6366f1' },
  ];

  const tradeOutcomeData = [
    { name: 'Pending', value: stats.pendingTrades, color: '#f59e0b' },
    { name: 'Won', value: stats.winningTrades, color: 'hsl(var(--market-yes))' },
    { name: 'Lost', value: stats.losingTrades, color: 'hsl(var(--market-no))' },
  ];

  // Top events by volume
  const topEvents = [...events]
    .sort((a, b) => (b.totalNoVolume + b.totalYesVolume) - (a.totalNoVolume + a.totalYesVolume))
    .slice(0, 5)
    .map(event => ({
      name: event.name.length > 20 ? event.name.substring(0, 20) + '...' : event.name,
      volume: event.totalNoVolume + event.totalYesVolume,
    }));

  return (
    <AdminLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-6 flex items-center">
              <div className="bg-accent/20 w-12 h-12 rounded-full flex items-center justify-center mr-4">
                <BarChartIcon size={24} className="text-accent" />
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Total Events</div>
                <div className="text-2xl font-bold">
                  {events.length}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 flex items-center">
              <div className="bg-accent/20 w-12 h-12 rounded-full flex items-center justify-center mr-4">
                <TrendingUp size={24} className="text-accent" />
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Total Volume</div>
                <div className="text-2xl font-bold">
                  {/* ${stats.totalVolume.toLocaleString()} */}
                  <HeartCoin amount={stats.totalVolume} size="xl" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 flex items-center">
              <div className="bg-accent/20 w-12 h-12 rounded-full flex items-center justify-center mr-4">
                <Users size={24} className="text-accent" />
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Active Users</div>
                <div className="text-2xl font-bold">
                  {stats.uniqueUsers}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Event Status Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChartIcon size={18} className="text-muted-foreground" />
                <span>Events by Status</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsPieChart>
                  <Pie
                    data={eventStatusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={5}
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}`}
                  >
                    {eventStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Legend />
                  <Tooltip />
                </RechartsPieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Top Events by Volume */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChartIcon size={18} className="text-muted-foreground" />
                <span>Top Events by Volume</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={topEvents}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                  <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                  <YAxis tickFormatter={(value) => `$${value}`} />
                  <Tooltip formatter={(value) => [`$${value}`, 'Volume']} />
                  <Bar dataKey="volume" fill="hsl(var(--accent))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Trade Outcome Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChartIcon size={18} className="text-muted-foreground" />
                <span>Trade Outcomes</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsPieChart>
                  <Pie
                    data={tradeOutcomeData}
                    cx="50%"
                    cy="50%"
                    outerRadius={90}
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}`}
                  >
                    {tradeOutcomeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Legend />
                  <Tooltip />
                </RechartsPieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboardPage;
