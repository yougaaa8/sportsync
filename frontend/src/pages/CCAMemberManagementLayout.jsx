import Navbar from "../components/Navbar.jsx"
import Footer from "../components/Footer.jsx"
import CCAMembersTable from "../components/CCAMembersTable.jsx"
import { useState, useEffect } from "react" 
import { useParams } from "react-router-dom"
import "../stylesheets/cca-training-session-management.css"

export default function CCAMemberManagementLayout() {
    const token = localStorage.getItem("authToken")

    // Set state to store CCA members data
    const [ccaData, setCcaData] = useState(null)
    const [ccaMembersData, setCcaMembersData] = useState(null)
    const [ccaMembersDataError, setCcaMembersDataError] = useState(null)
    const [showForm, setShowForm] = useState(false)

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
        membersList = ccaMembersData?.map(member => (
            <tr key={member.id}>
                <td>{member.id}</td>
                <td>{member.first_name}</td>
                <td>{member.last_name}</td>
                <td>{member.position}</td>
                <td>{member.role}</td>
            </tr>
        ))
    }

    function showFormClick() {
        console.log("CLICK CLICK")
        setShowForm(prevShowForm => !prevShowForm)
    }

    async function addNewMember(formData) {
        // Create an object to represent the data
        const data = {
            'user': formData.get("email"),
            'cca': formData.get("cca"),
            'position': formData.get("position"),
            'role': formData.get("role"),
            'is_active': formData.get("is_active"), 
            'emergency_contact': formData.get("emergency_contact"),
            'notes': formData.get("notes")
        }

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
        }
        catch (err) {
            console.log(`Catch block error: ${err}`)
        }
    }

    // Map all the current CCAs into options that the user can choose from 

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
                <CCAMembersTable membersList={membersList}/>
            </main>
            <Footer />
        </>
    )
}
