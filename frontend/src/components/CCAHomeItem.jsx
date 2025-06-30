import "../stylesheets/cca-info.css"
import { Link } from "react-router-dom"
import { Paper, Typography, Box } from "@mui/material"

function truncateText(text, maxWords = 50) {
    if (!text) return "";
    const words = text.split(" ");
    if (words.length <= maxWords) return text;
    return words.slice(0, maxWords).join(" ") + "…";
}

export default function CCAItem(props) {
    return (
        <Paper
            elevation={2}
            sx={{
                p: 3,
                borderRadius: 3,
                boxShadow: "0 2px 12px 0 rgba(245, 158, 11, 0.06)",
                border: "1px solid #ffe5b4",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                minHeight: 350,
                bgcolor: "#fff",
                transition: "box-shadow 0.2s",
                "&:hover": {
                    boxShadow: "0 6px 24px 0 rgba(245, 158, 11, 0.13)",
                },
            }}
        >
            <Link to={`/cca-detail/${props.ccainfo.id}`} style={{ textDecoration: "none", width: "100%" }}>
                <Box
                    sx={{
                        width: 180,
                        height: 180,
                        mx: "auto",
                        mb: 2,
                        borderRadius: 2,
                        background: "#f9fafb",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        overflow: "hidden",
                        border: "1px solid #eee",
                    }}
                >
                    <img
                        className="cca-info-picture"
                        src={props.ccainfo.logo}
                        alt={props.ccainfo.name}
                        style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "contain",
                            borderRadius: "inherit",
                        }}
                        onError={e => { e.target.style.display = "none"; }}
                    />
                </Box>
                <Typography
                    variant="h6"
                    sx={{
                        fontWeight: 700,
                        color: "#f59e0b",
                        textAlign: "center",
                        mb: 1,
                        letterSpacing: 0.2,
                    }}
                    className="cca-info-cca-name"
                >
                    {props.ccainfo.name}
                </Typography>
                <Typography
                    sx={{
                        color: "#444",
                        textAlign: "center",
                        fontSize: 15,
                        lineHeight: 1.6,
                        minHeight: 60,
                    }}
                    className="cca-info-explanation"
                >
                    {truncateText(props.ccainfo.description, 50)}
                </Typography>
            </Link>
        </Paper>
    )
}