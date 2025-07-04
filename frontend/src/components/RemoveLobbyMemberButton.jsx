import { useState } from "react"

export default function RemoveLobbyMemberButton(props) {
    const token = localStorage.getItem("authToken");
    const [buttonPlaceholder, setButtonPlaceholder] = useState("Remove member")

    console.log("The Remove Member button is being rendered for lobby ID: ", props.lobbyId);
    console.log("The Remove Member button is being rendered for user ID: ", props.userId);

    async function removeMember() {
        try {
            const response = await fetch(`https://sportsync-backend-8gbr.onrender.com/api/matchmaking/lobbies/${props.lobbyId}/members/${props.userId}/`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            });
            if (!response.ok) {
                console.log("Failed to remove member")
                setButtonPlaceholder("Failed to remove member")
            }
            else {
                console.log("Successfully removed member")
                setButtonPlaceholder("Successfully removed member")
                setTimeout(() => {
                    window.location.reload()
                }, 1000)
            }
        } catch (error) {
            setButtonPlaceholder("Failed to remove member")
            console.error("Error removing member:", error);
        }
    }
    
    return (
        <>
            <button onClick={removeMember}>{buttonPlaceholder}</button>
        </>
    )
}