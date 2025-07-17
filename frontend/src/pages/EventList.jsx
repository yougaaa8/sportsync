import React, { useState, useEffect } from "react"
import Navbar from "../components/Navbar.jsx"
import Footer from "../components/Footer.jsx"
import EventItem from "../components/EventItem.jsx"
import { pullEventsData } from "../api-calls/pullEventsData.js"

export default function EventList() {
    // Create state to store array of JSX event objects
    const [events, setEvents] = React.useState([])

    const token = localStorage.getItem("authToken")

    // Fetch the events from the backend
    useEffect(() => {
        const fetchEvents = async () => {
            setEvents(await pullEventsData())
        };
        fetchEvents();
    }, [token]);

    // Create const to store the array of JSX event elements
    const eventElements = events.map(event => (
        <EventItem event={event}/>
    ))
    
    return (
        <>
            <Navbar />
            <main>
                <h1 className="page-title">Upcoming Events</h1>
                <br />
                {eventElements}
                <button>
                    <a href="/event-form">List a new event</a>
                </button>
            </main>
            <Footer />
        </>
    )   
}