// import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import { useState } from "react";
import useCAS from "../hooks/useCAS";
import { SvgIcon, Tooltip } from "@mui/material";
import Link from "next/link";

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
          <Link href={isLoggedIn ? "/dashboard" : ""}>
            <SvgIcon sx={{ mr: 2, mt: 0.4, height: 20, cursor: "pointer" }}>
              <Logo />
            </SvgIcon>
          </Link>
          <Link href={isLoggedIn ? "/dashboard" : ""}>
            <Typography
              fontSize={22}
              fontWeight={500}
              component="div"
              flexGrow={1}
              sx={{ cursor: "pointer" }}
            >
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
                <Link href="/dashboard">
                  <MenuItem onClick={handleClose}>Dashboard</MenuItem>
                </Link>
                <Link href="/profile">
                  <MenuItem onClick={handleClose}>Profile</MenuItem>
                </Link>
                <Link href="/logout">
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

function Logo() {
  return (
    <>
      <path
        xmlns="http://www.w3.org/2000/svg"
        d="M21,11.5V15H18a3,3,0,0,0-3,3v3H4.5A1.5,1.5,0,0,1,3,19.5V4.5A1.5,1.5,0,0,1,4.5,3h9A1.5,1.5,0,0,0,15,1.5h0A1.5,1.5,0,0,0,13.5,0h-9A4.5,4.5,0,0,0,0,4.5v15A4.5,4.5,0,0,0,4.5,24H16.484a4.5,4.5,0,0,0,3.181-1.317l3.017-3.017A4.5,4.5,0,0,0,24,16.485V11.5A1.5,1.5,0,0,0,22.5,10h0A1.5,1.5,0,0,0,21,11.5Z"
        fill="#ffffff"
        data-original="#000000"
      />
      <path
        xmlns="http://www.w3.org/2000/svg"
        d="M17.793,1.793l-12.5,12.5A1,1,0,0,0,5,15v3a1,1,0,0,0,1,1H9a1,1,0,0,0,.707-.293L22.038,6.376a3.379,3.379,0,0,0,.952-3.17A3.118,3.118,0,0,0,17.793,1.793Z"
        fill="#ffffff"
        data-original="#000000"
      />
    </>
  );
}
