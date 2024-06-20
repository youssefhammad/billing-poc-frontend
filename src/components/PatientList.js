// src/PatientList.js

import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  List,
  ListItem,
  ListItemText,
  Typography,
  Divider,
  CircularProgress,
} from "@mui/material";

const PatientList = ({ onSelectPatient }) => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios
      .get("https://localhost:7264/api/Patient/get-all")
      .then((response) => {
        console.log(response.data);
        setPatients(response.data);
        setLoading(false);
      })
      .catch((error) => {
        setError(error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <Box
        sx={{
          width: "250px",
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        sx={{
          width: "250px",
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Typography variant="body1" color="error">
          Failed to load patients.
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        width: "250px",
        height: "100vh",
        bgcolor: "background.paper",
        boxShadow: 1,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Box sx={{ padding: 2, bgcolor: "primary.main", color: "white" }}>
        <Typography variant="h6" component="div">
          Patient List
        </Typography>
      </Box>
      <Divider />
      <Box sx={{ flex: 1, overflowY: "auto" }}>
        <List>
          {patients.map((patient) => (
            <ListItem
              button
              key={patient.patientId}
              onClick={() => onSelectPatient(patient)}
            >
              <ListItemText
                primary={`${patient.firstName} ${patient.lastName}`}
              />
            </ListItem>
          ))}
        </List>
      </Box>
    </Box>
  );
};

export default PatientList;
