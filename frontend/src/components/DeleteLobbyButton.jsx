import { Button } from "@mui/material"
import { useState } from "react"
import { useNavigate } from "react-router-dom"

export default function DeleteLobbyButton(props) {
    const token = localStorage.getItem("authToken")
    const [buttonPlaceholder, setButtonPlaceholder] = useState("Delete Lobby")
    const navigate = useNavigate();

    async function deleteLobby() {
        try {
            const response = await fetch(`https://sportsync-backend-8gbr.onrender.com/api/matchmaking/lobbies/${props.lobbyId}/`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            })
            
            if (!response.ok) {
                console.log("Failed to delete lobby", response)
                setButtonPlaceholder("Failed to delete lobby")
                setTimeout(() => {
                window.location.reload()
                }, 1000)
            }
            else {
                console.log("Successfully deleted lobby")
                setButtonPlaceholder("Successfully deleted lobby")
                setTimeout(() => {
                    navigate("/available-matches")
                }, 1000)
            }
        }
        catch (error) {
            console.log("Failed to delete lobby", error)
            setButtonPlaceholder("Failed to delete lobby")
            setTimeout(() => {
                window.location.reload()
            }, 1000)
        }
    }
    
    return (
        <>
            <Button onClick={deleteLobby}>{buttonPlaceholder}</Button>
        </>
    )
}