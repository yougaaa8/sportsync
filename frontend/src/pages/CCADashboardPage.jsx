import Navbar from "../components/Navbar.jsx"
import Footer from "../components/Footer.jsx"
import CCADashboardLayout from "../components/CCADashboardLayout.jsx" 
import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import "../stylesheets/cca-dashboard-page.css"
import { Typography, Paper, Box } from "@mui/material"
import pullCCADetail from "../api-calls/pullCCADetail.js"
import pullCCAMembersList from "../api-calls/pullCCAMembersList.js"
import pullCCATrainingData from "../api-calls/pullCCATrainingData.js"

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
        const fetchCCAData = async () => {
            setCcaData(await pullCCADetail(ccaId))
        }
        fetchCCAData()
    }, [ccaId])
    console.log("The CCA Data is: ", ccaData)

    // 2. Fetch the CCA Members Data
    useEffect(() => {
        const fetchCcaMembersData = async () => {
            setCcaMembersData(await pullCCAMembersList(ccaId))
        }

        if (ccaId) {
            fetchCcaMembersData()
        }
    }, [ccaId])
    console.log("The CCA members data is: ", ccaMembersData)

    // 3. Fetch the CCA Training Data
    useEffect(() => {
        const fetchCcaTrainingData = async () => {
            setCcaTrainingData(await pullCCATrainingData(ccaId))
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