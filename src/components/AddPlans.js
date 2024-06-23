// src/components/AddPlans.js
import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import axios from "axios";
import PlanProceduresGrid from "./PlanProceduresGrid";

const AddPlans = ({ insuranceCompanyId, insuranceCompanyName }) => {
  const [plans, setPlans] = useState([{ id: 1, name: "" }]);
  const [message, setMessage] = useState("");
  const [showProceduresGrid, setShowProceduresGrid] = useState(false);
  const [createdPlans, setCreatedPlans] = useState([]);

  const handleChange = (id, value) => {
    const updatedPlans = plans.map((plan) =>
      plan.id === id ? { ...plan, name: value } : plan
    );
    setPlans(updatedPlans);
  };

  const addNewRow = () => {
    const newId = plans[plans.length - 1].id + 1;
    setPlans([...plans, { id: newId, name: "" }]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    const planNames = plans
      .map((plan) => plan.name.trim())
      .filter((name) => name !== "");

    try {
      const response = await axios.post(
        `https://localhost:7264/api/Patient/add-insurance-company-plans?insuranceCompanyId=${parseInt(
          insuranceCompanyId
        )}`,
        planNames
      );
      setMessage("Plans added successfully!");
      setCreatedPlans(response.data);
      setShowProceduresGrid(true);
      setPlans([{ id: 1, name: "" }]);
    } catch (error) {
      if (error.response && error.response.data && error.response.data.errors) {
        setMessage(Object.values(error.response.data.errors).flat().join(", "));
      } else {
        setMessage("Error adding plans. Please try again.");
      }
      console.error("Error adding plans:", error);
    }
  };

  return (
    <Box sx={{ mt: 2, width: "28%" }}>
      <Paper elevation={3} sx={{ p: 2, maxWidth: "1200px", margin: "0 auto" }}>
        <Typography variant="h6" gutterBottom sx={{ mb: 1 }}>
          Add Plans for {insuranceCompanyName}
        </Typography>
        <form onSubmit={handleSubmit}>
          <TableContainer>
            <Table
              size="small"
              aria-label="simple table"
              sx={{ minWidth: "100%" }}
            >
              <TableHead>
                <TableRow>
                  <TableCell
                    sx={{ padding: "4px 8px", height: "32px", width: "100%" }}
                  >
                    Plan Name
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {plans.map((plan) => (
                  <TableRow key={plan.id}>
                    <TableCell sx={{ padding: "4px 8px", height: "32px" }}>
                      <TextField
                        fullWidth
                        value={plan.name}
                        onChange={(e) => handleChange(plan.id, e.target.value)}
                        margin="none"
                        size="small"
                        sx={{ "& .MuiInputBase-input": { padding: "4px 8px" } }}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <Box sx={{ mt: 1, display: "flex", justifyContent: "space-between" }}>
            <Button
              variant="contained"
              color="primary"
              onClick={addNewRow}
              size="small"
            >
              Add New Row
            </Button>
            <Button
              type="submit"
              variant="contained"
              color="secondary"
              size="small"
            >
              Create Plans
            </Button>
          </Box>
        </form>
        {message && (
          <Typography
            color={
              message.includes("Error") || message.includes("failed")
                ? "error"
                : "success"
            }
            sx={{ mt: 1, fontSize: "0.875rem" }}
          >
            {message}
          </Typography>
        )}
        {showProceduresGrid && (
          <PlanProceduresGrid
            insuranceCompanyId={insuranceCompanyId}
            createdPlans={createdPlans}
          />
        )}
      </Paper>
    </Box>
  );
};

export default AddPlans;
