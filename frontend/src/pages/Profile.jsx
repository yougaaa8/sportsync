import { useEffect, useState, useRef } from "react"
import { useNavigate } from "react-router-dom"
import Navbar from "../components/Navbar.jsx"
import Footer from "../components/Footer.jsx"
import BlankProfilePicture from "../assets/blank-user-profile.jpg"
import "../stylesheets/profile.css"
import { Paper } from "@mui/material"

export default function Profile() {
    const [email, setEmail] = useState("");
    const [firstName, setFirstName] = useState("")
    const [lastName, setLastName] = useState("")
    const [status, setStatus] = useState("student")
    const [message, setMessage] = useState("")
    const navigate = useNavigate();

    // Variables for profile picture upload
    const [profilePicPreview, setProfilePicPreview] = useState(null)
    const [profilePicFile, setProfilePicFile] = useState(null)
    const fileInputRef = useRef(null);

    // 1) On mount, load the current profile
    useEffect(() => {
        const token = localStorage.getItem("authToken")
        if (!token) return

        fetch("http://localhost:8000/api/auth/profile/",
              {headers: {"Authorization": `Bearer ${token}`}})
              .then(res => res.json())
              .then(data => {
                    setFirstName(data.first_name)
                    setLastName(data.last_name)
                    setStatus(data.status)
                    // get existing profile picture if available
                    if (data.profile_picture) { 
                        setProfilePicPreview(data.profile_picture)
                        console.log("Profile picture changed")
                    }
                        
                })
              .catch(console.error)
    }, [])

    // 2) Function to handle file selection
    function handleFileChange(e) {
        const file = e.target.files[0]
        if (file) {
            setProfilePicFile(file)
            setProfilePicPreview(URL.createObjectURL(file))
        }
    }

    // 3) On form submit, PATCH the update endpoint to update the database
    async function handleSubmit(e) {
        e.preventDefault()
        setMessage("")

        const token = localStorage.getItem("authToken");
        // Create a FormData to send in the upcoming PATCH request
        const formData = new FormData();
        formData.append("first_name", firstName)
        formData.append("last_name", lastName)
        formData.append("status", status)
        if (profilePicFile) {
            formData.append("profile_picture", profilePicFile)
        }

        try {
            const res = await fetch ("http://localhost:8000/api/auth/profile/update/", {
                method: "PATCH",
                headers: {
                    "Authorization": `Bearer ${token}`
                },
                body: formData
            })
            const data = await res.json()

            if (res.ok) {
                setMessage("Profile updated successfully!")
                window.location.reload()
            }
            else {
                setMessage("Failed to update: " + JSON.stringify(data))
            }
        } catch(error) {
            console.error(error)
            setMessage("An error occured while updating profile.")
        }
    }

    return (
        <>
            <Navbar />
            <div className="back-button"></div>
            <main className="profile-page-main">
                <div className="profile-left">
                    <Paper sx={{p: 6, mt: 4}}>
                        <img className="profile-picture" 
                            src={profilePicPreview || BlankProfilePicture} 
                            alt="Profile"
                        />
                        {/* Hidden file input that can be controlled by the button below it,
                            pointed to by fileInputRef */}
                        <input 
                            type="file"
                            accept="image/*"
                            style={{ display: "none" }}
                            ref={fileInputRef}
                            onChange={handleFileChange}
                        />
                        <button
                            className="edit-profile-picture-button"
                            onClick={() => fileInputRef.current.click()}
                        >
                            Edit profile picture
                        </button>
                        <h1 className="profile-page-username">{firstName || "Guest"}</h1>
                        <h2 className="profile-page-user-status">{ status }</h2>
                        <div className="profile-page-links">
                            <a className="profile-page-profile-link">Profile</a>
                            <a className="profile-page-individual-link">Events</a>
                            <a className="profile-page-individual-link">Bookings</a>
                            <a className="profile-page-individual-link">Orders</a>
                        </div>
                    </Paper>
                </div>
                <div className="profile-right">
                    <Paper sx={{pt: 5, px: 5, pb:10}}>
                        <form className="profile-form" 
                            onSubmit={handleSubmit}
                            encType="multipart/form-data"
                        >
                            <label htmlFor="first-name">First Name</label>
                            <input 
                                id="first-name"
                                value={firstName}
                                type="text"
                                onChange={e => setFirstName(e.target.value)}
                            />
                            <label htmlFor="status">Last Name</label>
                            <input 
                                id="last-name"
                                value={lastName}
                                type="text"
                                onChange={e => setLastName(e.target.value)}
                            />
                            <label htmlFor="status">Status</label>
                            <select
                                id="status"
                                value={status}
                                onChange={(e) => setStatus(e.target.value)}
                            >
                                <option value="student">Student</option>
                                <option value="staff">Staff</option>
                                <option value="others">Others</option>
                            </select>
                            <button type="submit">Save changes</button>
                        </form>
                    </Paper>
                </div>
            </main>
            <Footer />
        </>
    )
}