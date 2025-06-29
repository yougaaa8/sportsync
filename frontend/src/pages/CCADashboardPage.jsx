import Navbar from "../components/Navbar.jsx"
import Footer from "../components/Footer.jsx"
import CCADashboardLayout from "../components/CCADashboardLayout.jsx" 
import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import "../stylesheets/cca-dashboard-page.css"
import { Typography, Paper, Box } from "@mui/material"

export default function CCADashboardPage() {
    // Obtain the authorization token from localStorage
    const token = localStorage.getItem("authToken")

    // Get the CCA ID from the URL
    const { ccaId } = useParams()
    console.log("This is the extracted CCA ID: ", ccaId)

    // Set React states
    const [ccaData, setCcaData] = useState(null)
    const [ccaMembersData, setCcaMembersData] = useState(null)
    const [ccaTrainingData, setCcaTrainingData] = useState(null)
    const [ccaDataError, setCcaDataError] = useState(null)
    const [ccaMembersDataError, setCcaMembersDataError] = useState(null)
    const [ccaTrainingDataError, setCcaTrainingDataError] = useState(null)

    // Use that CCA ID to:
    // 1. Fetch the CCA Data
    useEffect(() => {
        const fetchCcaData = async () => {
            console.log("asdhfkahsdkjfahsdf")
            try {
                const response = await fetch(`http://localhost:8000/api/cca/${ccaId}`, {
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
                setCcaDataError(err.message)
                console.log("The CCA Data Error is: ", ccaDataError)
            }
        }

        if (ccaId) {
            console.log("Running fetchCcaData")
            fetchCcaData()
        }
    }, [ccaId])
    console.log("The CCA Data is: ", ccaData)

    // 2. Fetch the CCA Members Data
    useEffect(() => {
        const fetchCcaMembersData = async () => {
            try {
                const response = await fetch(`http://localhost:8000/api/cca/${ccaId}/members/`, {
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

    // 3. Fetch the CCA Training Data
    useEffect(() => {
        const fetchCcaTrainingData = async () => {
            try {
                const response = await fetch(`http://localhost:8000/api/cca/${ccaId}/training/`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    }
                })

                if (!response.ok) {
                    throw new Error("CCA Training Data not found")
                }

                const trainingData = await response.json()
                setCcaTrainingData(trainingData)
                console.log("CCA Training Dat retrieved")
            }
            catch (err) {
                setCcaTrainingDataError(err)
            }
        }

        if (ccaId) {
            fetchCcaTrainingData()
        }
    }, [ccaId])
    console.log("The CCA training data is: ", ccaTrainingData)

    // Pass the CCA data to a variable that will be passed on as props
    // to the CCADashboardLayout component
    
    return (
        <>
        {(ccaData && ccaMembersData && ccaTrainingData) ?
            <>
                <Navbar />
                <main className="cca-dashboard-page-main">
                    <h1 className="page-title">CCA Management Dashboard</h1>
                    <Box sx={{
                        marginX: "5rem"
                    }}>  
                        <CCADashboardLayout data={ccaData} 
                                            membersData={ccaMembersData} 
                                            trainingData={ccaTrainingData}
                                            ccaId={ccaId}/>
                    </Box>
                </main>
                <Footer />
            </>
            : <h1>Loading...</h1>
        }
        </>
    )
}