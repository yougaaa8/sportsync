"use client"

import { useParams } from "next/navigation"
import { useEffect, useState, useRef } from "react"
import pullCCADetails from "../../../../api-calls/cca/pullCCADetails"
import Image from "next/image"
import { Box, Container, Typography, Divider, Paper, Avatar, Button, Link } from "@mui/material"
import { Email, PhotoCamera, Language, Facebook, Instagram } from "@mui/icons-material"
import { CCADetail } from "@/types/CCATypes"
import uploadCCALogo from "../../../../api-calls/cca/uploadCCALogo"
import BackButton from "@/components/BackButton"

export default function CCALayout() {
    // Set states
    const [ccaDetails, setCcaDetails] = useState<null | CCADetail>(null)

    // Set refs
    const fileInputRef = useRef<HTMLInputElement>(null)

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

    // Define functions
    function changeCCALogo() {
        fileInputRef.current?.click()
    }

    async function imageUpload(event: React.ChangeEvent<HTMLInputElement>) {
        const file = event.target.files?.[0]
        if (file && typeof ccaId === "string") {
            await uploadCCALogo(file, ccaId)
            // After backend is updated, re-fetch the updated details
            // setCcaDetails(await pullCCADetails(ccaId))
        }
    }

    console.log("CCA Logo URL: ", ccaDetails?.logo_url)

    return (
        <><BackButton /><Container maxWidth="lg" sx={{ py: 4 }}>
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
                                flexShrink: 0,
                                position: 'relative' // Enable absolute positioning for children
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
                                }} />
                            <Button
                                className="shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110 active:scale-95 backdrop-blur-sm"
                                sx={{
                                    position: 'absolute',
                                    bottom: 8,
                                    right: 8,
                                    minWidth: 'auto',
                                    width: 40,
                                    height: 40,
                                    borderRadius: '50%',
                                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                                    color: '#424242',
                                    border: '1px solid rgba(0, 0, 0, 0.1)',
                                    '&:hover': {
                                        backgroundColor: 'rgba(255, 255, 255, 1)',
                                        color: '#FF6B35'
                                    }
                                }}
                                onClick={changeCCALogo}
                            >
                                <PhotoCamera fontSize="small" />
                            </Button>
                            {/* Hidden file input */}
                            <input
                                type="file"
                                accept="image/*"
                                ref={fileInputRef}
                                style={{ display: "none" }}
                                onChange={imageUpload} />
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

                {/* Links and Social Media Section */}
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
                        Connect With Us
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        {/* Website Link */}
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
                            <Language sx={{ color: '#FF6B35', fontSize: '1.25rem' }} />
                            <Link
                                href={ccaDetails?.website}
                                target="_blank"
                                rel="noopener noreferrer"
                                sx={{
                                    color: '#424242',
                                    fontWeight: 500,
                                    textDecoration: 'none',
                                    '&:hover': {
                                        color: '#FF6B35',
                                        textDecoration: 'underline'
                                    }
                                }}
                            >
                                {ccaDetails?.website}
                            </Link>
                        </Box>

                        {/* Facebook Link */}
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
                            <Facebook sx={{ color: '#1877F2', fontSize: '1.25rem' }} />
                            <Link
                                href={ccaDetails?.facebook}
                                target="_blank"
                                rel="noopener noreferrer"
                                sx={{
                                    color: '#424242',
                                    fontWeight: 500,
                                    textDecoration: 'none',
                                    '&:hover': {
                                        color: '#1877F2',
                                        textDecoration: 'underline'
                                    }
                                }}
                            >
                                {ccaDetails?.facebook}
                            </Link>
                        </Box>

                        {/* Instagram Link */}
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
                            <Instagram sx={{ color: '#E4405F', fontSize: '1.25rem' }} />
                            <Link
                                href={ccaDetails?.instagram}
                                target="_blank"
                                rel="noopener noreferrer"
                                sx={{
                                    color: '#424242',
                                    fontWeight: 500,
                                    textDecoration: 'none',
                                    '&:hover': {
                                        color: '#E4405F',
                                        textDecoration: 'underline'
                                    }
                                }}
                            >
                                {ccaDetails?.instagram}
                            </Link>
                        </Box>
                    </Box>
                </Box>

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
        </Container></>
    )
}