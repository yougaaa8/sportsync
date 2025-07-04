import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  typography: {
    h1: {
      fontSize: '24px',
      fontWeight: 'bold',
      color: '#F59E0B',
      textAlign: 'center',
      marginBottom: '16px',
    },
    h2: {
      fontSize: '18px',
      fontWeight: 500,
      color: '#666',
      marginBottom: '8px',
    },
    h3: {
      fontSize: '14px',
      lineHeight: 1.6,
      color: '#999',
    },
  },
});

export default theme;