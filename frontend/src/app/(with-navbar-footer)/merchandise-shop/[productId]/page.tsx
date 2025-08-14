"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { useRouter } from "next/navigation"
import pullProductData from "../../../../api-calls/merchandise-shop/pullProductData"
import editMerchandiseDetails from "../../../../api-calls/merchandise-shop/editMerchandiseDetails"
import pullUserCCAObjects from "../../../../api-calls/cca/pullUserCCAObjects"
import notifyWishlistedUsers from "../../../../api-calls/merchandise-shop/notifyWishlistedUsers"
import { CCADetail } from "../../../../types/CCATypes"
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
    Breadcrumbs,
    Link,
    TextField,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Divider,
    Alert,
    Stack,
    Snackbar
} from "@mui/material"
import { 
    ArrowBack, 
    Launch, 
    Store, 
    CheckCircle, 
    Cancel,
    Home,
    NavigateNext,
    ChevronRight,
    Edit,
    Save,
    CloudUpload
} from "@mui/icons-material"
import Image from "next/image"
import React, { useRef } from "react"

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
    flex: '1 1 60%',
}))

const ImageWrapper = styled(Box)(({  }) => ({
    position: 'relative',
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
}))

const NextImageButton = styled(Button)(({ theme }) => ({
    position: 'absolute',
    bottom: '16px',
    right: '16px',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    color: theme.palette.primary.main,
    border: `1px solid ${theme.palette.primary.main}`,
    borderRadius: '8px',
    padding: theme.spacing(1, 2),
    fontSize: '0.875rem',
    fontWeight: 500,
    textTransform: 'none',
    minHeight: '36px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
    backdropFilter: 'blur(8px)',
    transition: 'all 0.2s ease-in-out',
    '&:hover': {
        backgroundColor: theme.palette.primary.main,
        color: 'white',
        transform: 'translateY(-1px)',
        boxShadow: '0 4px 12px rgba(255, 107, 53, 0.3)',
    },
    '&:active': {
        transform: 'translateY(0)',
    }
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

const FormCard = styled(Paper)(({ theme }) => ({
    borderRadius: '16px',
    padding: theme.spacing(4),
    marginTop: theme.spacing(4),
    border: '1px solid #E0E0E0',
    boxShadow: '0 2px 12px rgba(0, 0, 0, 0.08)',
    backgroundColor: '#FFFFFF',
}))

const FormSection = styled(Box)(({ theme }) => ({
    marginBottom: theme.spacing(3),
}))

const StyledTextField = styled(TextField)(({ theme }) => ({
    '& .MuiOutlinedInput-root': {
        borderRadius: '12px',
        backgroundColor: '#FAFAFA',
        '&:hover': {
            backgroundColor: '#F5F5F5',
        },
        '&.Mui-focused': {
            backgroundColor: '#FFFFFF',
        },
        '& fieldset': {
            borderColor: '#E0E0E0',
        },
        '&:hover fieldset': {
            borderColor: theme.palette.primary.main,
        },
        '&.Mui-focused fieldset': {
            borderColor: theme.palette.primary.main,
            borderWidth: '2px',
        },
    },
    '& .MuiInputLabel-root': {
        color: '#757575',
        fontWeight: 500,
        '&.Mui-focused': {
            color: theme.palette.primary.main,
        },
    },
}))

const StyledFormControl = styled(FormControl)(({ theme }) => ({
    '& .MuiOutlinedInput-root': {
        borderRadius: '12px',
        backgroundColor: '#FAFAFA',
        '&:hover': {
            backgroundColor: '#F5F5F5',
        },
        '&.Mui-focused': {
            backgroundColor: '#FFFFFF',
        },
        '& fieldset': {
            borderColor: '#E0E0E0',
        },
        '&:hover fieldset': {
            borderColor: theme.palette.primary.main,
        },
        '&.Mui-focused fieldset': {
            borderColor: theme.palette.primary.main,
            borderWidth: '2px',
        },
    },
    '& .MuiInputLabel-root': {
        color: '#757575',
        fontWeight: 500,
        '&.Mui-focused': {
            color: theme.palette.primary.main,
        },
    },
}))

const FileUploadBox = styled(Box)(({ theme }) => ({
    border: '2px dashed #E0E0E0',
    borderRadius: '12px',
    padding: theme.spacing(3),
    textAlign: 'center',
    backgroundColor: '#FAFAFA',
    cursor: 'pointer',
    transition: 'all 0.2s ease-in-out',
    '&:hover': {
        borderColor: theme.palette.primary.main,
        backgroundColor: '#F5F5F5',
    },
    '& input[type="file"]': {
        display: 'none',
    },
}))

const ManageButton = styled(Button)(({ theme }) => ({
    borderRadius: '12px',
    padding: theme.spacing(1.5, 3),
    fontWeight: 600,
    textTransform: 'none',
    fontSize: '0.875rem',
    minHeight: '44px',
    marginTop: theme.spacing(3),
    backgroundColor: 'transparent',
    color: theme.palette.secondary.main,
    border: `2px solid ${theme.palette.secondary.main}`,
    '&:hover': {
        backgroundColor: theme.palette.secondary.main,
        color: 'white',
        transform: 'translateY(-2px)',
        boxShadow: '0 4px 12px rgba(26, 35, 126, 0.3)',
    },
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
    // Set states
    const [productData, setProductData] = useState<ProductDetail | null>(null)
    const [loading, setLoading] = useState(true)
    const [imageIndex, setImageIndex] = useState(0)
    const [isShowMerchandiseForm, setIsShowMerchandiseForm] = useState(false)
    const [userCCAs, setUserCCAs] = useState<null | CCADetail[]>(null)
    const [notifySuccess, setNotifySuccess] = useState(false);

    // Add a ref for the file input
    const fileInputRef = useRef<HTMLInputElement>(null);

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

    // Get the user CCAs into the userCCAs state
    useEffect(() => {
        const fetchCCAs = async () => {
            setUserCCAs(await pullUserCCAObjects())
        }
        fetchCCAs()
    }, [])

    const handlePurchase = () => {
        if (productData?.buy_link) {
            window.open(productData.buy_link, '_blank', 'noopener,noreferrer')
        }
    }

    const handleBackToShop = () => {
        router.push('/merchandise-shop')
    }

    function nextImageClick() {
        console.log("setting next image")
        setImageIndex(prev => ((prev + 1) % ((productData?.images?.length ?? 1))))
    }

    async function handleMerchandiseDetailsUpdate(formData: FormData) {
        if (
            !fileInputRef.current ||
            !fileInputRef.current.files ||
            fileInputRef.current.files.length === 0
        ) {
            formData.delete("uploaded_images");
        }
        await editMerchandiseDetails(formData, productData?.id)
        setTimeout(() => {
            window.location.reload()
        }, 1000)
    }

    async function handleNotifyWishlistedUsers(formData: FormData) {
        await notifyWishlistedUsers(formData, productData?.id)
        setNotifySuccess(true);
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

    // Transform the CCA objects into CCA options for the form
    const ccaOptions = userCCAs?.map(cca => (
        <option key={cca.id} value={cca.id}>{cca.name}</option>
    ))

    console.log("The current image index: ", imageIndex)
    console.log("These are the userCCAS: ", userCCAs)

    return (
        <StyledContainer>
            <Fade in={true} timeout={500}>
                <Box>
                    {/* Navigation */}
                    <Box sx={{ mb: 4 }}>
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
                            <ProductImageContainer>
                                <ImageWrapper>
                                    <Image 
                                        src={productData.images[imageIndex].image_url} 
                                        alt={productData.name}
                                        width={500} 
                                        height={400}
                                        style={{
                                            width: '100%',
                                            height: '100%',
                                            objectFit: 'cover'
                                        }}
                                    />
                                    {productData.images && productData.images.length > 1 && (
                                        <NextImageButton 
                                            onClick={nextImageClick}
                                            endIcon={<ChevronRight sx={{ fontSize: '18px' }} />}
                                        >
                                            Next Image
                                        </NextImageButton>
                                    )}
                                </ImageWrapper>
                            </ProductImageContainer>
                            
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

                    {/* Manage Merchandise Button */}
                    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                        <ManageButton 
                            onClick={() => setIsShowMerchandiseForm(prev => !prev)}
                            startIcon={<Edit />}
                        >
                            {isShowMerchandiseForm ? 'Hide Form' : 'Manage Merchandise Details'}
                        </ManageButton>
                    </Box>

                    {/* Merchandise Edit Form */}
                    {isShowMerchandiseForm && (
                        <FormCard>
                            <Box sx={{ mb: 3 }}>
                                <Typography variant="h5" sx={{ fontWeight: 600, color: '#212121', mb: 1 }}>
                                    Edit Merchandise Details
                                </Typography>
                                <Typography variant="body2" sx={{ color: '#757575' }}>
                                    Update your product information and settings below
                                </Typography>
                            </Box>
                            
                            <Divider sx={{ mb: 4 }} />
                            
                            <form action={handleMerchandiseDetailsUpdate} encType="multipart/form-data">
                                <Stack spacing={4}>
                                    {/* Basic Information Section */}
                                    <FormSection>
                                        <Typography variant="h6" sx={{ fontWeight: 600, color: '#212121', mb: 3 }}>
                                            Basic Information
                                        </Typography>
                                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                                            <StyledTextField
                                                fullWidth
                                                label="Product Name"
                                                name="name"
                                                defaultValue={productData?.name}
                                                variant="outlined"
                                            />
                                            <StyledFormControl fullWidth>
                                                <InputLabel>CCA</InputLabel>
                                                <Select
                                                    name="cca"
                                                    defaultValue={productData?.cca_name || ''}
                                                    label="CCA"
                                                    required
                                                    native
                                                >
                                                    {ccaOptions}
                                                </Select>
                                            </StyledFormControl>
                                            <StyledTextField
                                                fullWidth
                                                label="Product Description"
                                                name="description"
                                                defaultValue={productData?.description}
                                                multiline
                                                rows={4}
                                                variant="outlined"
                                            />
                                        </Box>
                                    </FormSection>

                                    {/* Pricing and Availability Section */}
                                    <FormSection>
                                        <Typography variant="h6" sx={{ fontWeight: 600, color: '#212121', mb: 3 }}>
                                            Pricing & Availability
                                        </Typography>
                                        <Box sx={{ display: 'flex', gap: 3, flexDirection: { xs: 'column', sm: 'row' } }}>
                                            <StyledTextField
                                                label="Price ($)"
                                                name="price"
                                                type="number"
                                                inputProps={{ step: "0.01", min: "0" }}
                                                defaultValue={productData?.price}
                                                variant="outlined"
                                                sx={{ flex: 1 }}
                                            />
                                            <StyledFormControl sx={{ flex: 1 }}>
                                                <InputLabel>Availability</InputLabel>
                                                <Select
                                                    name="available"
                                                    defaultValue={productData?.available ? "true" : "false"}
                                                    label="Availability"
                                                >
                                                    <MenuItem value="true">Available</MenuItem>
                                                    <MenuItem value="false">Unavailable</MenuItem>
                                                </Select>
                                            </StyledFormControl>
                                        </Box>
                                    </FormSection>

                                    {/* Purchase Link Section */}
                                    <FormSection>
                                        <Typography variant="h6" sx={{ fontWeight: 600, color: '#212121', mb: 3 }}>
                                            Purchase Information
                                        </Typography>
                                        <StyledTextField
                                            fullWidth
                                            label="Purchase Link"
                                            name="buy_link"
                                            type="url"
                                            defaultValue={productData?.buy_link}
                                            variant="outlined"
                                            placeholder="https://example.com/purchase-link"
                                        />
                                    </FormSection>

                                    {/* Images Section */}
                                    <FormSection>
                                        <Typography variant="h6" sx={{ fontWeight: 600, color: '#212121', mb: 3 }}>
                                            Product Images* (required)
                                        </Typography>
                                        <label>
                                            <FileUploadBox>
                                                <input 
                                                    name="uploaded_images" 
                                                    type="file" 
                                                    multiple 
                                                    accept="image/*"
                                                    ref={fileInputRef}
                                                    // Do NOT add required here!
                                                />
                                                <CloudUpload sx={{ fontSize: 48, color: '#BDBDBD', mb: 2 }} />
                                                <Typography variant="body1" sx={{ fontWeight: 500, color: '#757575', mb: 1 }}>
                                                    Upload new images
                                                </Typography>
                                                <Typography variant="body2" sx={{ color: '#9E9E9E' }}>
                                                    Click to select multiple image files
                                                </Typography>
                                            </FileUploadBox>
                                        </label>
                                        <Alert severity="info" sx={{ mt: 2 }}>
                                            Upload new images to replace existing ones. Supported formats: JPG, PNG, WebP
                                        </Alert>
                                    </FormSection>

                                    {/* Action Buttons */}
                                    <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', pt: 2 }}>
                                        <Button
                                            variant="outlined"
                                            onClick={() => setIsShowMerchandiseForm(false)}
                                            sx={{ 
                                                borderRadius: '12px',
                                                px: 4,
                                                py: 1.5,
                                                fontWeight: 600,
                                                textTransform: 'none',
                                                borderColor: '#E0E0E0',
                                                color: '#757575',
                                                '&:hover': {
                                                    borderColor: '#BDBDBD',
                                                    backgroundColor: '#FAFAFA'
                                                }
                                            }}
                                        >
                                            Cancel
                                        </Button>
                                        <Button
                                            type="submit"
                                            variant="contained"
                                            startIcon={<Save />}
                                            sx={{ 
                                                borderRadius: '12px',
                                                px: 4,
                                                py: 1.5,
                                                fontWeight: 600,
                                                textTransform: 'none',
                                                backgroundColor: '#FF6B35',
                                                '&:hover': {
                                                    backgroundColor: '#E65100'
                                                }
                                            }}
                                        >
                                            Update Merchandise Details
                                        </Button>
                                    </Box>
                                </Stack>
                            </form>
                        </FormCard>
                    )}

                    {/* Notify Wishlisted Users Form */}
                    <Box sx={{ px: 4, pb: 4, mt: 6, maxWidth: 500, mx: "auto" }}>
                        <FormCard>
                            <Typography
                                variant="h6"
                                sx={{
                                    mb: 2,
                                    fontWeight: 600,
                                    color: "primary.main",
                                    textAlign: "center",
                                }}
                            >
                                Notify Wishlisted Users
                            </Typography>
                            <Box
                                component="form"
                                action={handleNotifyWishlistedUsers}
                                sx={{ display: "flex", flexDirection: "column", gap: 2 }}
                            >
                                <StyledTextField
                                    name="message"
                                    label="Message"
                                    variant="outlined"
                                    fullWidth
                                    required
                                    multiline
                                    rows={3}
                                    placeholder="Enter your message to wishlisted users"
                                />
                                <Button
                                    type="submit"
                                    variant="contained"
                                    size="large"
                                    sx={{
                                        mt: 1,
                                        px: 4,
                                        py: 1.5,
                                        borderRadius: 2,
                                        textTransform: "none",
                                        fontWeight: 600,
                                        fontSize: "1rem",
                                        alignSelf: "center",
                                        backgroundColor: "primary.main",
                                        "&:hover": {
                                            backgroundColor: "primary.dark",
                                        },
                                    }}
                                >
                                    Notify Wishlisted Users
                                </Button>
                            </Box>
                        </FormCard>
                    </Box>

                    {/* Success Snackbar */}
                    <Snackbar
                        open={notifySuccess}
                        autoHideDuration={4000}
                        onClose={() => setNotifySuccess(false)}
                        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
                    >
                        <Alert
                            onClose={() => setNotifySuccess(false)}
                            severity="success"
                            sx={{ width: "100%" }}
                        >
                            Notification sent to all wishlisted users!
                        </Alert>
                    </Snackbar>
                </Box>
            </Fade>
        </StyledContainer>
    );
}