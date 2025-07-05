import { Paper, Typography, Box, Divider } from "@mui/material";
import JoinLobbyButton from "./JoinLobbyButton";
import { Link } from "react-router-dom";
import LeaveLobbyButton from "./LeaveLobbyButton";

export default function MatchItem(props) {
    return (
        <Paper
            elevation={4}
            sx={{
                m: 2,
                p: 0,
                maxWidth: 340,
                minHeight: 420,
                bgcolor: "#fff7e6",
                borderRadius: 3,
                boxShadow: "0 4px 16px 0 rgba(245, 158, 11, 0.10)",
                border: "1px solid #ffe5b4",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                transition: "box-shadow 0.2s",
                "&:hover": {
                    boxShadow: "0 8px 24px 0 rgba(245, 158, 11, 0.18)",
                }
            }}
        >
            <Link to={`/match-detail/${props.entry.id}`} style={{ textDecoration: "none", color: "inherit" }}>
                <Box sx={{ p: 2 }}>
                    <Typography variant="h1" sx={{ color: "#F59E0B", fontSize: 22, fontWeight: 700, textAlign: "center", mb: 1 }}>
                        {props.entry.name}
                    </Typography>
                    <Divider sx={{ mb: 1 }} />
                    <Typography variant="h2" sx={{ color: "#888", fontSize: 16, fontWeight: 500, mb: 0.5 }}>
                        <b>Sport: </b> {props.entry.sport}
                    </Typography>
                    <Typography sx={{ color: "#444", fontSize: 15, mb: 0.5 }}>
                        <b>Date:</b> {props.entry.date}
                    </Typography>
                    <Typography sx={{ color: "#444", fontSize: 15, mb: 0.5 }}>
                        <b>Location:</b> {props.entry.location}
                    </Typography>
                    <Typography sx={{ color: "#444", fontSize: 15, mb: 0.5 }}>
                        <b>Start:</b> {props.entry.start_time}
                    </Typography>
                    <Typography sx={{ color: "#444", fontSize: 15, mb: 0.5 }}>
                        <b>End:</b> {props.entry.end_time}
                    </Typography>
                    <Typography sx={{ color: "#444", fontSize: 15, mb: 0.5 }}>
                        <b>Maximum Capacity:</b> {props.entry.max_capacity}
                    </Typography>
                    <Paper
                        sx={{
                            my: 2,
                            p: 2,
                            bgcolor: "#fffdfa",
                            borderRadius: 2,
                            border: "1px solid #ffe5b4",
                            boxShadow: "none",
                            fontSize: 15,
                            color: "#555"
                        }}
                        elevation={0}
                    >
                        <Typography sx={{ fontSize: 15 }}>{props.entry.description}</Typography>
                    </Paper>
                </Box>
            </Link>
            <Box sx={{ px: 2, pb: 2 }}>
                <JoinLobbyButton id={props.entry.id} isDetailedView={false}/>
            </Box>
            <Box sx={{ px: 2, pb: 2 }}>
                <LeaveLobbyButton id={props.entry.id} />
            </Box>
        </Paper>
    );
}