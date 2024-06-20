import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  CircularProgress,
  Typography,
  TextField,
} from "@mui/material";
import { LocalizationProvider, DateTimePicker } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import InvoiceDetails from "./InvoiceDetails";

const PatientActions = ({ patient }) => {
  const [rows, setRows] = useState([]);
  const [procedures, setProcedures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [invoice, setInvoice] = useState(null);

  useEffect(() => {
    if (patient) {
      axios
        .get("https://localhost:7264/api/Patient/get-all-mediacl-procedures")
        .then((response) => {
          setProcedures(response.data);
          setLoading(false);
        })
        .catch((error) => {
          setError(error);
          setLoading(false);
        });
    }
  }, [patient]);

  useEffect(() => {
    if (patient) {
      setRows([{ id: 1, action: "", price: "", procedureDate: null }]); // Reset rows when patient changes
    } else {
      setRows([]); // Clear rows if no patient is selected
    }
  }, [patient]);

  const handleChange = (index, field) => (event) => {
    const newRows = [...rows];
    if (field === "action") {
      const selectedProcedure = procedures.find(
        (procedure) => procedure.medicalProcedureId === event.target.value
      );
      newRows[index].action = selectedProcedure.medicalProcedureId;
      newRows[index].price = selectedProcedure.price;
    } else if (field === "procedureDate") {
      newRows[index].procedureDate = event;
    }
    setRows(newRows);
  };

  const addNewRow = () => {
    setRows([
      ...rows,
      { id: rows.length + 1, action: "", price: "", procedureDate: null },
    ]);
  };

  const createInvoice = () => {
    const invoiceData = {
      patientId: patient.patientId,
      patientMedicalProcedures: rows.map((row) => ({
        medicalProcedureId: row.action,
        procedureDate: row.procedureDate
          ? row.procedureDate.toISOString()
          : null,
      })),
    };

    axios
      .post("https://localhost:7264/api/Patient/add-invoice", invoiceData)
      .then((response) => {
        // Handle successful response
        setInvoice(response.data);
        console.log("Invoice created successfully:", response.data);
      })
      .catch((error) => {
        // Handle error response
        console.error("Failed to create invoice:", error);
      });
  };

  if (loading) {
    return (
      <Box sx={{ padding: 2, display: "flex", justifyContent: "center" }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ padding: 2, display: "flex", justifyContent: "center" }}>
        <Typography variant="body1" color="error">
          Failed to load procedures.
        </Typography>
      </Box>
    );
  }

  return (
    <Paper
      sx={{ padding: 2, margin: 2, bgcolor: "background.paper", boxShadow: 3 }}
    >
      <Box sx={{ padding: 2 }}>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell sx={{ padding: "4px", width: "30%" }}>
                  Medical Procedure
                </TableCell>
                <TableCell sx={{ padding: "4px", width: "20%" }}>
                  Price
                </TableCell>
                <TableCell sx={{ padding: "4px", width: "50%" }}>
                  Procedure Date
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row, index) => (
                <TableRow key={row.id} sx={{ height: "48px" }}>
                  <TableCell component="th" scope="row" sx={{ padding: "4px" }}>
                    <FormControl fullWidth sx={{ margin: 0 }}>
                      <InputLabel
                        id={`action-label-${row.id}`}
                        sx={{ fontSize: "0.875rem", top: "-6px" }}
                      >
                        Procedure
                      </InputLabel>
                      <Select
                        labelId={`action-label-${row.id}`}
                        id={`action-select-${row.id}`}
                        value={row.action}
                        label="Procedure"
                        onChange={handleChange(index, "action")}
                        sx={{
                          fontSize: "0.875rem",
                          padding: "0px",
                          minHeight: "32px",
                          "& .MuiSelect-select": {
                            padding: "4px",
                            display: "flex",
                            alignItems: "center",
                          },
                          width: "230px", // Set fixed width for the dropdown
                        }}
                      >
                        <MenuItem value="">
                          <em>None</em>
                        </MenuItem>
                        {procedures.map((procedure) => (
                          <MenuItem
                            key={procedure.medicalProcedureId}
                            value={procedure.medicalProcedureId}
                            sx={{
                              fontSize: "0.875rem",
                              minHeight: "32px",
                              padding: "4px",
                            }}
                          >
                            {procedure.procedureName}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </TableCell>
                  <TableCell sx={{ padding: "4px" }}>{row.price}</TableCell>
                  <TableCell sx={{ padding: "4px" }}>
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                      <DateTimePicker
                        renderInput={(props) => (
                          <TextField
                            {...props}
                            InputLabelProps={{
                              shrink: false, // Ensure the label shrinks
                              sx: {
                                fontSize: "0.875rem",
                                top: "-6px", // Adjust the position of the label
                              },
                            }}
                            InputProps={{
                              sx: {
                                fontSize: "0.875rem",
                                padding: "4px",
                                minHeight: "32px", // Adjust height to match the dropdown
                                "& .MuiInputBase-input": {
                                  padding: "4px", // Ensure padding does not increase height
                                },
                                display: "flex",
                                alignItems: "center",
                              },
                            }}
                          />
                        )}
                        value={row.procedureDate}
                        onChange={handleChange(index, "procedureDate")}
                        inputFormat="yyyy/MM/dd hh:mm a"
                        sx={{
                          "& .MuiInputBase-root": {
                            fontSize: "0.875rem",
                            padding: "4px",
                            minHeight: "32px",
                            "& input": {
                              padding: "4px",
                            },
                          },
                          "& .MuiIconButton-root": {
                            padding: "4px",
                          },
                          "& .MuiInputAdornment-root .MuiButtonBase-root": {
                            padding: "4px",
                          },
                        }}
                      />
                    </LocalizationProvider>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: 2,
          }}
        >
          <Button variant="contained" color="primary" onClick={addNewRow}>
            Add New
          </Button>
          <Button
            variant="contained"
            color="secondary"
            onClick={createInvoice}
            disabled={invoice !== null} // Disable the button if invoice is created
          >
            Create Invoice
          </Button>
        </Box>
      </Box>
      {invoice && <InvoiceDetails invoice={invoice} />}
    </Paper>
  );
};

export default PatientActions;
