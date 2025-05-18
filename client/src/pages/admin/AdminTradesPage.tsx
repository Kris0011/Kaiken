
import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { AlertCircle, Search } from 'lucide-react';
import AdminLayout from '@/components/Layout/AdminLayout';
import tradeService, { Trade } from '@/services/trades';

const AdminTradesPage = () => {
  const [trades, setTrades] = useState<Trade[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'pending' | 'won' | 'lost'>('all');

  useEffect(() => {
    const fetchTrades = async () => {
      try {
        const data = await tradeService.getAllTrades();
        // console.log('Fetched trades:', data);
        setTrades(data);
      } catch (error) {
        console.error('Error fetching trades:', error);
        setError('Failed to load trades. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchTrades();
  }, []);

  const getOutcomeBadge = (outcome: string) => {
    switch (outcome) {
      case 'pending':
        return <Badge variant="outline">Pending</Badge>;
      case 'won':
        return <Badge variant="default" className="bg-market-yes">Won</Badge>;
      case 'lost':
        return <Badge variant="destructive">Lost</Badge>;
      default:
        return <Badge variant="outline">Pending</Badge>;
    }
  };

  const getPredictionBadge = (prediction: string) => {
    return prediction === 'yes'
      ? <Badge variant="outline" className="border-market-yes text-market-yes">YES</Badge>
      : <Badge variant="outline" className="border-market-no text-market-no">NO</Badge>;
  };

  // Apply filters
  const filteredTrades = trades
    .filter(trade => {
      if (filter === 'all') return true;
      return trade.status === filter;
    })
    .filter(trade =>
      trade.username?.toLowerCase().includes(search.toLowerCase()) ||
      trade.eventName?.toLowerCase().includes(search.toLowerCase())
    );

  return (
    <AdminLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">All Trades</h1>

        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-grow relative">
            <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by user or event"
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
              <SelectItem value="all">All Trades</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="won">Won</SelectItem>
              <SelectItem value="lost">Lost</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {loading ? (
          <div className="animate-pulse space-y-4">
            <div className="h-10 bg-muted/30 rounded w-full"></div>
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
        ) : filteredTrades.length === 0 ? (
          <div className="text-center py-12 bg-muted/30 rounded-lg">
            <p className="text-muted-foreground">
              {search
                ? `No trades found matching "${search}"`
                : filter !== 'all'
                  ? `No ${filter} trades found`
                  : 'No trades found'
              }
            </p>
          </div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Event</TableHead>
                  <TableHead>Prediction</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Outcome</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTrades.map((trade) => (
                  <TableRow key={trade?.id}>
                    <TableCell className="font-medium">{trade?.username}</TableCell>
                    <TableCell className="max-w-[250px] truncate">{trade?.eventName}</TableCell>
                    <TableCell>{getPredictionBadge(trade?.selection)}</TableCell>
                    <TableCell>${trade?.amount.toFixed(2)}</TableCell>
                    <TableCell>{(trade?.price * 100).toFixed(0)}%</TableCell>
                    <TableCell>{getOutcomeBadge(trade?.status)}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {format(new Date(trade?.createdAt), 'MMM d, yyyy')}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminTradesPage;
