import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Typography } from "@mui/material";
import registerEvent from "../api-calls/registerEvent";

export default function EventRegistrationButton(props) {
    const token = localStorage.getItem("authToken");
    const [success, setSuccess] = useState(false);
    const [fail, setFail] = useState(false)
    const navigate = useNavigate();     

    async function registerForEvent() {
        const response = await registerEvent(props.event.id)
        if (response) {
            setSuccess(true)
            setTimeout(() => {
                navigate("/event-list");
            }, 1500)
        }
        else {
            setFail(true)
            setTimeout(() => {
                window.location.reload()
            }, 1500)
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
            {
                fail && (
                    <Typography>You already registered for this event</Typography>
                )
            }
        </>
    );
}