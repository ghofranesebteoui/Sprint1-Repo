import { createTheme } from "@mui/material/styles";

// Palette bleue dominante - inspirée du design moderne
export const colors = {
  // Couleurs principales - Tons bleus
  blue50: "#EDF4FF",
  blue100: "#DAEAFF",
  blue200: "#BAD4FF",
  blue300: "#88B8FF",
  blue400: "#529BF5",
  blue500: "#2575E8",
  blue600: "#1A62D4",
  blue700: "#1050B0",

  // Accents secondaires
  coral: "#FF6B47",
  coralLight: "#FFF0EC",
  teal: "#2DC9B4",
  tealLight: "#E0FAF7",
  purple: "#9B8EC4",
  purpleLight: "#EDE9FF",
  orange: "#FF9A3C",
  orangeLight: "#FFF0DC",
  amber: "#F5A623",
  green: "#22C55E",
  greenLight: "#E8FAF0",
  greenTrend: "#1DB954",

  // Surfaces - fond bleu glacé très doux
  bg: "#F0F6FF",
  cream: "#EAF2FF",
  cream2: "#D8EAFF",
  white: "#FFFFFF",
  border: "#C8DCFF",
  border2: "#B0CCFF",

  // Texte
  text: {
    primary: "#0C1B3E",
    secondary: "#243860",
    tertiary: "#5D7AAA",
    quaternary: "#9DB8D8",
    white: "#FFFFFF",
  },

  // Couleurs de statut
  success: "#22C55E",
  warning: "#F59E0B",
  error: "#EF4444",
  info: "#60A5FA",
  red: "#EF4444",
  amberStatus: "#F59E0B",

  // Gradients
  gradientMain: "linear-gradient(135deg, #2575E8 0%, #1050B0 100%)",
  gradientCoral: "linear-gradient(135deg, #FF6B47 0%, #FF8A6A 100%)",
  gradientTeal: "linear-gradient(135deg, #2DC9B4 0%, #26B5A2 100%)",
  gradientIndigo: "linear-gradient(135deg, #6B73E0 0%, #5560CC 100%)",
  gradientBlue: "linear-gradient(135deg, #2575E8 0%, #1050B0 100%)",

  // Ombres
  shadowXs: "0 1px 4px rgba(20, 90, 200, 0.07)",
  shadowSm: "0 2px 14px rgba(20, 90, 200, 0.1)",
  shadowMd: "0 6px 26px rgba(20, 90, 200, 0.14)",
  shadowLg: "0 18px 50px rgba(20, 90, 200, 0.18)",
  shadowCoral: "0 6px 20px rgba(255, 107, 71, 0.28)",
  shadowBlue: "0 6px 20px rgba(37, 117, 232, 0.32)",
};

export const theme = createTheme({
  palette: {
    primary: {
      main: colors.blue500,
      light: colors.blue300,
      dark: colors.blue700,
    },
    secondary: {
      main: colors.teal,
      light: colors.tealLight,
      dark: "#26B5A2",
    },
    success: {
      main: colors.success,
    },
    warning: {
      main: colors.warning,
    },
    error: {
      main: colors.error,
    },
    info: {
      main: colors.info,
    },
    background: {
      default: colors.bg,
      paper: colors.white,
    },
    text: {
      primary: colors.text.primary,
      secondary: colors.text.secondary,
    },
  },
  typography: {
    fontFamily:
      '"Nunito Sans", "Nunito", "Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontFamily: '"Nunito", sans-serif',
      fontSize: "2.5rem",
      fontWeight: 900,
      letterSpacing: "0.5px",
    },
    h2: {
      fontFamily: '"Nunito", sans-serif',
      fontSize: "2rem",
      fontWeight: 800,
      letterSpacing: "-0.3px",
    },
    h3: {
      fontSize: "1.75rem",
      fontWeight: 700,
    },
    h4: {
      fontSize: "1.5rem",
      fontWeight: 700,
    },
    h5: {
      fontSize: "1.25rem",
      fontWeight: 700,
    },
    h6: {
      fontSize: "1rem",
      fontWeight: 700,
    },
    button: {
      textTransform: "none",
      fontWeight: 800,
    },
  },
  shape: {
    borderRadius: 14,
  },
  shadows: [
    "none",
    colors.shadowXs,
    colors.shadowSm,
    colors.shadowMd,
    colors.shadowLg,
    colors.shadowBlue,
    colors.shadowCoral,
    "0 24px 64px rgba(20, 90, 200, 0.20)",
    ...Array(17).fill("none"),
  ],
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 22,
          padding: "10px 24px",
          fontSize: "0.95rem",
          fontWeight: 800,
          boxShadow: "none",
          "&:hover": {
            boxShadow: colors.shadowBlue,
            transform: "translateY(-2px)",
          },
        },
        contained: {
          background: colors.gradientBlue,
          color: "#FFFFFF",
          "&:hover": {
            background: colors.blue600,
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 18,
          boxShadow: colors.shadowSm,
          border: "none",
          transition: "all 0.3s ease",
          "&:hover": {
            boxShadow: colors.shadowMd,
            transform: "translateY(-4px)",
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            borderRadius: 11,
            backgroundColor: colors.cream,
            border: `1.5px solid ${colors.border}`,
            "&:hover fieldset": {
              borderColor: colors.blue500,
            },
            "&.Mui-focused fieldset": {
              borderColor: colors.blue500,
            },
          },
        },
      },
    },
  },
});

export default theme;
