import { Outlet } from "react-router-dom";

import { Box, Toolbar } from "@mui/material";
import { useAuthStore } from "../../auth/hooks/useAuthStore";
import { SideBar } from "../components/SideBar";
import { NavbarUser } from "../components/NavbarUser";
import { ToastContainer } from "react-toastify";

const drawerWidth = 280;

export const VocabLayout = () => {
  const { user } = useAuthStore();

  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
      }}
    >
      <NavbarUser drawerWidth={drawerWidth} />

      <SideBar
        drawerWidth={drawerWidth}
        displayName={user?.displayName || "Invitado"}
      />

      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />

        <Outlet
        //   context={{
        //
        //   }}
        ></Outlet>
        <ToastContainer position="top-right" autoClose={3000} />
      </Box>
    </Box>
  );
};

export default VocabLayout;
