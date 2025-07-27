"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation.js"
import CCATrainingTable from "../../../../../../components/CCA/CCATrainingTable.jsx"
import { 
    Box, 
    TableCell, 
    TableRow, 
    Button, 
    Typography, 
    Paper,
    TextField,
    MenuItem,
    Container
} from "@mui/material"
import joinTrainingSession from "../../../../../../api-calls/cca/joinTrainingSession.js"
import leaveTrainingSession from "../../../../../../api-calls/cca/leaveTrainingSession.js"
import createTrainingSession from "../../../../../../api-calls/cca/createTrainingSession.js"
import pullCCATrainingData from "../../../../../../api-calls/cca/pullCCATrainingData.js"
import pullCCADetail from "../../../../../../api-calls/cca/pullCCADetails.js"
import { CCADetail, Training } from "../../../../../../types/CCATypes.js"

export default function TrainingSessionManagement() {
    // Set the states
    const [ccaTrainingSessions, setCcaTrainingSessions] = useState<Training[] | null>(null)
    const [ccaData, setCcaData] = useState<CCADetail | null>(null)
    const [showForm, setShowForm] = useState<boolean | null>(null)
    const [joinButtonPlaceholder, setJoinButtonPlaceholder] = useState("Join training session")
    const [leaveButtonPlaceholder, setLeaveButtonPlaceholder] = useState("Leave training session")
    
    // Get the CCA ID from the URL
    const params = useParams()
    const ccaId = params.ccaId
    console.log("cca id is: ", ccaId)

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

    async function joinSessionClick(ccaId: string, sessionId: number) {
        try {
            await joinTrainingSession(ccaId, sessionId)
            setJoinButtonPlaceholder("Successfully joined training session")
        }
        catch (error) {
            console.log("Failed to join training session: ", error)
            setJoinButtonPlaceholder("Failed to join training session")
        }
        finally {
            setTimeout(() => window.location.reload(), 1000)
        }
    }

    async function leaveSessionClick(ccaId: string, sessionId: number) {
        try {
            await leaveTrainingSession(ccaId, sessionId)
            setLeaveButtonPlaceholder("Successfully left training session")
        }
        catch (error) {
            console.log("Failed to leave training session: ", error)
            setLeaveButtonPlaceholder("Failed to leave training session")
        }
        finally {
            setTimeout(() => window.location.reload(), 1000)
        }
    }

    // Map the CCA Training sessions into an array of table rows
    let trainingList
    if (ccaTrainingSessions) {
        trainingList = ccaTrainingSessions.map((training, idx) => (
            <TableRow
                key={training.id}
                sx={{
                    backgroundColor: idx % 2 === 0 ? "#FFFFFF" : "#FAFAFA",
                    transition: "background-color 0.2s ease",
                    "&:hover": {
                        backgroundColor: "#F5F5F5"
                    }
                }}
            >
                <TableCell 
                    align="center" 
                    sx={{ 
                        fontWeight: 600, 
                        color: "#FF6B35", 
                        border: "none",
                        py: 2
                    }}
                >
                    {idx + 1}
                </TableCell>
                <TableCell 
                    align="center" 
                    sx={{ 
                        border: "none", 
                        color: "#212121",
                        fontWeight: 500,
                        py: 2
                    }}
                >
                    {training.date}
                </TableCell>
                <TableCell 
                    align="center" 
                    sx={{ 
                        border: "none", 
                        color: "#212121",
                        py: 2
                    }}
                >
                    {training.start_time}
                </TableCell>
                <TableCell 
                    align="center" 
                    sx={{ 
                        border: "none", 
                        color: "#212121",
                        py: 2
                    }}
                >
                    {training.end_time}
                </TableCell>
                <TableCell 
                    align="center" 
                    sx={{ 
                        border: "none", 
                        color: "#212121",
                        py: 2
                    }}
                >
                    {training.location}
                </TableCell>
                <TableCell 
                    align="center" 
                    sx={{ 
                        border: "none", 
                        color: "#757575",
                        py: 2
                    }}
                >
                    {training.note}
                </TableCell>
                <TableCell 
                    align="center" 
                    sx={{ 
                        border: "none",
                        py: 2
                    }}
                >
                    <Box sx={{ display: "flex", gap: 1, justifyContent: "center", flexWrap: "wrap" }}>
                        <Button
                            variant="outlined"
                            size="small"
                            sx={{
                                borderColor: "#FF6B35",
                                color: "#FF6B35",
                                fontWeight: 600,
                                borderRadius: 2,
                                px: 2,
                                py: 0.8,
                                textTransform: "none",
                                fontSize: "0.75rem",
                                transition: "all 0.2s ease",
                                minWidth: "120px",
                                "&:hover": {
                                    backgroundColor: "#FF6B35",
                                    color: "#FFFFFF",
                                    borderColor: "#FF6B35",
                                    transform: "translateY(-1px)"
                                }
                            }}
                            onClick={() => typeof ccaId === "string" && joinSessionClick(ccaId, training.id)}
                        >
                            {joinButtonPlaceholder}
                        </Button>
                        <Button
                            variant="outlined"
                            size="small"
                            sx={{
                                borderColor: "#FF6B35",
                                color: "#FF6B35",
                                fontWeight: 600,
                                borderRadius: 2,
                                px: 2,
                                py: 0.8,
                                textTransform: "none",
                                fontSize: "0.75rem",
                                transition: "all 0.2s ease",
                                minWidth: "120px",
                                "&:hover": {
                                    backgroundColor: "#FF6B35",
                                    color: "#FFFFFF",
                                    borderColor: "#FF6B35",
                                    transform: "translateY(-1px)"
                                }
                            }}
                            onClick={() => typeof ccaId === "string" && leaveSessionClick(ccaId, training.id)}
                        >
                            {leaveButtonPlaceholder}
                        </Button>
                        <Button
                            variant="outlined"
                            size="small"
                            sx={{
                                borderColor: "#FF6B35",
                                color: "#FF6B35",
                                fontWeight: 600,
                                borderRadius: 2,
                                px: 2,
                                py: 0.8,
                                textTransform: "none",
                                fontSize: "0.75rem",
                                transition: "all 0.2s ease",
                                minWidth: "140px",
                                "&:hover": {
                                    backgroundColor: "#FF6B35",
                                    color: "#FFFFFF",
                                    borderColor: "#FF6B35",
                                    transform: "translateY(-1px)"
                                }
                            }}
                            onClick={() => typeof ccaId === "string" && joinSessionClick(ccaId, training.id)}
                        >
                            View Training Session Details
                        </Button>
                    </Box>
                </TableCell>
            </TableRow>
        ))
    }

    function showFormClick() {
        console.log("CLICK CLICK")
        setShowForm(prevShowForm => !prevShowForm)
    }

    async function addNewTrainingSession(formData: FormData) {
        if (typeof ccaId === "string") {
            formData.append("cca", ccaId)
        }
        await createTrainingSession(ccaId, formData)
        window.location.reload()
    }

    return (
        <Container maxWidth="xl" sx={{ py: 4 }}>
            {/* Header Section */}
            <Box sx={{ mb: 4 }}>
                <Typography 
                    variant="h4" 
                    component="h1" 
                    sx={{ 
                        fontWeight: 700,
                        color: "#212121",
                        mb: 1
                    }}
                >
                    CCA Training Sessions Management
                </Typography>
                <Typography 
                    variant="body1" 
                    sx={{ 
                        color: "#757575",
                        mb: 3
                    }}
                >
                    Manage and organize your CCA training sessions efficiently
                </Typography>
                
                <Button
                    variant="contained"
                    onClick={showFormClick}
                    sx={{
                        backgroundColor: "#FF6B35",
                        color: "#FFFFFF",
                        fontWeight: 600,
                        borderRadius: 2,
                        px: 3,
                        py: 1.2,
                        textTransform: "none",
                        boxShadow: "0 2px 8px rgba(255, 107, 53, 0.2)",
                        "&:hover": {
                            backgroundColor: "#E65100",
                            transform: "translateY(-2px)",
                            boxShadow: "0 4px 12px rgba(255, 107, 53, 0.3)"
                        }
                    }}
                >
                    {!showForm ? "Add New Training Session" : "Close Form"}
                </Button>
            </Box>

            {/* Form Section */}
            {showForm && (
                <Paper 
                    elevation={2}
                    sx={{ 
                        p: 4, 
                        mb: 4, 
                        borderRadius: 3,
                        border: "1px solid #F0F0F0"
                    }}
                >
                    <Typography 
                        variant="h6" 
                        sx={{ 
                            mb: 3, 
                            color: "#212121",
                            fontWeight: 600
                        }}
                    >
                        Create New Training Session
                    </Typography>
                    
                    <Box 
                        component="form" 
                        action={addNewTrainingSession}
                        sx={{ 
                            display: "flex",
                            flexDirection: "column",
                            gap: 3
                        }}
                    >
                        <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                            <TextField
                                label="Date"
                                name="date"
                                type="date"
                                InputLabelProps={{ shrink: true }}
                                sx={{ flex: 1, minWidth: "200px" }}
                            />
                            <TextField
                                label="Start Time"
                                name="start_time"
                                type="time"
                                InputLabelProps={{ shrink: true }}
                                sx={{ flex: 1, minWidth: "200px" }}
                            />
                            <TextField
                                label="End Time"
                                name="end_time"
                                type="time"
                                InputLabelProps={{ shrink: true }}
                                sx={{ flex: 1, minWidth: "200px" }}
                            />
                        </Box>

                        <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                            <TextField
                                label="Location"
                                name="location"
                                sx={{ flex: 1, minWidth: "200px" }}
                            />
                            <TextField
                                label="Max Participants"
                                name="max_participants"
                                type="number"
                                sx={{ flex: 1, minWidth: "200px" }}
                            />
                        </Box>

                        <TextField
                            label="Note"
                            name="note"
                            multiline
                            rows={3}
                            sx={{ width: "100%" }}
                        />

                        <TextField
                            label="CCA"
                            name="cca"
                            select
                            defaultValue={ccaData?.name || ""}
                            sx={{ maxWidth: "300px" }}
                        >
                            <MenuItem value={ccaData?.name || ""}>
                                {ccaData?.name || "Select CCA"}
                            </MenuItem>
                        </TextField>

                        <Button
                            type="submit"
                            variant="contained"
                            sx={{
                                backgroundColor: "#FF6B35",
                                color: "#FFFFFF",
                                fontWeight: 600,
                                borderRadius: 2,
                                px: 4,
                                py: 1.5,
                                textTransform: "none",
                                alignSelf: "flex-start",
                                "&:hover": {
                                    backgroundColor: "#E65100"
                                }
                            }}
                        >
                            Add Training Session
                        </Button>
                    </Box>
                </Paper>
            )}

            {/* Table Section */}
            <Paper 
                elevation={1}
                sx={{ 
                    borderRadius: 3,
                    border: "1px solid #F0F0F0",
                    overflow: "hidden"
                }}
            >
                {trainingList ? (
                    <CCATrainingTable trainingList={trainingList} />
                ) : (
                    <Box 
                        sx={{ 
                            p: 8, 
                            textAlign: "center" 
                        }}
                    >
                        <Typography 
                            variant="h6" 
                            sx={{ 
                                color: "#757575",
                                fontWeight: 500
                            }}
                        >
                            Loading training sessions...
                        </Typography>
                    </Box>
                )}
            </Paper>
        </Container>
    )
}