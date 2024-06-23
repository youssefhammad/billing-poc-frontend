// src/components/AddInsuranceCompany.js
import React, { useState } from "react";
import { Box, TextField, Button, Typography, Paper, Grid } from "@mui/material";
import axios from "axios";
import AddPlans from "./AddPlans";
import PlanProceduresGrid from "./PlanProceduresGrid";

const AddInsuranceCompany = () => {
  const [companyName, setCompanyName] = useState("");
  const [message, setMessage] = useState("");
  const [newCompany, setNewCompany] = useState(null);
  const [createdPlans, setCreatedPlans] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const response = await axios.post(
        `https://localhost:7264/api/Patient/add-insurance-company?insuranceCompanyName=${companyName}`
      );
      setMessage("Insurance company added successfully!");
      setNewCompany(response.data);
      setCompanyName("");
    } catch (error) {
      setMessage("Error adding insurance company. Please try again.");
      console.error("Error adding insurance company:", error);
    }
  };

  return (
    <Box sx={{ mt: 2, width: "100%" }}>
      <Grid container spacing={2}>
        <Grid item xs={12} md={5}>
          <Paper elevation={3} sx={{ p: 2, mb: 2 }}>
            <Typography variant="h6" gutterBottom sx={{ mb: 1 }}>
              Add Insurance Company
            </Typography>
            <form onSubmit={handleSubmit}>
              <TextField
                fullWidth
                label="Company Name"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                margin="dense"
                required
                size="small"
                sx={{ mb: 1 }}
              />
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                size="small"
                sx={{ mt: 1 }}
              >
                Create Company
              </Button>
            </form>
            {message && (
              <Typography
                color={message.includes("Error") ? "error" : "success"}
                sx={{ mt: 1, fontSize: "0.875rem" }}
              >
                {message}
              </Typography>
            )}
          </Paper>
          {newCompany && (
            <AddPlans
              insuranceCompanyId={newCompany.insuranceCompanyId}
              insuranceCompanyName={newCompany.name}
              onPlansCreated={setCreatedPlans}
            />
          )}
        </Grid>
        <Grid item xs={12} md={7}>
          {newCompany && createdPlans.length > 0 && (
            <PlanProceduresGrid
              insuranceCompanyId={newCompany.insuranceCompanyId}
              createdPlans={createdPlans}
            />
          )}
        </Grid>
      </Grid>
    </Box>
  );
};

export default AddInsuranceCompany;
