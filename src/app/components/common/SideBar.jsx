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
  Stack,
  useTheme,
} from "@mui/material";

import {
  DashboardOutlined,
  TranslateOutlined,
  ChatBubbleOutlineOutlined,
  RepeatOutlined,
  MenuBookOutlined,
} from "@mui/icons-material";
import {
  Menu as MenuIcon,
  AccountCircle,
  LabelOutlined,
  LogoutOutlined,
  BuildCircleOutlined,
} from "@mui/icons-material";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

export const SideBar = ({ drawerWidth = 240, displayName }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const isLargeScreen = useMediaQuery("(min-width: 1024px)");
  const navigate = useNavigate();
  const dispatch = useDispatch();

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
      {/* Top Section */}
      <Box>
        <Toolbar sx={{ px: 2, py: 3 }}>
          <Stack direction="row" alignItems="center" spacing={2}>
            <AccountCircle fontSize="large" sx={{ color: "primary.main" }} />
            <Box>
              <Typography
                variant="h6"
                fontWeight="bold"
                sx={{ color: "text.primary" }}
              >
                {displayName}
              </Typography>
              <Typography variant="caption" sx={{ color: "text.secondary" }}>
                Logged in
              </Typography>
            </Box>
          </Stack>
        </Toolbar>
        <Divider />

        <List>
          <ListItemButton onClick={() => navigate("/app/dashboard")}>
            <ListItemIcon>
              <DashboardOutlined sx={{ color: "text.primary" }} />
            </ListItemIcon>
            <ListItemText primary="Dashboard" />
          </ListItemButton>

          <ListItemButton onClick={() => navigate("/app")}>
            <ListItemIcon>
              <TranslateOutlined sx={{ color: "text.primary" }} />
              {/* o TextFieldsOutlined */}
            </ListItemIcon>
            <ListItemText primary="Words" />
          </ListItemButton>

          <ListItemButton onClick={() => navigate("/app/phrase")}>
            <ListItemIcon>
              <ChatBubbleOutlineOutlined sx={{ color: "text.primary" }} />
            </ListItemIcon>
            <ListItemText primary="Phrases" />
          </ListItemButton>

          <ListItemButton onClick={() => navigate("/app/verbs")}>
            <ListItemIcon>
              <RepeatOutlined sx={{ color: "text.primary" }} />
              {/* o FunctionsOutlined */}
            </ListItemIcon>
            <ListItemText primary="Verbs" />
          </ListItemButton>

          <ListItemButton onClick={() => navigate("/app/texts")}>
            <ListItemIcon>
              <MenuBookOutlined sx={{ color: "text.primary" }} />
              {/* o ArticleOutlined */}
            </ListItemIcon>
            <ListItemText primary="Texts" />
          </ListItemButton>
        </List>
      </Box>

      {/* Bottom Section */}
      <Box>
        <Divider />
        <ListItemButton onClick={() => navigate("/app/tags")}>
          <ListItemIcon>
            <LabelOutlined sx={{ color: "text.primary" }} />
          </ListItemIcon>
          <ListItemText primary="Tags" />
        </ListItemButton>
        <List>
          <ListItemButton onClick={() => navigate("/app/tools")}>
            <ListItemIcon>
              <BuildCircleOutlined sx={{ color: "text.primary" }} />
            </ListItemIcon>
            <ListItemText primary="Tools" />
          </ListItemButton>
        </List>
        <List>
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
            top: 30,
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
        <Drawer
          variant={isLargeScreen ? "permanent" : "temporary"}
          open={isLargeScreen ? true : mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
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
      </Box>
    </>
  );
};
