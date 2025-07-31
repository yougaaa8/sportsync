"use client"

import pullCCADetail from "../../../../api-calls/cca/pullCCADetails"   
import { Paper, Typography, Box, Button } from "@mui/material"
import { useState, useEffect } from "react"
import { useRouter } from 'next/navigation'
import { CCADetail } from "@/types/CCATypes"
import BackButton from "@/components/BackButton"

export default function CCADashboardWelcome() {
    // State that will represent the list of CCA objects
    const [ccas, setCcas] = useState<CCADetail[] | null>(null)
    const [ccaIds, setCcaIds] = useState<number[]>([])
    let ccaList

    const router = useRouter()

    // For each CCA id that the user is a member of, turn it into a CCA object
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const data = localStorage.getItem("ccaIds")
            if (data) {
                setCcaIds(JSON.parse(data))
            }
        }
    }, [])

    console.log("The list of ccaIds are: ", ccaIds)

    useEffect(() => {
        async function fetchAllCcas() {
            if (ccaIds.length > 0) {
                const details = await Promise.all(
                    ccaIds.map(ccaId => pullCCADetail(ccaId))
                )
                setCcas(details)
            }
        }
        fetchAllCcas()
    }, [ccaIds])

    console.log("These are the list of CCA objects: ", ccas)

    // Function that will redirect the user to their respective CCA Dashboard page
    function manageCCA(ccaId: number) {
        router.push(`/cca/dashboard/${ccaId}`)
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
            <Box 
                sx={{ 
                    mb: 6,
                    pt: 4,
                    pb: 3,
                    textAlign: 'center',
                    background: 'linear-gradient(135deg, #FAFAFA 0%, #F5F5F5 100%)',
                    borderBottom: '1px solid #E0E0E0'
                }}
            >
                <Typography
                    variant="h3"
                    component="h1"
                    sx={{
                        fontWeight: 700,
                        color: '#212121',
                        letterSpacing: '-0.02em',
                        mb: 1,
                        fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' }
                    }}
                >
                    CCA Management Dashboard
                </Typography>
                <Box 
                    sx={{ 
                        width: 60,
                        height: 4,
                        backgroundColor: '#FF6B35',
                        mx: 'auto',
                        borderRadius: 2
                    }} 
                />
            </Box>
            {ccaList && ccaList}
        </>
    )
}