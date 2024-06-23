// src/components/PlanProceduresGrid.js
import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Select,
  MenuItem,
  FormControl,
  Button,
  Snackbar,
} from "@mui/material";
import axios from "axios";

const PlanProceduresGrid = ({ insuranceCompanyId, createdPlans }) => {
  const [medicalProcedures, setMedicalProcedures] = useState([]);
  const [procedureConfigurations, setProcedureConfigurations] = useState([]);
  const [selectedConfigurations, setSelectedConfigurations] = useState({});
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [procResponse, configResponse] = await Promise.all([
          axios.get(
            `https://localhost:7264/api/Patient/get-medical-proc?insuranceCompanyId=${insuranceCompanyId}`
          ),
          axios.get("https://localhost:7264/api/Patient/get-all-proc-config"),
        ]);
        setMedicalProcedures(procResponse.data);
        setProcedureConfigurations(configResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
        setSnackbarMessage("Error fetching data. Please try again.");
        setSnackbarOpen(true);
      }
    };
    fetchData();
  }, [insuranceCompanyId]);

  const handleConfigChange = (planId, medicalProcedureId, configId) => {
    setSelectedConfigurations((prev) => ({
      ...prev,
      [`${planId}-${medicalProcedureId}`]: configId,
    }));
  };

  const handleSave = async () => {
    try {
      const savePromises = createdPlans.map((plan) => {
        const configurationDtos = medicalProcedures
          .map((procedure) => ({
            medicalProcedureId: procedure.medicalProcedureId,
            procedureConfigurationId:
              selectedConfigurations[
                `${plan.planId}-${procedure.medicalProcedureId}`
              ] || null,
          }))
          .filter((config) => config.procedureConfigurationId !== null);

        return axios.post(
          `https://localhost:7264/api/Patient/assign-proc-config-to-plan?planId=${plan.planId}`,
          configurationDtos
        );
      });

      await Promise.all(savePromises);

      setSnackbarMessage("Configurations saved successfully!");
      setSnackbarOpen(true);
    } catch (error) {
      console.error("Error saving configurations:", error);
      setSnackbarMessage("Error saving configurations. Please try again.");
      setSnackbarOpen(true);
    }
  };

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h6" gutterBottom>
        Plan Procedures Configuration
      </Typography>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="plan procedures table">
          <TableHead>
            <TableRow>
              <TableCell sx={{ padding: "4px", height: "32px" }}>
                Plan Name
              </TableCell>
              <TableCell sx={{ padding: "4px", height: "32px" }}>
                Medical Procedure
              </TableCell>
              <TableCell sx={{ padding: "4px", height: "32px" }}>
                Price
              </TableCell>
              <TableCell sx={{ padding: "4px", height: "32px" }}>
                Procedure Configuration
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {createdPlans.flatMap((plan) =>
              medicalProcedures.map((procedure) => (
                <TableRow
                  key={`${plan.planId}-${procedure.medicalProcedureId}`}
                  sx={{ height: "32px" }}
                >
                  <TableCell sx={{ padding: "4px" }}>{plan.planName}</TableCell>
                  <TableCell sx={{ padding: "4px" }}>
                    {procedure.procedureName}
                  </TableCell>
                  <TableCell sx={{ padding: "4px" }}>
                    {procedure.price}
                  </TableCell>
                  <TableCell sx={{ padding: "4px" }}>
                    <FormControl fullWidth sx={{ m: 0 }}>
                      <Select
                        value={
                          selectedConfigurations[
                            `${plan.planId}-${procedure.medicalProcedureId}`
                          ] || ""
                        }
                        onChange={(e) =>
                          handleConfigChange(
                            plan.planId,
                            procedure.medicalProcedureId,
                            e.target.value
                          )
                        }
                        sx={{
                          fontSize: "0.875rem",
                          padding: "0px",
                          minHeight: "32px",
                          "& .MuiSelect-select": {
                            padding: "4px",
                            display: "flex",
                            alignItems: "center",
                          },
                          width: "230px",
                        }}
                      >
                        <MenuItem value="">
                          <em>None</em>
                        </MenuItem>
                        {procedureConfigurations.map((config) => (
                          <MenuItem
                            key={config.procedureConfigurationId}
                            value={config.procedureConfigurationId}
                            sx={{
                              fontSize: "0.875rem",
                              minHeight: "32px",
                              padding: "4px",
                            }}
                          >
                            {config.configurationName}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <Box sx={{ mt: 2, display: "flex", justifyContent: "flex-end" }}>
        <Button variant="contained" color="primary" onClick={handleSave}>
          Save Configurations
        </Button>
      </Box>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
        message={snackbarMessage}
      />
    </Box>
  );
};

export default PlanProceduresGrid;
