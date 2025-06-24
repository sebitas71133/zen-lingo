import { createTheme } from "@mui/material/styles";
import { ThemeProvider } from "@emotion/react";
import { CssBaseline } from "@mui/material";
import { useSelector } from "react-redux";
import "@fontsource/orbitron"; // Asegura la fuente Cyberpunk

export const Apptheme = ({ children }) => {
  const { darkMode } = useSelector((state) => state.theme);

  const theme = createTheme({
    palette: {
      mode: darkMode ? "dark" : "light",
      primary: {
        main: darkMode ? "#38BDF8" : "#007ACC", // Azul cielo suave
      },
      secondary: {
        main: darkMode ? "#8B5CF6" : "#FF477E", // Púrpura suave
      },
      background: {
        default: darkMode ? "#0F172A" : "#F8FAFC", // Azul grisáceo muy oscuro
        paper: darkMode ? "rgba(30, 41, 59, 0.9)" : "rgba(255, 255, 255, 0.85)",
      },
      text: {
        primary: darkMode ? "#E2E8F0" : "#1A1A1A", // Gris claro
        secondary: darkMode ? "#94A3B8" : "#444444", // Gris medio
      },
    },
    typography: {
      fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    },
    components: {
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundColor: darkMode
              ? "rgba(30, 41, 59, 0.9)"
              : "rgba(255, 255, 255, 0.85)",
            border: darkMode ? "1px solid #38BDF8" : "1px solid #007ACC",
            boxShadow: darkMode
              ? "0px 0px 10px rgba(56, 189, 248, 0.4)"
              : "0px 0px 8px rgba(0, 122, 204, 0.3)",
            backdropFilter: "blur(12px)",
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 10,
            textTransform: "uppercase",
            fontWeight: "600",
            border: `1px solid ${darkMode ? "#8B5CF6" : "#007ACC"}`,
            color: darkMode ? "#E2E8F0" : "#FFFFFF",
            background: darkMode
              ? "linear-gradient(90deg, #38BDF8, #8B5CF6)"
              : "linear-gradient(90deg, #007ACC, #FF477E)",
            transition: "0.3s ease-in-out",
            "&:hover": {
              background: darkMode
                ? "linear-gradient(90deg, #8B5CF6, #38BDF8)"
                : "linear-gradient(90deg, #FF477E, #007ACC)",
              transform: "scale(1.04)",
            },
          },
        },
      },
      MuiTextField: {
        styleOverrides: {
          root: {
            "& .MuiOutlinedInput-root": {
              "& fieldset": {
                borderColor: darkMode ? "#38BDF8" : "#007ACC",
              },
              "&:hover fieldset": {
                borderColor: darkMode ? "#8B5CF6" : "#FF477E",
              },
              "&.Mui-focused fieldset": {
                borderColor: darkMode ? "#8B5CF6" : "#FF477E",
              },
            },
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            backgroundColor: darkMode ? "#0F172A" : "#FFFFFF",
            boxShadow: darkMode
              ? "0px 0px 10px rgba(56, 189, 248, 0.3)"
              : "none",
          },
        },
      },
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
};
