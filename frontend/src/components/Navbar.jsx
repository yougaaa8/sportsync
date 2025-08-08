"use client"

import { useState, useRef, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import SportSyncLogo from "../assets/sportsync-logo.png"
import logout from "../api-calls/login/logout";
import { API_BASE_URL } from "@/config/api";

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
    Chip,
    Popover,
    List,
    ListItem,
    Badge,
    Alert,
    Snackbar,
    Button
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
    MarkEmailReadRounded,
    ClearAllRounded,
    OpenInNewRounded
} from "@mui/icons-material";

export default function Navbar() {
    const router = useRouter();
    const pathname = usePathname();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    
    const [anchorEl, setAnchorEl] = useState(null);
    const [notificationAnchorEl, setNotificationAnchorEl] = useState(null);
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [userEmail, setUserEmail] = useState("user@example.com");
    const [wsConnected, setWsConnected] = useState(false);
    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState("");
    const [role, setRole] = useState("")
    const [profilePictureUrl, setProfilePictureUrl] = useState("")
    const [fullName, setFullName] = useState("")
    
    const dropdownRef = useRef(null);
    const wsRef = useRef(null);
    const reconnectTimeoutRef = useRef(null);
    const isMenuOpen = Boolean(anchorEl);
    const isNotificationOpen = Boolean(notificationAnchorEl);

    // Extract role and profile picture URL from local storage
    useEffect(() => {
        if (typeof window !== "undefined") {
            setRole(localStorage.getItem("role"))
            setProfilePictureUrl(localStorage.getItem("profilePicture"))
            setFullName(localStorage.getItem("fullName"))
        }
    }, [])

    // Helper function to get WebSocket URL
    const getWebSocketUrl = () => {
        if (!API_BASE_URL) {
            console.error('API_BASE_URL is not defined');
            return null;
        }
        
        // Convert HTTP/HTTPS URL to WebSocket URL
        let wsUrl = API_BASE_URL.replace('http://', 'ws://').replace('https://', 'wss://');
        
        // Remove any trailing slashes and add the WebSocket path
        wsUrl = wsUrl.replace(/\/$/, '');
        wsUrl += '/ws/notifications/';
        
        console.log('WebSocket URL:', wsUrl);
        return wsUrl;
    };

    // Initialize WebSocket connection
    useEffect(() => {
        const email = localStorage.getItem("email");
        if (email) {
            setUserEmail(email);
        }

        let reconnectAttempts = 0;
        const maxReconnectAttempts = 5;
        const baseReconnectDelay = 1000; // Start with 1 second

        // Initialize WebSocket connection
        const connectWebSocket = async () => {
            // Clear any existing timeout
            if (reconnectTimeoutRef.current) {
                clearTimeout(reconnectTimeoutRef.current);
                reconnectTimeoutRef.current = null;
            }

            // Close existing connection if any
            if (wsRef.current && wsRef.current.readyState !== WebSocket.CLOSED) {
                wsRef.current.close();
            }

            const wsUrl = getWebSocketUrl();
            if (!wsUrl) {
                console.error('Cannot establish WebSocket connection: Invalid URL');
                return;
            }

            try {
                console.log(`Attempting WebSocket connection (attempt ${reconnectAttempts + 1}/${maxReconnectAttempts})`);
                wsRef.current = new WebSocket(wsUrl);
                
                // Set a connection timeout
                const connectionTimeout = setTimeout(() => {
                    if (wsRef.current && wsRef.current.readyState === WebSocket.CONNECTING) {
                        console.log('WebSocket connection timeout');
                        wsRef.current.close();
                    }
                }, 10000); // 10 second timeout
                
                wsRef.current.onopen = () => {
                    console.log('WebSocket connected successfully');
                    clearTimeout(connectionTimeout);
                    setWsConnected(true);
                    reconnectAttempts = 0; // Reset reconnect attempts on successful connection
                    
                    // Send connection confirmation with user info if needed
                    const userInfo = {
                        type: 'connection_established',
                        email: email,
                        timestamp: new Date().toISOString()
                    };
                    
                    try {
                        wsRef.current.send(JSON.stringify(userInfo));
                    } catch (sendError) {
                        console.warn('Failed to send connection confirmation:', sendError);
                    }
                };

                wsRef.current.onmessage = (event) => {
                    try {
                        const data = JSON.parse(event.data);
                        console.log('WebSocket message received:', data);
                        
                        if (data.type === 'notification') {
                            const newNotification = {
                                id: data.id || Date.now(),
                                title: data.title || 'New Notification',
                                message: data.message || 'You have a new notification',
                                timestamp: new Date(data.timestamp || Date.now()),
                                read: false
                            };

                            setNotifications(prev => [newNotification, ...prev]);
                            setUnreadCount(prev => prev + 1);
                            
                            // Show alert
                            setAlertMessage(newNotification.message);
                            setShowAlert(true);
                        }
                    } catch (error) {
                        console.error('Error parsing WebSocket message:', error);
                    }
                };

                wsRef.current.onclose = (event) => {
                    clearTimeout(connectionTimeout);
                    console.log(`WebSocket disconnected: Code ${event.code}, Reason: ${event.reason || 'No reason provided'}`);
                    setWsConnected(false);
                    
                    // Handle different close codes
                    let shouldReconnect = false;
                    switch (event.code) {
                        case 1000: // Normal closure
                            console.log('WebSocket closed normally');
                            break;
                        case 1001: // Going away
                        case 1006: // Abnormal closure (connection lost)
                            shouldReconnect = reconnectAttempts < maxReconnectAttempts;
                            break;
                        case 1002: // Protocol error
                        case 1003: // Unsupported data
                        case 1007: // Invalid data
                        case 1008: // Policy violation
                        case 1009: // Message too big
                        case 1010: // Missing extension
                        case 1011: // Internal error
                            console.error(`WebSocket closed due to error: ${event.code}`);
                            shouldReconnect = false;
                            break;
                        default:
                            shouldReconnect = reconnectAttempts < maxReconnectAttempts;
                    }
                    
                    if (shouldReconnect) {
                        const delay = Math.min(baseReconnectDelay * Math.pow(2, reconnectAttempts), 30000);
                        console.log(`Reconnecting in ${delay}ms...`);
                        
                        reconnectTimeoutRef.current = setTimeout(() => {
                            reconnectAttempts++;
                            connectWebSocket();
                        }, delay);
                    } else if (reconnectAttempts >= maxReconnectAttempts) {
                        console.error('Max reconnection attempts reached. WebSocket notifications are disabled.');
                        // You could show a user notification here if needed
                    }
                };

                wsRef.current.onerror = (error) => {
                    clearTimeout(connectionTimeout);
                    console.error('WebSocket error:', error);
                    setWsConnected(false);
                };

            } catch (error) {
                console.error('Failed to create WebSocket connection:', error);
                setWsConnected(false);
                
                // Retry connection if we haven't exceeded max attempts
                if (reconnectAttempts < maxReconnectAttempts) {
                    const delay = Math.min(baseReconnectDelay * Math.pow(2, reconnectAttempts), 30000);
                    reconnectTimeoutRef.current = setTimeout(() => {
                        reconnectAttempts++;
                        connectWebSocket();
                    }, delay);
                }
            }
        };

        // Only connect if we have the necessary configuration
        if (typeof window !== 'undefined' && API_BASE_URL) {
            connectWebSocket();
        }

        // Cleanup on unmount
        return () => {
            if (reconnectTimeoutRef.current) {
                clearTimeout(reconnectTimeoutRef.current);
            }
            if (wsRef.current) {
                wsRef.current.close(1000, 'Component unmounting'); // Normal closure
            }
        };
    }, []);

    const userInitials = userEmail.split('@')[0].substring(0, 2).toUpperCase();

    // Navigation items with icons
    const navItems = [
        { label: "Home", path: "/home", icon: <HomeRounded /> },
        { label: "CCAs", path: "/cca", icon: <GroupsRounded /> },
        { label: "Profile", path: "/profile", icon: <PersonRounded /> },
        { label: "Matches", path: "/matchmaking", icon: <SportsRounded /> },
        { label: "Events", path: "/events", icon: <EventRounded /> },
        { label: "Tournaments", path: "/tournament", icon: <EmojiEventsRounded /> },
        { label: "Merchandise", path: "/merchandise-shop", icon: <StoreRounded /> },
        { label: "CCA Dashboard", path: "/cca/dashboard/", icon: <DashboardRounded /> },
    ];

    // Check if current path matches nav item
    const isActive = (path) => pathname === path;

    const handleMenuClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleNotificationClick = (event) => {
        setNotificationAnchorEl(event.currentTarget);
    };

    const handleNotificationClose = () => {
        setNotificationAnchorEl(null);
    };

    const handleNavigation = (path) => {
        router.push(path);
        handleMenuClose();
    };

    const handleViewAllNotifications = () => {
        handleNotificationClose();
        router.push('/notifications'); 
    };

    const markNotificationAsRead = (notificationId) => {
        setNotifications(prev => 
            prev.map(notification => 
                notification.id === notificationId 
                    ? { ...notification, read: true }
                    : notification
            )
        );
        setUnreadCount(prev => Math.max(0, prev - 1));
        
        // Send mark_read message to WebSocket if connected
        if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
            try {
                wsRef.current.send(JSON.stringify({ 
                    type: 'mark_read', 
                    notification_id: notificationId 
                }));
            } catch (error) {
                console.error('Failed to send mark_read message:', error);
            }
        }
    };

    const markAllAsRead = () => {
        setNotifications(prev => 
            prev.map(notification => ({ ...notification, read: true }))
        );
        setUnreadCount(0);
        
        // Send mark all read message to WebSocket if connected
        if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
            try {
                wsRef.current.send(JSON.stringify({ type: 'mark_all_read' }));
            } catch (error) {
                console.error('Failed to send mark_all_read message:', error);
            }
        }
    };

    const clearAllNotifications = () => {
        setNotifications([]);
        setUnreadCount(0);
    };

    async function handleLogout() {
        // Close WebSocket connection before logout
        if (wsRef.current) {
            wsRef.current.close(1000, 'User logging out');
        }
        
        const refresh = localStorage.getItem("refreshToken");
        if (refresh) {
            logout(refresh);
        }
        handleMenuClose();
        router.push("/login");
    }

    const formatTime = (timestamp) => {
        const now = new Date();
        const diff = now - timestamp;
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);
        const days = Math.floor(diff / 86400000);

        if (minutes < 1) return 'just now';
        if (minutes < 60) return `${minutes}m ago`;
        if (hours < 24) return `${hours}h ago`;
        return `${days}d ago`;
    };

    return (
        <>
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
                        onClick={() => router.push('/home')}
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
                            <Image
                                src={SportSyncLogo} 
                                alt="SportSync" 
                                width={32}
                                height={32}
                                style={{ 
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
                                    onClick={() => router.push('/merchandise-shop/wishlist')}
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
                                    onClick={handleNotificationClick}
                                    sx={{ 
                                        color: '#6c757d',
                                        position: 'relative',
                                        '&:hover': { 
                                            backgroundColor: 'rgba(244, 162, 97, 0.1)',
                                            color: '#f4a261' 
                                        }
                                    }}
                                >
                                    <Badge 
                                        badgeContent={unreadCount} 
                                        color="error"
                                        sx={{
                                            '& .MuiBadge-badge': {
                                                backgroundColor: '#e76f51',
                                                color: 'white'
                                            }
                                        }}
                                    >
                                        <NotificationsRounded />
                                    </Badge>
                                </IconButton>
                            </Box>
                        )}

                        {/* User Avatar & Menu */}
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            {!isMobile && (
                                <Box sx={{ textAlign: 'right', mr: 1 }}>
                                    <Typography variant="body2" sx={{ color: '#495057', fontWeight: 500 }}>
                                        {fullName}
                                    </Typography>
                                    <Typography variant="caption" sx={{ color: '#6c757d' }}>
                                        {role} {wsConnected ? '🟢' : '🔴'}
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
                                <Avatar>
                                    {profilePictureUrl && typeof profilePictureUrl === "string" && profilePictureUrl.trim() !== "" && profilePictureUrl !== "null" && profilePictureUrl !== "undefined" ? (
                                        <Image
                                            src={profilePictureUrl}
                                            alt={"profile picture"}
                                            width={40}
                                            height={40}
                                        />
                                    ) : (
                                        <span>{userInitials}</span>
                                    )}
                                </Avatar>
                            </IconButton>
                        </Box>
                    </Box>

                    {/* Main Menu Dropdown */}
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
                                {fullName}
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

                    {/* Notifications Popover */}
                    <Popover
                        open={isNotificationOpen}
                        anchorEl={notificationAnchorEl}
                        onClose={handleNotificationClose}
                        anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'right',
                        }}
                        transformOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                        }}
                        PaperProps={{
                            sx: {
                                width: 350,
                                maxHeight: 400,
                                borderRadius: 2,
                                boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                                mt: 1
                            }
                        }}
                    >
                        <Box sx={{ p: 2, borderBottom: '1px solid rgba(0,0,0,0.08)' }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                    Notifications
                                </Typography>
                                <Box>
                                    {unreadCount > 0 && (
                                        <IconButton size="small" onClick={markAllAsRead} title="Mark all as read">
                                            <MarkEmailReadRounded fontSize="small" />
                                        </IconButton>
                                    )}
                                    <IconButton size="small" onClick={clearAllNotifications} title="Clear all">
                                        <ClearAllRounded fontSize="small" />
                                    </IconButton>
                                </Box>
                            </Box>
                            {unreadCount > 0 && (
                                <Typography variant="caption" color="primary">
                                    {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
                                </Typography>
                            )}
                            <Button
                                fullWidth
                                variant="outlined"
                                size="small"
                                onClick={handleViewAllNotifications}
                                endIcon={<OpenInNewRounded />}
                                sx={{
                                    mt: 1,
                                    borderColor: '#f4a261',
                                    color: '#f4a261',
                                    '&:hover': {
                                        borderColor: '#e76f51',
                                        backgroundColor: 'rgba(244, 162, 97, 0.05)',
                                        color: '#e76f51'
                                    }
                                }}
                            >
                                View All Notifications
                            </Button>
                        </Box>
                        
                        <List sx={{ p: 0, maxHeight: 300, overflow: 'auto' }}>
                            {notifications.length === 0 ? (
                                <ListItem>
                                    <Typography color="text.secondary" align="center" sx={{ width: '100%' }}>
                                        No notifications yet
                                    </Typography>
                                </ListItem>
                            ) : (
                                notifications.map((notification) => (
                                    <ListItem
                                        key={notification.id}
                                        sx={{
                                            borderBottom: '1px solid rgba(0,0,0,0.05)',
                                            backgroundColor: notification.read ? 'transparent' : 'rgba(244, 162, 97, 0.05)',
                                            cursor: 'pointer',
                                            '&:hover': {
                                                backgroundColor: 'rgba(244, 162, 97, 0.1)'
                                            }
                                        }}
                                        onClick={() => markNotificationAsRead(notification.id)}
                                    >
                                        <Box sx={{ width: '100%' }}>
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                                <Typography variant="subtitle2" sx={{ fontWeight: notification.read ? 400 : 600 }}>
                                                    {notification.title}
                                                </Typography>
                                                {!notification.read && (
                                                    <Box sx={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#e76f51', ml: 1, mt: 0.5 }} />
                                                )}
                                            </Box>
                                            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                                                {notification.message}
                                            </Typography>
                                            <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5 }}>
                                                {formatTime(notification.timestamp)}
                                            </Typography>
                                        </Box>
                                    </ListItem>
                                ))
                            )}
                        </List>
                    </Popover>
                </Toolbar>
            </AppBar>

            {/* Notification Alert Snackbar */}
            <Snackbar
                open={showAlert}
                autoHideDuration={4000}
                onClose={() => setShowAlert(false)}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                sx={{ mt: 8 }}
            >
                <Alert onClose={() => setShowAlert(false)} severity="info" variant="filled">
                    {alertMessage}
                </Alert>
            </Snackbar>
        </>
    );
}