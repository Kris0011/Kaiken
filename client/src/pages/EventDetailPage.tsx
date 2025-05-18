import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { format, formatDistanceToNow, parseISO } from 'date-fns';
import { AlertCircle, Clock, Timer, Calendar, TrendingUp, Heart } from 'lucide-react';
import { toast } from 'sonner';
import MainLayout from '@/components/Layout/MainLayout';
import TradeForm from '@/components/TradeForm';
import PriceChart from '@/components/PriceChart';
import TradeHistoryTable from '@/components/TradeHistoryTable';
import eventService, { Event } from '@/services/events';
import tradeService, { Trade, CreateTradeRequest } from '@/services/trades';
import { useAuth } from '@/contexts/AuthContext';
import websocketService from '@/services/websocket';
import HeartCoin from '@/components/HeartCoin';

// Mock price history data (would come from API in real implementation)
const generateMockPriceHistory = (event: Event) => {
  const now = new Date();
  const data = [];
  // Generate 20 price points over the last few hours
  for (let i = 0; i < 20; i++) {
    const time = new Date(now.getTime() - (20 - i) * 30 * 60000); // Every 30 minutes
    let price = event.currentYesPrice;
    // Add some random variation but keep within 20% of current price
    const variation = (Math.random() * 0.2) - 0.1; // -10% to +10%
    price = Math.max(0.1, Math.min(0.9, price + variation * price));

    data.push({
      timestamp: time.toISOString(),
      price
    });
  }
  // Make sure the latest point matches the current price
  data.push({
    timestamp: now.toISOString(),
    price: event.currentYesPrice
  });

  return data;
};

const EventDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const { isAuthenticated, user } = useAuth();
  const [event, setEvent] = useState<Event | null>(null);
  const [trades, setTrades] = useState<Trade[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [priceHistory, setPriceHistory] = useState<any[]>([]);

  useEffect(() => {
    const fetchEventData = async () => {
      try {
        if (id) {
          const eventData = await eventService.getEvent(id);
          setEvent(eventData);

          // In a real app, you would get real price history from an API
          setPriceHistory(generateMockPriceHistory(eventData));

          // Fetch trades for this event
          const tradesData = await tradeService.getTradesByEvent(id);
          setTrades(tradesData);
        }
      } catch (error) {
        console.error('Error fetching event data:', error);
        setError('Failed to load event data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchEventData();

    // Subscribe to WebSocket updates
    const eventUnsubscribe = websocketService.subscribe<Event>('eventUpdated', (updatedEvent) => {
      if (updatedEvent._id === id) {
        setEvent(updatedEvent);
        // Update price history with new point
        setPriceHistory(prev => [...prev, {
          timestamp: new Date().toISOString(),
          price: updatedEvent.currentYesPrice
        }]);
      }
    });

    const tradeUnsubscribe = websocketService.subscribe<Trade>('tradeUpdated', (updatedTrade) => {
      if (updatedTrade.eventId === id) {
        setTrades(prev => {
          const index = prev.findIndex(t => t.id === updatedTrade.id);
          if (index !== -1) {
            const newTrades = [...prev];
            newTrades[index] = updatedTrade;
            return newTrades;
          } else {
            return [updatedTrade, ...prev];
          }
        });
      }
    });

    return () => {
      eventUnsubscribe();
      tradeUnsubscribe();
    };
  }, [id]);

  const handleTrade = async (data: CreateTradeRequest) => {
    if (!isAuthenticated) {
      toast.error('You must be logged in to place trades');
      return;
    }

    if (!event) return;

    try {
      const newTrade = await tradeService.createTrade(data);
      setTrades([newTrade, ...trades]);
      toast.success('Trade placed successfully!');
    } catch (error: any) {
      console.error('Error placing trade:', error);
      toast.error(error.response?.data?.message || 'Failed to place trade');
    }
  };

  const getStatusDisplay = () => {
    if (!event) return null;

    switch (event.status) {
      case 'live':
        return (
          <Badge variant="default" className="bg-market-yes">
            <div className="live-indicator"></div>
            Live Now
          </Badge>
        );
      case 'upcoming':
        return <Badge variant="outline">Upcoming</Badge>;
      case 'resolved':
        return (
          <Badge variant="outline" className={event.result === 'yes' ? 'border-market-yes text-market-yes' : 'border-market-no text-market-no'}>
            Resolved: {event.result?.toUpperCase()}
          </Badge>
        );
      default:
        return null;
    }
  };

  const getCountdownDisplay = () => {
    if (!event) return null;

    const now = new Date();
    const startDate = parseISO(event.startTime);
    // const endDate = parseISO(event.endDate);

    if (event.status === 'live') {
      return (
        <div className="flex items-center">
          <Clock size={16} className="mr-2 text-muted-foreground" />
          {/* <span>Ends {formatDistanceToNow(endDate, { addSuffix: true })}</span> */}
        </div>
      );
    } else if (event.status === 'upcoming') {
      return (
        <div className="flex items-center">
          <Timer size={16} className="mr-2 text-muted-foreground" />
          <span>Starts {formatDistanceToNow(startDate, { addSuffix: true })}</span>
        </div>
      );
    } else if (event.status === 'resolved') {
      return (
        <div className="flex items-center">
          <Calendar size={16} className="mr-2 text-muted-foreground" />
          <span>Resolved on {format(parseISO(event.updatedAt), 'MMM d, yyyy')}</span>
        </div>
      );
    }

    return null;
  };

  const userTrades = trades.filter(trade => user && trade.userId === user.id);

  if (loading) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-muted/50 rounded w-1/3"></div>
            <div className="h-4 bg-muted/50 rounded w-1/4"></div>
            <div className="h-64 bg-muted/30 rounded"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="h-48 bg-muted/30 rounded"></div>
              <div className="h-48 bg-muted/30 rounded"></div>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (error || !event) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-destructive/10 mb-4">
            <AlertCircle size={32} className="text-destructive" />
          </div>
          <h1 className="text-2xl font-bold mb-2">Error Loading Event</h1>
          <p className="text-muted-foreground mb-6">{error || 'Event not found'}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
          >
            Try Again
          </button>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-wrap gap-2 items-center mb-2">
          {getStatusDisplay()}
          {getCountdownDisplay()}
        </div>

        <h1 className="text-2xl md:text-3xl font-bold mb-4">{event.name}</h1>

        <div className="flex flex-col md:flex-row gap-6 bg-muted/30 rounded-lg p-6 mb-8 items-start">
          {event.image && (
            <div className="flex-shrink-0 mb-4 md:mb-0">
              <img
                src={event.image}
                alt={event.name}
                className="w-48 h-48 object-cover rounded-lg shadow"
              />
            </div>
          )}
          <p className="text-muted-foreground text-base leading-relaxed">{event.description}</p>
        </div>

        {/* Price Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="text-sm text-muted-foreground mb-1">Yes Price</div>
              <div className="text-2xl font-bold text-market-yes">
                {(event.currentYesPrice * 100).toFixed(0)}%
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="text-sm text-muted-foreground mb-1">No Price</div>
              <div className="text-2xl font-bold text-market-no">
                {(100 - event.currentYesPrice * 100).toFixed(0)}%
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="text-sm text-muted-foreground mb-1">Yes Volume</div>
              <div className="text-2xl font-bold text-market-yes">
                {/* ${event.totalYesVolume.toLocaleString()} */}
                <HeartCoin amount={event.totalYesVolume} size='xl' />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="text-sm text-muted-foreground mb-1">No Volume</div>
              <div className="text-2xl font-bold text-market-no">
                {/* ${event.totalNoVolume.toLocaleString()} */}
                <HeartCoin amount={event.totalNoVolume} size='xl' />
              </div>
            </CardContent>
          </Card>
        </div>

        {event.status === 'resolved' && (
          <Alert className={`mb-6 ${event.result === 'yes' ? 'border-market-yes' : 'border-market-no'}`}>
            <AlertDescription className="flex items-center">
              This market has resolved to <span className={`font-semibold ml-1 ${event.result === 'yes' ? 'text-market-yes' : 'text-market-no'}`}>
                {event.result === 'yes' ? 'YES' : 'NO'}
              </span>
            </AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Chart and Trades Section */}
          <div className="lg:col-span-2">
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-medium mb-4">Market Price History</h2>
                <PriceChart data={priceHistory} height={300} />
              </CardContent>
            </Card>

            <div className="mt-6">
              <Tabs defaultValue="all">
                <TabsList>
                  {/* <TabsTrigger value="all">All Trades</TabsTrigger> */}
                  {isAuthenticated && userTrades.length > 0 && (
                    <TabsTrigger value="my">My Trades</TabsTrigger>
                  )}
                </TabsList>
                {/* <TabsContent value="all" className="mt-4">
                  <TradeHistoryTable trades={trades} />
                </TabsContent> */}
                {isAuthenticated && userTrades.length > 0 && (
                  <TabsContent value="my" className="mt-4">
                    <TradeHistoryTable trades={userTrades} />
                  </TabsContent>
                )}
              </Tabs>
            </div>
          </div>

          {/* Trading Panel */}
          <div>
            {!isAuthenticated ? (
              <Card>
                <CardContent className="p-6 text-center">
                  <h3 className="font-medium mb-2">Login to Trade</h3>
                  <p className="text-muted-foreground text-sm mb-4">
                    You need to be logged in to place trades on this market.
                  </p>
                  <div className="flex justify-center space-x-4">
                    <a href="/login" className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90">
                      Log In
                    </a>
                    <a href="/register" className="px-4 py-2 border border-input bg-background hover:bg-accent hover:text-accent-foreground rounded-md">
                      Sign Up
                    </a>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <TradeForm event={event} onSubmit={handleTrade} />
            )}

            {/* Trading Info */}
            <Card className="mt-6">
              <CardContent className="p-6">
                <h3 className="font-medium mb-2">Market Details</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Start Time:</span>
                    <span>{format(parseISO(event.startTime), 'MMM d, yyyy h:mm a')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Created:</span>
                    <span>{formatDistanceToNow(parseISO(event.createdAt), { addSuffix: true })}</span>
                  </div>
                  {event.status === 'resolved' && (
                    <>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Resolved:</span>
                        <span>{format(parseISO(event.updatedAt), 'MMM d, yyyy h:mm a')}</span>
                      </div>
                      <div className="flex justify-between font-medium">
                        <span>Result:</span>
                        <span className={`${event.result === 'yes' ? 'text-market-yes' : 'text-market-no'}`}>
                          {event.result?.toUpperCase()}
                        </span>
                      </div>
                      <div className="flex justify-between font-medium">
                        <span>Winning Outcome:</span>
                        <span className={`${event.winningOutcome === 'yes' ? 'text-market-yes' : event.winningOutcome === 'no' ? 'text-market-no' : ''}`}>
                          {event.winningOutcome ? event.winningOutcome.toUpperCase() : 'N/A'}
                        </span>
                      </div>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default EventDetailPage;
