"use client"

import CCAMembersTable from "../../../../../components/CCA/CCAMembersTable.jsx"
import CCATrainingTable from "../../../../../components/CCA/CCATrainingTable.jsx"
import { TableRow, TableCell, Typography, Button, Box, Container, Divider } from "@mui/material"
import { useState, useEffect } from "react"
import pullCCAMembersList from "@/api-calls/cca/pullCCAMembersList.js"
import pullCCATrainingData from "../../../../../api-calls/cca/pullCCATrainingData"
import { Member, Training } from "../../../../../types/CCATypes"

export default function CCADashboardLayout({params}: {
    params: Promise<{
        ccaId: string
    }>
}) {
    const [ membersData, setMembersData ] = useState<Member[] | null>(null)
    const [ trainingData, setTrainingData ] = useState<Training[] | null>(null)
    const [resolvedParams, setResolvedParams] = useState<{ ccaId: string } | null>(null);

    // Resolve the params
    useEffect(() => {
        const resolveParams = async () => {
            const result = await params;
            setResolvedParams(result);
        };
        resolveParams();
    }, [params]);

    // Pull members data
    useEffect(() => {
        const fetchCcaMembersData = async () => {
            if (resolvedParams?.ccaId) {
                const members = await pullCCAMembersList(resolvedParams.ccaId);
                setMembersData(members);
                console.log("This is the members data: ", members);
            }
        }
        fetchCcaMembersData()
    }, [resolvedParams])

    // Pull training data
    useEffect(() => {
        const fetchTrainingData = async () => {
            if (resolvedParams?.ccaId) {
                const training = await pullCCATrainingData(resolvedParams.ccaId)
                setTrainingData(training)
            }
        }
        fetchTrainingData()
    }, [resolvedParams])

    const membersList = membersData?.map((member, index) => (
        <TableRow 
            key={member.id} 
            sx={{ 
                "&:last-child td, &:last-child th": { border: 0 },
                "&:hover": {
                    backgroundColor: "#FAFAFA"
                }
            }}
        >
            <TableCell align="center" sx={{ color: "#757575", fontWeight: 500 }}>{index + 1}</TableCell>
            <TableCell align="center" sx={{ fontWeight: 600 }}>{member.first_name}</TableCell>
            <TableCell align="center" sx={{ fontWeight: 600 }}>{member.last_name}</TableCell>
            <TableCell align="center">{member.position}</TableCell>
            <TableCell align="center">{member.role}</TableCell>
        </TableRow>
    ))

    // The training data passed into props is an array of training objects
    // Map each object in the training data array into a table row
    const trainingList = trainingData?.map((training, index) => (
        <TableRow 
            key={training.id}
            sx={{ 
                "&:hover": {
                    backgroundColor: "#FAFAFA"
                }
            }}
        >
            <TableCell align="center" sx={{ color: "#757575", fontWeight: 500 }}>{index + 1}</TableCell>
            <TableCell align="center" sx={{ fontWeight: 600 }}>{training.date}</TableCell>
            <TableCell align="center">{training.start_time}</TableCell>
            <TableCell align="center">{training.end_time}</TableCell>
            <TableCell align="center">{training.location}</TableCell>
            <TableCell align="center">{training.note}</TableCell>
        </TableRow>
    ))

    // Function that runs when member management button is clicked
    function membersTableClick() {
    }

    // Function that runs when training session management button is clicked

    return (
        <Container maxWidth="xl" sx={{ py: 4, px: 3 }}>
            {/* Member Management Section */}
            <Box sx={{ mb: 6 }}>
                <Box sx={{ 
                    display: "flex", 
                    justifyContent: "space-between", 
                    alignItems: "center", 
                    mb: 3 
                }}>
                    <Box>
                        <Typography 
                            variant="h3" 
                            sx={{ 
                                fontWeight: 700,
                                color: "#212121",
                                mb: 1
                            }}
                        >
                            Member Management
                        </Typography>
                        <Typography 
                            variant="body2" 
                            sx={{ 
                                color: "#757575",
                                fontSize: "1rem"
                            }}
                        >
                            Manage members
                        </Typography>
                        href={`/cca/dashboard/${resolvedParams?.ccaId}/member-management`}
                    </Box>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={membersTableClick}
                        href={`/cca/dashboard/${resolvedParams?.ccaId}/member-management`}
                        sx={{ 
                            minWidth: "160px",
                            height: "44px",
                            fontSize: "0.875rem"
                        }}
                    >
                        Manage Members
                    </Button>
                </Box>
                <CCAMembersTable membersList={membersList}/>
            </Box>

            {/* Divider */}
            <Divider sx={{ my: 6, borderColor: "#E0E0E0" }} />

            {/* Training Session Management Section */}
            <Box sx={{ mb: 4 }}>
                <Box sx={{ 
                    display: "flex", 
                    justifyContent: "space-between", 
                    alignItems: "center", 
                    mb: 3 
                }}>
                    <Box>
                        <Typography 
                            variant="h3" 
                            sx={{ 
                                fontWeight: 700,
                                color: "#212121",
                                mb: 1
                            }}
                        >
                            Training Session Management
                        </Typography>
                        <Typography 
                            variant="body2" 
                            sx={{ 
                                color: "#757575",
                                fontSize: "1rem"
                            }}
                        />
                            Manage training sessions
                        href={`/cca/dashboard/${resolvedParams?.ccaId}/training-management`}
                    </Box>
                    <Button
                        variant="contained"
                        color="primary"
                        href={`/cca/dashboard/${resolvedParams?.ccaId}/training-management`}
                        sx={{ 
                            minWidth: "160px",
                            height: "44px",
                            fontSize: "0.875rem"
                        }}
                    >
                        Manage Training
                    </Button>
                </Box>
                <CCATrainingTable trainingList={trainingList}/>
            </Box>
        </Container>
    )
}