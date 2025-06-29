import { 
    TableContainer,
    Table,
    TableHead,
    TableBody,
    TableRow,
    TableCell,
    Paper
} from "@mui/material"

export default function CCAMembersTable(props) {
    return (
        <>
            <TableContainer 
                sx={{ 
                    maxHeight: "300px",
                    borderRadius: 3,
                    boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
                    overflow: "hidden"
                }}
                component={Paper}>
                <Table stickyHeader>
                    <TableHead sx={{ "& .MuiTableCell-head": {
                        backgroundColor: '#f59e0b',
                        color: 'white',
                        fontWeight: 'bold',
                        fontSize: '0.95rem'
                    } }}>
                        <TableRow>
                            <TableCell align="center">ID</TableCell>
                            <TableCell align="center">First Name</TableCell>
                            <TableCell align="center">Last Name</TableCell>
                            <TableCell align="center">Position</TableCell>
                            <TableCell align="center">Role</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody >
                        {props.membersList}
                    </TableBody>
                </Table>
            </TableContainer>
        </>
    )
}