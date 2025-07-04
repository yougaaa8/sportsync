import { 
    TableContainer,
    Table,
    TableHead,
    TableBody,
    TableRow,
    TableCell,
    Paper
} from "@mui/material"

export default function CCATrainingTable(props) {
    return (
        <>
            <TableContainer
    sx={{
        maxHeight: "500px", // adjust as needed for your layout
        borderRadius: 3,
        boxShadow: "0 4px 16px 0 rgba(245,158,11,0.07)",
        overflowY: "auto",
        overflowX: "auto",
        background: "#fff",
        scrollbarWidth: "thin",
        "&::-webkit-scrollbar": {
            width: "8px",
            background: "transparent"
        },
        "&:hover::-webkit-scrollbar-thumb": {
            background: "#f5b041"
        }
    }}
    component={Paper}
>
    <Table stickyHeader>
        <TableHead sx={{
            "& .MuiTableCell-head": {
                backgroundColor: '#f59e0b',
                color: 'white',
                fontWeight: 'bold',
                fontSize: '1rem',
                textAlign: "center",
                border: 0
            }
        }}>
            <TableRow>
                <TableCell align="center">ID</TableCell>
                <TableCell align="center">Date</TableCell>
                <TableCell align="center">Start Time</TableCell>
                <TableCell align="center">End Time</TableCell>
                <TableCell align="center">Location</TableCell>
                <TableCell align="center">Notes</TableCell>
                <TableCell align="center">Actions</TableCell>
            </TableRow>
        </TableHead>
        <TableBody>
            {props.trainingList}
        </TableBody>
    </Table>
</TableContainer>
        </>
    )
}