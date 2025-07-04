import { useState } from "react"
import { useParams, useNavigate } from "react-router-dom";

export default function JoinLobbyButton(props) {
    // Get the token from local storage
    const token = localStorage.getItem("authToken");

    const navigate = useNavigate();

    // Set state
    const [leaveLobbyResponse, setLeaveLobbyResponse] = useState(null);
    
    console.log("The lobby ID is: ", props.id);

    async function leaveLobby() {
        try {
            const response = await fetch(`https://sportsync-backend-8gbr.onrender.com/api/matchmaking/lobbies/${props.id}/leave/`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            });
            if (!response.ok) {
                console.error("Failed to join lobby");
            }
            const data = await response.json();
            console.log("Leave lobby response data: ", data);
            setLeaveLobbyResponse(data);
            navigate("/available-matches"); // Redirect to available matches after leaving
        } catch (error) {
            console.error("Error leaving lobby:", error);
        }
    }

    return (
        <button onClick={leaveLobby}>Leave this lobby</button>
    )
}