import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Typography } from "@mui/material";
import registerEvent from "../../api-calls/events/registerEvent";

export default function EventRegistrationButton(props) {
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

    async function registerForEvent() {
        const response = await registerEvent(props.event.id);
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
                onClick={registerForEvent}
                className="w-full sm:w-auto px-8 py-3 rounded-lg font-medium 
                    text-white bg-orange-600 hover:bg-orange-700 
                    transition-colors duration-200"
            >     
                Register for Event
            </button>
            {success && (
                <div style={{ color: "#16a34a", marginTop: "12px", fontWeight: 500 }}>
                    Successfully registered!
                </div>
            )}
            {fail && (
                <Typography>You already registered for this event</Typography>
            )}
        </>
    );
}