// src/components/AddInsuranceCompany.js
import React, { useState } from "react";
import { Box, TextField, Button, Typography, Paper } from "@mui/material";
import axios from "axios";
import AddPlans from "./AddPlans";

const AddInsuranceCompany = () => {
  const [companyName, setCompanyName] = useState("");
  const [message, setMessage] = useState("");
  const [newCompany, setNewCompany] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const response = await axios.post(
        `https://localhost:7264/api/Patient/add-insurance-company?insuranceCompanyName=${companyName}`
      );
      setMessage("Insurance company added successfully!");
      setNewCompany(response.data); // Assuming the API returns the new company data
      setCompanyName("");
    } catch (error) {
      setMessage("Error adding insurance company. Please try again.");
      console.error("Error adding insurance company:", error);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        mt: 4,
      }}
    >
      <Paper elevation={3} sx={{ p: 4, maxWidth: 400, width: "100%" }}>
        <Typography variant="h5" gutterBottom>
          Add Insurance Company
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Company Name"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            margin="normal"
            required
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 2 }}
          >
            Create Company
          </Button>
        </form>
        {message && (
          <Typography
            color={message.includes("Error") ? "error" : "success"}
            sx={{ mt: 2 }}
          >
            {message}
          </Typography>
        )}
      </Paper>
      {newCompany && (
        <AddPlans
          insuranceCompanyId={newCompany.insuranceCompanyId}
          insuranceCompanyName={newCompany.name}
        />
      )}
    </Box>
  );
};

export default AddInsuranceCompany;
