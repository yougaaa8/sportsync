import { 
    Typography, 
    Card, 
    CardMedia, 
    CardContent, 
    CardActions, 
    Button,
    Box,
    Chip,
    styled,
    IconButton,
    Tooltip,
} from "@mui/material"
import { ShoppingCart, Visibility, FavoriteBorder, Favorite } from "@mui/icons-material"
import { useState } from "react"
import addToWishlist from "../../api-calls/merchandise-shop/addToWishlist"
import removeFromWishlist from "../../api-calls/merchandise-shop/removeFromWishlist"
import Link from "next/link"

const StyledCard = styled(Card)(({ theme }) => ({
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    border: '1px solid #e8e8e8',
    borderRadius: '16px',
    overflow: 'hidden',
    backgroundColor: '#ffffff',
    '&:hover': {
        transform: 'translateY(-8px)',
        boxShadow: '0 20px 40px rgba(246, 166, 90, 0.15)',
        borderColor: '#f6a65a',
    },
}))

const StyledCardMedia = styled(CardMedia)({
    height: 240,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    position: 'relative',
    '&::after': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.1) 100%)',
    }
})

const PriceChip = styled(Chip)(({ theme }) => ({
    position: 'absolute',
    top: 16,
    right: 16,
    backgroundColor: '#f6a65a',
    color: 'white',
    fontWeight: 600,
    fontSize: '0.9rem',
    zIndex: 1,
    '& .MuiChip-label': {
        padding: '8px 12px',
    }
}))

const AvailabilityChip = styled(Chip)(({ available }) => ({
    backgroundColor: available ? '#4caf50' : '#ff5252',
    color: 'white',
    fontSize: '0.75rem',
    height: '24px',
    '& .MuiChip-label': {
        padding: '0 8px',
    }
}))

const WishlistButton = styled(IconButton)(({ theme, isWishlisted }) => ({
    position: 'absolute',
    top: 16,
    left: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    color: isWishlisted ? '#ff5252' : '#666',
    width: 40,
    height: 40,
    zIndex: 1,
    transition: 'all 0.2s ease',
    '&:hover': {
        backgroundColor: '#ffffff',
        color: '#ff5252',
        transform: 'scale(1.1)',
    },
}))

const StyledButton = styled(Button)(({ variant }) => ({
    borderRadius: '24px',
    textTransform: 'none',
    fontWeight: 600,
    padding: '10px 24px',
    transition: 'all 0.2s ease',
    ...(variant === 'contained' && {
        backgroundColor: '#4a90e2',
        color: 'white',
        '&:hover': {
            backgroundColor: '#357abd',
            transform: 'scale(1.02)',
        },
        '&:disabled': {
            backgroundColor: '#e0e0e0',
            color: '#999',
        }
    }),
    ...(variant === 'outlined' && {
        borderColor: '#f6a65a',
        color: '#f6a65a',
        '&:hover': {
            backgroundColor: '#f6a65a',
            color: 'white',
            transform: 'scale(1.02)',
        },
    }),
}))

export default function ProductItem(props) {
    const { entry } = props;
    const [isWishlisted, setIsWishlisted] = useState(props.isWishlisted)
    
    const handleWishlistToggle = () => {
        try {
            console.log("Is this product wishlisted? ", props.isWishlisted)
            if (isWishlisted) {
                removeFromWishlist(props.entry.id)
                setIsWishlisted(!isWishlisted)
            }
            else { 
                addToWishlist(props.entry.id)
                setIsWishlisted(!isWishlisted)
            }
        }
        catch {
            console.log("Failed to add product to wishlist")
        }
    };
    
    return (
            <StyledCard>
                <Box sx={{ position: 'relative' }}>
                    <StyledCardMedia
                        image={entry.first_image || '/placeholder-image.jpg'}
                        title={entry.name}
                    />
                    <PriceChip label={`${entry.price}`} />
                    <Tooltip title={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}>
                        <WishlistButton 
                            onClick={handleWishlistToggle}
                            isWishlisted={isWishlisted}
                        >
                            {isWishlisted ? <Favorite /> : <FavoriteBorder />}
                        </WishlistButton>
                    </Tooltip>
                </Box>
                
                <CardContent sx={{ flexGrow: 1, p: 3 }}>
                    <Box sx={{ mb: 2 }}>
                        <Typography 
                            variant="h6" 
                            component="h3"
                            sx={{ 
                                fontWeight: 600,
                                fontSize: '1.1rem',
                                lineHeight: 1.3,
                                mb: 1,
                                color: '#333'
                            }}
                        >
                            {entry.name}
                        </Typography>
                        
                        <Typography 
                            variant="body2" 
                            sx={{ 
                                fontSize: '0.9rem',
                                mb: 2,
                                fontWeight: 500,
                                color: '#666'
                            }}
                        >
                            {entry.cca_name}
                        </Typography>
                        
                        <AvailabilityChip 
                            label={entry.available ? 'In Stock' : 'Out of Stock'}
                            available={entry.available}
                            size="small"
                        />
                    </Box>
                </CardContent>
                
                <CardActions sx={{ p: 3, pt: 0 }}>
                    <Box sx={{ display: 'flex', gap: 1, width: '100%' }}>
                        <StyledButton
                            variant="contained"
                            startIcon={<ShoppingCart />}
                            disabled={!entry.available}
                            sx={{ flex: 1 }}
                        >
                            <Link href={props.entry.buy_link}>
                                Purchase Now
                            </Link>
                        </StyledButton>
                        
                        <StyledButton
                            variant="outlined"
                            startIcon={<Visibility />}
                            sx={{ minWidth: 'auto', px: 2 }}
                        >
                            <Link href={`/merchandise-shop/${props.entry.id}`}>
                                View
                            </Link>
                        </StyledButton>
                    </Box>
                </CardActions>
            </StyledCard>
    )
}