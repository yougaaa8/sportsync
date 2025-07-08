import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Paper,
  Grid,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  Alert,
  CircularProgress,
  Divider,
  IconButton,
  Card,
  CardContent,
  Stack,
  InputAdornment,
  Fade,
  Backdrop
} from '@mui/material';
import {
  Edit as EditIcon,
  Save as SaveIcon,
  CloudUpload as CloudUploadIcon,
  AttachMoney as AttachMoneyIcon,
  Store as StoreIcon,
  Description as DescriptionIcon,
  Category as CategoryIcon,
  Link as LinkIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
import pullProductEdit from "../api-calls/pullProductEdit.js";
import editProductDetails from "../api-calls/editProductDetails.js";
import pullCCADetail from '../api-calls/pullCCADetail.js';

// Styled components matching SportSync theme
const StyledContainer = styled(Container)(({ theme }) => ({
  paddingTop: theme.spacing(4),
  paddingBottom: theme.spacing(6),
  minHeight: '80vh',
}));

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(5),
  borderRadius: theme.spacing(2),
  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
  border: '1px solid #e5e7eb',
  backgroundColor: '#ffffff',
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: theme.spacing(1.5),
    backgroundColor: '#ffffff',
    '&:hover .MuiOutlinedInput-notchedOutline': {
      borderColor: '#d1d5db',
    },
    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
      borderColor: '#6366f1',
      borderWidth: 2,
    },
  },
  '& .MuiInputLabel-root': {
    fontWeight: 500,
    color: '#374151',
    '&.Mui-focused': {
      color: '#6366f1',
    },
  },
  '& .MuiOutlinedInput-notchedOutline': {
    borderColor: '#d1d5db',
  },
}));

const StyledFormControl = styled(FormControl)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: theme.spacing(1.5),
    backgroundColor: '#ffffff',
    '&:hover .MuiOutlinedInput-notchedOutline': {
      borderColor: '#d1d5db',
    },
    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
      borderColor: '#6366f1',
      borderWidth: 2,
    },
  },
  '& .MuiInputLabel-root': {
    fontWeight: 500,
    color: '#374151',
    '&.Mui-focused': {
      color: '#6366f1',
    },
  },
  '& .MuiOutlinedInput-notchedOutline': {
    borderColor: '#d1d5db',
  },
}));

const StyledButton = styled(Button)(({ theme }) => ({
  borderRadius: theme.spacing(1.5),
  textTransform: 'none',
  fontWeight: 600,
  fontSize: '1rem',
  padding: theme.spacing(1.5, 4),
  backgroundColor: '#e67e22',
  color: '#ffffff',
  '&:hover': {
    backgroundColor: '#d35400',
  },
  '&:disabled': {
    backgroundColor: '#9ca3af',
    color: '#ffffff',
  },
}));

const FileUploadBox = styled(Box)(({ theme }) => ({
  border: '2px dashed #d1d5db',
  borderRadius: theme.spacing(2),
  padding: theme.spacing(6),
  textAlign: 'center',
  cursor: 'pointer',
  backgroundColor: '#f9fafb',
  transition: 'all 0.3s ease',
  '&:hover': {
    borderColor: '#6366f1',
    backgroundColor: '#f3f4f6',
  },
}));

const PageHeader = styled(Box)(({ theme }) => ({
  textAlign: 'center',
  marginBottom: theme.spacing(5),
  padding: theme.spacing(4, 0),
  backgroundColor: '#ffffff',
  borderRadius: theme.spacing(2),
  border: '1px solid #e5e7eb',
  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
}));

const FormSection = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(4),
}));

const SectionTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 600,
  color: '#374151',
  marginBottom: theme.spacing(3),
  fontSize: '1.25rem',
  borderBottom: '2px solid #e5e7eb',
  paddingBottom: theme.spacing(1),
}));

const StatusChip = styled(Chip)(({ theme, status }) => ({
  fontWeight: 600,
  borderRadius: theme.spacing(1),
  backgroundColor: status === 'true' ? '#10b981' : '#ef4444',
  color: 'white',
  '&:hover': {
    backgroundColor: status === 'true' ? '#059669' : '#dc2626',
  },
}));

