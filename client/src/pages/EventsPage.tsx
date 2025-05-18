import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import MainLayout from '@/components/Layout/MainLayout';
import EventCard from '@/components/EventCard';
import eventService, { Event } from '@/services/events';
import websocketService from '@/services/websocket';
import { Search, AlertCircle } from 'lucide-react';

const EventsPage = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'live' | 'upcoming' | 'resolved'>('all');

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const data = await eventService.getEvents();
        setEvents(data);
      } catch (error) {
        console.error('Error fetching events:', error);
        setError('Failed to load events. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();

    // Subscribe to WebSocket updates
    const unsubscribe = websocketService.subscribe<Event>('eventUpdated', (updatedEvent) => {
      setEvents(prevEvents => {
        const index = prevEvents.findIndex(e => e._id === updatedEvent._id);
        if (index !== -1) {
          const newEvents = [...prevEvents];
          newEvents[index] = updatedEvent;
          return newEvents;
        } else {
          return [...prevEvents, updatedEvent];
        }
      });
    });

    return unsubscribe;
  }, []);

  // Apply filters
  const filteredEvents = events
    .filter(event => {
      if (filter === 'all') return true;
      return event.status === filter;
    })
  // .filter(event =>
  //   event.name.toLowerCase().includes(search.toLowerCase()) ||
  //   event.category.toLowerCase().includes(search.toLowerCase())
  // );

  // Sort events
  const sortedEvents = [...filteredEvents].sort((a, b) => {
    // Live events first, then upcoming, then resolved
    if (a.status === 'live' && b.status !== 'live') return -1;
    if (a.status !== 'live' && b.status === 'live') return 1;
    if (a.status === 'upcoming' && b.status === 'resolved') return -1;
    if (a.status === 'resolved' && b.status === 'upcoming') return 1;

    // Within the same status, sort by various criteria
    if (a.status === 'live') {
      // For live events, sort by total volume (highest first)
      const aVolume = a.totalYesVolume + a.totalNoVolume;
      const bVolume = b.totalYesVolume + b.totalNoVolume;
      return bVolume - aVolume;
    } else if (a.status === 'upcoming') {
      // For upcoming events, sort by start time (soonest first)
      return new Date(a.startTime).getTime() - new Date(b.startTime).getTime();
    } else {
      // For resolved events, sort by update date (most recent first)
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    }
  });

  return (
    <MainLayout>
      <section className="py-8">
        <div className="container px-4 mx-auto">
          <h1 className="text-3xl font-bold mb-6">Prediction Markets</h1>

          {/* Filter Controls */}
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="flex-grow relative">
              <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search markets"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filter} onValueChange={(value: any) => setFilter(value)}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Filter" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Markets</SelectItem>
                <SelectItem value="live">Live Now</SelectItem>
                <SelectItem value="upcoming">Upcoming</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Events Grid */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="bg-muted/30 animate-pulse h-64 rounded-md"></div>
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-destructive/10 mb-4">
                <AlertCircle size={32} className="text-destructive" />
              </div>
              <p className="text-destructive mb-4">{error}</p>
              <Button onClick={() => window.location.reload()} variant="outline">
                Try Again
              </Button>
            </div>
          ) : sortedEvents.length === 0 ? (
            <div className="text-center py-12 bg-muted/30 rounded-lg">
              <p className="text-muted-foreground">
                {search ?
                  `No markets found matching "${search}"` :
                  filter !== 'all' ?
                    `No ${filter} markets available` :
                    'No markets available'
                }
              </p>
              {search && (
                <Button onClick={() => setSearch('')} variant="outline" className="mt-4">
                  Clear Search
                </Button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sortedEvents.map(event => (
                <EventCard key={event._id} event={event} />
              ))}
            </div>
          )}
        </div>
      </section>
    </MainLayout>
  );
};

export default EventsPage;
