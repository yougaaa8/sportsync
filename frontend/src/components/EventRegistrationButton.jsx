import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function EventRegistrationButton(props) {
    const token = localStorage.getItem("authToken");
    const [success, setSuccess] = useState(false);
    const navigate = useNavigate();     

    async function registerForEvent() {
        try {
            const response = await fetch(`https://sportsync-backend-8gbr.onrender.com/api/event/${props.event.id}/signup/`, {
                method: "POST",
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
                throw new Error("Failed to register for event");
            }

            setSuccess(true);
            await new Promise(resolve => setTimeout(resolve, 1500)); // Wait for 1.5 seconds

            const data = await response.json();
            console.log("Registration successful:", data);
            navigate("/event-list")
        } catch (error) {
            console.error("Error registering for event:", error);
        }
    }

    return (
        <>
            <button onClick={registerForEvent}>Register for Event</button>
            {success && (
                <div style={{ color: "#16a34a", marginTop: "12px", fontWeight: 500 }}>
                    Successfully registered!
                </div>
            )}
        </>
    );
}