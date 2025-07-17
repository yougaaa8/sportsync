import { useState } from "react"
import removeLobbyMember from "../api-calls/removeLobbyMember"

export default function RemoveLobbyMemberButton(props) {
    const [buttonPlaceholder, setButtonPlaceholder] = useState("Remove member")

    console.log("The Remove Member button is being rendered for lobby ID: ", props.lobbyId);
    console.log("The Remove Member button is being rendered for user ID: ", props.userId);

    async function removeMember() {
        const response = await removeLobbyMember(props.lobbyId, props.userId)
        console.log("Response in Button.jsx: ", response)
        if (response) {
            setButtonPlaceholder("Successfully removed member");
            setTimeout(() => {
                window.location.reload();
            }, 1000);
        }
        else {
            setButtonPlaceholder("Failed to remove member");
            setTimeout(() => {
                window.location.reload();
            }, 1000);
        }
    }
    
    return (
        <>
            <button onClick={removeMember}>{buttonPlaceholder}</button>
        </>
    )
}