import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import Navbar from "../components/Navbar.jsx"
import Footer from "../components/Footer.jsx"
import CCATrainingTable from "../components/CCATrainingTable"
import { Box } from "@mui/material"
import "../stylesheets/cca-training-session-management.css"

export default function TrainingSessionManagement() {
    // Set the states
    const [ccaTrainingSessions, setCcaTrainingSessions] = useState(null)
    const [ccaTrainingDataError, setCcaTrainingDataError] = useState(null)
    const [ccaData, setCcaData] = useState(null)
    const [showForm, setShowForm] = useState(null)

    // Set the token value
    const token = localStorage.getItem("authToken")
    
    // Get the CCA ID from the URL
    const { ccaId } = useParams()

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

    // Get the CCA Training Session information from the API endpoint
    useEffect(() => {
        const fetchCcaTrainingdata = async () => {
            try {
                const response = await fetch(`https://sportsync-backend-8gbr.onrender.com/api/cca/${ccaId}/training/`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    }
                })

                if (!response.ok) {
                    throw new Error("CCA Training Data not found")
                }

                const ccaTrainingData = await response.json()
                setCcaTrainingSessions(ccaTrainingData)
                console.log("CCA Training Data successfully retrieved")
            }
            catch (err) {
                console.log("An error has occured fetching")
                setCcaTrainingDataError(err)
            }
        }

        if (ccaId) {
            fetchCcaTrainingdata()
        }
    }, [ccaId])

    // Map the CCA Training sessions into an array of 
    let trainingList
    if (ccaTrainingSessions) {
        trainingList = ccaTrainingSessions.map(training => (
            <tr key={training.id}>
                <td>{training.id}</td>
                <td>{training.date}</td>
                <td>{training.start_time}</td>
                <td>{training.end_time}</td>
                <td>{training.location}</td>
                <td>{training.note}</td>
            </tr>
        ))
    }

    function showFormClick() {
        console.log("CLICK CLICK")
        setShowForm(prevShowForm => !prevShowForm)
    }

    function addNewTrainingSession() {

    }

    return (

        <>
            <Navbar />
            <main>
                <h1 className="page-title">CCA Training Sessions Management</h1>
                <button onClick={showFormClick}>
                    { !showForm
                      ? "Create a new training session"
                      : "Close form"
                    }
                </button>
                {showForm
                 ? <form className="cca-submission-form" action={addNewTrainingSession}>
                    <label>Date: </label>
                    <input type="date"></input>

                    <label>Start Time: </label>
                    <input type="time"></input>

                    <label>End Time: </label>
                    <input type="time"></input>

                    <label>Location: </label>
                    <input></input>

                    <label>Max Participants</label>
                    <input></input>

                    <label>Note: </label>
                    <input></input>

                    <label>CCA: </label>
                    <select defaultValue={ccaData.name}>
                        <option>{ccaData.name}</option>
                    </select>

                    <button className="add-training-session-button">Add training session</button>
                 </form>
                 : null}
                <Box sx={{ marginX: "5rem"}}>
                    {trainingList
                    ? <CCATrainingTable trainingList={trainingList} />
                    : <h1>Loading...</h1>
                    }
                </Box>
            </main>
            <Footer />
        </>
    )
}