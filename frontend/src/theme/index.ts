import { createTheme } from "@mui/material/styles";

// Define custom color palette
const colors = {
  primary: {
    main: "#FF6B35", // Professional orange - warmer and more sophisticated
    light: "#FF8A65", // Lighter orange for hover states
    dark: "#E65100", // Darker orange for emphasis
    contrastText: "#FFFFFF",
  },
  secondary: {
    main: "#1A237E", // Dark blue similar to NUS blue
    light: "#3949AB", // Lighter blue for accents
    dark: "#0D47A1", // Very dark blue
    contrastText: "#FFFFFF",
  },
  background: {
    default: "#FAFAFA", // Very light gray instead of pure white
    paper: "#FFFFFF", // Pure white for cards and surfaces
  },
  text: {
    primary: "#212121", // Dark gray for primary text
    secondary: "#757575", // Medium gray for secondary text
    disabled: "#BDBDBD", // Light gray for disabled text
  },
  grey: {
    50: "#FAFAFA",
    100: "#F5F5F5",
    200: "#EEEEEE",
    300: "#E0E0E0",
    400: "#BDBDBD",
    500: "#9E9E9E",
    600: "#757575",
    700: "#616161",
    800: "#424242",
    900: "#212121",
  },
};

// Create the theme
const theme = createTheme({
  palette: {
    mode: "light",
    primary: colors.primary,
    secondary: colors.secondary,
    background: colors.background,
    text: colors.text,
    grey: colors.grey,
    success: {
      main: "#4CAF50",
      light: "#81C784",
      dark: "#388E3C",
    },
    warning: {
      main: "#FF9800",
      light: "#FFB74D",
      dark: "#F57C00",
    },
    error: {
      main: "#F44336",
      light: "#EF5350",
      dark: "#D32F2F",
    },
    info: {
      main: "#2196F3",
      light: "#64B5F6",
      dark: "#1976D2",
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: "2.5rem",
      fontWeight: 700,
      lineHeight: 1.2,
      color: colors.text.primary,
    },
    h2: {
      fontSize: "2rem",
      fontWeight: 600,
      lineHeight: 1.3,
      color: colors.text.primary,
    },
    h3: {
      fontSize: "1.5rem",
      fontWeight: 600,
      lineHeight: 1.4,
      color: colors.text.primary,
    },
    h4: {
      fontSize: "1.25rem",
      fontWeight: 600,
      lineHeight: 1.4,
      color: colors.text.primary,
    },
    h5: {
      fontSize: "1.125rem",
      fontWeight: 600,
      lineHeight: 1.4,
      color: colors.text.primary,
    },
    h6: {
      fontSize: "1rem",
      fontWeight: 600,
      lineHeight: 1.4,
      color: colors.text.primary,
    },
    body1: {
      fontSize: "1rem",
      lineHeight: 1.6,
      color: colors.text.primary,
    },
    body2: {
      fontSize: "0.875rem",
      lineHeight: 1.6,
      color: colors.text.secondary,
    },
    button: {
      textTransform: "none",
      fontWeight: 600,
      fontSize: "0.875rem",
    },
    caption: {
      fontSize: "0.75rem",
      lineHeight: 1.5,
      color: colors.text.secondary,
    },
  },
  shape: {
    borderRadius: 12, // More rounded corners for modern look
  },
  spacing: 8, // Default MUI spacing
  components: {
    // Button component customization
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: "10px 24px",
          boxShadow: "none",
          textTransform: "none",
          fontWeight: 600,
          transition: "all 0.2s ease-in-out",
          "&:hover": {
            transform: "translateY(-2px)",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
          },
        },
        containedPrimary: {
          background: `linear-gradient(135deg, ${colors.primary.main} 0%, ${colors.primary.dark} 100%)`,
          "&:hover": {
            background: `linear-gradient(135deg, ${colors.primary.light} 0%, ${colors.primary.main} 100%)`,
          },
        },
        containedSecondary: {
          background: `linear-gradient(135deg, ${colors.secondary.main} 0%, ${colors.secondary.dark} 100%)`,
          "&:hover": {
            background: `linear-gradient(135deg, ${colors.secondary.light} 0%, ${colors.secondary.main} 100%)`,
          },
        },
        outlined: {
          borderWidth: 2,
          "&:hover": {
            borderWidth: 2,
          },
        },
      },
    },
    // Card component customization
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: "0 2px 12px rgba(0, 0, 0, 0.08)",
          border: "1px solid #F0F0F0",
          transition: "all 0.3s ease-in-out",
          "&:hover": {
            transform: "translateY(-4px)",
            boxShadow: "0 8px 25px rgba(0, 0, 0, 0.12)",
          },
        },
      },
    },
    // Paper component customization
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.06)",
        },
        elevation1: {
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.06)",
        },
        elevation2: {
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
        },
        elevation3: {
          boxShadow: "0 8px 25px rgba(0, 0, 0, 0.12)",
        },
      },
    },
    // AppBar customization
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: colors.background.paper,
          color: colors.text.primary,
          boxShadow: "0 2px 12px rgba(0, 0, 0, 0.08)",
          borderBottom: "1px solid #F0F0F0",
        },
      },
    },
    // Chip customization
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          fontWeight: 500,
        },
        colorPrimary: {
          backgroundColor: colors.primary.main,
          color: colors.primary.contrastText,
        },
        colorSecondary: {
          backgroundColor: colors.secondary.main,
          color: colors.secondary.contrastText,
        },
      },
    },
    // TextField customization
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            borderRadius: 8,
            "&:hover .MuiOutlinedInput-notchedOutline": {
              borderColor: colors.primary.main,
            },
            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
              borderColor: colors.primary.main,
            },
          },
        },
      },
    },
    // Tabs customization
    MuiTabs: {
      styleOverrides: {
        root: {
          borderBottom: "1px solid #E0E0E0",
        },
        indicator: {
          backgroundColor: colors.primary.main,
          height: 3,
          borderRadius: 2,
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: "none",
          fontWeight: 600,
          fontSize: "0.875rem",
          color: colors.text.secondary,
          "&.Mui-selected": {
            color: colors.primary.main,
          },
        },
      },
    },
    // Avatar customization
    MuiAvatar: {
      styleOverrides: {
        root: {
          backgroundColor: colors.primary.main,
          color: colors.primary.contrastText,
          fontWeight: 600,
        },
      },
    },
    // Badge customization
    MuiBadge: {
      styleOverrides: {
        badge: {
          backgroundColor: colors.primary.main,
          color: colors.primary.contrastText,
          fontWeight: 600,
        },
      },
    },
  },
  shadows: [
    "none",
    "0 2px 4px rgba(0, 0, 0, 0.05)",
    "0 2px 8px rgba(0, 0, 0, 0.06)",
    "0 4px 12px rgba(0, 0, 0, 0.08)",
    "0 6px 16px rgba(0, 0, 0, 0.10)",
    "0 8px 25px rgba(0, 0, 0, 0.12)",
    "0 12px 35px rgba(0, 0, 0, 0.14)",
    "0 16px 45px rgba(0, 0, 0, 0.16)",
    "0 20px 55px rgba(0, 0, 0, 0.18)",
    "0 24px 65px rgba(0, 0, 0, 0.20)",
    "0 28px 75px rgba(0, 0, 0, 0.22)",
    "0 32px 85px rgba(0, 0, 0, 0.24)",
    "0 36px 95px rgba(0, 0, 0, 0.26)",
    "0 40px 105px rgba(0, 0, 0, 0.28)",
    "0 44px 115px rgba(0, 0, 0, 0.30)",
    "0 48px 125px rgba(0, 0, 0, 0.32)",
    "0 52px 135px rgba(0, 0, 0, 0.34)",
    "0 56px 145px rgba(0, 0, 0, 0.36)",
    "0 60px 155px rgba(0, 0, 0, 0.38)",
    "0 64px 165px rgba(0, 0, 0, 0.40)",
    "0 68px 175px rgba(0, 0, 0, 0.42)",
    "0 72px 185px rgba(0, 0, 0, 0.44)",
    "0 76px 195px rgba(0, 0, 0, 0.46)",
    "0 80px 205px rgba(0, 0, 0, 0.48)",
    "0 84px 215px rgba(0, 0, 0, 0.50)",
  ],
});

export default theme;