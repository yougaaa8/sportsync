import { Button } from "@mui/material"
import { useState } from "react"

export default function UpdateLobbyDetailsButton(props) {
    const [showForm, setShowForm] = useState(false)
    const [buttonPlaceholder, setButtonPlaceholder] = useState("Update Lobby Details")
    const token = localStorage.getItem("authToken")

    async function updateLobby(formData) {
        console.log("Update lobby function is running")
        try {
            console.log("I am inside the try block")
            const response = await fetch(`https://sportsync-backend-8gbr.onrender.com/api/matchmaking/lobbies/${props.lobbyId}/`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    name: formData.get("name"),
                    description: formData.get("description"),
                    sport: formData.get("sport"),
                    date: formData.get("date"),
                    start_time: formData.get("startTime"),
                    end_time: formData.get("endTime"),
                    location: formData.get("location"),
                    open_lobby: formData.get("openLobby") === "Yes",
                    password: formData.get("password"),
                    max_capacity: parseInt(formData.get("maxCapacity"), 10)
                })
            })
            if (!response.ok) {
                const errorData = await response.json()
                console.error("Failed to update lobby:", errorData)
                setButtonPlaceholder("Failed to update lobby details")
                setTimeout(() => {
                    setButtonPlaceholder("Update Lobby Details")
                })
            }
            else {
                const data = await response.json()
                setButtonPlaceholder("Successfully updated lobby details")
                setTimeout(() => {
                    window.location.reload()
                }, 1500)
            }
        }
        catch (error) {
            console.error("Failed to update lobby with error:", error)
            setButtonPlaceholder("Failed to update lobby details")
                setTimeout(() => {
                    setButtonPlaceholder("Update Lobby Details")
                }
        )
        }
    }

    function updateForm() {
        return (
            <form action={updateLobby} className="matchmaking-lobby-form">
                <label>Lobby Name: </label>
                <input name="name" placeholder="Enter lobby name" defaultValue={props.matchDetails.name}></input>

                <label>Description: </label>
                <input name="description" defaultValue={props.matchDetails.description}></input>

                <label>Sport</label>
                <input name="sport" placeholder="Enter the sport you would like to play" defaultValue={props.matchDetails.sport}></input>

                <label>Date: </label>
                <input name="date" type="date" defaultValue={props.matchDetails.date}></input>

                <label>Start Time: </label>
                <input name="startTime" type="time" defaultValue={props.matchDetails.start_time}></input>

                <label>End Time: </label>
                <input name="endTime" type="time" defaultValue={props.matchDetails.end_time}></input>

                <label>Location: </label>
                <input name="location" defaultValue={props.matchDetails.location}></input>

                <label>Open Lobby: </label>
                <select name="openLobby" placeholder="Is this lobby open to anyone?">
                    <option>Yes</option>
                    <option>No</option>
                </select>

                <label>Password: </label>
                <input name="password" defaultValue={props.matchDetails.password}></input>

                <label>Max Capacity: </label>
                <input name="maxCapacity" placeholder="Enter the number of additional people you need for the game" defaultValue={props.matchDetails.max_capacity}></input>

                <Button
                type="submit"
                variant="contained"
                color="warning"
                sx={{
                    mt: 3,
                    width: '100%',
                    fontWeight: 700,
                    fontSize: '1rem',
                    borderRadius: 2,
                    boxShadow: 'none',
                    textTransform: 'none',
                    letterSpacing: 0.5,
                    '&:hover': {
                        backgroundColor: '#ff9800',
                        boxShadow: 'none',
                    },
                }}
            >
                {buttonPlaceholder}
            </Button>
            </form>
        )
    }

    return (
        <>
            {!showForm
             ? (<Button
                onClick={() => setShowForm(prev => !prev)}
                variant="outlined"
                color="warning"
                sx={{
                    fontWeight: 600,
                    borderRadius: 2,
                    borderWidth: 2,
                    px: 2.5,
                    py: 1,
                    fontSize: '1rem',
                    textTransform: 'none',
                    letterSpacing: 0.5,
                    boxShadow: 'none',
                    '&:hover': {
                        backgroundColor: '#fff3e0',
                        borderColor: '#ff9800',
                        boxShadow: 'none',
                    },
                }}
            >
                Update Lobby Details
            </Button>)
             : null}
            {showForm
             ? updateForm()
             : null}
        </>
    )
}