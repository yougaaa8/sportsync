import { useEffect, useState } from "react"
import Navbar from "../components/Navbar.jsx"
import Footer from "../components/Footer.jsx"
import BlankProfilePicture from "../assets/blank-user-profile.jpg"
import "../stylesheets/profile.css"

export default function Profile() {
    const [username, setUsername] = useState("");

    useEffect(() => {
        const stored = localStorage.getItem("username");
        if (stored) setUsername(stored);
    }, []);

    return (
        <>
            <Navbar />
            <div className="back-button"></div>
            <main className="profile-page-main">
                <div className="profile-left">
                    <img className="profile-picture" src={BlankProfilePicture} />
                    <button className="edit-profile-picture-button">Edit profile picture</button>
                    <h1 className="profile-page-username">{username || "Guest"}</h1>
                    <div className="profile-page-links">
                        <a className="profile-page-profile-link">Profile</a>
                        <a className="profile-page-individual-link">Events</a>
                        <a className="profile-page-individual-link">Bookings</a>
                        <a className="profile-page-individual-link">Orders</a>
                    </div>
                </div>
                <div className="profile-right">
                    <form className="profile-form">
                        <label>First Name</label>
                        <input></input>
                        <label>Last Name</label>
                        <input></input>
                        <label>Status</label>
                        <select>
                            <option>Student</option>
                            <option>Staff</option>
                            <option>Others</option>
                        </select>
                        <button type="submit">Save changes</button>
                    </form>
                </div>
            </main>
            <Footer />
        </>
    )
}