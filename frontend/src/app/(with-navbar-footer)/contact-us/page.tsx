"use client"

import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  CircularProgress,
  Avatar,
  SelectChangeEvent
} from '@mui/material';
import {
  Email as EmailIcon,
  LocationOn as LocationIcon,
  Group as GroupIcon,
  CheckCircle as CheckCircleIcon,
} from '@mui/icons-material';

export default function ContactUs() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSelectChange = (e: SelectChangeEvent<string>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = () => {
    // Basic validation
    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      alert('Please fill in all required fields');
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      setSubmitted(true);
      setIsSubmitting(false);
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
    }, 1500);
  };

  if (submitted) {
    return (
      <Box sx={{ 
        minHeight: '100vh', 
        bgcolor: 'background.default',
        py: 8,
        px: 2
      }}>
        <Container maxWidth="md">
          <Paper 
            elevation={3} 
            sx={{ 
              p: 6, 
              textAlign: 'center',
              borderRadius: 3
            }}
          >
            <Avatar 
              sx={{ 
                width: 80, 
                height: 80, 
                bgcolor: 'success.main', 
                mx: 'auto', 
                mb: 3,
                fontSize: '2rem'
              }}
            >
              <CheckCircleIcon fontSize="large" />
            </Avatar>
            
            <Typography variant="h3" gutterBottom color="text.primary">
              Message Sent Successfully!
            </Typography>
            
            <Typography variant="body1" color="text.secondary" sx={{ mb: 4, fontSize: '1.1rem' }}>
              Thank you for contacting SportSync. We&apos;ll get back to you within 24 hours.
            </Typography>
            
            <Button 
              variant="contained" 
              size="large"
              onClick={() => setSubmitted(false)}
              sx={{ 
                px: 4, 
                py: 1.5,
                fontSize: '1rem'
              }}
            >
              Send Another Message
            </Button>
          </Paper>
        </Container>
      </Box>
    );
  }

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      bgcolor: 'background.default',
      py: 8,
      px: 2
    }}>
      <Container maxWidth="xl">
        {/* Header */}
        <Box sx={{ textAlign: 'center', mb: 8 }}>
          <Typography 
            variant="h2" 
            component="h1" 
            gutterBottom
            sx={{ 
              fontWeight: 700,
              fontSize: { xs: '2.5rem', md: '3.5rem' },
              mb: 3
            }}
          >
            Contact SportSync
          </Typography>
          <Typography 
            variant="h6" 
            color="text.secondary"
            sx={{ 
              maxWidth: '600px', 
              mx: 'auto',
              fontSize: '1.2rem',
              lineHeight: 1.6
            }}
          >
            Have questions or feedback? We&apos;d love to hear from you and help make your sports experience better.
          </Typography>
        </Box>

        <Box sx={{ 
          display: 'flex', 
          flexDirection: { xs: 'column', lg: 'row' },
          gap: 4,
          alignItems: 'flex-start'
        }}>
          {/* Contact Info */}
          <Box sx={{ flex: { lg: '0 0 400px' } }}>
            <Paper elevation={2} sx={{ p: 4, height: 'fit-content' }}>
              <Typography variant="h4" gutterBottom sx={{ mb: 3, fontWeight: 600 }}>
                Get in Touch
              </Typography>
              
              <Box sx={{ mb: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 3 }}>
                  <Avatar sx={{ bgcolor: 'primary.light', mr: 2, mt: 0.5 }}>
                    <EmailIcon />
                  </Avatar>
                  <Box>
                    <Typography variant="h6" gutterBottom>
                      Email
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      E1398508@u.nus.edu
                    </Typography>
                  </Box>
                </Box>
                
                <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 3 }}>
                  <Avatar sx={{ bgcolor: 'primary.light', mr: 2, mt: 0.5 }}>
                    <LocationIcon />
                  </Avatar>
                  <Box>
                    <Typography variant="h6" gutterBottom>
                      Location
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      National University of Singapore
                    </Typography>
                  </Box>
                </Box>
                
                <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                  <Avatar sx={{ bgcolor: 'primary.light', mr: 2, mt: 0.5 }}>
                    <GroupIcon />
                  </Avatar>
                  <Box>
                    <Typography variant="h6" gutterBottom>
                      Team
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Made Yoga Chantiswara
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Alexander Gerald
                    </Typography>
                  </Box>
                </Box>
              </Box>              
            </Paper>
          </Box>

          {/* Contact Form */}
          <Box sx={{ flex: 1 }}>
            <Paper elevation={2} sx={{ p: 4 }}>
              <Typography variant="h4" gutterBottom sx={{ mb: 3, fontWeight: 600 }}>
                Send us a Message
              </Typography>
              
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <Box sx={{ 
                  display: 'flex', 
                  flexDirection: { xs: 'column', md: 'row' },
                  gap: 2
                }}>
                  <TextField
                    fullWidth
                    label="Name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="Your full name"
                    variant="outlined"
                  />
                  
                  <TextField
                    fullWidth
                    label="Email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="your.email@u.nus.edu"
                    variant="outlined"
                  />
                </Box>

                <FormControl fullWidth required>
                  <InputLabel>Subject</InputLabel>
                  <Select
                    name="subject"
                    value={formData.subject}
                    onChange={handleSelectChange}
                    label="Subject"
                  >
                    <MenuItem value="bug-report">Bug Report</MenuItem>
                    <MenuItem value="feature-request">Feature Request</MenuItem>
                    <MenuItem value="cca-partnership">CCA Partnership</MenuItem>
                    <MenuItem value="technical-support">Technical Support</MenuItem>
                    <MenuItem value="general-inquiry">General Inquiry</MenuItem>
                    <MenuItem value="other">Other</MenuItem>
                  </Select>
                </FormControl>

                <TextField
                  fullWidth
                  label="Message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  multiline
                  rows={6}
                  placeholder="Tell us more about your inquiry..."
                  variant="outlined"
                />

                <Button
                  variant="contained"
                  size="large"
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  sx={{ 
                    py: 2,
                    fontSize: '1.1rem',
                    fontWeight: 600,
                    mt: 2
                  }}
                >
                  {isSubmitting ? (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <CircularProgress size={20} color="inherit" />
                      Sending...
                    </Box>
                  ) : (
                    'Send Message'
                  )}
                </Button>
              </Box>
            </Paper>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}