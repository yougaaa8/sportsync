import React, { useState, useEffect } from 'react';
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
import listNewProduct from '../api-calls/listNewProduct.js';
import "../stylesheets/new-product-form.css"
import pullCCADetail from '../api-calls/pullCCADetail.js';
import { useNavigate } from 'react-router-dom';

export default function NewProductForm() {
    const [ccaObjects, setCcaObjects] = useState([]);
    const [buttonPlaceholder, setButtonPlaceholder] = useState("Add Product")
    const navigate = useNavigate()

    const [formData, setFormData] = useState({
        name: '',
        cca: '',
        price: '',
        availability: 'Available',
        image: null
    });
    
    const [imagePreview, setImagePreview] = useState(null);
    const [submitted, setSubmitted] = useState(false);

    const handleInputChange = (field) => (event) => {
        setFormData(prev => ({
            ...prev,
            [field]: event.target.value
        }));
    };

    const handleImageUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            setFormData(prev => ({
                ...prev,
                image: file
            }));
            
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const resetForm = () => {
        setFormData({
            name: '',
            cca: '',
            price: '',
            availability: 'Available',
            image: null
        });
        setImagePreview(null);
        setSubmitted(false);
    };

    const getStatusClass = (availability) => {
        switch (availability) {
            case 'Available': return 'status-available';
            case 'Out of stock': return 'status-out-of-stock';
            case 'Pre-Order': return 'status-pre-order';
            case 'Upcoming': return 'status-upcoming';
            default: return 'status-available';
        }
    };

    async function listNewProductClick(formData) {
        console.log("Listing...")
        try {
            const response = await listNewProduct(formData)
            console.log("Successfully listed new product:", response);
            setButtonPlaceholder("Successfully listed new product")
            setTimeout(() => {
                navigate("/merchandise-shop")
            }, 1000)
        }
        catch (error) {
            console.error("Error listing new product:", error);
            setButtonPlaceholder("Failed to list new product")
            setTimeout(() => {
                window.location.reload()
            }, 1000)
        }
    }

    // Get the array of the user's CCA ids from localStorage
    const ccaIds = JSON.parse(localStorage.getItem("ccaIds"))

    // Map the CCA ids into objects that encapsulate the CCA id and name, using the API call
    // to get the CCA name from the id
    useEffect(() => {
        async function fetchCcaObjects() {
            const objects = await Promise.all(
                ccaIds.map(async ccaId => {
                    const ccaDetail = await pullCCADetail(ccaId)
                    return { id: ccaId, name: ccaDetail.name}
                })
            )
            setCcaObjects(objects)
        }
        fetchCcaObjects()
    }, [])
    

    console.log("These are the CCA objects we have retrieved: ", ccaObjects)
    // Map the CCA objects into options for the select input
    const ccaOptions = ccaObjects.map(cca => {
        return (
            <option value={cca.id}>{cca.name}</option>
        )
    })

    return (
        <>
            <Navbar />
            <div className="page-container">
                <div className="container">
                    <div className="page-header">
                        <h1 className="page-header-title">List a New Product</h1>
                    </div>

                    {/* Quick Stats */}
                    <div className="stats-grid">
                        <div className="stat-card">
                            <div className="stat-value">23</div>
                            <div className="stat-label">Total Products</div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-value">18</div>
                            <div className="stat-label">Available Now</div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-value stat-highlight">$8.33</div>
                            <div className="stat-label">Average Price</div>
                        </div>
                    </div>

                    <div className="form-card">
                        <div className="form-header">
                            <h2 className="form-header-title">🏪 Add New Product</h2>
                            <p className="form-header-desc">Fill in the details below to add a new product to the store</p>
                        </div>

                        <div className="form-body">
                            {submitted && (
                                <div className="success-message">
                                    ✅ Product successfully added to the SportSync store!
                                </div>
                            )}

                            <form className="product-form" action={listNewProductClick}>
                                <div className="form-group">
                                    <label htmlFor="name">Product Name *</label>
                                    <input
                                        type="text"
                                        id="name"
                                        value={formData.name}
                                        onChange={handleInputChange('name')}
                                        placeholder="Enter product name"
                                        required
                                        name="name"
                                        className="input"
                                    />
                                </div>

                                <div className="form-row">
                                    <div className="form-group">
                                        <label htmlFor="cca">CCA *</label>
                                        <select
                                            type="text"
                                            id="cca"
                                            value={formData.cca}
                                            onChange={handleInputChange('cca')}
                                            placeholder="e.g., NUS Basketball"
                                            required
                                            name="cca"
                                            className="input">
                                                {ccaOptions}
                                        </select>
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="price">Price ($) *</label>
                                        <input
                                            type="number"
                                            id="price"
                                            value={formData.price}
                                            onChange={handleInputChange('price')}
                                            placeholder="0.00"
                                            step="0.01"
                                            min="0"
                                            required
                                            name="price"
                                            className="input"
                                        />
                                    </div>
                                </div>

                                <div className="form-row">
                                    <div className="form-group">
                                        <label htmlFor="availability">Availability Status</label>
                                        <select
                                            id="availability"
                                            value={formData.availability}
                                            onChange={handleInputChange('availability')}
                                            required
                                            name="available"
                                            className="input"
                                        >
                                            <option value={true}>Available</option>
                                            <option value={false}>Out of stock</option>
                                            <option value={false}>Pre-Order</option>
                                            <option value={false}>Upcoming</option>
                                        </select>
                                        <div className="availability-preview">
                                            <div className={`availability-status ${getStatusClass(formData.availability)}`}>
                                                {formData.availability}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="form-group">
                                        <label>Product Image</label>
                                        <div className="upload-area" onClick={() => document.getElementById('image').click()}>
                                            <div className="upload-icon">📸</div>
                                            <div className="upload-text">
                                                {imagePreview ? 'Change image' : 'Upload image'}
                                            </div>
                                            <input
                                                type="file"
                                                id="image"
                                                onChange={handleImageUpload}
                                                accept="image/*"
                                                name="uploaded_images"
                                                className="input"
                                            />
                                        </div>
                                    </div>

                                    <label>Description: </label>
                                    <input name="description" />

                                    <label>Link for purchase: </label>
                                    <input name="buy_link" />
                                </div>

                                {imagePreview && (
                                    <div className="preview-area">
                                        <h4 className="preview-title">Preview</h4>
                                        <img
                                            src={imagePreview}
                                            alt="Product preview"
                                            className="preview-image"
                                        />
                                    </div>
                                )}
                                <div className="button-group">
                                    <button type="submit" className="btn btn-primary">
                                        ✅ {buttonPlaceholder}
                                    </button>
                                    <button type="button" className="btn btn-secondary" onClick={resetForm}>
                                        ↩️ Reset Form
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
}