import Navbar from "../components/Navbar.jsx"
import Footer from "../components/Footer.jsx"
import pullCCADetail from "../api-calls/pullCCADetail.js"   
import { Paper, Typography, Box, Button } from "@mui/material"
import { useState, useEffect } from "react"
import { useNavigate } from 'react-router-dom';

export default function CCADashboardWelcome() {
    // State that will represent the list of CCA objects
    const [ccas, setCcas] = useState(null)
    let ccaList

    const navigate = useNavigate()

    // For each CCA id that the user is a member of, turn it into a CCA object
    const ccaIds = JSON.parse(localStorage.getItem("ccaIds"))
    console.log("The list of ccaIds are: ", ccaIds)

    useEffect(() => {
        async function fetchAllCcas() {
        const details = await Promise.all(
            ccaIds.map(ccaId => pullCCADetail(ccaId))
        )
        setCcas(details)
        }
        fetchAllCcas()
    }, [])

    console.log("These are the list of CCA objects: ", ccas)

    // Function that will redirect the user to their respective CCA Dashboard page
    function manageCCA(ccaId) {
        navigate(`/cca-dashboard/${ccaId}`)
    }

    // For each CCA object that the user is a member of, turn it into a paper component
    if (ccas) {
    ccaList = ccas.map(cca => (
        <Paper
            key={cca.id}
            elevation={3}
            sx={{
                p: { xs: 3, sm: 4 },
                my: 3,
                mx: "auto",
                maxWidth: 700,
                borderRadius: 4,
                display: "flex",
                flexDirection: { xs: "column", sm: "row" },
                alignItems: "center",
                justifyContent: "space-between",
                boxShadow: "0 4px 24px rgba(0,0,0,0.07)",
                background: "#fff",
                transition: "box-shadow 0.2s",
                "&:hover": {
                    boxShadow: "0 8px 32px rgba(0,0,0,0.13)",
                },
            }}
        >
            <Box sx={{ flex: 1 }}>
                <Typography
                    variant="h5"
                    fontWeight={700}
                    color="primary"
                    sx={{ mb: 1, letterSpacing: 0.5 }}
                >
                    {cca.name}
                </Typography>
                <Typography
                    variant="body1"
                    color="text.secondary"
                    sx={{ mb: 2 }}
                >
                    {cca.description || "No description available."}
                </Typography>
            </Box>
            <Button
                variant="contained"
                color="primary"
                sx={{
                    minWidth: 140,
                    fontWeight: 600,
                    borderRadius: 2,
                    boxShadow: "none",
                    textTransform: "none",
                    py: 1.2,
                    px: 3,
                    fontSize: "1rem",
                    ml: { sm: 3 },
                    mt: { xs: 2, sm: 0 }
                }}
                onClick={() => manageCCA(cca.id)}
            >
                Manage CCA
            </Button>
        </Paper>
    ))
}

    return (
        <>
            <Navbar />
            <h1 className="page-title">CCA Management Dashboard</h1>
            {ccaList && ccaList}
            <Footer />
        </>
    )
}

