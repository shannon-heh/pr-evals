// import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import Link from "@mui/material/Link";
import { useState } from "react";
import useCAS from "../hooks/useCAS";
import { Tooltip } from "@mui/material";

export default function MenuAppBar() {
  const [anchorEl, setAnchorEl] = useState(null);

  const { isLoggedIn } = useCAS();

  const handleMenu = (e) => {
    setAnchorEl(e.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          {/* TO-DO: app icon goes here */}
          <Link
            href={isLoggedIn ? "/dashboard" : ""}
            underline="none"
            sx={{ color: "white", flexGrow: 1 }}
          >
            <Typography variant="h6" component="div">
              pr.evals
            </Typography>
          </Link>
          {isLoggedIn && (
            <div>
              <Tooltip title="Click for Menu" arrow>
                <IconButton
                  size="large"
                  aria-label="account of current user"
                  aria-controls="menu-appbar"
                  aria-haspopup="true"
                  onClick={handleMenu}
                  color="inherit"
                >
                  <MenuIcon />
                </IconButton>
              </Tooltip>
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                <Link
                  href="/dashboard"
                  underline="none"
                  sx={{ color: "black" }}
                >
                  <MenuItem onClick={handleClose}>Dashboard</MenuItem>
                </Link>
                <Link href="/profile" underline="none" sx={{ color: "black" }}>
                  <MenuItem onClick={handleClose}>Profile</MenuItem>
                </Link>
                <Link href="/logout" underline="none" sx={{ color: "black" }}>
                  <MenuItem onClick={handleClose}>Logout</MenuItem>
                </Link>
              </Menu>
            </div>
          )}
        </Toolbar>
      </AppBar>
    </Box>
  );
}
