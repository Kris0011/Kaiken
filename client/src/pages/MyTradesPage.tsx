
import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import MainLayout from '@/components/Layout/MainLayout';
import TradeHistoryTable from '@/components/TradeHistoryTable';
import tradeService, { Trade } from '@/services/trades';
import websocketService from '@/services/websocket';
import { AlertCircle, LineChart } from 'lucide-react';
import HeartCoin from '@/components/HeartCoin';

const MyTradesPage = () => {
  const [trades, setTrades] = useState<Trade[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTrades = async () => {
      try {
        const data = await tradeService.getMyTrades();
        setTrades(data);
      } catch (error) {
        console.error('Error fetching trades:', error);
        setError('Failed to load trades. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchTrades();

    // Subscribe to WebSocket updates
    const unsubscribe = websocketService.subscribe<Trade>('tradeUpdated', (updatedTrade) => {
      setTrades(prevTrades => {
        const index = prevTrades.findIndex(t => t.id === updatedTrade.id);
        if (index !== -1) {
          const newTrades = [...prevTrades];
          newTrades[index] = updatedTrade;
          return newTrades;
        }
        return prevTrades;
      });
    });

    return unsubscribe;
  }, []);

  // Calculate trading statistics
  const pendingTrades = trades.filter(trade => trade.status === 'pending');
  const completedTrades = trades.filter(trade => trade.status !== 'pending');
  const winningTrades = trades.filter(trade => trade.status === 'won');
  const losingTrades = trades.filter(trade => trade.status === 'lost');

  const totalInvested = trades.reduce((sum, trade) => sum + trade.amount, 0);
  const totalWon = winningTrades.reduce((sum, trade) => {
    const payout = trade.amount / trade.price;
    return sum + payout;
  }, 0);
  const totalLost = losingTrades.reduce((sum, trade) => sum + trade.amount, 0);
  const netProfit = totalWon - totalInvested;

  return (
    <MainLayout requireAuth>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">My Trades</h1>

        {/* Trading Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-card">
            <CardContent className="p-6">
              <div className="text-sm text-muted-foreground mb-1">Total Trades</div>
              <div className="text-2xl font-bold">{trades.length}</div>
            </CardContent>
          </Card>

          <Card className="bg-card">
            <CardContent className="p-6">
              <div className="text-sm text-muted-foreground mb-1">Pending</div>
              <div className="text-2xl font-bold">{pendingTrades.length}</div>
            </CardContent>
          </Card>

          <Card className="bg-card">
            <CardContent className="p-6">
              <div className="text-sm text-muted-foreground mb-1">Win Rate</div>
              <div className="text-2xl font-bold">
                {completedTrades.length > 0
                  ? `${((winningTrades.length / completedTrades.length) * 100).toFixed(0)}%`
                  : '0%'}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card">
            <CardContent className="p-6">
              <div className="text-sm text-muted-foreground mb-1">Net Profit</div>
              <div className={`text-2xl font-bold flex items-center ${netProfit >= 0 ? 'text-market-yes' : 'text-market-no'}`}>
                <LineChart size={18} className="mr-1" />
                <HeartCoin amount={netProfit.toFixed(2)} size="xl" />
                {/* ${netProfit.toFixed(2)} */}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Trades Table */}
        {loading ? (
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-muted/50 rounded w-1/4"></div>
            <div className="h-64 bg-muted/30 rounded"></div>
          </div>
        ) : error ? (
          <div className="text-center py-12 bg-muted/30 rounded-lg">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-destructive/10 mb-4">
              <AlertCircle size={32} className="text-destructive" />
            </div>
            <p className="text-destructive mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
            >
              Try Again
            </button>
          </div>
        ) : trades.length === 0 ? (
          <div className="text-center py-12 bg-muted/30 rounded-lg">
            <p className="text-muted-foreground mb-4">You haven't placed any trades yet.</p>
            <a
              href="/events"
              className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
            >
              Browse Markets
            </a>
          </div>
        ) : (
          <div className="bg-card rounded-lg shadow-sm">
            <TradeHistoryTable trades={trades} />
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default MyTradesPage;
