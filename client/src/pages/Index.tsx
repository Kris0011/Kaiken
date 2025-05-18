"use client"

import { useState, useEffect } from "react"

import { Button } from "@/components/ui/button"
import MainLayout from "@/components/Layout/MainLayout"
import EventCard from "@/components/EventCard"
import eventService, { type Event } from "@/services/events"
import websocketService from "@/services/websocket"
import HeroSection from "@/components/Index/HeroSection"
import LiveEvents from "@/components/Index/LiveEvents"
import UpcomingEvents from "@/components/Index/UpcomingEvents"
import ReferalProgram from "@/components/Index/ReferalProgram"
import HowItWorks from "@/components/Index/HowItWorks"
import Faq from "@/components/Index/Faq"

const Index = () => {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const data = await eventService.getEvents()
        setEvents(data)
      } catch (error) {
        console.error("Error fetching events:", error)
        setError("Failed to load events. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    fetchEvents()

    // Subscribe to WebSocket updates
    const unsubscribe = websocketService.subscribe<Event>("eventUpdated", (updatedEvent) => {
      setEvents((prevEvents) => {
        const index = prevEvents.findIndex((e) => e._id === updatedEvent._id)
        if (index !== -1) {
          const newEvents = [...prevEvents]
          newEvents[index] = updatedEvent
          return newEvents
        } else {
          return [...prevEvents, updatedEvent]
        }
      })
    })

    return unsubscribe
  }, [])

  // Filter events into categories
  const liveEvents = events.filter((event) => event.status === "live")
  const upcomingEvents = events.filter((event) => event.status === "upcoming")
  const recentlyResolved = events
    .filter((event) => event.status === "resolved")
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 4)

  return (
    <MainLayout>
      {/* Hero Section */}

      <HeroSection />


      {/* Live Events Section */}
      <LiveEvents liveEvents={liveEvents} loading={loading} error={error} />


      {/* Upcoming Events Section */}
      <UpcomingEvents upcomingEvents={upcomingEvents} loading={loading} error={error} />


      {/* Recently Resolved Section */}
      {recentlyResolved.length > 0 && (
        <section className="py-16">
          <div className="container px-4 mx-auto">
            <div className="mb-8">
              <h2 className="text-3xl font-bold mb-2">Recently Resolved</h2>
              <p className="text-muted-foreground">Check out the outcomes of these prediction markets</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {recentlyResolved.map((event) => (
                <EventCard key={event._id} event={event} compact />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* How It Works Section */}
      <HowItWorks />


      {/* Community & Referral Program Section */}

      {/* <ReferalProgram /> */}


      {/* FAQ Section */}
      <Faq />


      {/* Stats Section */}
      <section className="py-16">
        <div className="container px-4 mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center p-6">
              <div className="text-3xl md:text-4xl font-bold text-accent mb-2">10k+</div>
              <div className="text-sm text-muted-foreground">Active Traders</div>
            </div>
            <div className="text-center p-6">
              <div className="text-3xl md:text-4xl font-bold text-accent mb-2">500+</div>
              <div className="text-sm text-muted-foreground">Markets Created</div>
            </div>
            <div className="text-center p-6">
              <div className="text-3xl md:text-4xl font-bold text-accent mb-2">$2M+</div>
              <div className="text-sm text-muted-foreground">Total Volume</div>
            </div>
            <div className="text-center p-6">
              <div className="text-3xl md:text-4xl font-bold text-accent mb-2">98%</div>
              <div className="text-sm text-muted-foreground">Resolution Accuracy</div>
            </div>
          </div>
        </div>
      </section>


    </MainLayout>
  )
}

export default Index
