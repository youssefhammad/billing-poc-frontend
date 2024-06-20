import React from "react";
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
} from "@mui/material";

const InvoiceDetails = ({ invoice }) => {
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
      </Box>
    </Paper>
  );
};

export default InvoiceDetails;
