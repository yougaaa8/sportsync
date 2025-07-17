import { Paper, Typography } from "@mui/material";
import { Link } from "react-router-dom";

export default function Event(props) {    
    return (
        <Link sx={{bgcolor: "#fffdfa"}} to={`/event-detail/${props.event.id}`}>
            <Paper
                elevation={3}
                sx={{
                    p: 3,
                    my: 2,
                    maxWidth: 600,
                    mx: "auto",
                    bgcolor: "#fffdfa",
                    borderRadius: 3,
                    boxShadow: "0 4px 16px 0 rgba(245, 158, 11, 0.08)",
                    border: "1px solid #ffe5b4",
                    textAlign: "center"
                }}
            >
                <Typography variant="h1" sx={{ color: "#F59E0B", mb: 1 }}>
                    {props.event.name}
                </Typography>
                <Typography variant="h2" sx={{ color: "#888", mb: 1 }}>
                    Location: {props.event.location}
                </Typography>
                <Typography variant="body1" sx={{ color: "#444" }}>
                    Date: {props.event.date}
                </Typography>
            </Paper>
        </Link>
    );
}