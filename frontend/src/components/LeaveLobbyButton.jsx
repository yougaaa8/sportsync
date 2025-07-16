import { useState } from "react"
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@mui/material"

export default function JoinLobbyButton(props) {
    // Get the token from local storage
    const token = localStorage.getItem("authToken");

    const navigate = useNavigate();

    // Set state
    const [leaveLobbyResponse, setLeaveLobbyResponse] = useState(null);
    const [buttonPlaceholder, setButtonPlaceholder] = useState("Leave lobby")
    
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
                setButtonPlaceholder("Failed to join lobby")
                setTimeout(() => {
                    window.location.reload()
                }, 1000)
            }
            else {
                const data = await response.json();
                console.log("Leave lobby response data: ", data);
                setLeaveLobbyResponse(data);
                setButtonPlaceholder("Successfully left lobby")
                setTimeout(() => {
                    navigate("/available-matches"); // Redirect to available matches after leaving
                }, 1000)
            }
        } catch (error) {
            console.error("Error leaving lobby:", error);
        }
    }

    return (
        <Button onClick={leaveLobby}>{buttonPlaceholder}</Button>
    )
}