import React from 'react'
import { Link } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'
import EventCard from '../EventCard'
import { Event } from '@/services/events'


export default function UpcomingEvents(
    { upcomingEvents, loading, error }: {
        upcomingEvents: Event[]
        loading: boolean
        error: string | null
    }
) {
    return (
        <section className="py-16 bg-muted/20">
            <div className="container px-4 mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h2 className="text-3xl font-bold mb-2">Upcoming Markets</h2>
                        <p className="text-muted-foreground">Get ready for these future prediction markets</p>
                    </div>
                    <Link to="/events" className="text-accent hover:underline flex items-center font-medium">
                        View All <ChevronRight size={16} className="ml-1" />
                    </Link>
                </div>

                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="bg-background animate-pulse h-64 rounded-xl"></div>
                        ))}
                    </div>
                ) : upcomingEvents.length === 0 ? (
                    <div className="text-center py-16 bg-background rounded-xl border border-border">
                        <p className="text-muted-foreground">No upcoming markets available.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {upcomingEvents.slice(0, 6).map((event) => (
                            <EventCard key={event._id} event={event} />
                        ))}
                    </div>
                )}
            </div>
        </section>
    )
}
