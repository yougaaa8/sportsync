import { Button } from "@mui/material"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import deleteLobby from "../api-calls/deleteLobby"

export default function DeleteLobbyButton(props) {
    const token = localStorage.getItem("authToken")
    const [buttonPlaceholder, setButtonPlaceholder] = useState("Delete Lobby")
    const navigate = useNavigate();

    async function handleDeleteLobby() {
        const response = await deleteLobby(props.lobbyId)
        if (!response) {
            setButtonPlaceholder("Failed to delete lobby");
            setTimeout(() => {
                window.location.reload();
            }, 1000);
    } else {
      setButtonPlaceholder("Successfully deleted lobby");
      setTimeout(() => {
        navigate("/available-matches");
      }, 1000);
    }}
    
    return (
        <>
            <Button onClick={handleDeleteLobby}>{buttonPlaceholder}</Button>
        </>
    )
}