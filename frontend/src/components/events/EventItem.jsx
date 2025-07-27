import { Paper, Typography, Box, Chip } from "@mui/material";
import Link from "next/link";
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import { format } from 'date-fns';

export default function EventItem({ event }) {
    // Format the date for better display
    const formatDate = (dateString) => {
        try {
            const date = new Date(dateString);
            return format(date, 'MMM dd, yyyy • h:mm a');
        } catch (error) {
            return dateString;
        }
    };

    // Get event category for styling
    const getEventCategory = (eventName) => {
        const name = eventName.toLowerCase();
        if (name.includes('basketball')) return 'Basketball';
        if (name.includes('run') || name.includes('charity')) return 'Running';
        if (name.includes('code') || name.includes('hack')) return 'Tech';
        if (name.includes('archery')) return 'Archery';
        return 'Sports';
    };

    // Get category color
    const getCategoryColor = (category) => {
        const colors = {
            'Basketball': { bg: '#fef3c7', text: '#92400e' },
            'Running': { bg: '#dbeafe', text: '#1e40af' },
            'Tech': { bg: '#f3e8ff', text: '#7c3aed' },
            'Archery': { bg: '#d1fae5', text: '#047857' },
            'Sports': { bg: '#fee2e2', text: '#dc2626' }
        };
        return colors[category] || colors['Sports'];
    };

    const category = getEventCategory(event.name);
    const categoryColors = getCategoryColor(category);
    
    return (
        <Link href={`/events/${event.id}`} style={{ textDecoration: 'none' }}>
            <Paper
                elevation={0}
                className="group"
                sx={{
                    background: '#ffffff',
                    border: '1px solid #e5e7eb',
                    borderRadius: 3,
                    overflow: 'hidden',
                    cursor: 'pointer',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    position: 'relative',
                    '&:hover': {
                        borderColor: '#ea580c',
                        boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 4px 10px -2px rgba(0, 0, 0, 0.05)',
                        transform: 'translateY(-4px)',
                        '& .event-category': {
                            transform: 'scale(1.05)'
                        },
                        '& .event-title': {
                            color: '#ea580c'
                        }
                    }
                }}
            >
                {/* Category stripe */}
                <Box sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: 4,
                    bgcolor: '#ea580c',
                    transform: 'scaleX(0)',
                    transformOrigin: 'left',
                    transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    '.group:hover &': {
                        transform: 'scaleX(1)'
                    }
                }} />

                <Box sx={{ p: 4, flex: 1, display: 'flex', flexDirection: 'column' }}>
                    {/* Header with title and category */}
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 3 }}>
                        <Typography 
                            variant="h6" 
                            className="event-title"
                            sx={{ 
                                color: '#111827',
                                fontWeight: 700,
                                fontSize: '1.25rem',
                                lineHeight: 1.3,
                                flex: 1,
                                mr: 2,
                                transition: 'color 0.3s ease',
                                display: '-webkit-box',
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: 'vertical',
                                overflow: 'hidden',
                            }}
                        >
                            {event.name}
                        </Typography>

                        <Chip
                            label={category}
                            className="event-category"
                            size="small"
                            sx={{
                                bgcolor: categoryColors.bg,
                                color: categoryColors.text,
                                fontWeight: 600,
                                fontSize: '0.75rem',
                                height: 28,
                                borderRadius: 2,
                                border: 'none',
                                transition: 'transform 0.3s ease',
                                '& .MuiChip-label': {
                                    px: 1.5
                                }
                            }}
                        />
                    </Box>

                    {/* Event details */}
                    <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                        {/* Location */}
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Box sx={{
                                width: 40,
                                height: 40,
                                borderRadius: 2,
                                bgcolor: '#f3f4f6',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                mr: 2.5
                            }}>
                                <LocationOnIcon 
                                    sx={{ 
                                        fontSize: 20, 
                                        color: '#6b7280'
                                    }} 
                                />
                            </Box>
                            <Box sx={{ flex: 1, minWidth: 0 }}>
                                <Typography 
                                    variant="body2" 
                                    sx={{
                                        color: '#4b5563',
                                        fontSize: '0.875rem',
                                        fontWeight: 500,
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        whiteSpace: 'nowrap'
                                    }}
                                >
                                    {event.location || 'Location TBD'}
                                </Typography>
                            </Box>
                        </Box>

                        {/* Date */}
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Box sx={{
                                width: 40,
                                height: 40,
                                borderRadius: 2,
                                bgcolor: '#f3f4f6',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                mr: 2.5
                            }}>
                                <CalendarTodayIcon 
                                    sx={{ 
                                        fontSize: 18, 
                                        color: '#6b7280'
                                    }} 
                                />
                            </Box>
                            <Box sx={{ flex: 1, minWidth: 0 }}>
                                <Typography 
                                    variant="body2" 
                                    sx={{
                                        color: '#4b5563',
                                        fontSize: '0.875rem',
                                        fontWeight: 500
                                    }}
                                >
                                    {formatDate(event.date)}
                                </Typography>
                            </Box>
                        </Box>
                    </Box>
                </Box>
            </Paper>
        </Link>
    );
}