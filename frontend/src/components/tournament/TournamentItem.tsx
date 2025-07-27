import { Typography, Paper, Box, Chip, Divider, Button, TextField, MenuItem } from "@mui/material";
import Link from "next/link";
import { Tournament } from "../../types/TournamentTypes"
import { useState } from "react"
import editTournament from "../../api-calls/tournament/editTournament"
import deleteTournament from "../../api-calls/tournament/deleteTournament"

export default function TournamentItem(props: {
    entry: Tournament
}) {
    // Set states
    const [isShowForm, setIsShowForm] = useState(false)

    // Define functions
    function manageTournamentClick(formData: FormData) {
        editTournament(props.entry.id, formData)
    }

    function deleteTournamentClick() {
        deleteTournament(props.entry.id)
    }

    console.log("These are the props for the tournament item: ", props);
    console.log("This is the tournament start date: ", props.entry.start_date)

    return (
        <>
        {!isShowForm && <Link href={`/tournament/${props.entry.id}`}>
            <Paper
                elevation={3}
                sx={{
                    my: 3,
                    px: { xs: 2, md: 4 },
                    py: 3,
                    maxWidth: 700,
                    mx: "auto",
                    borderRadius: 4,
                    boxShadow: "0 4px 24px 0 rgba(245, 158, 11, 0.08)",
                    border: "1px solid #ffe5b4",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    bgcolor: "#fffdfa",
                }}
            >
                {props.entry.logo && (
                    <Box sx={{ mb: 2 }}>
                        {/* <Image
                width={200}
                height={200}
                src={props.entry.logo}
                alt={`${props.entry.name} logo`}
                style={{
                    width: 70,
                    height: 70,
                    objectFit: "contain",
                    borderRadius: "12px",
                    background: "#fff",
                    boxShadow: "0 2px 8px rgba(245,158,11,0.07)"
                }}
                onError={e => { (e.target as HTMLImageElement).style.display = "none"; }}
            /> */}
                    </Box>
                )}
                <Typography
                    variant="h5"
                    sx={{
                        fontWeight: 700,
                        color: "#f59e0b",
                        mb: 1,
                        textAlign: "center",
                        letterSpacing: 0.2
                    }}
                >
                    {props.entry.name}
                </Typography>
                <Chip
                    label={props.entry.status}
                    color={props.entry.status === "upcoming" ? "warning" : "default"}
                    sx={{
                        mb: 1,
                        fontWeight: 500,
                        fontSize: 14,
                        letterSpacing: 0.5,
                        bgcolor: "#fff7e6",
                        color: "#d97706"
                    }}
                    size="small" />
                <Divider sx={{ width: "100%", my: 1 }} />
                <Box sx={{ display: "flex", gap: 2, mb: 1 }}>
                    <Typography sx={{ fontSize: 15, color: "#444" }}>
                        <b>Start:</b> {props.entry.start_date}
                    </Typography>
                    <Typography sx={{ fontSize: 15, color: "#444" }}>
                        <b>End:</b> {props.entry.end_date}
                    </Typography>
                </Box>
                <Typography sx={{ color: "#666", textAlign: "center", lineHeight: 1.6 }}>
                    {props.entry.description}
                </Typography>
            </Paper>
        </Link>}
        <Button onClick={() => setIsShowForm(prev => !prev)}>
                {isShowForm ? "Close Tournament Update Form" : "Manage Tournament Details"}
        </Button>
        {isShowForm && (
            <Box
                component="form"
                action={manageTournamentClick}
                sx={{
                    p: 4,
                    mb: 4,
                    borderRadius: 2,
                    boxShadow: 2,
                    backgroundColor: "#fff",
                    maxWidth: 400,
                    mx: "auto",
                    display: "flex",
                    flexDirection: "column",
                    gap: 2,
                }}
            >
                <Typography variant="h6" sx={{ mb: 2, color: "primary.main", fontWeight: 700 }}>
                    Update Tournament Details
                </Typography>

                <TextField
                    label="Name"
                    name="name"
                    variant="outlined"
                    fullWidth
                    defaultValue={props.entry.name}
                    required
                />

                <TextField
                    select
                    label="Status"
                    name="status"
                    variant="outlined"
                    fullWidth
                    defaultValue={props.entry.status}
                    required
                >
                    <MenuItem value="upcoming">Upcoming</MenuItem>
                    <MenuItem value="ongoing">Ongoing</MenuItem>
                    <MenuItem value="completed">Completed</MenuItem>
                </TextField>

                <TextField
                    label="Start Date"
                    name="start_date"
                    type="date"
                    variant="outlined"
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                    defaultValue={props.entry.start_date}
                    required
                />

                <TextField
                    label="End Date"
                    name="end_date"
                    type="date"
                    variant="outlined"
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                    defaultValue={props.entry.end_date}
                    required
                />

                <TextField
                    label="Description"
                    name="description"
                    variant="outlined"
                    fullWidth
                    multiline
                    rows={2}
                    defaultValue={props.entry.description}
                />

                <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    sx={{ mt: 2, fontWeight: 600 }}
                >
                    Update Tournament Details
                </Button>
            </Box>
        )}

        <Button onClick={deleteTournamentClick}>
            Delete Tournament
        </Button>


    </>
    )
}