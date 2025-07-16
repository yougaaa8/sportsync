import { useState } from "react"
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@mui/material"

export default function JoinLobbyButton(props) {
    // Get the token from local storage
    const token = localStorage.getItem("authToken");

    const navigate = useNavigate();

    // Set state
    const [joinLobbyResponse, setJoinLobbyResponse] = useState(null);
    const [buttonPlaceholder, setButtonPlaceholder] = useState("Join lobby")
    console.log("The lobby ID is: ", props.id);

    async function joinLobby() {
        try {
            const response = await fetch(`https://sportsync-backend-8gbr.onrender.com/api/matchmaking/lobbies/${props.id}/join/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            });
            if (!response.ok) {
                console.error("Failed to join lobby");
                setButtonPlaceholder("Failed to join lobby")
                setTimeout(() => {
                    window.location.reload() // Redirect to match detail page after one second
                }, 1000)
            }
            else {
                const data = await response.json();
                console.log("Join lobby response data: ", data);
                setJoinLobbyResponse(data);
                setButtonPlaceholder("Sucessfully joined lobby")
                setTimeout(() => {
                    props.isDetailedView
                    ? window.location.reload()
                    : navigate(`/match-detail/${props.id}`); // Redirect to match detail page after one second
                }, 1000)
            }
        } catch (error) {
            console.error("Error joining lobby:", error);
            setButtonPlaceholder("Failed to join lobby")
            setTimeout(() => {
                window.location.reload()
            }, 1000)
        }
    }

    return (
        <Button onClick={joinLobby} className="bg-blue-500">
            {buttonPlaceholder}
        </Button>
    )
};