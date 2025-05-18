import { ChevronRight, Target } from 'lucide-react'
import React from 'react'
import { Button } from '../ui/button'
import EventCard from '../EventCard'
import { Event } from '@/services/events'
import { Link } from 'react-router-dom'

export default function LiveEvents(
    { liveEvents, loading, error }: {
        liveEvents: Event[]
        loading: boolean
        error: string | null
    }
) {
    return (
        <section className="py-16">
            <div className="container px-4 mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h2 className="text-3xl font-bold mb-2">
                            Live Markets
                            {liveEvents.length > 0 && (
                                <span className="inline-flex ml-3 h-6 w-6 items-center justify-center rounded-full bg-market-yes text-xs text-white">
                                    {liveEvents.length}
                                </span>
                            )}
                        </h2>
                        <p className="text-muted-foreground">Trade on these events happening right now</p>
                    </div>
                    <Link to="/events" className="text-accent hover:underline flex items-center font-medium">
                        View All <ChevronRight size={16} className="ml-1" />
                    </Link>
                </div>

                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="border border-border rounded-xl overflow-hidden">
                                <div className="h-12 bg-muted/30 animate-pulse flex items-center px-4">
                                    <div className="w-8 h-8 rounded-full bg-muted/50 animate-pulse"></div>
                                    <div className="ml-3 w-1/2 h-4 bg-muted/50 animate-pulse"></div>
                                    <div className="ml-auto w-16 h-6 rounded-full bg-muted/50 animate-pulse"></div>
                                </div>
                                <div className="p-6 space-y-4">
                                    <div className="w-3/4 h-6 bg-muted/30 animate-pulse"></div>
                                    <div className="w-full h-4 bg-muted/30 animate-pulse"></div>
                                    <div className="w-full h-3 bg-muted/30 animate-pulse rounded-full"></div>
                                    <div className="flex justify-between">
                                        <div className="w-1/3 h-8 bg-muted/30 animate-pulse rounded-lg"></div>
                                        <div className="w-1/3 h-8 bg-muted/30 animate-pulse rounded-lg"></div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : error ? (
                    <div className="text-center py-16 rounded-xl border border-border">
                        <p className="text-destructive mb-4">{error}</p>
                        <Button onClick={() => window.location.reload()} variant="outline">
                            Try Again
                        </Button>
                    </div>
                ) : liveEvents.length === 0 ? (
                    <div className="text-center py-16 bg-muted/10 rounded-xl border border-border">
                        <Target size={48} className="mx-auto text-muted-foreground mb-4" />
                        <p className="text-muted-foreground mb-4">No live markets available at the moment.</p>
                        <Link to="/events">
                            <Button variant="outline">Browse All Markets</Button>
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {liveEvents.slice(0, 6).map((event) => (
                            <EventCard key={event._id} event={event} />
                        ))}
                    </div>
                )}
            </div>
        </section>
    )
}
