import { Outlet } from "react-router-dom";

import { Box, IconButton } from "@mui/material";
import GitHubIcon from "@mui/icons-material/GitHub";
import { useDispatch, useSelector } from "react-redux";
import { toggleDarkMode } from "../../store/slices/themeSlice";
import { DarkMode } from "../../components/DarkMode";

export const PublicLayout = () => {
  const { darkMode } = useSelector((state) => state.theme);

  const dispatch = useDispatch();

  const setDarkMode = () => {
    dispatch(toggleDarkMode());
  };
  return (
    <>
      <Box
        component={"main"}
        sx={{
          p: 3,

          height: "100%",
          width: "100vw",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Outlet></Outlet>
      </Box>
      <Box sx={{ position: "absolute", top: 30, left: 40 }}>
        <IconButton
          color="primary.main"
          component="a"
          href="https://github.com/sebitas71133"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="GitHub"
        >
          <GitHubIcon fontSize="large" />
        </IconButton>
      </Box>
      <Box
        sx={{
          position: "absolute",
          right: 0,
          top: 20,
          color: "white",
          fontWeight: "bold",
          padding: 2,
        }}
      >
        <DarkMode darkMode={darkMode} setDarkMode={setDarkMode} />
      </Box>
    </>
  );
};

export default PublicLayout;
