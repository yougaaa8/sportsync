import Navbar from "../components/Navbar.jsx"
import Footer from "../components/Footer.jsx"
import CCAMembersTable from "../components/CCAMembersTable.jsx"
import { useState, useEffect } from "react" 
import { useParams } from "react-router-dom"
import "../stylesheets/cca-training-session-management.css"
import RemoveCCAMemberButton from "../components/RemoveCCAMemberButton.jsx"
import { Typography, TableRow, TableCell } from "@mui/material"

export default function CCAMemberManagementLayout() {
    const token = localStorage.getItem("authToken")

    // Set state to store CCA members data
    const [ccaData, setCcaData] = useState(null)
    const [ccaMembersData, setCcaMembersData] = useState(null)
    const [ccaMembersDataError, setCcaMembersDataError] = useState(null)
    const [showForm, setShowForm] = useState(false)
    const [isRegistrationSuccessful, setIsRegistrationSuccessful] = useState(false)
    let userId;

    // Get the CCA ID from the URL
    const { ccaId } = useParams()
    console.log("This is the extracted CCA ID: ", ccaId)
    
    // Get the CCA data from the API
    useEffect(() => {
        const fetchCcaData = async () => {
            try {
                const response = await fetch(`https://sportsync-backend-8gbr.onrender.com/api/cca/${ccaId}/`, {
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json"
                    }
                })

                if (!response.ok) {
                    throw new Error("CCA not found")
                }

                const data = await response.json()
                setCcaData(data)
                console.log("CCA data retrieved into state")
            }
            catch (err) {
                console.log("The CCA Data Error is: ", err)
            }
        }

        if (ccaId) {
            console.log("Running fetchCcaData")
            fetchCcaData()
        }
    }, [ccaId])
    console.log("The CCA Data is: ", ccaData)

    // Get the CCA members data from the API
    useEffect(() => {
            const fetchCcaMembersData = async () => {
                try {
                    const response = await fetch(`https://sportsync-backend-8gbr.onrender.com/api/cca/${ccaId}/members/`, {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${token}`
                        }
                    })
    
                    if (!response.ok) {
                        throw new Error("CCA not found")
                    }
    
                    const membersData = await response.json()
                    setCcaMembersData(membersData)
                    console.log("CCA Members Data retrieved")
                }
                catch (err) {
                    setCcaMembersDataError(err)
                }
            }
    
            if (ccaId) {
                fetchCcaMembersData()
            }
        }, [ccaId])
        console.log("The CCA members data is: ", ccaMembersData)
    
    // Map the CCA members data, which is an array of member objects,
    // into an array of table rows 
    let membersList
    if (ccaMembersData) {
    membersList = ccaMembersData?.map((member, idx) => (
        <TableRow
            key={member.id}
            sx={{
                backgroundColor: idx % 2 === 0 ? "#fff" : "#fcf7ee",
                transition: "background 0.2s",
                "&:hover": {
                    backgroundColor: "#fff7e6"
                }
            }}
        >
            <TableCell
                align="center"
                sx={{ fontWeight: 500, color: "#f59e0b", border: 0, textAlign: "center" }}
            >
                {idx + 1}
            </TableCell>
            <TableCell align="center" sx={{ border: 0, textAlign: "center" }}>
                {member.first_name}
            </TableCell>
            <TableCell align="center" sx={{ border: 0, textAlign: "center" }}>
                {member.last_name}
            </TableCell>
            <TableCell
                align="center"
                sx={{
                    border: 0,
                    color: "#f59e0b",
                    fontWeight: 500,
                    textTransform: "capitalize",
                    textAlign: "center"
                }}
            >
                {member.position}
            </TableCell>
            <TableCell
                align="center"
                sx={{
                    border: 0,
                    color: "#f59e0b",
                    fontWeight: 500,
                    textAlign: "center"
                }}
            >
                {member.role}
            </TableCell>
            <TableCell align="center" sx={{ border: 0, textAlign: "center" }}>
                <button
                    style={{
                        background: "#fff",
                        border: "2px solid #f59e0b",
                        borderRadius: 8,
                        padding: "6px 18px",
                        fontWeight: 600,
                        color: "#f59e0b",
                        cursor: "pointer",
                        transition: "all 0.2s",
                        fontSize: "1rem",
                        boxShadow: "0 2px 8px 0 rgba(245,158,11,0.04)",
                        textAlign: "center"
                    }}
                    onMouseOver={e => {
                        e.currentTarget.style.background = "#f59e0b";
                        e.currentTarget.style.color = "#fff";
                    }}
                    onMouseOut={e => {
                        e.currentTarget.style.background = "#fff";
                        e.currentTarget.style.color = "#f59e0b";
                    }}
                    onClick={removeMember}
                >
                    Remove CCA member
                </button>
            </TableCell>
        </TableRow>
    ))
}

    function showFormClick() {
        setShowForm(prevShowForm => !prevShowForm)
    }

    async function addNewMember(formData) {
        // Resolve the user id from the email
        console.log("The email of the user to be added is: ", formData.get("email"))
        const email = formData.get("email")
        try {
            const response = await fetch(`https://sportsync-backend-8gbr.onrender.com/api/get-user-profile/?email=${email}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`  
                }
            })
            if (!response.ok) {
                throw new Error("Cannot fetch user by email")
            }
            const userIdData = await response.json()
            console.log("The retrieved user id is: ", userIdData)
            userId = userIdData.user_id
        }
        catch (err) {
            console.log("Error fetching user by email ", err)
            return
        }
        
        // Create an object to represent the data
        const data = {
            'user': userId,
            'cca': ccaId,
            'position': formData.get("position"),
            'role': formData.get("role"),
            'is_active': formData.get("is_active"), 
            'emergency_contact': formData.get("emergency_contact"),
            'notes': formData.get("notes")
        }
        

        // POST to add a new member with the user id field
        try {
            const response = await fetch(`https://sportsync-backend-8gbr.onrender.com/api/cca/${ccaId}/members/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(data)
            })
            if (!response.ok) {
                throw new Error("Cannot add new member")
            }
            console.log("CCA member added, here's the POST response: ", response)
            setIsRegistrationSuccessful(prev => (!prev))
            setTimeout(() => {
                window.location.reload()
            }, 1000) // Reload the page after 1 second to show the new member
        }
        catch (err) {
            console.log(`Catch block error: ${err}`)
        }
    }

    function removeMember() {}

    return (
        <>
            <Navbar />
            <main>
                <h1 className="page-title">CCA Members Management</h1>
                {!showForm 
                 ? <button onClick={showFormClick}>Add a new CCA member</button>
                 : <button onClick={showFormClick}>Close form</button>}
                 {(showForm && ccaData)
                  ? <form className="cca-submission-form" action={addNewMember}>
                        <label>Email: </label>
                        <input name="email"></input>

                        <label>CCA: </label>
                        <select name="cca" defaultValue={ccaData.name}>
                            <option value={ccaData.name}>{ccaData.name}</option>
                        </select>

                        <label>Position: </label>
                        <select name="position">
                            <option value="member">Member</option>
                            <option value="committee">Committee</option>
                        </select>

                        <label>Role: </label>
                        <input name="role"></input>

                        <label>Active: </label>
                        <select name="is_active">
                            <option value={true}>Yes</option>
                            <option value={false}>No</option>
                        </select>

                        <label>Emergency Contact: </label>
                        <input name="emergency_contact"></input>

                        <label>Notes: </label>
                        <textarea name="notes"></textarea>

                        <button>Add new member</button>
                    </form>
                  : null}
                {isRegistrationSuccessful && 
                <Typography variant="h1">Successfully Registered New Member</Typography>}
                <CCAMembersTable membersList={membersList}/>
            </main>
            <Footer />
        </>
    )
}
