import {
  Business,
  CoPresent,
  EditCalendar,
  EmojiPeople,
  Logout,
  ManageAccounts,
  Newspaper,
  Person,
} from "@mui/icons-material";
import {
  Box,
  Button,
  List,
  ListItem,
  useMediaQuery,
  useTheme,
  ListItemIcon,
  ListItemText,
  styled,
} from "@mui/material";
import React from "react";
import Logo from "../../assets/images/logo.png";
import { NavLink, useNavigate } from "react-router-dom";

export const Sidebar = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const StyleListItemButton = styled(NavLink)({
    textDecoration: "none",
    display: "flex",
    backgroundColor: "131F73",
    color: "white",
    "&:hover": {
      backgroundColor: "#5FA6E3",
      color: "white",
    },
    "&:onClick": {
      backgroundColor: "#5FA6E3",
      color: "white",
    },
    padding: "10px",
    width: "200px",
    justifyContent: "center",
    alignItems: "center",
  });

  const StyleButton = styled(Button)({
    textDecoration: "none",
    display: "flex",
    backgroundColor: "131F73",
    color: "white",
    "&:hover": {
      backgroundColor: "#5FA6E3",
      color: "white",
    },
    "&:onClick": {
      backgroundColor: "#5FA6E3",
      color: "white",
    },
    padding: "10px",
    width: "200px",
    alignItems: "center",
  });
  const StyleListItem = styled(ListItem)({
    display: "block",
    width: "max-content",
    borderRadius: "5px",
  });

  const StyleListItemText = styled(ListItemText)`
    @media (max-width: 1200px) {
      display: none;
    }
  `;

  const onLogout = () => {
    try {
      navigate("/sign-in");
      localStorage.removeItem("user");
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  return (
    <Box
      backgroundColor="#131F73"
      color="white"
      flex={1.3}
      p={2}
      height="100vh"
      sx={{ display: { xs: "none", sm: "none", md: "block" } }}
    >
      <Box zIndex={1} position="sticky">
        <List>
          {isSmallScreen ? (
            <Typography variant="h6" sx={{ color: "white" }}>
              Logo
            </Typography>
          ) : (
            <Box
              borderRadius="10px"
              component="img"
              sx={{ height: "60px", weight: "auto" }}
              src={Logo}
            />  
          )}
          <StyleListItem disablePadding>
            <StyleListItemButton component="a" to="student">
              <ListItemIcon>
                <EmojiPeople sx={{ color: "white" }} />
              </ListItemIcon>
              <StyleListItemText primary="Student" display="none" />
            </StyleListItemButton>
          </StyleListItem>
          <StyleListItem disablePadding>
            <StyleListItemButton component="a" to="coordinator">
              <ListItemIcon>
                <CoPresent sx={{ color: "white" }} />
              </ListItemIcon>
              <StyleListItemText primary="Coordinator" />
            </StyleListItemButton>
          </StyleListItem>
          <StyleListItem disablePadding>
            <StyleListItemButton component="a" to="guest">
              <ListItemIcon>
                <Person sx={{ color: "white" }} />
              </ListItemIcon>
              <StyleListItemText primary="Guest" />
            </StyleListItemButton>
          </StyleListItem>
          <StyleListItem disablePadding>
            <StyleListItemButton component="a" to="faculty">
              <ListItemIcon>
                <Business sx={{ color: "white" }} />
              </ListItemIcon>
              <StyleListItemText primary="Faculty" />
            </StyleListItemButton>
          </StyleListItem>
          <StyleListItem disablePadding>
            <StyleListItemButton component="a" to="contribution">
              <ListItemIcon>
                <Newspaper sx={{ color: "white" }} />
              </ListItemIcon>
              <StyleListItemText primary="Contributions" />
            </StyleListItemButton>
          </StyleListItem>
          <StyleListItem disablePadding>
            <StyleListItemButton component="a" to="event">
              <ListItemIcon>
                <EditCalendar sx={{ color: "white" }} />
              </ListItemIcon>
              <StyleListItemText primary="Annual Event" />
            </StyleListItemButton>
          </StyleListItem>
          <StyleListItem disablePadding>
            <StyleListItemButton component="a" to="account">
              <ListItemIcon>
                <ManageAccounts sx={{ color: "white" }} />
              </ListItemIcon>
              <StyleListItemText primary="All Accounts" />
            </StyleListItemButton>
          </StyleListItem>
          <StyleListItem disablePadding sx={{ mt: "auto" }}>
            <StyleButton component="a" onClick={() => onLogout()}>
              <ListItemIcon>
                <Logout sx={{ color: "white" }} />
              </ListItemIcon>
              <StyleListItemText primary="Logout" />
            </StyleButton>
          </StyleListItem>
        </List>
      </Box>
    </Box>
  );
};
