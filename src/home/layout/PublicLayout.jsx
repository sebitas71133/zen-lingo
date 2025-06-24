import { Navigate, Outlet, useNavigate } from "react-router-dom";

import { useSelector } from "react-redux";
import { Navbar } from "../components/NavBar";
import { Box } from "@mui/material";

export const PublicLayout = () => {
  const darkMode = useSelector((state) => state.translator.darkMode);

  return (
    <>
      <Navbar></Navbar>
      <Box
        component={"main"}
        sx={{
          p: 3,
          flexGrow: 1,
          mt: 10,
          backgroundImage: `${
            darkMode
              ? "url('/dark-cyberpunk.jpg')"
              : "url('/light-cyberpunk.jpg')"
          }`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: "fixed",
        }}
      >
        <Outlet></Outlet>
      </Box>
    </>
  );
};

export default PublicLayout;
