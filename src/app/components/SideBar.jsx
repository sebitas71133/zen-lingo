import { useState } from "react";
import {
  Box,
  Divider,
  Drawer,
  List,
  Toolbar,
  Typography,
  IconButton,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import {
  Menu as MenuIcon,
  AccountCircle,
  LabelOutlined,
  NotesOutlined,
  LogoutOutlined,
} from "@mui/icons-material";
import BuildIcon from "@mui/icons-material/Build";

import useMediaQuery from "@mui/material/useMediaQuery";
import { useNavigate } from "react-router-dom";

export const SideBar = ({ drawerWidth = 240, displayName }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const isLargeScreen = useMediaQuery("(min-width: 1024px)");
  const navigate = useNavigate();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleLogout = () => {
    navigate("/auth/logout", { replace: true });
  };

  const drawerContent = (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        justifyContent: "space-between",
      }}
    >
      {/* Parte superior */}
      <Box>
        <Toolbar sx={{ borderRight: 1, borderColor: "divider" }}>
          <Typography
            variant="h5"
            noWrap
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 3,
              justifyContent: "flex-end",
            }}
          >
            <AccountCircle sx={{ color: "text.primary" }} />
            {displayName}
          </Typography>
        </Toolbar>
        <Divider sx={{ bgcolor: "divider" }} />

        <List>
          <ListItemButton onClick={() => navigate("/app")}>
            <ListItemIcon>
              <NotesOutlined sx={{ color: "text.primary" }} />
            </ListItemIcon>
            <ListItemText primary="Word" />
          </ListItemButton>

          {/* <ListItemButton onClick={() => navigate("/app/category")}>
            <ListItemIcon>
              <CategoryOutlined sx={{ color: "text.primary" }} />
            </ListItemIcon>
            <ListItemText primary="Categories" />
          </ListItemButton> */}

          {/* <ListItemButton onClick={() => navigate("/app/word")}>
            <ListItemIcon>
              <LabelOutlined sx={{ color: "text.primary" }} />
            </ListItemIcon>
            <ListItemText primary="Word" />
          </ListItemButton> */}

          {/* <ListItemButton onClick={() => navigate("/app/favorite")}>
            <ListItemIcon>
              <LabelOutlined sx={{ color: "text.primary" }} />
            </ListItemIcon>
            <ListItemText primary="Favorite" />
          </ListItemButton> */}
        </List>
      </Box>

      <Box>
        <Divider />
        <List>
          <ListItemButton onClick={() => navigate("/app/tags")}>
            <ListItemIcon>
              <BuildIcon sx={{ color: "text.primary" }} />
            </ListItemIcon>
            <ListItemText primary="Tags" />
          </ListItemButton>
          <ListItemButton onClick={handleLogout}>
            <ListItemIcon>
              <LogoutOutlined sx={{ color: "text.primary" }} />
            </ListItemIcon>
            <ListItemText primary="Logout" />
          </ListItemButton>
        </List>
      </Box>
    </Box>
  );

  return (
    <>
      {!isLargeScreen && (
        <IconButton
          onClick={handleDrawerToggle}
          sx={{
            position: "absolute",
            top: 10,
            left: 10,
            zIndex: 1200,
            color: mobileOpen ? "primary.main" : "text.primary",
          }}
        >
          <MenuIcon />
        </IconButton>
      )}

      <Box
        component="nav"
        sx={{
          width: isLargeScreen ? drawerWidth : "auto",
          flexShrink: { sm: 0 },
        }}
      >
        {isLargeScreen ? (
          <Drawer
            variant="permanent"
            open
            sx={{
              "& .MuiDrawer-paper": {
                width: drawerWidth,
                boxSizing: "border-box",
                bgcolor: "background.paper",
                borderRight: "none",
              },
            }}
          >
            {drawerContent}
          </Drawer>
        ) : (
          <Drawer
            variant="temporary"
            open={mobileOpen}
            onClose={handleDrawerToggle}
            ModalProps={{ keepMounted: true }}
            sx={{
              "& .MuiDrawer-paper": {
                width: drawerWidth,
                boxSizing: "border-box",
                bgcolor: "background.paper",
              },
            }}
          >
            {drawerContent}
          </Drawer>
        )}
      </Box>
    </>
  );
};
