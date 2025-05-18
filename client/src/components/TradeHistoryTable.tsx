
import { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronDown, Filter } from 'lucide-react';
import { Trade } from '@/services/trades';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';
import HeartCoin from './HeartCoin';

interface TradeHistoryTableProps {
  trades: Trade[];
  isAdmin?: boolean;
}

const TradeHistoryTable = ({ trades, isAdmin = false }: TradeHistoryTableProps) => {
  const [filter, setFilter] = useState<'all' | 'pending' | 'won' | 'lost'>('all');

  const filteredTrades = filter === 'all'
    ? trades
    : trades.filter(trade => trade.status === filter);

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

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Trade History</h3>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="flex items-center">
              <Filter size={14} className="mr-2" />
              Filter: {filter.charAt(0).toUpperCase() + filter.slice(1)}
              <ChevronDown size={14} className="ml-2" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Filter by outcome</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => setFilter('all')}>
              All Trades
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setFilter('pending')}>
              Pending
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setFilter('won')}>
              Won
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setFilter('lost')}>
              Lost
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {isAdmin && <TableHead>User</TableHead>}
              <TableHead>Event</TableHead>
              <TableHead>Prediction</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Outcome</TableHead>
              <TableHead>Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTrades.length === 0 ? (
              <TableRow>
                <TableCell colSpan={isAdmin ? 7 : 6} className="text-center py-4 text-muted-foreground">
                  No trades found for the selected filter.
                </TableCell>
              </TableRow>
            ) : (
              filteredTrades.map((trade) => (
                <TableRow key={trade.id}>
                  {isAdmin && <TableCell>{trade.username}</TableCell>}
                  <TableCell>
                    <Link
                      to={`/events/${trade.eventId}`}
                      className="hover:text-accent hover:underline"
                    >
                      {trade.eventName}
                    </Link>
                  </TableCell>
                  <TableCell>{getPredictionBadge(trade.selection)}</TableCell>
                  {/* <TableCell>${trade.amount?.toFixed(2)}</TableCell> */}
                  <TableCell>
                    <HeartCoin amount={trade.amount} size="md" />
                  </TableCell>
                  <TableCell>{(trade.price * 100)?.toFixed(0)}%</TableCell>
                  <TableCell>{getOutcomeBadge(trade.status)}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {trade?.createdAt && !isNaN(new Date(trade.createdAt).getTime())
                      ? format(new Date(trade.createdAt), 'MMM d, yyyy')
                      : 'Invalid date'}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div >
  );
};

export default TradeHistoryTable;
