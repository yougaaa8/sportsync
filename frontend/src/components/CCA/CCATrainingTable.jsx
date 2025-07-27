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
        <TableContainer
            component={Paper}
            sx={{
                maxHeight: "600px",
                borderRadius: 3,
                boxShadow: "0 2px 12px rgba(0, 0, 0, 0.08)",
                border: "1px solid #F0F0F0",
                overflowY: "hidden",
                overflowX: "auto",
                transition: "all 0.3s ease-in-out",
                "&:hover": {
                    overflowY: "auto",
                    boxShadow: "0 8px 25px rgba(0, 0, 0, 0.12)"
                },
                // Custom scrollbar styling
                "& *::-webkit-scrollbar": {
                    width: "8px",
                    height: "8px"
                },
                "& *::-webkit-scrollbar-track": {
                    background: "transparent"
                },
                "& *::-webkit-scrollbar-thumb": {
                    background: "#E0E0E0",
                    borderRadius: "4px",
                    "&:hover": {
                        background: "#BDBDBD"
                    }
                },
                scrollbarWidth: "thin",
                scrollbarColor: "#E0E0E0 transparent"
            }}
        >
            <Table stickyHeader>
                <TableHead>
                    <TableRow>
                        {["ID", "Date", "Start Time", "End Time", "Location", "Notes", "Actions"].map((header) => (
                            <TableCell 
                                key={header}
                                align="center"
                                sx={{
                                    backgroundColor: "#FF6B35",
                                    color: "#FFFFFF",
                                    fontWeight: 700,
                                    fontSize: "0.875rem",
                                    textTransform: "uppercase",
                                    letterSpacing: "0.5px",
                                    py: 2,
                                    borderBottom: "none",
                                    position: "sticky",
                                    top: 0,
                                    zIndex: 10
                                }}
                            >
                                {header}
                            </TableCell>
                        ))}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {props.trainingList}
                </TableBody>
            </Table>
        </TableContainer>
    )
}