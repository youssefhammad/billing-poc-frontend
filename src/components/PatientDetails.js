// src/PatientDetails.js

import React from "react";
import { Box, Typography, Grid, Paper } from "@mui/material";

const PatientDetails = ({ patient }) => {
  if (!patient) {
    return (
      <Box sx={{ padding: 2 }}>
        <Typography variant="h6">
          Select a patient to see the details
        </Typography>
      </Box>
    );
  }

  return (
    <Paper
      sx={{
        padding: 2,
        margin: 2,
        bgcolor: "background.paper",
        boxShadow: 3,
      }}
    >
      <Typography variant="h4" gutterBottom>
        {patient.firstName} {patient.lastName}
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <Typography variant="body1">
            <strong>ID:</strong> {patient.patientId}
          </Typography>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography variant="body1">
            <strong>Plan Name:</strong> {patient?.plan.planName}
          </Typography>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography variant="body1">
            <strong>Birth Date:</strong> {patient.birthDate}
          </Typography>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default PatientDetails;
