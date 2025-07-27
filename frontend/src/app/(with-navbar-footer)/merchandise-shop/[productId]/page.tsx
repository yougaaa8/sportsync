"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { useRouter } from "next/navigation"
import pullProductData from "../../../../api-calls/merchandise-shop/pullProductData"
import { ProductDetail } from "../../../../types/MerchandiseShopTypes"
import { 
    Typography, 
    Container, 
    Box, 
    Paper, 
    Button, 
    Chip, 
    Card, 
    CardContent,
    Skeleton,
    Fade,
    styled,
    IconButton,
    Breadcrumbs,
    Link
} from "@mui/material"
import { 
    ArrowBack, 
    Launch, 
    Store, 
    CheckCircle, 
    Cancel,
    Home,
    NavigateNext
} from "@mui/icons-material"

const StyledContainer = styled(Container)(({ theme }) => ({
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(6),
    maxWidth: '1200px',
    margin: '0 auto',
}))

const ProductCard = styled(Paper)(({  }) => ({
    borderRadius: '16px',
    overflow: 'hidden',
    boxShadow: 'none',
    border: '1px solid #E0E0E0',
    backgroundColor: '#FFFFFF',
}))

const ProductImageContainer = styled(Box)(({  }) => ({
    height: '400px',
    backgroundColor: '#F5F5F5',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
}))

const ProductInfo = styled(Box)(({ theme }) => ({
    padding: theme.spacing(4),
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(3),
}))

const PriceChip = styled(Box)(({ theme }) => ({
    backgroundColor: theme.palette.primary.main,
    color: 'white',
    padding: theme.spacing(1, 2),
    borderRadius: '20px',
    fontWeight: 600,
    fontSize: '1.25rem',
    display: 'inline-block',
    width: 'fit-content',
}))

const StyledButton = styled(Button)(({ theme }) => ({
    borderRadius: '8px',
    padding: theme.spacing(1.5, 3),
    fontWeight: 600,
    textTransform: 'none',
    fontSize: '1rem',
    minHeight: '48px',
    '&.primary': {
        backgroundColor: theme.palette.primary.main,
        color: 'white',
        '&:hover': {
            backgroundColor: theme.palette.primary.dark,
        },
        '&:disabled': {
            backgroundColor: '#BDBDBD',
            color: 'white',
        }
    },
    '&.secondary': {
        backgroundColor: 'transparent',
        color: theme.palette.primary.main,
        border: `1px solid ${theme.palette.primary.main}`,
        '&:hover': {
            backgroundColor: 'rgba(255, 107, 53, 0.04)',
        }
    }
}))

const InfoCard = styled(Card)(({  }) => ({
    borderRadius: '12px',
    border: '1px solid #E0E0E0',
    boxShadow: 'none',
    backgroundColor: '#FAFAFA',
}))

interface StatusChipProps {
    available: boolean
}

const StatusChip = styled(Chip, {
    shouldForwardProp: (prop) => prop !== "available"
})<StatusChipProps>(({ available }) => ({
    fontWeight: 500,
    fontSize: '0.875rem',
    borderRadius: '6px',
    ...(available ? {
        backgroundColor: 'rgba(76, 175, 80, 0.1)',
        color: '#4CAF50',
        border: 'none',
    } : {
        backgroundColor: 'rgba(244, 67, 54, 0.1)',
        color: '#F44336',
        border: 'none',
    })
}))

const BackButton = styled(IconButton)(({ theme }) => ({
    backgroundColor: 'transparent',
    border: '1px solid #E0E0E0',
    color: '#757575',
    width: '40px',
    height: '40px',
    '&:hover': {
        backgroundColor: '#F5F5F5',
        borderColor: theme.palette.primary.main,
        color: theme.palette.primary.main,
    }
}))

const LoadingSkeleton = () => (
    <StyledContainer>
        <Box sx={{ mb: 4 }}>
            <Skeleton variant="rectangular" width={40} height={40} sx={{ borderRadius: '8px', mb: 2 }} />
            <Skeleton variant="text" width={200} height={24} />
        </Box>
        <Box sx={{ display: 'flex', gap: 4, flexDirection: { xs: 'column', md: 'row' } }}>
            <Box sx={{ flex: '1 1 60%' }}>
                <Skeleton variant="rectangular" height={400} sx={{ borderRadius: '16px' }} />
            </Box>
            <Box sx={{ flex: '1 1 40%' }}>
                <Skeleton variant="text" width="70%" height={40} sx={{ mb: 2 }} />
                <Skeleton variant="text" width="30%" height={24} sx={{ mb: 2 }} />
                <Skeleton variant="rectangular" height={80} sx={{ borderRadius: '12px', mb: 3 }} />
                <Skeleton variant="rectangular" height={48} sx={{ borderRadius: '8px', mb: 2 }} />
                <Skeleton variant="rectangular" height={48} sx={{ borderRadius: '8px' }} />
            </Box>
        </Box>
    </StyledContainer>
)

