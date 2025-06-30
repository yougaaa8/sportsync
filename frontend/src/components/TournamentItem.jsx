import { Typography, Paper, Box, Chip, Divider } from "@mui/material";
import { Link } from "react-router-dom";

export default function TournamentItem(props) {
    console.log("These are the props for the tournament item: ", props);
    return (
        <Link to={`/tournament-sports/${props.id}`}>
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
                {props.logo && (
                    <Box sx={{ mb: 2 }}>
                        <img
                            src={props.logo}
                            alt={`${props.name} logo`}
                            style={{
                                width: 70,
                                height: 70,
                                objectFit: "contain",
                                borderRadius: "12px",
                                background: "#fff",
                                boxShadow: "0 2px 8px rgba(245,158,11,0.07)"
                            }}
                            onError={e => { e.target.style.display = "none"; }}
                        />
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
                    {props.name}
                </Typography>
                <Chip
                    label={props.status}
                    color={props.status === "upcoming" ? "warning" : "default"}
                    sx={{
                        mb: 1,
                        fontWeight: 500,
                        fontSize: 14,
                        letterSpacing: 0.5,
                        bgcolor: "#fff7e6",
                        color: "#d97706"
                    }}
                    size="small"
                />
                <Divider sx={{ width: "100%", my: 1 }} />
                <Box sx={{ display: "flex", gap: 2, mb: 1 }}>
                    <Typography sx={{ fontSize: 15, color: "#444" }}>
                        <b>Start:</b> {props.startDate}
                    </Typography>
                    <Typography sx={{ fontSize: 15, color: "#444" }}>
                        <b>End:</b> {props.endDate}
                    </Typography>
                </Box>
                <Typography sx={{ color: "#666", textAlign: "center", lineHeight: 1.6 }}>
                    {props.description}
                </Typography>
            </Paper>
        </Link>
    )
}