import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import Navbar from "../components/Navbar.jsx"
import Footer from "../components/Footer.jsx"
import CCATrainingTable from "../components/CCATrainingTable.jsx"
import { Box, TableCell, TableRow, Button } from "@mui/material"
import "../stylesheets/cca-training-session-management.css"
import joinTrainingSession from "../api-calls/joinTrainingSession.js"
import leaveTrainingSession from "../api-calls/leaveTrainingSession.js"
import createTrainingSession from "../api-calls/createTrainingSession.js"
import pullCCATrainingData from "../api-calls/pullCCATrainingData.js"
import pullCCADetail from "../api-calls/pullCCADetail.js"

export default function TrainingSessionManagement() {
    // Set the states
    const [ccaTrainingSessions, setCcaTrainingSessions] = useState(null)
    const [ccaTrainingDataError, setCcaTrainingDataError] = useState(null)
    const [ccaData, setCcaData] = useState(null)
    const [showForm, setShowForm] = useState(null)
    const [joinButtonPlaceholder, setJoinButtonPlaceholder] = useState("Join training session")
    const [successfulJoin, setSuccessfulJoin] = useState(false)
    const [leaveButtonPlaceholder, setLeaveButtonPlaceholder] = useState("Leave training session")
    const [successfulLeave, setSuccessfulLeave] = useState(false)

    // Set the token value
    const token = localStorage.getItem("authToken")
    
    // Get the CCA ID from the URL
    const { ccaId } = useParams()

    // Get the CCA data from the API
    useEffect(() => {
        const fetchCcaData = async () => {
            setCcaData(await pullCCADetail(ccaId))
        }

        if (ccaId) {
            console.log("Running fetchCcaData")
            fetchCcaData()
        }
    }, [ccaId])
    console.log("The CCA Data is: ", ccaData)

    // Get the CCA Training Session information from the API endpoint
    useEffect(() => {
        const fetchCCATrainingData = async () => {
            setCcaTrainingSessions(await pullCCATrainingData(ccaId))
        }
        fetchCCATrainingData()
    }, [ccaId])

    async function joinSessionClick(ccaId, sessionId) {
        try {
            await joinTrainingSession(ccaId, sessionId)
            setJoinButtonPlaceholder("Successfully joined training session")
        }
        catch (error) {
            setJoinButtonPlaceholder("Failed to join training session")
        }
        finally {
            setTimeout(() => window.location.reload(), 1000)
        }
    }

    async function leaveSessionClick(ccaId, sessionId) {
        try {
            await leaveTrainingSession(ccaId, sessionId)
            setLeaveButtonPlaceholder("Successfully left training session")
        }
        catch (error) {
            setLeaveButtonPlaceholder("Failed to leave training session")
        }
        finally {
            setTimeout(() => window.location.reload(), 1000)
        }
    }

    // Map the CCA Training sessions into an array of 
    let trainingList
if (ccaTrainingSessions) {
    trainingList = ccaTrainingSessions.map((training, idx) => (
        <TableRow
            key={training.id}
            sx={{
                backgroundColor: idx % 2 === 0 ? "#fff" : "#fcf7ee",
                transition: "background 0.2s",
                "&:hover": {
                    backgroundColor: "#fff7e6"
                }
            }}
        >
            <TableCell align="center" sx={{ fontWeight: 500, color: "#f59e0b", border: 0 }}>{training.id}</TableCell>
            <TableCell align="center" sx={{ border: 0 }}>{training.date}</TableCell>
            <TableCell align="center" sx={{ border: 0 }}>{training.start_time}</TableCell>
            <TableCell align="center" sx={{ border: 0 }}>{training.end_time}</TableCell>
            <TableCell align="center" sx={{ border: 0 }}>{training.location}</TableCell>
            <TableCell align="center" sx={{ border: 0 }}>{training.note}</TableCell>
            <TableCell align="center" sx={{ border: 0 }}>
                <Button
                    variant="outlined"
                    sx={{
                        borderColor: "#f59e0b",
                        color: "#f59e0b",
                        fontWeight: 600,
                        borderRadius: 2,
                        px: 2.5,
                        py: 1,
                        mx: 0.5,
                        textTransform: "none",
                        transition: "all 0.2s",
                        "&:hover": {
                            backgroundColor: "#f59e0b",
                            color: "#fff",
                            borderColor: "#f59e0b"
                        }
                    }}
                    onClick={() => joinSessionClick(ccaId, training.id)}
                >
                    {joinButtonPlaceholder}
                </Button>
                <Button
                    variant="outlined"
                    sx={{
                        borderColor: "#f59e0b",
                        color: "#f59e0b",
                        fontWeight: 600,
                        borderRadius: 2,
                        px: 2.5,
                        py: 1,
                        mx: 0.5,
                        textTransform: "none",
                        transition: "all 0.2s",
                        "&:hover": {
                            backgroundColor: "#f59e0b",
                            color: "#fff",
                            borderColor: "#f59e0b"
                        }
                    }}
                    onClick={() => leaveSessionClick(ccaId, training.id)}
                >
                    {leaveButtonPlaceholder}
                </Button>
                <Button
                    variant="outlined"
                    sx={{
                        borderColor: "#f59e0b",
                        color: "#f59e0b",
                        fontWeight: 600,
                        borderRadius: 2,
                        px: 2.5,
                        py: 1,
                        mx: 0.5,
                        textTransform: "none",
                        transition: "all 0.2s",
                        "&:hover": {
                            backgroundColor: "#f59e0b",
                            color: "#fff",
                            borderColor: "#f59e0b"
                        }
                    }}
                    onClick={() => joinSessionClick(ccaId, training.id)}
                >
                    View Training Session Details
                </Button>
            </TableCell>
        </TableRow>
    ))
}

    function showFormClick() {
        console.log("CLICK CLICK")
        setShowForm(prevShowForm => !prevShowForm)
    }

    function addNewTrainingSession(formData) {
        formData.append("cca", ccaId)
        createTrainingSession(ccaId, formData)
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
                    <input type="date" name="date"></input>

                    <label>Start Time: </label>
                    <input type="time" name="start_time"></input>

                    <label>End Time: </label>
                    <input type="time" name="end_time"></input>

                    <label>Location: </label>
                    <input name="location"></input>

                    <label>Max Participants</label>
                    <input name="max_participants"></input>

                    <label>Note: </label>
                    <input name="note"></input>

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