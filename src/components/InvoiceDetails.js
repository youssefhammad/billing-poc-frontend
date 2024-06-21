import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Button,
  CircularProgress,
  Grid,
} from "@mui/material";

const InvoiceDetails = ({ invoice, patientId }) => {
  const [loading, setLoading] = useState(false);
  const [processedInvoice, setProcessedInvoice] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Reset state when invoice or patientId changes
    setProcessedInvoice(null);
    setError(null);
  }, [invoice, patientId]);

  const handleProcessInvoice = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(
        `https://localhost:7264/api/Bill/calculate-bill?patientId=${patientId}`
      );
      setProcessedInvoice(response.data);
    } catch (err) {
      setError("Failed to process invoice. Please try again.");
      console.error("Error processing invoice:", err);
    } finally {
      setLoading(false);
    }
  };

  const renderTable = (data, columns, title) => (
    <Box sx={{ mt: 2 }}>
      <Typography variant="h6" gutterBottom>
        {title}
      </Typography>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label={title}>
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell key={column.id} sx={{ padding: "4px" }}>
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row, index) => (
              <TableRow key={index} sx={{ height: "48px" }}>
                {columns.map((column) => (
                  <TableCell key={column.id} sx={{ padding: "4px" }}>
                    {column.format
                      ? column.format(row[column.id])
                      : row[column.id]}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );

  return (
    <Paper
      sx={{ padding: 2, margin: 2, bgcolor: "background.paper", boxShadow: 3 }}
    >
      <Box sx={{ padding: 2 }}>
        <Typography variant="h6" gutterBottom>
          Invoice Details
        </Typography>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="invoice table">
            <TableHead>
              <TableRow>
                <TableCell sx={{ padding: "4px" }}>Invoice ID</TableCell>
                <TableCell sx={{ padding: "4px" }}>Invoice Status ID</TableCell>
                <TableCell sx={{ padding: "4px" }}>Charge</TableCell>
                <TableCell sx={{ padding: "4px" }}>Discount</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow sx={{ height: "48px" }}>
                <TableCell sx={{ padding: "4px" }}>
                  {invoice.invoiceId}
                </TableCell>
                <TableCell sx={{ padding: "4px" }}>
                  {invoice.invoiceStatusId}
                </TableCell>
                <TableCell sx={{ padding: "4px" }}>{invoice.charge}</TableCell>
                <TableCell sx={{ padding: "4px" }}>
                  {invoice.discount}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
        <Box
          sx={{
            mt: 2,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Button
            variant="contained"
            color="primary"
            onClick={handleProcessInvoice}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : "Process Invoice"}
          </Button>
          {error && (
            <Typography color="error" variant="body2">
              {error}
            </Typography>
          )}
        </Box>
        {processedInvoice && (
          <Grid container spacing={2}>
            <Grid item xs={12}>
              {renderTable(
                [processedInvoice],
                [
                  { id: "invoiceId", label: "Invoice ID" },
                  {
                    id: "dateTime",
                    label: "Date Time",
                    format: (value) => new Date(value).toLocaleString(),
                  },
                  { id: "charge", label: "Charge" },
                  { id: "discount", label: "Discount" },
                ],
                "Processed Invoice"
              )}
            </Grid>
            <Grid item xs={12}>
              {renderTable(
                processedInvoice.patientMedicalProcedures,
                [
                  { id: "patientMedicalProcedureId", label: "Procedure ID" },
                  { id: "medicalProcedureId", label: "Medical Procedure ID" },
                  {
                    id: "procedureDate",
                    label: "Procedure Date",
                    format: (value) => new Date(value).toLocaleString(),
                  },
                  { id: "outOfPocketCost", label: "Out of Pocket Cost" },
                  { id: "coveredAmount", label: "Covered Amount" },
                ],
                "Processed Patient Medical Procedures"
              )}
            </Grid>
            <Grid item xs={12}>
              {renderTable(
                processedInvoice.patientRuleHistories,
                [
                  { id: "ruleName", label: "Rule Name" },
                  { id: "ruleActionData", label: "Rule Action Data" },
                ],
                "Patient Rule Histories"
              )}
            </Grid>
          </Grid>
        )}
      </Box>
    </Paper>
  );
};

export default InvoiceDetails;
