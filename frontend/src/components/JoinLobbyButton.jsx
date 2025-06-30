import { useState } from "react"
import { useParams, useNavigate } from "react-router-dom";

export default function JoinLobbyButton(props) {
    // Get the token from local storage
    const token = localStorage.getItem("authToken");

    const navigate = useNavigate();

    // Set state
    const [joinLobbyResponse, setJoinLobbyResponse] = useState(null);
    
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
            }
            const data = await response.json();
            console.log("Join lobby response data: ", data);
            setJoinLobbyResponse(data);
            navigate(`/match-detail/${props.id}`); // Redirect to match detail page after joining
        } catch (error) {
            console.error("Error joining lobby:", error);
        }
    }

    return (
        <button onClick={joinLobby}>Join this lobby</button>
    )
}