import { useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { Button } from "@mui/material"

export default function ViewLobbyButton(props) {
    const router = useRouter()
    const pathname = usePathname()

    // Set state
    console.log("The lobby ID is: ", props.id)

    // Define functions
    function handleViewLobby() {
        router.push(`${pathname}/${props.id}`)
    }

    return (
        <Button onClick={handleViewLobby} className="bg-blue-500">
            View Lobby
        </Button>
    )
}