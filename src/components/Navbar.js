// src/components/Navbar.js
import React from "react";
import { AppBar, Toolbar, Typography, Button } from "@mui/material";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Technomedic Billing System
        </Typography>
        <Button color="inherit" component={Link} to="/">
          Home
        </Button>
        <Button color="inherit" component={Link} to="/invoices">
          Invoices
        </Button>
        <Button color="inherit" component={Link} to="/add-insurance">
          Add Insurance
        </Button>
        <Button color="inherit" component={Link} to="/add-patient">
          Add Patient
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
