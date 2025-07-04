import Navbar from "../components/Navbar.jsx"
import Footer from "../components/Footer.jsx"
import "../stylesheets/matchmaking-form.css"
import { useNavigate } from "react-router-dom";

export default function OpenMatchmaking() {
    const token = localStorage.getItem("authToken");
    const navigate = useNavigate();

    async function createLobby(formData) {
        try {
            const response = await fetch("https://sportsync-backend-8gbr.onrender.com/api/matchmaking/lobbies/create/", {
                method: "POST",
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
                throw new Error("Failed to update lobby");
            }
            navigate("/available-matches");
        }
        catch (error) {
            console.error("Error updating lobby:", error);
        }
    }
    
    return (
        <>
            <Navbar />
            <main className="matchmaking-lobby-main">
                <h1 className="matchmaking-lobby-header page-title">Create a new matchmaking lobby</h1>
                <form action={createLobby} className="matchmaking-lobby-form">
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