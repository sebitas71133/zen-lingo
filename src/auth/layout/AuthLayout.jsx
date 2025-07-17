import { Box, Grid2, ThemeProvider } from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import { Link, Outlet } from "react-router-dom";
import { blueTheme } from "../../../theme/blueTheme";
import { DarkMode } from "../../components/DarkMode";
import { useDispatch, useSelector } from "react-redux";
import { toggleDarkMode } from "../../store/slices/themeSlice";

export const AuthLayout = () => {
  const { darkMode } = useSelector((state) => state.theme);

  const dispatch = useDispatch();

  const setDarkMode = () => {
    dispatch(toggleDarkMode());
  };

  return (
    <ThemeProvider theme={blueTheme}>
      <Grid2
        container
        spacing={0}
        direction="column"
        alignItems="center"
        justifyContent="center"
        sx={{
          minHeight: "100vh",
          // backgroundColor: "primary.main",
          padding: 4,
        }}
      >
        <Box
          sx={{
            position: "absolute",
            left: 0,
            top: 0,
            color: "white",
            fontWeight: "bold",
            padding: 2,
          }}
          component={Link}
          to="/"
        >
          <HomeIcon
            fontSize="large"
            sx={{
              color: "primary.main",
              "&:hover": { transform: "scale(1.2)" },
            }}
          />
        </Box>
        <Box
          sx={{
            position: "absolute",
            right: 0,
            top: 0,
            color: "white",
            fontWeight: "bold",
            padding: 2,
          }}
        >
          <DarkMode darkMode={darkMode} setDarkMode={setDarkMode} />
        </Box>
        <Grid2
          item
          className="box-shadow"
          xs={3}
          sx={{
            width: { sm: 450 },
            backgroundColor: "secondary.main",
            padding: 3,
            borderRadius: 2,
          }}
        >
          <Outlet />
        </Grid2>
      </Grid2>
    </ThemeProvider>
  );
};
