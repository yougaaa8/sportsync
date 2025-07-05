import { Typography } from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function EventLeaveButton(props) {
    const token = localStorage.getItem("authToken");
    const [success, setSuccess] = useState(false);
    const [fail, setFail] = useState(false)
    const navigate = useNavigate();     

    async function leaveEvent() {
        try {
            const response = await fetch(`https://sportsync-backend-8gbr.onrender.com/api/event/${props.event.id}/leave/`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    event: props.event.id,
                    user: localStorage.getItem("userId")
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error(errorData)
                setFail(true)
                throw new Error("Failed to leave event");
            }

            setSuccess(true);
            await new Promise(resolve => setTimeout(resolve, 1500)); // Wait for 1.5 seconds

            console.log("Successfully left event:");
            navigate("/event-list")
        } catch (error) {
            setFail(true)
            console.error("Error leaving event:", error);
        }
    }

    return (
        <>
            <button onClick={leaveEvent}>Leave Event</button>
            {success && (
                <div style={{ color: "#16a34a", marginTop: "12px", fontWeight: 500 }}>
                    Left Event Successfully
                </div>
            )}
            {fail && (
                <Typography>You have not signed up for this event</Typography>
            )}
        </>
    );
}