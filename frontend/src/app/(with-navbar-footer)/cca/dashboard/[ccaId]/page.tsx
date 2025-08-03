"use client"

import CCAMembersTable from "../../../../../components/CCA/CCAMembersTable.jsx"
import CCATrainingTable from "../../../../../components/CCA/CCATrainingTable.jsx"
import { 
    TableRow, 
    TableCell, 
    Typography, 
    Button, 
    Box, 
    Container, 
    Divider,
    Modal,
    TextField,
    IconButton,
    Paper
} from "@mui/material"
import CloseIcon from '@mui/icons-material/Close'
import CampaignIcon from '@mui/icons-material/Campaign'
import { useState, useEffect } from "react"
import pullCCAMembersList from "@/api-calls/cca/pullCCAMembersList.js"
import pullCCATrainingData from "../../../../../api-calls/cca/pullCCATrainingData.js"
import { Member, Training } from "../../../../../types/CCATypes.js"
import sendCCAAnnouncement from "../../../../../api-calls/cca/sendCCAAnnouncement"

export default function CCADashboardLayout({params}: {
    params: Promise<{
        ccaId: string
    }>
}) {
    const [ membersData, setMembersData ] = useState<Member[] | null>(null)
    const [ trainingData, setTrainingData ] = useState<Training[] | null>(null)
    const [resolvedParams, setResolvedParams] = useState<{ ccaId: string } | null>(null);
    const [announcementModalOpen, setAnnouncementModalOpen] = useState(false);
    const [announcementTitle, setAnnouncementTitle] = useState("");
    const [announcementMessage, setAnnouncementMessage] = useState("");

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

    // Announcement function
    function handleAnnouncements(formData: FormData) {
        if (resolvedParams) {
            sendCCAAnnouncement(formData, resolvedParams.ccaId)
            // Close modal and reset form after sending
            setAnnouncementModalOpen(false);
            setAnnouncementTitle("");
            setAnnouncementMessage("");
        }
    }

    // Handle form submission
    const handleAnnouncementSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('title', announcementTitle);
        formData.append('message', announcementMessage);
        handleAnnouncements(formData);
    };

    // Handle modal close
    const handleModalClose = () => {
        setAnnouncementModalOpen(false);
        setAnnouncementTitle("");
        setAnnouncementMessage("");
    };

    return (
        <Container maxWidth="xl" sx={{ py: 4, px: 3 }}>
            {/* Announcement Button */}
            <Box sx={{ mb: 4, display: 'flex', justifyContent: 'flex-end' }}>
                <Button
                    variant="contained"
                    color="primary"
                    startIcon={<CampaignIcon />}
                    onClick={() => setAnnouncementModalOpen(true)}
                    sx={{ 
                        minWidth: "180px",
                        height: "44px",
                        fontSize: "0.875rem",
                        fontWeight: 600
                    }}
                >
                    Send Announcement
                </Button>
            </Box>

            {/* Announcement Modal */}
            <Modal
                open={announcementModalOpen}
                onClose={handleModalClose}
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <Paper
                    elevation={3}
                    sx={{
                        width: '90%',
                        maxWidth: 500,
                        bgcolor: 'background.paper',
                        borderRadius: 2,
                        p: 0,
                        outline: 'none',
                        position: 'relative'
                    }}
                >
                    {/* Modal Header */}
                    <Box sx={{ 
                        p: 3, 
                        pb: 2,
                        borderBottom: '1px solid #E0E0E0',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                    }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                            <CampaignIcon sx={{ color: 'primary.main', fontSize: 24 }} />
                            <Typography variant="h6" sx={{ fontWeight: 600, color: 'text.primary' }}>
                                Send Announcement
                            </Typography>
                        </Box>
                        <IconButton 
                            onClick={handleModalClose}
                            sx={{ 
                                color: 'text.secondary',
                                '&:hover': { backgroundColor: 'grey.100' }
                            }}
                        >
                            <CloseIcon />
                        </IconButton>
                    </Box>

                    {/* Modal Body */}
                    <Box sx={{ p: 3 }}>
                        <form onSubmit={handleAnnouncementSubmit}>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                                <TextField
                                    label="Announcement Title"
                                    variant="outlined"
                                    fullWidth
                                    required
                                    value={announcementTitle}
                                    onChange={(e) => setAnnouncementTitle(e.target.value)}
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            backgroundColor: '#FAFAFA',
                                            '&:hover': {
                                                backgroundColor: '#F5F5F5',
                                            },
                                            '&.Mui-focused': {
                                                backgroundColor: '#FFFFFF',
                                            }
                                        }
                                    }}
                                />
                                
                                <TextField
                                    label="Message"
                                    variant="outlined"
                                    fullWidth
                                    required
                                    multiline
                                    rows={4}
                                    value={announcementMessage}
                                    onChange={(e) => setAnnouncementMessage(e.target.value)}
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            backgroundColor: '#FAFAFA',
                                            '&:hover': {
                                                backgroundColor: '#F5F5F5',
                                            },
                                            '&.Mui-focused': {
                                                backgroundColor: '#FFFFFF',
                                            }
                                        }
                                    }}
                                />
                            </Box>

                            {/* Modal Footer */}
                            <Box sx={{ 
                                display: 'flex', 
                                justifyContent: 'flex-end', 
                                gap: 2, 
                                mt: 4,
                                pt: 3,
                                borderTop: '1px solid #E0E0E0'
                            }}>
                                <Button
                                    variant="outlined"
                                    onClick={handleModalClose}
                                    sx={{ 
                                        minWidth: 100,
                                        color: 'text.secondary',
                                        borderColor: 'grey.300',
                                        '&:hover': {
                                            borderColor: 'grey.400',
                                            backgroundColor: 'grey.50'
                                        }
                                    }}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    variant="contained"
                                    color="primary"
                                    sx={{ 
                                        minWidth: 120,
                                        fontWeight: 600
                                    }}
                                >
                                    Send
                                </Button>
                            </Box>
                        </form>
                    </Box>
                </Paper>
            </Modal>

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