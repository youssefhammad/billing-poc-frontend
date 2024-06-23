// src/components/AddPatient.js
import React, { useState, useEffect } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import axios from "axios";

const AddPatient = () => {
  const [patient, setPatient] = useState({
    firstName: "",
    lastName: "",
    birthDate: null,
    insuranceCompanyId: "",
    planId: "",
    coInsurance: "",
    isVIP: false,
  });
  const [insuranceCompanies, setInsuranceCompanies] = useState([]);
  const [plans, setPlans] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchInsuranceCompanies = async () => {
      try {
        const response = await axios.get(
          "https://localhost:7264/api/Patient/get-insturance-companies"
        );
        setInsuranceCompanies(response.data);
      } catch (error) {
        console.error("Error fetching insurance companies:", error);
        setMessage("Error fetching insurance companies. Please try again.");
      }
    };
    fetchInsuranceCompanies();
  }, []);

  useEffect(() => {
    const fetchPlans = async () => {
      if (patient.insuranceCompanyId) {
        try {
          const response = await axios.get(
            `https://localhost:7264/api/Patient/get-plans?insuranceCompany=${patient.insuranceCompanyId}`
          );
          setPlans(response.data);
        } catch (error) {
          console.error("Error fetching plans:", error);
          setMessage("Error fetching plans. Please try again.");
        }
      } else {
        setPlans([]);
      }
    };
    fetchPlans();
  }, [patient.insuranceCompanyId]);

  const handleChange = (e) => {
    const { name, value, checked } = e.target;
    setPatient((prev) => ({
      ...prev,
      [name]: name === "isVIP" ? checked : value,
    }));
    if (name === "insuranceCompanyId") {
      setPatient((prev) => ({ ...prev, planId: "" }));
    }
  };

  const handleDateChange = (date) => {
    setPatient((prev) => ({
      ...prev,
      birthDate: date,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const response = await axios.post(
        "https://localhost:7264/api/Patient/add-patient",
        {
          ...patient,
          birthDate: patient.birthDate.toISOString(),
          coInsurance: parseFloat(patient.coInsurance),
          planId: parseInt(patient.planId),
        }
      );
      setMessage("Patient added successfully!");
      setPatient({
        firstName: "",
        lastName: "",
        birthDate: null,
        insuranceCompanyId: "",
        planId: "",
        coInsurance: "",
        isVIP: false,
      });
    } catch (error) {
      console.error("Error adding patient:", error);
      setMessage("Error adding patient. Please try again.");
    }
  };

  return (
    <Box sx={{ mt: 2, width: "100%" }}>
      <Paper elevation={3} sx={{ p: 2, maxWidth: 400, margin: "0 auto" }}>
        <Typography variant="h6" gutterBottom sx={{ mb: 1 }}>
          Add Patient
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="First Name"
            name="firstName"
            value={patient.firstName}
            onChange={handleChange}
            margin="dense"
            required
            size="small"
            sx={{ mb: 1 }}
          />
          <TextField
            fullWidth
            label="Last Name"
            name="lastName"
            value={patient.lastName}
            onChange={handleChange}
            margin="dense"
            required
            size="small"
            sx={{ mb: 1 }}
          />
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              label="Birth Date"
              value={patient.birthDate}
              onChange={handleDateChange}
              renderInput={(params) => (
                <TextField
                  {...params}
                  fullWidth
                  margin="dense"
                  required
                  size="small"
                  sx={{
                    mb: 1,
                    width: "100%", // Ensure full width
                    "& .MuiInputBase-root": {
                      height: "40px",
                      width: "100%", // Ensure the input takes full width
                    },
                    "& .MuiInputBase-input": {
                      padding: "8.5px 14px",
                      height: "23px",
                    },
                  }}
                  InputLabelProps={{
                    shrink: true,
                    sx: {
                      backgroundColor: "white",
                      padding: "0 4px",
                      transform: patient.birthDate
                        ? "translate(14px, -6px) scale(0.75)"
                        : "translate(14px, 8px) scale(1)",
                    },
                  }}
                />
              )}
              sx={{ width: "100%" }} // Add this to ensure DatePicker takes full width
            />
          </LocalizationProvider>
          <FormControl fullWidth margin="dense" size="small" sx={{ mb: 1 }}>
            <InputLabel
              id="insurance-company-label"
              shrink={false}
              sx={{
                backgroundColor: "white",
                padding: "0 4px",
                transform: patient.insuranceCompanyId
                  ? "translate(14px, -6px) scale(0.75)"
                  : "translate(14px, 8px) scale(1)",
              }}
            >
              Insurance Company
            </InputLabel>
            <Select
              labelId="insurance-company-label"
              name="insuranceCompanyId"
              value={patient.insuranceCompanyId}
              onChange={handleChange}
              required
              sx={{ height: "40px" }}
              MenuProps={{
                PaperProps: {
                  style: {
                    maxHeight: 200,
                    width: 250,
                  },
                },
                anchorOrigin: {
                  vertical: "bottom",
                  horizontal: "left",
                },
                transformOrigin: {
                  vertical: "top",
                  horizontal: "left",
                },
                getContentAnchorEl: null,
              }}
            >
              {insuranceCompanies.map((company) => (
                <MenuItem
                  key={company.insuranceCompanyId}
                  value={company.insuranceCompanyId}
                >
                  {company.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth margin="dense" size="small" sx={{ mb: 1 }}>
            <InputLabel
              id="plan-label"
              shrink={false}
              sx={{
                backgroundColor: "white",
                padding: "0 4px",
                transform: patient.planId
                  ? "translate(14px, -6px) scale(0.75)"
                  : "translate(14px, 8px) scale(1)",
              }}
            >
              Plan
            </InputLabel>
            <Select
              labelId="plan-label"
              name="planId"
              value={patient.planId}
              onChange={handleChange}
              required
              disabled={!patient.insuranceCompanyId}
              sx={{ height: "40px" }}
              MenuProps={{
                PaperProps: {
                  style: {
                    maxHeight: 200,
                    width: 250,
                  },
                },
                anchorOrigin: {
                  vertical: "bottom",
                  horizontal: "left",
                },
                transformOrigin: {
                  vertical: "top",
                  horizontal: "left",
                },
                getContentAnchorEl: null,
              }}
            >
              {plans.map((plan) => (
                <MenuItem key={plan.planId} value={plan.planId}>
                  {plan.planName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            fullWidth
            label="Co-Insurance"
            name="coInsurance"
            value={patient.coInsurance}
            onChange={handleChange}
            margin="dense"
            required
            size="small"
            type="number"
            inputProps={{ step: "0.01", min: "0", max: "1" }}
            sx={{ mb: 1 }}
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={patient.isVIP}
                onChange={handleChange}
                name="isVIP"
              />
            }
            label="VIP"
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
            Add Patient
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
    </Box>
  );
};

export default AddPatient;
