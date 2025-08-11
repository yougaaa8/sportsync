import { 
    Table, 
    TableBody, 
    TableCell, 
    TableContainer, 
    TableHead, 
    TableRow, 
    Paper,
    Chip,
    Typography
} from '@mui/material';

export default function EventParticipantTable({ participants }) {
    // Function to get status chip color and styling
    const getStatusChip = (status) => {
        const statusLower = status?.toLowerCase();
        
        if (statusLower === 'confirmed' || statusLower === 'registered') {
            return (
                <Chip 
                    label={status} 
                    size="small"
                    sx={{
                        backgroundColor: '#E8F5E8',
                        color: '#2E7D32',
                        fontWeight: 600,
                        fontSize: '0.75rem',
                        height: 24
                    }}
                />
            );
        } else if (statusLower === 'pending') {
            return (
                <Chip 
                    label={status} 
                    size="small"
                    sx={{
                        backgroundColor: '#FFF3E0',
                        color: '#EF6C00',
                        fontWeight: 600,
                        fontSize: '0.75rem',
                        height: 24
                    }}
                />
            );
        } else if (statusLower === 'cancelled') {
            return (
                <Chip 
                    label={status} 
                    size="small"
                    sx={{
                        backgroundColor: '#FFEBEE',
                        color: '#C62828',
                        fontWeight: 600,
                        fontSize: '0.75rem',
                        height: 24
                    }}
                />
            );
        } else {
            return (
                <Chip 
                    label={status} 
                    size="small"
                    sx={{
                        backgroundColor: '#F5F5F5',
                        color: '#616161',
                        fontWeight: 600,
                        fontSize: '0.75rem',
                        height: 24
                    }}
                />
            );
        }
    };

    // Format registration time
    const formatRegistrationTime = (timestamp) => {
        if (!timestamp) return 'N/A';
        try {
            const date = new Date(timestamp);
            return date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        } catch (error) {
            return timestamp;
        }
    };

    return (
        <><Typography 
            variant="h4" 
            sx={{
                fontWeight: 600,
                color: '#212121',
                mb: 3,
                mt: 4,
                ml: 40,
                fontSize: '1.5rem'
            }}
        >
            Event Participants
        </Typography><TableContainer
            component={Paper}
            sx={{
                borderRadius: 3,
                boxShadow: '0 2px 12px rgba(0, 0, 0, 0.08)',
                border: '1px solid #F0F0F0',
                overflow: 'hidden',
                mt: 3
            }}
        >
                <Table sx={{ minWidth: 650 }}>
                    <TableHead>
                        <TableRow
                            sx={{
                                backgroundColor: '#FAFAFA',
                                '& th': {
                                    borderBottom: '2px solid #E0E0E0'
                                }
                            }}
                        >
                            <TableCell
                                sx={{
                                    fontWeight: 600,
                                    fontSize: '0.875rem',
                                    color: '#424242',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.5px',
                                    py: 2
                                }}
                            >
                                Participant ID
                            </TableCell>
                            <TableCell
                                sx={{
                                    fontWeight: 600,
                                    fontSize: '0.875rem',
                                    color: '#424242',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.5px',
                                    py: 2
                                }}
                            >
                                User ID
                            </TableCell>
                            <TableCell
                                sx={{
                                    fontWeight: 600,
                                    fontSize: '0.875rem',
                                    color: '#424242',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.5px',
                                    py: 2
                                }}
                            >
                                Registration Time
                            </TableCell>
                            <TableCell
                                sx={{
                                    fontWeight: 600,
                                    fontSize: '0.875rem',
                                    color: '#424242',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.5px',
                                    py: 2
                                }}
                            >
                                Status
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {participants?.map((participant, index) => (
                            <TableRow
                                key={participant.id || index}
                                sx={{
                                    '&:hover': {
                                        backgroundColor: '#FAFAFA',
                                        transition: 'background-color 0.2s ease'
                                    },
                                    '&:last-child td': {
                                        borderBottom: 0
                                    },
                                    '& td': {
                                        borderBottom: '1px solid #F0F0F0'
                                    }
                                }}
                            >
                                <TableCell
                                    sx={{
                                        fontSize: '0.875rem',
                                        color: '#212121',
                                        fontWeight: 500,
                                        py: 2
                                    }}
                                >
                                    {index + 1}
                                </TableCell>
                                <TableCell
                                    sx={{
                                        fontSize: '0.875rem',
                                        color: '#212121',
                                        fontWeight: 500,
                                        py: 2
                                    }}
                                >
                                    {participant.id}
                                </TableCell>
                                <TableCell
                                    sx={{
                                        fontSize: '0.875rem',
                                        color: '#757575',
                                        py: 2
                                    }}
                                >
                                    {formatRegistrationTime(participant.registered_at)}
                                </TableCell>
                                <TableCell sx={{ py: 2 }}>
                                    {getStatusChip(participant.status)}
                                </TableCell>
                            </TableRow>
                        ))}
                        {(!participants || participants.length === 0) && (
                            <TableRow>
                                <TableCell
                                    colSpan={4}
                                    sx={{
                                        textAlign: 'center',
                                        py: 4,
                                        color: '#9E9E9E',
                                        fontStyle: 'italic'
                                    }}
                                >
                                    <Typography variant="body2">
                                        No participants registered yet
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer></>
    );
}