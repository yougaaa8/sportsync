import { useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { Button } from "@mui/material"
import leaveLobby from "../../api-calls/matchmaking/leaveLobby";

export default function JoinLobbyButton(props) {

    // Set state
    const [leaveLobbyResponse, setLeaveLobbyResponse] = useState(null);
    const [buttonPlaceholder, setButtonPlaceholder] = useState("Leave lobby")
    
    // Set static values
    const router = useRouter()
    const pathname = usePathname()

    console.log("The lobby ID is: ", props.id);

    async function handleLeaveLobby() {
        const response = leaveLobby(props.id)
        if (response) {
            setLeaveLobbyResponse(response);
            setButtonPlaceholder("Successfully left lobby");
            setTimeout(() => {
                if (pathname === "/matchmaking") {
                    window.location.reload()
                }
                router.push("/matchmaking"); // Redirect to available matches after leaving
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