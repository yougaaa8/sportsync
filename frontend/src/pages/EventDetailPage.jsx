import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Paper, Tab, Typography } from "@mui/material";
import Navbar from "../components/Navbar.jsx"
import Footer from "../components/Footer.jsx"
import EventRegistrationButton from "../components/EventRegistrationButton.jsx";
import EventLeaveButton from "../components/EventLeaveButton.jsx";
import { Table, TableHead, TableRow, TableCell } from "@mui/material";

export default function EventDetailPage() {
    const { eventId } = useParams();
    const token = localStorage.getItem("authToken");
    const [eventDetails, setEventDetails] = useState(null);
    const [eventParticipants, setEventParticipants] = useState(null);

    // Get detailed data for the event using the eventId
    useEffect(() => {
        const fetchEventDetails = async () => {
            try {
                const response = await fetch(`https://sportsync-backend-8gbr.onrender.com/api/event/${eventId}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    }
                });
                if (!response.ok) {
                    throw new Error("Failed to fetch event details");
                }
                const data = await response.json();
                console.log("Event details: ", data);
                setEventDetails(data);
            } catch (error) {
                console.error("Error fetching event details: ", error);
            }
        };
        fetchEventDetails();
    }, [eventId, token]);

    // Get the participant data for the event
    useEffect(() => {
        const fetchEventParticipants = async () => {
            try {
                const response = await fetch(`https://sportsync-backend-8gbr.onrender.com/api/event/${eventId}/participants/`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    }
                });
                if (!response.ok) {
                    throw new Error("Failed to fetch event participants");
                }
                const data = await response.json();
                console.log("Event participants: ", data);
                setEventParticipants(data);
            } catch (error) {
                console.error("Error fetching event participants: ", error);
            }
        };
        if (eventId) {
            fetchEventParticipants();
        }
    }, [eventId, token]);   

    return (
        <>
            <Navbar />
            {eventDetails && (
                <Paper
                    elevation={3}
                    sx={{
                        p: 3,
                        my: 2,
                        maxWidth: 600,
                        mx: "auto",
                        bgcolor: "#fffdfa",
                        borderRadius: 3,
                        boxShadow: "0 4px 16px 0 rgba(245, 158, 11, 0.08)",
                        border: "1px solid #ffe5b4",
                        textAlign: "center"
                    }}
                >
                    <Typography variant="h1" sx={{ color: "#F59E0B", mb: 1 }}>
                        {eventDetails.name}
                    </Typography>
                    <Typography variant="h2" sx={{ color: "#888", mb: 1 }}>
                        Location: {eventDetails.location}
                    </Typography>
                    <Typography variant="body1" sx={{ color: "#444" }}>
                        Date: {eventDetails.date}
                    </Typography>
                    <Typography>
                        {eventDetails.description}
                    </Typography>
                    <Typography>
                        Number of Participants: {eventDetails.participants_count}
                    </Typography>
                    <Typography>Registration Deadline: {eventDetails.registration_deadline}</Typography>
                    <Typography>Registration Fee: ${eventDetails.registration_fee}</Typography>
                    <Typography>Organiser: {eventDetails.organizer}</Typography>
                    <Typography>{eventDetails.contact_point}</Typography>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell></TableCell>
                                <TableCell></TableCell>
                                <TableCell></TableCell>
                                <TableCell></TableCell>
                                <TableCell></TableCell>
                            </TableRow>
                        </TableHead>
                    </Table>
                    <br />
                    <EventRegistrationButton event={eventDetails}></EventRegistrationButton>
                    <EventLeaveButton event={eventDetails}></EventLeaveButton>
                </Paper>
            )}
            <Footer />
        </>
    );
}