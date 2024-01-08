import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { AppBar, Toolbar, Typography, IconButton, Menu, MenuItem } from "@mui/material";
import styled from "@emotion/styled";

import { getCurrentUserById } from "../services/users";
import { auth } from "../services/firebase";

const StyledAppBar = styled(AppBar)({
  zIndex: 1201,
});

const StyledTitle = styled(Typography)({
  flexGrow: 1,
});

const NameTypography = styled(Typography)({
  fontSize: "0.9rem",
  lineHeight: 1,
});

const Navbar = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [user, setUser] = useState({ firstName: "", lastName: "" });

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userId = localStorage.getItem("userId");
        if (userId) {
          const userData = await getCurrentUserById(userId);
          setUser(userData);
        }
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };

    fetchData();
  }, []);

  const handleSignOut = async () => {
    try {
      console.log(await auth.signOut());

      localStorage.removeItem("userId");
      navigate("/login");
      handleClose();
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <StyledAppBar position="fixed">
      <Toolbar>
        <StyledTitle variant="h6">Delivery Planner</StyledTitle>

        <IconButton
          size="medium"
          aria-label="account of current user"
          aria-controls="menu-appbar"
          aria-haspopup="true"
          onClick={handleMenu}
          color="inherit"
          style={{ borderRadius: "10px" }}
        >
          <NameTypography>{`${user.firstName} ${user.lastName}`}</NameTypography>
        </IconButton>

        <Menu
          id="menu-appbar"
          anchorEl={anchorEl}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "right",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          getContentAnchorEl={null}
          open={Boolean(anchorEl)}
          onClose={handleClose}
        >
          <MenuItem onClick={handleSignOut}>Sign Out</MenuItem>
        </Menu>
      </Toolbar>
    </StyledAppBar>
  );
};

export default Navbar;
