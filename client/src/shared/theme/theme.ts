import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#008a5e",
      dark: "#016646",
      light: "#1BB262",
      contrastText: "#FFFFFF",
    },
    secondary: {
      main: "#F5F6F9", // Button gray
      contrastText: "#008a5e",
    },
    error: {
      main: "#C2473B",
    },
    warning: {
      main: "#ed9111",
    },
    success: {
      main: "#26A761",
    },
    text: {
      primary: "#151515",
      secondary: "#9195A4", // Text gray
    },

    divider: "#F0EFF3",
  },
  typography: {
    fontFamily: "'Mulish', sans-serif",
    h2: {
      fontSize: "2rem", // 32px
      fontWeight: 800,
      lineHeight: 1.25,
    },
    h3: {
      fontSize: "1.5rem", // 24px
      fontWeight: 900,
      lineHeight: 1.33,
    },
    h4: {
      fontSize: "1rem", // 16px
      lineHeight: 1.5,
      fontWeight: 400,
    },
    h5: {
      fontSize: "1.125rem", // 18px
      lineHeight: 1.33,
      fontWeight: 600,
    },
    subtitle1: {
      fontWeight: 600,
      fontSize: "0.875rem", // 14px
      lineHeight: 1.43,
    },
    subtitle2: {
      fontWeight: 400,
      fontSize: "0.875rem", // 14px
      lineHeight: 1.43,
    },
    body2: {
      fontWeight: 400,
      fontSize: "0.75rem", // 12px
      lineHeight: 1.67,
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: "#3D3D44",
          color: "white",
          fontSize: "0.875rem",
          lineHeight: 1.43,
          px: 8,
          py: 4,
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          boxShadow: "none",
          textTransform: "none",
          fontWeight: 600,
          padding: "12px",
          "&:hover": {
            boxShadow: "none",
          },
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: "#008a5e",
          },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderWidth: 1,
          },
        },
        notchedOutline: {
          borderColor: "#EBEBED",
        },
        input: {
          padding: "14px 16px",
          fontSize: "0.875rem",
          "&::placeholder": {
            color: "#B1B5C3",
            opacity: 1,
          },
        },
      },
    },
  },
  spacing: (factory: any) => `${factory * 0.0625}rem`, // if factory = 1 => 0.0625rem ~ 1px (covert px units to rem)
});

export default theme;
