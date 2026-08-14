import { createTheme } from '@mui/material/styles';

export const getAppTheme = (mode = 'dark') => {
  const isDark = mode === 'dark';

  return createTheme({
    palette: {
      mode,
      primary: {
        main: '#6366F1', // Indigo Vibrant Accent
        light: '#818CF8',
        dark: '#4F46E5',
        contrastText: '#FFFFFF',
      },
      secondary: {
        main: '#EC4899', // Pinkish Coral Accent
        light: '#F472B6',
        dark: '#DB2777',
        contrastText: '#FFFFFF',
      },
      success: {
        main: '#10B981', // Emerald Online Badge
      },
      background: {
        default: isDark ? '#0B0F19' : '#F3F4F6',
        paper: isDark ? '#111827' : '#FFFFFF',
        subtle: isDark ? '#1F2937' : '#F9FAFB',
        glass: isDark ? 'rgba(17, 24, 39, 0.75)' : 'rgba(255, 255, 255, 0.85)',
      },
      text: {
        primary: isDark ? '#F9FAFB' : '#111827',
        secondary: isDark ? '#9CA3AF' : '#6B7280',
      },
      divider: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)',
    },
    typography: {
      fontFamily: "'Plus Jakarta Sans', 'Roboto', sans-serif",
      h5: {
        fontWeight: 700,
        letterSpacing: '-0.02em',
      },
      h6: {
        fontWeight: 600,
        letterSpacing: '-0.01em',
      },
      subtitle1: {
        fontWeight: 600,
      },
      button: {
        textTransform: 'none',
        fontWeight: 600,
      },
    },
    shape: {
      borderRadius: 16,
    },
    components: {
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: 'none',
            backdropFilter: 'blur(16px)',
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: '12px',
            boxShadow: 'none',
            padding: '8px 18px',
            '&:hover': {
              boxShadow: '0 4px 14px 0 rgba(99, 102, 241, 0.39)',
            },
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: {
            fontWeight: 600,
            borderRadius: '8px',
          },
        },
      },
      MuiTextField: {
        styleOverrides: {
          root: {
            '& .MuiOutlinedInput-root': {
              borderRadius: '14px',
            },
          },
        },
      },
    },
  });
};