export default function ProductDetailLayout() {
    const [productData, setProductData] = useState<ProductDetail | null>(null)
    const [loading, setLoading] = useState(true)
    const params = useParams()
    const router = useRouter()
    const productId = params.productId

    useEffect(() => {
        async function fetchProductData() {
            try {
                const data = await pullProductData(productId)
                setProductData(data)
                console.log("Successfully retrieved product data, ", data)
            }
            catch (error) {
                console.log("Failed to retrieve product data: ", error)
            } finally {
                setLoading(false)
            }
        }
        fetchProductData()
    }, [productId])

    const handlePurchase = () => {
        if (productData?.buy_link) {
            window.open(productData.buy_link, '_blank', 'noopener,noreferrer')
        }
    }

    const handleBackToShop = () => {
        router.push('/merchandise-shop')
    }

    if (loading) {
        return <LoadingSkeleton />
    }

    if (!productData) {
        return (
            <StyledContainer>
                <Box sx={{ textAlign: 'center', py: 8 }}>
                    <Typography variant="h4" sx={{ mb: 2, color: '#757575', fontWeight: 400 }}>
                        Product Not Found
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 4, color: '#9E9E9E' }}>
                        The product you&apos;re looking for doesn&apos;t exist or has been removed.
                    </Typography>
                    <StyledButton 
                        className="primary" 
                        onClick={handleBackToShop}
                        startIcon={<ArrowBack />}
                    >
                        Back to Shop
                    </StyledButton>
                </Box>
            </StyledContainer>
        )
    }

    return (
        <StyledContainer>
            <Fade in={true} timeout={500}>
                <Box>
                    {/* Navigation */}
                    <Box sx={{ mb: 4 }}>
                        <BackButton onClick={handleBackToShop} sx={{ mb: 2 }}>
                            <ArrowBack />
                        </BackButton>
                        <Breadcrumbs 
                            separator={<NavigateNext fontSize="small" />}
                            sx={{ color: '#757575', fontSize: '0.875rem' }}
                        >
                            <Link 
                                color="inherit" 
                                href="/merchandise" 
                                sx={{ 
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    textDecoration: 'none',
                                    '&:hover': { color: '#FF6B35' }
                                }}
                            >
                                <Home sx={{ mr: 0.5, fontSize: '1rem' }} />
                                Merchandise
                            </Link>
                            <Typography color="#212121" sx={{ fontWeight: 500, fontSize: '0.875rem' }}>
                                {productData.name}
                            </Typography>
                        </Breadcrumbs>
                    </Box>

                    {/* Main Product Section */}
                    <ProductCard>
                        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' } }}>
                            {/* Product Image */}
                            <Box sx={{ flex: '1 1 60%' }}>
                                <ProductImageContainer>
                                    <Box sx={{ textAlign: 'center' }}>
                                        <Store sx={{ 
                                            fontSize: 80, 
                                            color: '#BDBDBD', 
                                            mb: 2 
                                        }} />
                                        <Typography variant="body2" sx={{ color: '#9E9E9E' }}>
                                            Product Image
                                        </Typography>
                                    </Box>
                                </ProductImageContainer>
                            </Box>
                            
                            {/* Product Info */}
                            <Box sx={{ flex: '1 1 40%' }}>
                                <ProductInfo>
                                    {/* Product Title and Status */}
                                    <Box>
                                        <Typography 
                                            variant="h4" 
                                            component="h1" 
                                            sx={{ 
                                                fontWeight: 600, 
                                                color: '#212121', 
                                                mb: 2,
                                                lineHeight: 1.3
                                            }}
                                        >
                                            {productData.name}
                                        </Typography>
                                        <StatusChip 
                                            available={productData.available}
                                            icon={productData.available ? <CheckCircle sx={{ fontSize: '16px' }} /> : <Cancel sx={{ fontSize: '16px' }} />}
                                            label={productData.available ? "In Stock" : "Out of Stock"}
                                        />
                                    </Box>

                                    {/* CCA Info */}
                                    <InfoCard>
                                        <CardContent sx={{ p: 3, '&:last-child': { pb: 3 } }}>
                                            <Typography variant="body2" sx={{ color: '#757575', mb: 1 }}>
                                                Offered by
                                            </Typography>
                                            <Typography variant="h6" sx={{ fontWeight: 600, color: '#FF6B35' }}>
                                                {productData.cca_name}
                                            </Typography>
                                        </CardContent>
                                    </InfoCard>

                                    {/* Description */}
                                    <Box>
                                        <Typography 
                                            variant="body1" 
                                            sx={{ 
                                                color: '#757575', 
                                                lineHeight: 1.6,
                                                fontSize: '1rem'
                                            }}
                                        >
                                            {productData.description}
                                        </Typography>
                                    </Box>

                                    {/* Price */}
                                    <Box>
                                        <Typography variant="body2" sx={{ color: '#757575', mb: 1 }}>
                                            Price
                                        </Typography>
                                        <PriceChip>
                                            ${productData.price}
                                        </PriceChip>
                                    </Box>

                                    {/* Action Buttons */}
                                    <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
                                        <StyledButton
                                            className="primary"
                                            onClick={handlePurchase}
                                            disabled={!productData.available}
                                            startIcon={<Launch />}
                                            fullWidth
                                        >
                                            {productData.available ? 'Purchase Now' : 'Out of Stock'}
                                        </StyledButton>
                                        <StyledButton
                                            className="secondary"
                                            onClick={handleBackToShop}
                                            startIcon={<Store />}
                                            fullWidth
                                        >
                                            Continue Shopping
                                        </StyledButton>
                                    </Box>
                                </ProductInfo>
                            </Box>
                        </Box>
                    </ProductCard>
                </Box>
            </Fade>
        </StyledContainer>
    )
}