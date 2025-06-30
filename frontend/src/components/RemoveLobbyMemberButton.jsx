export default function RemoveLobbyMemberButton(props) {
    const token = localStorage.getItem("authToken");

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
            // Optionally handle response here
        } catch (error) {
            console.error("Error removing member:", error);
        }
    }
    
    return (
        <>
            <button onClick={removeMember}>Remove member</button>
        </>
    )
}