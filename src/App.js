// src/App.js
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Box } from "@mui/material";
import Navbar from "./components/Navbar";
import Home from "./components/HomePage";
import PatientPage from "./components/PatientPage";
import AddInsuranceCompany from "./components/AddInsuranceCompany";
import AddPatient from "./components/AddPatient";

function App() {
  return (
    <Router>
      <Box sx={{ flexGrow: 1 }}>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/invoices" element={<PatientPage />} />
          <Route path="/add-insurance" element={<AddInsuranceCompany />} />
          <Route path="/add-patient" element={<AddPatient />} />
        </Routes>
      </Box>
    </Router>
  );
}

export default App;
