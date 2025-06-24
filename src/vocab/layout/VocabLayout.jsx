import { Outlet } from "react-router-dom";

import { Box, Toolbar } from "@mui/material";
import { useAuthStore } from "../../auth/hooks/useAuthStore";
import { SideBar } from "../../app/components/SideBar";
import { NavbarUser } from "../../app/components/NavbarUser";

const drawerWidth = 280;

export const VocabLayout = () => {
  const { user } = useAuthStore();

  console.log({ user });

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

export default VocabLayout;
