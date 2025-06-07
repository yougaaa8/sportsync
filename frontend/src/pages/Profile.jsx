import Navbar from "../components/Navbar.jsx"
import Footer from "../components/Footer.jsx"
import BlankProfilePicture from "../assets/blank-user-profile.jpg"
import "../stylesheets/profile.css"

export default function Profile() {
    return (
        <>
            <Navbar />
            <img className="profile-picture" src={BlankProfilePicture} />
            <h1>User 1</h1>
            <p>Email: </p>
            <p>Events Registered: </p>
            <p>Booked Facilities: </p>
            <p>CCA Attendance: </p>
            <Footer />
        </>
    )
}