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
      setNewCompany(response.data);
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
        mt: 2,
      }}
    >
      <Paper elevation={3} sx={{ p: 2, maxWidth: 400, width: "100%" }}>
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
        />
      )}
    </Box>
  );
};

export default AddInsuranceCompany;
