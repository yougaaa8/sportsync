import { Button } from "@mui/material"
import { useState } from "react"
import updateLobbyDetails from "../api-calls/updateLobbyDetails"

export default function UpdateLobbyDetailsButton(props) {
    const [showForm, setShowForm] = useState(false)
    const [buttonPlaceholder, setButtonPlaceholder] = useState("Update Lobby Details")

    async function updateLobby(formData) {
        console.log("Update lobby function is running with props: ", props)
        const response = await updateLobbyDetails(formData, props.lobbyId)
        if (response) {
            setButtonPlaceholder("Successfully updated lobby details");
            setTimeout(() => {
                window.location.reload();
            }, 1500);
        }
        else {
            setButtonPlaceholder("Failed to update lobby details");
            setTimeout(() => {
                setButtonPlaceholder("Update Lobby Details");
            }, 1500);
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