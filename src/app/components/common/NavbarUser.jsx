import {
  AppBar,
  Toolbar,
  Typography,
  Tooltip,
  useTheme,
  useMediaQuery,
  Box,
  IconButton,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { toggleDarkMode } from "../../../store/slices/themeSlice";
import { DarkMode } from "../../../components/DarkMode";

export const NavbarUser = ({ drawerWidth = 240 }) => {
  const { darkMode } = useSelector((state) => state.theme);
  const dispatch = useDispatch();

  const theme = useTheme();
  const isLargeScreen = useMediaQuery(theme.breakpoints.up("lg"));

  const setDarkMode = () => {
    dispatch(toggleDarkMode());
  };

  return (
    <AppBar
      position="fixed"
      elevation={3}
      sx={{
        width: isLargeScreen ? `calc(100% - ${drawerWidth}px)` : "100%",
        ml: isLargeScreen ? `${drawerWidth}px` : 0,
        backgroundColor: darkMode
          ? theme.palette.background.paper
          : theme.palette.primary.main,
        color: darkMode ? theme.palette.text.primary : "#fff",
        borderBottom: darkMode ? `1px solid ${theme.palette.divider}` : "none",
      }}
    >
      <Toolbar
        sx={{
          minHeight: "100px !important", // Aumenta la altura del navbar
          px: { xs: 2, md: 3 },
          position: "relative",
        }}
      >
        {/* Título centrado */}
        <Typography
          variant="h6"
          component="div"
          sx={{
            position: "absolute",
            left: "50%",
            transform: "translateX(-50%)",
            fontWeight: "bold",
            userSelect: "none",
            color: darkMode ? theme.palette.text.primary : "#fff",
            textAlign: "center",
            whiteSpace: "nowrap",
          }}
        >
          📘 ZenLingo
        </Typography>

        {/* Botón de modo oscuro alineado a la derecha */}
        <Box sx={{ ml: "auto" }}>
          <Tooltip title={darkMode ? "Modo claro" : "Modo oscuro"}>
            <Box>
              <DarkMode darkMode={darkMode} setDarkMode={setDarkMode} />
            </Box>
          </Tooltip>
        </Box>
      </Toolbar>
    </AppBar>
  );
};
