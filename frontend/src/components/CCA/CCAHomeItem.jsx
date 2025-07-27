import { Paper, Typography, Box } from "@mui/material";
import Link from "next/link";

function truncateText(text, maxWords = 50) {
    if (!text) return "";
    const words = text.split(" ");
    if (words.length <= maxWords) return text;
    return words.slice(0, maxWords).join(" ") + "…";
}

export default function CCAItem(props) {
    return (
        <Paper
            elevation={0}
            sx={{
                p: 3,
                borderRadius: 3,
                border: '1px solid #F0F0F0',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                minHeight: 380,
                bgcolor: '#FFFFFF',
                transition: 'all 0.3s ease-in-out',
                cursor: 'pointer',
                '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: '0 12px 40px rgba(255, 107, 53, 0.15)',
                    border: '1px solid #FFE5B4',
                },
            }}
        >
            <Link 
                href={`/cca/${props.ccainfo.id}`} 
                style={{ 
                    textDecoration: 'none', 
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center'
                }}
            >
                {/* Image Container */}
                <Box
                    sx={{
                        width: 160,
                        height: 160,
                        mb: 3,
                        borderRadius: 3,
                        background: 'linear-gradient(135deg, #FAFAFA 0%, #F5F5F5 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        overflow: 'hidden',
                        border: '1px solid #EEEEEE',
                        position: 'relative',
                        '&::after': {
                            content: '""',
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            background: 'linear-gradient(135deg, rgba(255,107,53,0.05) 0%, rgba(255,107,53,0.02) 100%)',
                            opacity: 0,
                            transition: 'opacity 0.3s ease',
                        },
                        '&:hover::after': {
                            opacity: 1,
                        }
                    }}
                >
                    <img
                        src={props.ccainfo.logo_url}
                        alt={props.ccainfo.name}
                        style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'contain',
                            borderRadius: 'inherit',
                            transition: 'transform 0.3s ease',
                        }}
                        onError={e => { e.target.style.display = 'none'; }}
                    />
                </Box>

                {/* CCA Name */}
                <Typography
                    variant="h6"
                    sx={{
                        fontWeight: 700,
                        color: '#FF6B35',
                        textAlign: 'center',
                        mb: 2,
                        letterSpacing: 0.3,
                        fontSize: '1.1rem',
                        lineHeight: 1.3,
                        transition: 'color 0.3s ease',
                    }}
                >
                    {props.ccainfo.name}
                </Typography>

                {/* Description */}
                <Typography
                    sx={{
                        color: '#757575',
                        textAlign: 'center',
                        fontSize: '0.875rem',
                        lineHeight: 1.6,
                        flex: 1,
                        display: 'flex',
                        alignItems: 'flex-start',
                        fontWeight: 400,
                    }}
                >
                    {truncateText(props.ccainfo.description, 50)}
                </Typography>
            </Link>
        </Paper>
    );
}