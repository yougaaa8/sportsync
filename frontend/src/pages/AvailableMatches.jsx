import Navbar from "../components/Navbar.jsx"
import Footer from "../components/Footer.jsx"
import "../stylesheets/available-matches.css"

export default function AvailableMatches() {
    return (
        <>
            <Navbar />
            <main>
                <h1 className="available-matches-header page-title">Matches Currently Open</h1>
                <button className="available-matches-create-button">
                    <a href="/matchmaking-form">Create a new match</a>
                </button>
            </main>
            <Footer />
        </>
    )
}