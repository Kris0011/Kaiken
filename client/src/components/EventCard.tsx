import { Link } from 'react-router-dom';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowRight, Clock, Heart } from 'lucide-react';
import { Event } from '@/services/events';
import { formatDistanceToNow, parseISO, isAfter, isBefore } from 'date-fns';
import HeartCoin from './HeartCoin';

interface EventCardProps {
  event: Event;
  compact?: boolean;
}

const EventCard = ({ event, compact = false }: EventCardProps) => {
  const isLive = event.status === 'live';
  const isUpcoming = event.status === 'upcoming';
  const isResolved = event.status === 'resolved';

  const startTime = parseISO(event.startTime);
  const now = new Date();

  const isStartingSoon =
    isUpcoming &&
    isAfter(startTime, now) &&
    isBefore(startTime, new Date(now.getTime() + 24 * 60 * 60 * 1000));

  const getStatusBadge = () => {
    if (isLive) {
      return <Badge variant="default" className="bg-market-yes">Live Now</Badge>;
    } else if (isResolved) {
      return <Badge variant="outline">Resolved</Badge>;
    } else if (isStartingSoon) {
      return <Badge variant="secondary" className="border-accent text-accent">Starting Soon</Badge>;
    } else {
      return <Badge variant="outline">Upcoming</Badge>;
    }
  };

  return (
    <Card className="h-full transition-all hover:shadow event-card">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg">{event.name}</CardTitle>
          {getStatusBadge()}
        </div>
        {event.image && (
          <img
            src={event.image}
            alt={event.name}
            className="w-full h-40 object-cover rounded mt-2"
          />
        )}
      </CardHeader>
      <CardContent>
        {/* No description field in new interface */}
        <div className="flex flex-col space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Yes Price:</span>
            <span className="price-yes">{(event.currentYesPrice * 100).toFixed(0)}%</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">No Price:</span>
            <span className="price-no">{(100 - event.currentYesPrice * 100).toFixed(0)}%</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Volume:</span>
            <span>
              <HeartCoin amount={event.totalYesVolume + event.totalNoVolume} size="md" />
            </span>
          </div>
          <div className="flex justify-between text-sm items-center">
            <span className="text-muted-foreground flex items-center">
              <Clock size={14} className="mr-1" />
              {isLive ? 'Started' : isUpcoming ? 'Starts' : 'Ended'}:
            </span>
            <span className="font-medium">
              {isLive
                ? formatDistanceToNow(startTime, { addSuffix: true })
                : isUpcoming
                  ? formatDistanceToNow(startTime, { addSuffix: true })
                  : formatDistanceToNow(parseISO(event.updatedAt), { addSuffix: true })
              }
            </span>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Link to={`/events/${event._id}`} className="w-full">
          <Button variant={isLive ? "default" : "outline"} className="w-full">
            <span>{isLive ? 'Trade Now' : 'View Market'}</span>
            <ArrowRight size={16} className="ml-2" />
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
};

export default EventCard;
