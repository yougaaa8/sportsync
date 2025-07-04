import Navbar from "../components/Navbar.jsx"
import Footer from "../components/Footer.jsx"
import "../stylesheets/event-form.css"
import { useNavigate } from "react-router-dom";

export default function EventForm() {
    const token = localStorage.getItem("authToken");

    const navigate = useNavigate();
    
    async function createEvent(formData) {
        try {
            const response = await fetch("https://sportsync-backend-8gbr.onrender.com/api/event/create/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    name: formData.get("name"),
                    date: formData.get("date"),
                    // location: formData.get("location"),
                    registration_deadline: formData.get("registrationDeadline"),
                    description: formData.get("description"),
                    registration_fee: parseFloat(formData.get("registrationFee"))
                })
            })

            if(!response.ok) {
                throw new Error("Failed to create event")
            }

            const data = await response.json()
            console.log("Event created successfully:", data)
            navigate("/event-list") // Redirect to event list page after creation
        }
        catch (error) {
            console.error("Error creating event:", error)   
        }
    }
    
    return (
        <>
            <Navbar />
            <main>
                <h1 className="page-title">Create a new event</h1>
                <div className="event-form-container">
                    <form action={createEvent}>
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