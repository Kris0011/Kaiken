
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { format, parseISO } from 'date-fns';
import { Plus, Edit, Trash2, AlertCircle, CheckCircle, XCircle } from 'lucide-react';
import AdminLayout from '@/components/Layout/AdminLayout';
import EventForm from '@/components/EventForm';
import eventService, { Event, UpdateEventStatusRequest } from '@/services/events';
import HeartCoin from '@/components/HeartCoin';

const AdminEventsPage = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isResolveDialogOpen, setIsResolveDialogOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
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
  }, []);

  const handleCreateEvent = async (data: any) => {
    try {
      const newEvent = await eventService.createEvent(data);
      setEvents([...events, newEvent]);
      // setIsCreateDialogOpen(false);
      toast.success('Event created successfully!');
    } catch (error) {
      console.error('Error creating event:', error);
      toast.error('Failed to create event');
    }
  };

  const handleUpdateEvent = async (data: any) => {
    if (!selectedEvent) return;

    try {
      const updatedEvent = await eventService.updateEvent(selectedEvent._id, data);
      setEvents(events.map(event => event._id === selectedEvent._id ? updatedEvent : event));
      setIsEditDialogOpen(false);
      setSelectedEvent(null);
      toast.success('Event updated successfully!');
    } catch (error) {
      console.error('Error updating event:', error);
      toast.error('Failed to update event');
    }
  };

  const handleDeleteEvent = async () => {
    if (!selectedEvent) return;

    try {
      await eventService.deleteEvent(selectedEvent._id);
      setEvents(events.filter(event => event._id !== selectedEvent._id));
      setIsDeleteDialogOpen(false);
      setSelectedEvent(null);
      toast.success('Event deleted successfully!');
    } catch (error) {
      console.error('Error deleting event:', error);
      toast.error('Failed to delete event');
    }
  };

  const handleUpdateStatus = async (status: 'upcoming' | 'live' | 'resolved', result?: 'yes' | 'no') => {
    if (!selectedEvent) return;

    try {
      const data: UpdateEventStatusRequest = { status };
      if (status === 'resolved' && result) {
        data.result = result;
      }

      const updatedEvent = await eventService.updateEventStatus(selectedEvent._id, data);
      setEvents(events.map(event => event._id === selectedEvent._id ? updatedEvent : event));
      setIsResolveDialogOpen(false);
      setSelectedEvent(null);
      toast.success(`Event ${status === 'resolved' ? 'resolved' : 'status updated'} successfully!`);
    } catch (error) {
      console.error('Error updating event status:', error);
      toast.error('Failed to update event status');
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'live':
        return <Badge variant="default" className="bg-market-yes">Live</Badge>;
      case 'upcoming':
        return <Badge variant="outline">Upcoming</Badge>;
      case 'resolved':
        return <Badge variant="outline">Resolved</Badge>;
      default:
        return null;
    }
  };

  // Apply filters
  const filteredEvents = events.filter(event => {
    if (filter === 'all') return true;
    return event.status === filter;
  });

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Manage Events</h1>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus size={16} className="mr-2" />
                Create Event
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Create New Event</DialogTitle>
                <DialogDescription>
                  Enter the details for your new prediction market event.
                </DialogDescription>
              </DialogHeader>
              <EventForm onSubmit={handleCreateEvent} />
            </DialogContent>
          </Dialog>
        </div>

        <div className="flex justify-between items-center">
          <Select value={filter} onValueChange={(value: any) => setFilter(value)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Events</SelectItem>
              <SelectItem value="live">Live</SelectItem>
              <SelectItem value="upcoming">Upcoming</SelectItem>
              <SelectItem value="resolved">Resolved</SelectItem>
            </SelectContent>
          </Select>
          <div className="text-sm text-muted-foreground">
            Total: {filteredEvents.length} {filter !== 'all' ? filter : ''} events
          </div>
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
            <Button onClick={() => window.location.reload()} variant="outline">
              Try Again
            </Button>
          </div>
        ) : filteredEvents.length === 0 ? (
          <div className="text-center py-12 bg-muted/30 rounded-lg">
            <p className="text-muted-foreground mb-4">
              {filter !== 'all' ? `No ${filter} events found.` : 'No events found.'}
            </p>
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus size={16} className="mr-2" />
                  Create First Event
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>Create New Event</DialogTitle>
                  <DialogDescription>
                    Enter the details for your new prediction market event.
                  </DialogDescription>
                </DialogHeader>
                <EventForm onSubmit={handleCreateEvent} />
              </DialogContent>
            </Dialog>
          </div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Start Date</TableHead>
                  <TableHead>Yes Price</TableHead>
                  <TableHead>Yes Volume</TableHead>
                  <TableHead>No Volume</TableHead>
                  <TableHead>Result</TableHead>
                  <TableHead>Winning Outcome</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEvents.map((event) => (
                  <TableRow key={event?._id}>
                    <TableCell className="max-w-[250px] truncate">{event?.name}</TableCell>
                    <TableCell>{event?.description?.slice(0, 20)}{event?.description?.length > 20 ? '...' : ''}</TableCell>
                    <TableCell>{getStatusBadge(event?.status)}</TableCell>
                    <TableCell>{format(parseISO(event?.startTime), 'MMM d, yyyy')}</TableCell>
                    <TableCell>
                      {event?.currentYesPrice ? `${(event.currentYesPrice * 100).toFixed(0)}%` : '-'}
                    </TableCell>
                    <TableCell>
                      <HeartCoin amount={event?.totalYesVolume} size="md" />
                    </TableCell>
                    <TableCell>
                      <HeartCoin amount={event?.totalNoVolume} size="md" />
                    </TableCell>
                    {/* <TableCell>${event?.totalYesVolume.toLocaleString()}</TableCell> */}
                    {/* <TableCell>${event?.totalNoVolume.toLocaleString()}</TableCell> */}
                    <TableCell>
                      {event.result === 'yes' ? (
                        <span className="text-market-yes">YES</span>
                      ) : event.result === 'no' ? (
                        <span className="text-market-no">NO</span>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {event.winningOutcome === 'yes' ? (
                        <span className="text-market-yes">YES</span>
                      ) : event.winningOutcome === 'no' ? (
                        <span className="text-market-no">NO</span>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        {/* Edit Button */}
                        <Dialog open={isEditDialogOpen && selectedEvent?._id === event._id} onOpenChange={(open) => {
                          setIsEditDialogOpen(open);
                          if (!open) setSelectedEvent(null);
                        }}>
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => setSelectedEvent(event)}
                              disabled={event.status === 'resolved'}
                            >
                              <Edit size={16} />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-[600px]">
                            <DialogHeader>
                              <DialogTitle>Edit Event</DialogTitle>
                              <DialogDescription>
                                Update the details for this event.
                              </DialogDescription>
                            </DialogHeader>
                            {selectedEvent && (
                              <EventForm
                                initialData={{
                                  ...selectedEvent,
                                  image: undefined // Do not prefill image as File, let user upload if needed
                                }}
                                onSubmit={handleUpdateEvent}
                                isEditing={true}
                              />
                            )}
                          </DialogContent>
                        </Dialog>

                        {/* Resolve Dialog */}
                        <Dialog open={isResolveDialogOpen && selectedEvent?._id === event._id} onOpenChange={(open) => {
                          setIsResolveDialogOpen(open);
                          if (!open) setSelectedEvent(null);
                        }}>
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => setSelectedEvent(event)}
                              disabled={event.status === 'resolved'}
                            >
                              {event.status === 'upcoming' ? (
                                <CheckCircle size={16} className="text-market-yes" />
                              ) : (
                                <AlertCircle size={16} className="text-amber-500" />
                              )}
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-[600px]">
                            <DialogHeader>
                              <DialogTitle>
                                {event.status === 'upcoming'
                                  ? 'Set Event Live'
                                  : 'Resolve Event'
                                }
                              </DialogTitle>
                              <DialogDescription>
                                {event.status === 'upcoming'
                                  ? 'This will make the event live and allow trading.'
                                  : 'This will resolve the event and determine winners/losers.'
                                }
                              </DialogDescription>
                            </DialogHeader>

                            <div className="space-y-4 py-4">
                              {event.status === 'upcoming' ? (
                                <Button
                                  className="w-full"
                                  onClick={() => handleUpdateStatus('live')}
                                >
                                  Set Event Live
                                </Button>
                              ) : (
                                <div className="grid grid-cols-2 gap-4">
                                  <Button
                                    className="bg-market-yes hover:bg-market-yes/80 text-white"
                                    onClick={() => handleUpdateStatus('resolved', 'yes')}
                                  >
                                    <CheckCircle size={16} className="mr-2" />
                                    Resolve as YES
                                  </Button>
                                  <Button
                                    className="bg-market-no hover:bg-market-no/80 text-white"
                                    onClick={() => handleUpdateStatus('resolved', 'no')}
                                  >
                                    <XCircle size={16} className="mr-2" />
                                    Resolve as NO
                                  </Button>
                                </div>
                              )}
                            </div>
                          </DialogContent>
                        </Dialog>

                        {/* Delete Dialog */}
                        <AlertDialog open={isDeleteDialogOpen && selectedEvent?._id === event._id} onOpenChange={(open) => {
                          setIsDeleteDialogOpen(open);
                          if (!open) setSelectedEvent(null);
                        }}>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => setSelectedEvent(event)}
                            className="text-destructive border-destructive/30 hover:bg-destructive/10"
                          >
                            <Trash2 size={16} />
                          </Button>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Are you sure you want to delete this event?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete the event
                                and all associated trades.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={handleDeleteEvent}
                                className="bg-destructive hover:bg-destructive/90"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
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

export default AdminEventsPage;