export default function ProductEditLayout() {
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(null);
    const { productId } = useParams();
    const navigate = useNavigate()

    useEffect(() => {
        pullProductEdit(productId)
            .then(data => {
                setProduct(data);
                setLoading(false);
            })
            .catch(err => {
                setError('Failed to load product details');
                setLoading(false);
            });
    }, [productId]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setSubmitting(true);
        setError(null);

        try {
            const formData = new FormData(event.target);
            await editProductDetails(product.id, formData);
            setSuccess(true);
            setTimeout(() => setSuccess(false), 3000);
            setTimeout(() => {
                navigate(`/product-detail/${productId}`)
            }, 1000)
        } catch (err) {
            setError('Failed to update product');
        } finally {
            setSubmitting(false);
        }
    };

    // Get the array of user's CCA IDs from localStorage
    const ccaIds = JSON.parse(localStorage.getItem("ccaIds"))
    console.log("These are the CCA Ids for the user: ", ccaIds)

    const [ccaObjects, setCcaObjects] = useState(null)

    // Map over the array of CCA IDs to turn it into an array of CCA objects with
    // two fields: the cca ID and the cca name
    useEffect(() => {
        Promise.all(
            ccaIds.map(ccaId => (
                pullCCADetail(ccaId).then(result => ({
                    id: ccaId,
                    name: result.name
                }))
            ))
        ).then(setCcaObjects)
    }, [])

    console.log("These are the CCA objects that we have for this user: ", ccaObjects)

    // Map over the array of CCA objects to turn it into an array of option
    // components for the select in the form
    const ccas = ccaObjects?.map(ccaObject => (
        <MenuItem value={ccaObject.id}>{ccaObject.name}</MenuItem>
    ))

    if (loading) {
        return (
            <>
                <Navbar />
                <Container maxWidth="md" sx={{ py: 6, textAlign: 'center' }}>
                    <CircularProgress size={40} sx={{ color: '#e67e22' }} />
                    <Typography variant="h6" sx={{ mt: 2, color: '#6b7280' }}>
                        Loading product details...
                    </Typography>
                </Container>
                <Footer />
            </>
        );
    }

    return (
        <>
            <Navbar />
            <StyledContainer maxWidth="lg">
                <Fade in={true} timeout={600}>
                    <Box>
                        <PageHeader>
                            <EditIcon sx={{ fontSize: 36, mb: 2, color: '#e67e22' }} />
                            <Typography variant="h4" component="h1" sx={{ 
                                fontWeight: 600, 
                                mb: 1,
                                color: '#1f2937'
                            }}>
                                Edit Product Details
                            </Typography>
                            <Typography variant="body1" sx={{ 
                                color: '#6b7280',
                                fontWeight: 400,
                                fontSize: '1.1rem'
                            }}>
                                Update your product information
                            </Typography>
                        </PageHeader>

                        {error && (
                            <Alert severity="error" sx={{ mb: 4, borderRadius: 2 }}>
                                {error}
                            </Alert>
                        )}

                        {success && (
                            <Alert severity="success" sx={{ mb: 4, borderRadius: 2 }}>
                                Product updated successfully!
                            </Alert>
                        )}

                        {product && (
                            <StyledPaper elevation={0}>
                                <form onSubmit={handleSubmit}>
                                    {/* Basic Information Section */}
                                    <FormSection>
                                        <SectionTitle variant="h6">
                                            Basic Information
                                        </SectionTitle>
                                        <Grid container spacing={4}>
                                            <Grid item xs={12}>
                                                <StyledTextField
                                                    name="name"
                                                    label="Product Name"
                                                    defaultValue={product.name}
                                                    fullWidth
                                                    required
                                                    size="large"
                                                    InputProps={{
                                                        startAdornment: (
                                                            <InputAdornment position="start">
                                                                <StoreIcon sx={{ color: '#6b7280' }} />
                                                            </InputAdornment>
                                                        ),
                                                    }}
                                                />
                                            </Grid>
                                            <Grid item xs={12}>
                                                <StyledTextField
                                                    name="description"
                                                    label="Product Description"
                                                    defaultValue={product.description}
                                                    fullWidth
                                                    multiline
                                                    rows={4}
                                                    InputProps={{
                                                        startAdornment: (
                                                            <InputAdornment position="start" sx={{ alignSelf: 'flex-start', mt: 1 }}>
                                                                <DescriptionIcon sx={{ color: '#6b7280' }} />
                                                            </InputAdornment>
                                                        ),
                                                    }}
                                                />
                                            </Grid>
                                        </Grid>
                                    </FormSection>

                                    {/* Organization & Pricing Section */}
                                    <FormSection>
                                        <SectionTitle variant="h6">
                                            Organization & Pricing
                                        </SectionTitle>
                                        <Grid container spacing={4}>
                                            <Grid item xs={12} md={6}>
                                                <StyledFormControl fullWidth required>
                                                    <InputLabel id="cca-label">CCA/Organization</InputLabel>
                                                    <Select
                                                        labelId="cca-label"
                                                        name="cca"
                                                        label="CCA/Organization"
                                                        defaultValue={product.cca}
                                                    >
                                                        {ccas}
                                                    </Select>
                                                </StyledFormControl>
                                            </Grid>
                                            <Grid item xs={12} md={6}>
                                                <StyledTextField
                                                    name="price"
                                                    label="Price"
                                                    type="number"
                                                    defaultValue={product.price}
                                                    fullWidth
                                                    required
                                                    InputProps={{
                                                        startAdornment: (
                                                            <InputAdornment position="start">
                                                                <AttachMoneyIcon sx={{ color: '#6b7280' }} />
                                                            </InputAdornment>
                                                        ),
                                                    }}
                                                />
                                            </Grid>
                                        </Grid>
                                    </FormSection>

                                    {/* Availability & Links Section */}
                                    <FormSection>
                                        <SectionTitle variant="h6">
                                            Availability & Links
                                        </SectionTitle>
                                        <Grid container spacing={4}>
                                            <Grid item xs={12} md={6}>
                                                <StyledFormControl fullWidth>
                                                    <InputLabel>Availability Status</InputLabel>
                                                    <Select
                                                        name="available"
                                                        defaultValue={product.available}
                                                        label="Availability Status"
                                                    >
                                                        <MenuItem value={true}>
                                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                                <CheckCircleIcon sx={{ color: '#10b981', fontSize: 20 }} />
                                                                Available
                                                            </Box>
                                                        </MenuItem>
                                                        <MenuItem value={false}>
                                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                                <CancelIcon sx={{ color: '#ef4444', fontSize: 20 }} />
                                                                Unavailable
                                                            </Box>
                                                        </MenuItem>
                                                    </Select>
                                                </StyledFormControl>
                                            </Grid>
                                            <Grid item xs={12} md={6}>
                                                <StyledTextField
                                                    name="buy_link"
                                                    label="Purchase Link"
                                                    defaultValue={product.buy_link}
                                                    fullWidth
                                                    type="url"
                                                    placeholder="https://example.com/product"
                                                    InputProps={{
                                                        startAdornment: (
                                                            <InputAdornment position="start">
                                                                <LinkIcon sx={{ color: '#6b7280' }} />
                                                            </InputAdornment>
                                                        ),
                                                    }}
                                                />
                                            </Grid>
                                        </Grid>
                                    </FormSection>

                                    {/* Product Images Section */}
                                    <FormSection>
                                        <SectionTitle variant="h6">
                                            Product Images
                                        </SectionTitle>
                                        <FileUploadBox component="label">
                                            <input
                                                type="file"
                                                name="uploaded_images"
                                                multiple
                                                accept="image/*"
                                                style={{ display: 'none' }}
                                            />
                                            <CloudUploadIcon sx={{ fontSize: 48, color: '#6b7280', mb: 2 }} />
                                            <Typography variant="h6" sx={{ mb: 1, color: '#374151', fontWeight: 500 }}>
                                                Upload Product Images
                                            </Typography>
                                            <Typography variant="body1" sx={{ color: '#6b7280', mb: 2 }}>
                                                Click to select files or drag and drop
                                            </Typography>
                                            <Typography variant="body2" sx={{ color: '#9ca3af' }}>
                                                Supports: JPG, PNG, GIF (Max 5MB each)
                                            </Typography>
                                        </FileUploadBox>
                                    </FormSection>

                                    {/* Submit Button */}
                                    <Box sx={{ pt: 4 }}>
                                        <Divider sx={{ mb: 4 }} />
                                        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                                            <StyledButton
                                                type="submit"
                                                variant="contained"
                                                size="large"
                                                disabled={submitting}
                                                startIcon={submitting ? <CircularProgress size={20} /> : <SaveIcon />}
                                                sx={{
                                                    minWidth: 200,
                                                    py: 2,
                                                    fontSize: '1.1rem',
                                                }}
                                            >
                                                {submitting ? 'Updating...' : 'Update Product'}
                                            </StyledButton>
                                        </Box>
                                    </Box>
                                </form>
                            </StyledPaper>
                        )}
                    </Box>
                </Fade>
            </StyledContainer>
            <Footer />
        </>
    );
}