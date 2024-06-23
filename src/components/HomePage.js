// src/components/Home.js
import React from "react";
import { Typography, Box } from "@mui/material";

const Home = () => {
  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" gutterBottom>
        Welcome to the Medical Billing System
      </Typography>
      <Typography variant="body1">
        Use the navigation bar to access different parts of the application.
      </Typography>
    </Box>
  );
};

export default Home;
