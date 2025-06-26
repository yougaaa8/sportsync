import React, { useState, useEffect } from "react"
import Navbar from "../components/Navbar.jsx"
import Footer from "../components/Footer.jsx"

export default function EventList() {
    // Create state to store array of JSX event objects
    const [events, setEvents] = React.useState([])

    useEffect(() => {
        fetch("/api/events/list")
        .then(response => response.json())
        .then(data => setEvents(data))
        .catch(err => console.error("Event List fetch error: ", err))
    })

    // Create const to store the array of JSX event elements
    const eventElements = events.map(event => (
        <Event event-info={event}/>
    ))
    
    return (
        <>
            <Navbar />
            <main>
                <h1>Upcoming Events</h1>
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