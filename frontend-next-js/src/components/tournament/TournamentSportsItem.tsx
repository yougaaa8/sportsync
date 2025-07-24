import { Typography, Paper, Chip } from "@mui/material";
import { TournamentSport } from "../../types/TournamentTypes"

export default function TournamentSportsItem(props: TournamentSport) {
    return (
        <Paper
            elevation={2}
            sx={{
                my: 2,
                px: { xs: 2, md: 4 },
                py: 2,
                maxWidth: 700,
                mx: "auto",
                borderRadius: 3,
                boxShadow: "0 2px 12px 0 rgba(245, 158, 11, 0.06)",
                border: "1px solid #ffe5b4",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                bgcolor: "#fff",
            }}
        >
            <Typography
                variant="h6"
                sx={{
                    fontWeight: 700,
                    color: "#f59e0b",
                    mb: 1,
                    textAlign: "center",
                    letterSpacing: 0.2
                }}
            >
                {props.sport} Tournament
            </Typography>
            <Chip
                label={props.gender}
                color={props.gender === "male" ? "primary" : "secondary"}
                sx={{
                    mb: 1,
                    fontWeight: 500,
                    fontSize: 13,
                    bgcolor: props.gender === "male" ? "#e0f2fe" : "#fce7f3",
                    color: props.gender === "male" ? "#0284c7" : "#be185d"
                }}
                size="small"
            />
            <Typography
                sx={{
                    color: "#444",
                    textAlign: "center",
                    fontSize: 15,
                    lineHeight: 1.6,
                    mt: 1
                }}
            >
                {props.description}
            </Typography>
        </Paper>
    );
}