import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  components: {
    MuiTypography: {
      variants: [
        {
          props: { variant: 'h1' },
          style: {
            fontSize: '24px',
            fontWeight: 'bold',
            color: '#F59E0B',
            textAlign: 'center',
            marginBottom: '16px',
          },
        },
        {
          props: { variant: 'h2' },
          style: {
            fontSize: '18px',
            fontWeight: 500,
            color: '#666',
            marginBottom: '8px',
          },
        },
        {
          props: { variant: 'h3' },
          style: {
            fontSize: '14px',
            lineHeight: 1.6,
            color: '#999',
          },
        },
      ],
    },
  },
});

export default theme;