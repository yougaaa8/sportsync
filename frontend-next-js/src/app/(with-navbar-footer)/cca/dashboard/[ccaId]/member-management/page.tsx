"use client"

import CCAMembersTable from "../../../../../../components/CCA/CCAMembersTable.jsx"
import { useState, useEffect } from "react" 
import { useParams } from "next/navigation"
import "../../../../../../stylesheets/cca/cca-training-session-management.css"
import { 
    Typography, 
    TableRow, 
    TableCell, 
    Button, 
    Paper, 
    Box, 
    TextField, 
    MenuItem, 
    Container,
    Alert
} from "@mui/material"
import pullCCAMembersList from "../../../../../../api-calls/cca/pullCCAMembersList"
import pullCCADetail from "../../../../../../api-calls/cca/pullCCADetails"
import pullUserProfileFromEmail from "../../../../../../api-calls/profile/pullUserProfileFromEmail"
import addCcaMember from "../../../../../../api-calls/cca/addCCAMember"
import { CCADetail, Member } from "@/types/CCATypes.js"

export default function CCAMemberManagementLayout() {
    // Set state to store CCA members data
    const [ccaData, setCcaData] = useState<CCADetail | null>(null)
    const [ccaMembersData, setCcaMembersData] = useState<Member[]>([])
    const [showForm, setShowForm] = useState(false)
    const isRegistrationSuccessful = false
    let userId;

    // Get the CCA ID from the URL
    const params = useParams()
    const ccaId = params.ccaId // Extract ccaId from the dynamic route
    console.log("This is the extracted CCA ID: ", ccaId)
    
    // Get the CCA data from the API
    useEffect(() => {
        const fetchCcaData = async () => {
            setCcaData(await pullCCADetail(ccaId))
        }
        fetchCcaData()
    }, [ccaId])
    console.log("The CCA Data is: ", ccaData)

    // Get the CCA members data from the API
    useEffect(() => {
        const fetchCcaMembersData = async () => {
            try {
                const data = await pullCCAMembersList(ccaId);
                setCcaMembersData(data);
                console.log("CCA Members Data set to state:", data);
            } catch (err) {
                console.error("Error fetching CCA members:", err);
            }
        };
    
        if (ccaId) {
            fetchCcaMembersData();
        }
    }, [ccaId]);
    console.log("The CCA members data is: ", ccaMembersData)
    
    // Map the CCA members data, which is an array of member objects,
    // into an array of table rows 
    let membersList
    if (ccaMembersData) {
    membersList = ccaMembersData?.map((member, idx) => (
        <TableRow
            key={member.id}
            sx={{
                backgroundColor: idx % 2 === 0 ? "#fff" : "#fcf7ee",
                transition: "background 0.2s",
                "&:hover": {
                    backgroundColor: "#fff7e6"
                }
            }}
        >
            <TableCell
                align="center"
                sx={{ fontWeight: 500, color: "#f59e0b", border: 0, textAlign: "center" }}
            >
                {idx + 1}
            </TableCell>
            <TableCell align="center" sx={{ border: 0, textAlign: "center" }}>
                {member.first_name}
            </TableCell>
            <TableCell align="center" sx={{ border: 0, textAlign: "center" }}>
                {member.last_name}
            </TableCell>
            <TableCell
                align="center"
                sx={{
                    border: 0,
                    color: "#f59e0b",
                    fontWeight: 500,
                    textTransform: "capitalize",
                    textAlign: "center"
                }}
            >
                {member.position}
            </TableCell>
            <TableCell
                align="center"
                sx={{
                    border: 0,
                    color: "#f59e0b",
                    fontWeight: 500,
                    textAlign: "center"
                }}
            >
                {member.role}
            </TableCell>
        </TableRow>
    ))
}

    function showFormClick() {
        setShowForm(prevShowForm => !prevShowForm)
    }

    async function addNewMember(formData: FormData) {
        // Resolve the user id from the email
        console.log("The email of the user to be added is: ", formData.get("email"))
        const email = formData.get("email")
        const userProfile = await pullUserProfileFromEmail(email)
        userId = userProfile?.user_id
        console.log("The user id is: ", userId)
        
        // Create an object to represent the data
        const data = {
            'user': userId,
            'cca': ccaId,
            'position': formData.get("position"),
            'role': formData.get("role"),
            'is_active': formData.get("is_active"), 
            'emergency_contact': formData.get("emergency_contact"),
            'notes': formData.get("notes")
        }
        

        // POST to add a new member with the user id field
        addCcaMember(ccaId, data)
    }

    return (
        <Container maxWidth="xl" sx={{ py: 4 }}>
            {/* Page Header */}
            <Box sx={{ mb: 4 }}>
                <Typography 
                    variant="h3" 
                    component="h1" 
                    sx={{ 
                        fontWeight: 700, 
                        color: 'text.primary',
                        mb: 1
                    }}
                >
                    CCA Members Management
                </Typography>
                <Typography 
                    variant="body1" 
                    color="text.secondary"
                    sx={{ mb: 3 }}
                >
                    Manage and organize your CCA members efficiently
                </Typography>
                
                {/* Add Member Button */}
                <Button
                    variant="contained"
                    color="primary"
                    onClick={showFormClick}
                    sx={{
                        px: 3,
                        py: 1.5,
                        borderRadius: 2,
                        textTransform: 'none',
                        fontWeight: 600,
                        boxShadow: 2,
                        '&:hover': {
                            boxShadow: 3,
                            transform: 'translateY(-1px)'
                        }
                    }}
                >
                    {!showForm ? 'Add New CCA Member' : 'Close Form'}
                </Button>
            </Box>

            {/* Add Member Form */}
            {(showForm && ccaData) && (
                <Paper 
                    elevation={2} 
                    sx={{ 
                        p: 4, 
                        mb: 4, 
                        borderRadius: 3,
                        border: '1px solid',
                        borderColor: 'grey.200'
                    }}
                >
                    <Typography 
                        variant="h5" 
                        sx={{ 
                            mb: 3, 
                            fontWeight: 600,
                            color: 'text.primary'
                        }}
                    >
                        Add New Member
                    </Typography>
                    
                    <Box 
                        component="form" 
                        action={addNewMember}
                        sx={{ 
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 3
                        }}
                    >
                        {/* Form Grid Layout */}
                        <Box sx={{ 
                            display: 'flex', 
                            flexDirection: { xs: 'column', md: 'row' },
                            gap: 3
                        }}>
                            <TextField
                                name="email"
                                label="Email Address"
                                variant="outlined"
                                fullWidth
                                required
                                sx={{ flex: 1 }}
                            />
                            
                            <TextField
                                name="cca"
                                label="CCA"
                                value={ccaData.name}
                                variant="outlined"
                                fullWidth
                                disabled
                                sx={{ flex: 1 }}
                            />
                        </Box>

                        <Box sx={{ 
                            display: 'flex', 
                            flexDirection: { xs: 'column', md: 'row' },
                            gap: 3
                        }}>
                            <TextField
                                name="position"
                                label="Position"
                                select
                                variant="outlined"
                                fullWidth
                                required
                                defaultValue="member"
                                sx={{ flex: 1 }}
                            >
                                <MenuItem value="member">Member</MenuItem>
                                <MenuItem value="committee">Committee</MenuItem>
                            </TextField>
                            
                            <TextField
                                name="role"
                                label="Role"
                                variant="outlined"
                                fullWidth
                                sx={{ flex: 1 }}
                            />
                        </Box>

                        <Box sx={{ 
                            display: 'flex', 
                            flexDirection: { xs: 'column', md: 'row' },
                            gap: 3
                        }}>
                            <TextField
                                name="is_active"
                                label="Active Status"
                                select
                                variant="outlined"
                                fullWidth
                                required
                                defaultValue={true}
                                sx={{ flex: 1 }}
                            >
                                <MenuItem value="true">Yes</MenuItem>
                                <MenuItem value="false">No</MenuItem>
                            </TextField>
                            
                            <TextField
                                name="emergency_contact"
                                label="Emergency Contact"
                                variant="outlined"
                                fullWidth
                                sx={{ flex: 1 }}
                            />
                        </Box>

                        <TextField
                            name="notes"
                            label="Notes"
                            variant="outlined"
                            fullWidth
                            multiline
                            rows={3}
                        />

                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                            <Button
                                type="submit"
                                variant="contained"
                                color="primary"
                                size="large"
                                sx={{
                                    px: 4,
                                    py: 1.5,
                                    borderRadius: 2,
                                    textTransform: 'none',
                                    fontWeight: 600,
                                    boxShadow: 2,
                                    '&:hover': {
                                        boxShadow: 3,
                                        transform: 'translateY(-1px)'
                                    }
                                }}
                            >
                                Add Member
                            </Button>
                        </Box>
                    </Box>
                </Paper>
            )}

            {/* Success Alert */}
            {isRegistrationSuccessful && (
                <Alert 
                    severity="success" 
                    sx={{ 
                        mb: 4,
                        borderRadius: 2,
                        '& .MuiAlert-message': {
                            fontWeight: 500
                        }
                    }}
                >
                    Successfully registered new member!
                </Alert>
            )}

            {/* Members Table */}
            <Paper 
                elevation={1} 
                sx={{ 
                    borderRadius: 3,
                    border: '1px solid',
                    borderColor: 'grey.200',
                    overflow: 'hidden'
                }}
            >
                <CCAMembersTable membersList={membersList}/>
            </Paper>
        </Container>
    )
}