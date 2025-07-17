import Navbar from "../components/Navbar.jsx"
import Footer from "../components/Footer.jsx"
import "../stylesheets/matchmaking-form.css"
import { useNavigate } from "react-router-dom";
import createMatchLobby from "../api-calls/createMatchLobby.js";

export default function OpenMatchmaking() {
    const token = localStorage.getItem("authToken");
    const navigate = useNavigate();

    function  handleCreateLobby(formData) {
        const response = createMatchLobby(formData)
        if (response) {
            navigate("/available-matches");
        }
        else {
            console.log("Failed to create match")
        }
    }
    
    return (
        <>
            <Navbar />
            <main className="matchmaking-lobby-main">
                <h1 className="matchmaking-lobby-header page-title">Create a new matchmaking lobby</h1>
                <form action={handleCreateLobby} className="matchmaking-lobby-form">
                    <label>Lobby Name: </label>
                    <input name="name" placeholder="Enter lobby name"></input>

                    <label>Description: </label>
                    <input name="description"></input>

                    <label>Sport</label>
                    <input name="sport" placeholder="Enter the sport you would like to play"></input>

                    <label>Date: </label>
                    <input name="date" type="date"></input>

                    <label>Start Time: </label>
                    <input name="startTime" type="time"></input>

                    <label>End Time: </label>
                    <input name="endTime" type="time"></input>

                    <label>Location: </label>
                    <input name="location"></input>

                    <label>Open Lobby: </label>
                    <select name="openLobby" placeholder="Is this lobby open to anyone?">
                        <option>Yes</option>
                        <option>No</option>
                    </select>

                    <label>Password: </label>
                    <input name="password"></input>

                    <label>Max Capacity: </label>
                    <input name="maxCapacity" placeholder="Enter the number of additional people you need for the game"></input>

                    <button>Create a new lobby</button>
                </form>
            </main>
            <Footer />
        </>
    )
}