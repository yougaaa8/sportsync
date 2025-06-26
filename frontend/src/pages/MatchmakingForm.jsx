import Navbar from "../components/Navbar.jsx"
import Footer from "../components/Footer.jsx"
import "../stylesheets/matchmaking-form.css"

export default function OpenMatchmaking() {
    return (
        <>
            <Navbar />
            <main className="matchmaking-lobby-main">
                <h1 className="matchmaking-lobby-header">Create a new matchmaking lobby</h1>
                <form className="matchmaking-lobby-form">
                    <label>Lobby Name</label>
                    <input placeholder="Enter lobby name"></input>
                    <label>Sport</label>
                    <select placeholder="Enter the sport you would like to play"></select>
                    <label>Members Needed</label>
                    <input placeholder="Enter the number of additional people you need for the game"></input>
                    <label>Additional Info</label>
                    <input placeholder="Enter additional information about your match, team, requests, etc."></input>
                    <button>Create</button>
                </form>
            </main>
            <Footer />
        </>
    )
}