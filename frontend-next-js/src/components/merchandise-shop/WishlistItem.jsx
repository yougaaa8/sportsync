import { 
    Typography, 
    Paper, 
    Box, 
    Chip, 
    IconButton,
    Card,
    CardMedia,
    CardContent,
    CardActions,
    Button
} from "@mui/material"
import { 
    ImageOutlined, 
    FavoriteOutlined, 
    ShoppingCartOutlined,
    VisibilityOutlined,
    CheckCircleOutlined
} from "@mui/icons-material"
import { Link } from "react-router-dom"

export default function WishlistItem(props) {
    const { entry } = props
    
    // Format price display
    const formattedPrice = `$${parseFloat(entry.price).toFixed(2)}`
    
    // Determine availability status
    const isAvailable = entry.available === true || entry.available === 'true' || entry.available === 1
    
    return (
        <Card 
            sx={{ 
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                transition: 'all 0.3s ease',
                '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
                },
                borderRadius: 3,
                overflow: 'hidden'
            }}
        >
            {/* Product Image */}
            <Box sx={{ position: 'relative', bgcolor: '#f5f5f5', height: 200 }}>
                {entry.first_image ? (
                    <CardMedia
                        component="img"
                        height="200"
                        image={entry.first_image}
                        alt={entry.name}
                        sx={{ 
                            objectFit: 'cover',
                            transition: 'transform 0.3s ease',
                            '&:hover': { transform: 'scale(1.05)' }
                        }}
                    />
                ) : (
                    <Box 
                        sx={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'center',
                            height: '100%',
                            backgroundColor: '#f8f9fa'
                        }}
                    >
                        <ImageOutlined sx={{ fontSize: 60, color: '#ccc' }} />
                    </Box>
                )}
                
                {/* Wishlist indicator */}
                <Box sx={{ position: 'absolute', top: 8, right: 8 }}>
                    <IconButton 
                        size="small" 
                        sx={{ 
                            backgroundColor: 'rgba(255,255,255,0.9)',
                            '&:hover': { backgroundColor: 'rgba(255,255,255,1)' }
                        }}
                    >
                        <FavoriteOutlined sx={{ color: '#f4a261', fontSize: 20 }} />
                    </IconButton>
                </Box>

                {/* Availability Badge */}
                <Box sx={{ position: 'absolute', bottom: 8, left: 8 }}>
                    <Chip
                        icon={isAvailable ? <CheckCircleOutlined /> : null}
                        label={isAvailable ? "In Stock" : "Out of Stock"}
                        size="small"
                        sx={{
                            backgroundColor: isAvailable ? '#4caf50' : '#f44336',
                            color: 'white',
                            fontWeight: 500,
                            '& .MuiChip-icon': { color: 'white' }
                        }}
                    />
                </Box>
            </Box>

            {/* Product Details */}
            <CardContent sx={{ flexGrow: 1, p: 2 }}>
                <Typography 
                    variant="h6" 
                    component="h3"
                    sx={{ 
                        fontWeight: 600,
                        mb: 1,
                        fontSize: '1.1rem',
                        color: '#2c3e50',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                    }}
                >
                    {entry.name}
                </Typography>
                
                <Typography 
                    variant="body2" 
                    sx={{ 
                        color: '#6fa8dc',
                        mb: 1,
                        fontWeight: 500,
                        fontSize: '0.9rem'
                    }}
                >
                    {entry.cca_name}
                </Typography>
                
                <Typography 
                    variant="h6" 
                    sx={{ 
                        color: '#f4a261',
                        fontWeight: 700,
                        fontSize: '1.25rem'
                    }}
                >
                    {formattedPrice}
                </Typography>
            </CardContent>

            {/* Action Buttons */}
            <CardActions sx={{ p: 2, pt: 0 }}>
                <Box sx={{ display: 'flex', gap: 1, width: '100%' }}>
                    <Button
                        component={Link}
                        to={`/product-detail/${entry.id}`}
                        variant="outlined"
                        size="small"
                        startIcon={<VisibilityOutlined />}
                        sx={{
                            flex: 1,
                            borderColor: '#6fa8dc',
                            color: '#6fa8dc',
                            '&:hover': {
                                borderColor: '#5a91c7',
                                backgroundColor: 'rgba(111, 168, 220, 0.1)'
                            }
                        }}
                    >
                        View
                    </Button>
                    
                    <Button
                        variant="contained"
                        size="small"
                        startIcon={<ShoppingCartOutlined />}
                        disabled={!isAvailable}
                        sx={{
                            flex: 1,
                            backgroundColor: '#6fa8dc',
                            '&:hover': {
                                backgroundColor: '#5a91c7'
                            },
                            '&:disabled': {
                                backgroundColor: '#ccc'
                            }
                        }}
                    >
                        Add to Cart
                    </Button>
                </Box>
            </CardActions>
        </Card>
    )
}