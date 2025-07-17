import { Typography } from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import leaveEvent from "../api-calls/leaveEvent";

export default function EventLeaveButton(props) {
    const token = localStorage.getItem("authToken");
    const [success, setSuccess] = useState(false);
    const [fail, setFail] = useState(false)
    const navigate = useNavigate();     

    function handleLeaveEvent() {
        const response = leaveEvent(props.event.id)
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
            <button onClick={handleLeaveEvent}>Leave Event</button>
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