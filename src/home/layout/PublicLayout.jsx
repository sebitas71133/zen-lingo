import { Outlet } from "react-router-dom";

import { Box } from "@mui/material";

export const PublicLayout = () => {
  return (
    <>
      <Box
        component={"main"}
        sx={{
          p: 3,

          height: "100vh",

          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Outlet></Outlet>
      </Box>
    </>
  );
};

export default PublicLayout;
