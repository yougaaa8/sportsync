import { useState, useRef, useEffect } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import SportSyncLogo from "../assets/sportsync-logo.png"
import logout from "../api-calls/logout";
import { 
    Box, 
    AppBar, 
    Toolbar, 
    Typography, 
    IconButton, 
    Menu, 
    MenuItem, 
    Avatar, 
    Divider,
    ListItemIcon,
    ListItemText,
    Fade,
    useTheme,
    useMediaQuery,
    Chip
} from "@mui/material";
import {
    MenuRounded,
    HomeRounded,
    GroupsRounded,
    PersonRounded,
    SportsRounded,
    EventRounded,
    EmojiEventsRounded,
    StoreRounded,
    BusinessRounded,
    DashboardRounded,
    LogoutRounded,
    FavoriteRounded,
    NotificationsRounded,
    SearchRounded
} from "@mui/icons-material";

export default function Navbar() {
    const navigate = useNavigate();
    const location = useLocation();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    
    const [anchorEl, setAnchorEl] = useState(null);
    const [notificationCount] = useState(3); // Example notification count
    const dropdownRef = useRef(null);
    const isMenuOpen = Boolean(anchorEl);

    // Get user email for profile display
    const userEmail = localStorage.getItem("email") || "user@example.com";
    const userInitials = userEmail.split('@')[0].substring(0, 2).toUpperCase();

    // Navigation items with icons
    const navItems = [
        { label: "Home", path: "/", icon: <HomeRounded /> },
        { label: "CCAs", path: "/cca-home", icon: <GroupsRounded /> },
        { label: "Profile", path: "/profile", icon: <PersonRounded /> },
        { label: "Matches", path: "/available-matches", icon: <SportsRounded /> },
        { label: "Events", path: "/event-list", icon: <EventRounded /> },
        { label: "Tournaments", path: "/tournament", icon: <EmojiEventsRounded /> },
        { label: "Merchandise", path: "/merchandise-shop", icon: <StoreRounded /> },
        { label: "Facilities", path: "/facility-list", icon: <BusinessRounded /> },
        { label: "CCA Dashboard", path: "/cca-dashboard/", icon: <DashboardRounded /> },
    ];

    // Check if current path matches nav item
    const isActive = (path) => location.pathname === path;

    const handleMenuClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleNavigation = (path) => {
        navigate(path);
        handleMenuClose();
    };

    async function handleLogout() {
        const refresh = localStorage.getItem("refreshToken");
        logout(refresh);
        handleMenuClose();
        navigate("/login");
    }

    return (
        <AppBar 
            position="sticky" 
            elevation={0}
            sx={{
                background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
                borderBottom: '1px solid rgba(0,0,0,0.08)',
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)',
            }}
        >
            <Toolbar 
                sx={{ 
                    minHeight: { xs: 64, sm: 72 },
                    px: { xs: 2, sm: 3, md: 4 },
                    justifyContent: 'space-between'
                }}
            >
                {/* Logo Section */}
                <Box 
                    sx={{ 
                        display: 'flex', 
                        alignItems: 'center',
                        cursor: 'pointer',
                        '&:hover': {
                            transform: 'scale(1.02)',
                            transition: 'transform 0.2s ease'
                        }
                    }}
                    onClick={() => navigate('/')}
                >
                    <Box
                        sx={{
                            position: 'relative',
                            width: { xs: 40, sm: 48 },
                            height: { xs: 40, sm: 48 },
                            mr: 2,
                            borderRadius: '50%',
                            background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
                            boxShadow: '0 4px 20px rgba(0,0,0,0.15), inset 0 2px 4px rgba(255,255,255,0.8)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            border: '2px solid rgba(244, 162, 97, 0.2)',
                            '&::before': {
                                content: '""',
                                position: 'absolute',
                                top: -2,
                                left: -2,
                                right: -2,
                                bottom: -2,
                                borderRadius: '50%',
                                background: 'linear-gradient(45deg, #f4a261, #e76f51)',
                                zIndex: -1,
                            }
                        }}
                    >
                        <img 
                            src={SportSyncLogo} 
                            alt="SportSync" 
                            style={{ 
                                width: '65%', 
                                height: '65%',
                                objectFit: 'contain',
                                filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.1))'
                            }} 
                        />
                    </Box>
                    <Typography
                        variant="h5"
                        component="div"
                        sx={{
                            fontWeight: 700,
                            background: 'linear-gradient(45deg, #f4a261, #e76f51)',
                            backgroundClip: 'text',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            fontSize: { xs: '1.3rem', sm: '1.5rem' },
                            letterSpacing: '-0.5px'
                        }}
                    >
                        SportSync
                    </Typography>
                </Box>

                {/* Right Side Actions */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {/* Quick Actions (Desktop) */}
                    {!isMobile && (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mr: 2 }}>
                            <IconButton 
                                size="medium"
                                sx={{ 
                                    color: '#6c757d',
                                    '&:hover': { 
                                        backgroundColor: 'rgba(244, 162, 97, 0.1)',
                                        color: '#f4a261' 
                                    }
                                }}
                            >
                                <SearchRounded />
                            </IconButton>
                            
                            <IconButton 
                                size="medium"
                                onClick={() => navigate('/wishlist')}
                                sx={{ 
                                    color: '#6c757d',
                                    '&:hover': { 
                                        backgroundColor: 'rgba(244, 162, 97, 0.1)',
                                        color: '#f4a261' 
                                    }
                                }}
                            >
                                <FavoriteRounded />
                            </IconButton>
                            
                            <IconButton 
                                size="medium"
                                sx={{ 
                                    color: '#6c757d',
                                    position: 'relative',
                                    '&:hover': { 
                                        backgroundColor: 'rgba(244, 162, 97, 0.1)',
                                        color: '#f4a261' 
                                    }
                                }}
                            >
                                <NotificationsRounded />
                                {notificationCount > 0 && (
                                    <Chip
                                        label={notificationCount}
                                        size="small"
                                        sx={{
                                            position: 'absolute',
                                            top: -2,
                                            right: -2,
                                            minWidth: 20,
                                            height: 20,
                                            fontSize: '0.75rem',
                                            backgroundColor: '#e76f51',
                                            color: 'white',
                                            '& .MuiChip-label': { px: 0.5 }
                                        }}
                                    />
                                )}
                            </IconButton>
                        </Box>
                    )}

                    {/* User Avatar & Menu */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {!isMobile && (
                            <Box sx={{ textAlign: 'right', mr: 1 }}>
                                <Typography variant="body2" sx={{ color: '#495057', fontWeight: 500 }}>
                                    {userEmail.split('@')[0]}
                                </Typography>
                                <Typography variant="caption" sx={{ color: '#6c757d' }}>
                                    Student
                                </Typography>
                            </Box>
                        )}
                        
                        <IconButton
                            ref={dropdownRef}
                            onClick={handleMenuClick}
                            sx={{
                                p: 0,
                                '&:hover': {
                                    transform: 'scale(1.05)',
                                    transition: 'transform 0.2s ease'
                                }
                            }}
                        >
                            <Avatar
                                sx={{
                                    width: { xs: 36, sm: 40 },
                                    height: { xs: 36, sm: 40 },
                                    background: 'linear-gradient(45deg, #6fa8dc, #4a90e2)',
                                    color: 'white',
                                    fontWeight: 600,
                                    fontSize: '0.9rem',
                                    boxShadow: '0 2px 8px rgba(111, 168, 220, 0.3)'
                                }}
                            >
                                {userInitials}
                            </Avatar>
                        </IconButton>
                    </Box>
                </Box>

                {/* Enhanced Dropdown Menu */}
                <Menu
                    anchorEl={anchorEl}
                    open={isMenuOpen}
                    onClose={handleMenuClose}
                    TransitionComponent={Fade}
                    PaperProps={{
                        elevation: 12,
                        sx: {
                            mt: 1,
                            minWidth: 280,
                            borderRadius: 3,
                            border: '1px solid rgba(0,0,0,0.05)',
                            boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
                            '& .MuiMenuItem-root': {
                                px: 2,
                                py: 1.5,
                                borderRadius: 2,
                                mx: 1,
                                my: 0.5,
                                transition: 'all 0.2s ease',
                                '&:hover': {
                                    backgroundColor: 'rgba(244, 162, 97, 0.08)',
                                    transform: 'translateX(4px)',
                                    '& .MuiListItemIcon-root': {
                                        color: '#f4a261'
                                    }
                                }
                            }
                        }
                    }}
                    transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                    anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                >
                    {/* User Info Header */}
                    <Box sx={{ px: 2, py: 1.5, borderBottom: '1px solid rgba(0,0,0,0.08)' }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#2c3e50' }}>
                            {userEmail.split('@')[0]}
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#6c757d' }}>
                            {userEmail}
                        </Typography>
                    </Box>

                    {/* Navigation Items */}
                    {navItems.map((item, index) => (
                        <MenuItem
                            key={index}
                            onClick={() => handleNavigation(item.path)}
                            sx={{
                                backgroundColor: isActive(item.path) ? 'rgba(244, 162, 97, 0.1)' : 'transparent',
                                '& .MuiListItemIcon-root': {
                                    color: isActive(item.path) ? '#f4a261' : '#6c757d'
                                }
                            }}
                        >
                            <ListItemIcon sx={{ minWidth: 40 }}>
                                {item.icon}
                            </ListItemIcon>
                            <ListItemText 
                                primary={item.label}
                                sx={{
                                    '& .MuiTypography-root': {
                                        fontWeight: isActive(item.path) ? 600 : 400,
                                        color: isActive(item.path) ? '#f4a261' : '#2c3e50'
                                    }
                                }}
                            />
                        </MenuItem>
                    ))}

                    <Divider sx={{ my: 1 }} />

                    {/* Logout */}
                    <MenuItem
                        onClick={handleLogout}
                        sx={{
                            '&:hover': {
                                backgroundColor: 'rgba(231, 111, 81, 0.08)',
                                '& .MuiListItemIcon-root': {
                                    color: '#e76f51'
                                },
                                '& .MuiTypography-root': {
                                    color: '#e76f51'
                                }
                            }
                        }}
                    >
                        <ListItemIcon sx={{ minWidth: 40 }}>
                            <LogoutRounded />
                        </ListItemIcon>
                        <ListItemText 
                            primary="Logout"
                            sx={{
                                '& .MuiTypography-root': {
                                    fontWeight: 500
                                }
                            }}
                        />
                    </MenuItem>
                </Menu>
            </Toolbar>
        </AppBar>
    );
}