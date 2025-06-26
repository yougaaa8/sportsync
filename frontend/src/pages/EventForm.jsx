import Navbar from "../components/Navbar.jsx"
import Footer from "../components/Footer.jsx"

export default function EventForm() {
    console.log("rendered")
    return (
        <>
            <Navbar />
            <main>
                <h1>Create a new event</h1>
                <form>
                    <label>Event Name: </label>
                    <input placeholder="BizAd Charity Run 2025"/>

                    <label>Event Date: </label>
                    <input type="date"/>

                    <label>Event Description: </label>
                    <input placeholder="Charity run with fun prizes!"/>

                    <button>Create event</button>
                </form>
            </main>
            <Footer />
        </>
    )
}