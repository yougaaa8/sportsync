import Navbar from "../components/Navbar.jsx"
import Footer from "../components/Footer.jsx"
import "../stylesheets/event-form.css"
import { useNavigate } from "react-router-dom";
import createEvent from "../api-calls/createEvent.js";

export default function EventForm() {
    const token = localStorage.getItem("authToken");
    const navigate = useNavigate();

    const handleCreateEvent = async (formData) => {
        const result = await createEvent(formData)
        console.log("result: ", result)
        navigate("/event-list")
    }   

    return (
        <>
            <Navbar />
            <main>
                <h1 className="page-title">Create a new event</h1>
                <div className="event-form-container">
                    <form action={handleCreateEvent}>
                        <label>Event Name: </label>
                        <input name="name" type="text" placeholder="BizAd Charity Run 2025"/>

                        <label>Event Date: </label>
                        <input name="date" type="date"/>

                        <label>Registration Deadline: </label>
                        <input name="registrationDeadline"type="date"/>

                        <label>Location: </label>
                        <input name="location" type="text"/>

                        <label>Event Description: </label>
                        <input name="description" type="text" placeholder="Charity run with fun prizes!"/>

                        <label>Registration Fee: </label>
                        <input name="registrationFee" type="number" placeholder="20.00"/> 

                        <button type="submit">Create event</button>
                    </form>
                </div>
            </main>
            <Footer />
        </>
    )
}