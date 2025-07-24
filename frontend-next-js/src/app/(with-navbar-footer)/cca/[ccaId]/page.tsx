"use client"

import { useParams } from "next/navigation"
import { useEffect, useState } from "react"
import pullCCADetails from "../../../../api-calls/cca/pullCCADetails"
import Image from "next/image"
import { Box, Container, Typography, Divider, Paper, Avatar } from "@mui/material"
import { Email } from "@mui/icons-material"
import { CCADetail } from "@/types/CCATypes"

export default function CCALayout() {
    // Set states
    const [ccaDetails, setCcaDetails] = useState<null | CCADetail>(null)

    // Get the params
    const params = useParams()
    const ccaId = params.ccaId

    // Pull the CCA details
    useEffect(() => {
        const fetchCcaDetails = async () => {
            setCcaDetails(await pullCCADetails(ccaId))
        }
        fetchCcaDetails()
    }, [ccaId])

    console.log("ccaDetails: ", ccaDetails)

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Paper 
                elevation={0} 
                sx={{ 
                    p: { xs: 3, md: 5 }, 
                    borderRadius: 3,
                    border: '1px solid #F0F0F0',
                    backgroundColor: '#FFFFFF'
                }}
            >
                {/* Header Section */}
                <Box 
                    sx={{ 
                        display: 'flex', 
                        flexDirection: { xs: 'column', sm: 'row' },
                        alignItems: { xs: 'center', sm: 'flex-start' },
                        gap: 3,
                        mb: 4
                    }}
                >
                    {/* Logo */}
                    {(ccaDetails && ccaDetails.logo_url) ? (
                        <Box
                            sx={{
                                width: { xs: 120, sm: 150 },
                                height: { xs: 120, sm: 150 },
                                borderRadius: 3,
                                overflow: 'hidden',
                                border: '2px solid #F0F0F0',
                                flexShrink: 0
                            }}
                        >
                            <Image 
                                alt="CCA logo" 
                                src={ccaDetails.logo_url} 
                                width={150}
                                height={150}
                                style={{ 
                                    width: '100%', 
                                    height: '100%', 
                                    objectFit: 'cover' 
                                }}
                            />
                        </Box>
                    ) : (
                        <Avatar
                            sx={{
                                width: { xs: 120, sm: 150 },
                                height: { xs: 120, sm: 150 },
                                bgcolor: '#FF6B35',
                                fontSize: { xs: '2rem', sm: '2.5rem' },
                                fontWeight: 600
                            }}
                        >
                            {ccaDetails?.name?.charAt(0) || 'C'}
                        </Avatar>
                    )}

                    {/* Title and Basic Info */}
                    <Box sx={{ flex: 1, textAlign: { xs: 'center', sm: 'left' } }}>
                        <Typography 
                            variant="h3" 
                            component="h1"
                            sx={{ 
                                fontWeight: 700,
                                color: '#212121',
                                mb: 1,
                                fontSize: { xs: '1.75rem', sm: '2rem', md: '2.25rem' }
                            }}
                        >
                            {ccaDetails?.name || 'Loading...'}
                        </Typography>
                    </Box>
                </Box>

                <Divider sx={{ my: 4, borderColor: '#E0E0E0' }} />

                {/* Description Section */}
                {ccaDetails?.description && (
                    <Box sx={{ mb: 4 }}>
                        <Typography 
                            variant="h5" 
                            component="h2"
                            sx={{ 
                                fontWeight: 600,
                                color: '#212121',
                                mb: 2
                            }}
                        >
                            About Us
                        </Typography>
                        <Typography 
                            variant="body1"
                            sx={{ 
                                lineHeight: 1.7,
                                color: '#424242',
                                fontSize: '1rem'
                            }}
                        >
                            {ccaDetails.description}
                        </Typography>
                    </Box>
                )}

                <Divider sx={{ my: 4, borderColor: '#E0E0E0' }} />

                {/* Contact Section */}
                {ccaDetails?.contact_email && (
                    <Box>
                        <Typography 
                            variant="h5" 
                            component="h2"
                            sx={{ 
                                fontWeight: 600,
                                color: '#212121',
                                mb: 2
                            }}
                        >
                            Contact Information
                        </Typography>
                        <Box 
                            sx={{ 
                                display: 'flex', 
                                alignItems: 'center',
                                gap: 1.5,
                                p: 2,
                                bgcolor: '#FAFAFA',
                                borderRadius: 2,
                                border: '1px solid #F0F0F0'
                            }}
                        >
                            <Email sx={{ color: '#FF6B35', fontSize: '1.25rem' }} />
                            <Typography 
                                variant="body1"
                                sx={{ 
                                    color: '#424242',
                                    fontWeight: 500
                                }}
                            >
                                {ccaDetails.contact_email}
                            </Typography>
                        </Box>
                    </Box>
                )}
            </Paper>
        </Container>
    )
}