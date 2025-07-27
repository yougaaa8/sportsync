import { Typography } from "@mui/material";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import leaveEvent from "../../api-calls/events/leaveEvent";

export default function EventLeaveButton(props) {
    const [token, setToken] = useState(null);
    const [success, setSuccess] = useState(false);
    const [fail, setFail] = useState(false);
    const router = useRouter();

    // Safe localStorage access
    useEffect(() => {
        if (typeof window !== 'undefined') {
            setToken(localStorage.getItem("authToken"));
        }
    }, []);

    async function handleLeaveEvent() {
        const response = await leaveEvent(props.event.id);
        if (response) {
            setSuccess(true);
            setTimeout(() => {
                router.push("/events");
            }, 1500);
        } else {
            setFail(true);
            setTimeout(() => {
                window.location.reload();
            }, 1500);
        }
    }

    return (
        <>
            <button 
                onClick={handleLeaveEvent}
                className="w-full sm:w-auto px-8 py-3 rounded-lg font-medium 
                text-white bg-orange-600 hover:bg-orange-700 transition-colors 
                duration-200"
            >
                Leave Event
            </button>
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