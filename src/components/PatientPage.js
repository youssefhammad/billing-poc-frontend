// src/PatientPage.js

import React, { useState } from "react";
import { Box, Grid } from "@mui/material";
import PatientList from "./PatientList";
import PatientDetails from "./PatientDetails";
import PatientActions from "./PatientActions";

const PatientPage = () => {
  const [selectedPatient, setSelectedPatient] = useState(null);

  return (
    <Box sx={{ display: "flex" }}>
      <PatientList onSelectPatient={setSelectedPatient} />
      <Box sx={{ flex: 1, padding: 2 }}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <PatientDetails patient={selectedPatient} />
          </Grid>
          <Grid item xs={12}>
            <PatientActions />
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default PatientPage;
