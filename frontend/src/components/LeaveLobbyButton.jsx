import { useState } from "react"
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@mui/material"
import leaveLobby from "../api-calls/leaveLobby";

export default function JoinLobbyButton(props) {

    // Set state
    const [leaveLobbyResponse, setLeaveLobbyResponse] = useState(null);
    const [buttonPlaceholder, setButtonPlaceholder] = useState("Leave lobby")
    
    // Set static values
    const location = useLocation()
    const navigate = useNavigate();

    console.log("The lobby ID is: ", props.id);

    async function handleLeaveLobby() {
        const response = leaveLobby(props.id)
        if (response) {
            setLeaveLobbyResponse(response);
            setButtonPlaceholder("Successfully left lobby");
            setTimeout(() => {
                if (location.pathname === "/available-matches") {
                    navigate(0)
                }
                navigate("/available-matches"); // Redirect to available matches after leaving
            }, 1000);
        }
        else {
            setButtonPlaceholder("Failed to join lobby");
            setTimeout(() => {
                window.location.reload();
            }, 1000);
        }
    }

    return (
        <Button onClick={handleLeaveLobby}>{buttonPlaceholder}</Button>
    )
}