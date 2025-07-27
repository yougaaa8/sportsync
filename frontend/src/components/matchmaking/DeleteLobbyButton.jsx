import { Button } from "@mui/material"
import { useState } from "react"
import { useRouter } from "next/navigation" 
import deleteLobby from "../../api-calls/matchmaking/deleteLobby"

export default function DeleteLobbyButton(props) {
    const token = localStorage.getItem("authToken")
    const [buttonPlaceholder, setButtonPlaceholder] = useState("Delete Lobby")
    const router = useRouter(); 

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
                router.push("/matchmaking"); 
            }, 1000);
        }
    }
    
    return (
        <>
            <Button onClick={handleDeleteLobby}>{buttonPlaceholder}</Button>
        </>
    )
}