import {
  AppBar,
  Grid,
  Toolbar,
  Typography,
  Tooltip,
  useTheme,
  useMediaQuery,
  Box,
  IconButton,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { toggleDarkMode } from "../../store/slices/themeSlice";
import { DarkMode } from "../../components/DarkMode"; // Si usas tu propio switch

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
      <Toolbar sx={{ px: { xs: 2, md: 3 } }}>
        <Grid
          container
          alignItems="center"
          justifyContent="space-between"
          wrap="nowrap"
        >
          {/* Título o logo del proyecto */}
          <Grid item sx={{ ml: { xs: 5, sm: 5 } }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Box>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: "bold",
                    userSelect: "none",
                    whiteSpace: "nowrap",
                    color: darkMode ? theme.palette.text.primary : "#000",
                  }}
                >
                  📘 EnglishNote
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    mt: -0.5,
                    color: darkMode
                      ? theme.palette.text.secondary
                      : "rgba(0,0,0,0.6)",
                    fontSize: "0.75rem",
                    whiteSpace: "nowrap",
                  }}
                >
                  "Build your vocabulary, one note at a time."
                </Typography>
              </Box>
            </Box>
          </Grid>

          {/* Botón de modo oscuro/claro */}
          <Grid item>
            <Tooltip title={darkMode ? "Modo claro" : "Modo oscuro"}>
              <Box>
                <DarkMode darkMode={darkMode} setDarkMode={setDarkMode} />
              </Box>
            </Tooltip>
          </Grid>
        </Grid>
      </Toolbar>
    </AppBar>
  );
};
