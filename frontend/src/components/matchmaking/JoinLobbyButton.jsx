import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@mui/material"
import joinLobby from "../../api-calls/matchmaking/joinLobby"

export default function JoinLobbyButton(props) {
    const router = useRouter()

    // Set state
    const [joinLobbyResponse, setJoinLobbyResponse] = useState(null)
    const [buttonPlaceholder, setButtonPlaceholder] = useState("Join lobby")
    console.log("The lobby ID is: ", props.id)

    async function handleJoinLobby() {
        const response = await joinLobby(props.id)
        if (response) {
            setJoinLobbyResponse(response)
            setButtonPlaceholder("Successfully joined lobby")
            setTimeout(() => {
                props.isDetailedView
                ? window.location.reload()
                : router.push(`/matchmaking/${props.id}`)
            }, 1000)
        }
        else {
            setButtonPlaceholder("Failed to join lobby")
            setTimeout(() => {
                window.location.reload()
            }, 1000)
        }
    }

    return (
        <Button onClick={handleJoinLobby} className="bg-blue-500">
            {buttonPlaceholder}
        </Button>
    )
}