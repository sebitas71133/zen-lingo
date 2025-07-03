import { Outlet } from "react-router-dom";

import { Box, Toolbar } from "@mui/material";
import { NavbarUser } from "../components/NavbarUser";
import { useAuthStore } from "../../auth/hooks/useAuthStore";
import { SideBar } from "../components/SideBar";

const drawerWidth = 280;

export const PrivateLayout = () => {
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
        //     userId: user?.id ?? null,
        //     categories,
        //     totalTags,
        //     tags,
        //     totalCategories,
        //     notesTotal,
        //     imagesTotal,
        //   }}
        ></Outlet>
      </Box>
    </Box>
  );
};

export default PrivateLayout;
