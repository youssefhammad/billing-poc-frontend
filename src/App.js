// src/App.js
import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import { Box } from "@mui/material";
import Navbar from "./components/Navbar";
import Home from "./components/HomePage";
import { CssBaseline } from "@mui/material";
import PatientPage from "./components/PatientPage";
import AddInsuranceCompany from "./components/AddInsuranceCompany";
import AddPatient from "./components/AddPatient";
import Login from "./components/Login";
import { AuthProvider, useAuth } from "./contexts/AuthContext";

const PrivateRoute = ({ children }) => {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <CssBaseline />
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/invoices" element={<PatientPage />} />
          <Route path="/add-insurance" element={<AddInsuranceCompany />} />
          <Route
            path="/add-patient"
            element={
              <PrivateRoute>
                <AddPatient />
              </PrivateRoute>
            }
          />
          <Route path="/login" element={<Login />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
