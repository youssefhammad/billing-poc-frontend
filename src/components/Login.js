// src/components/Login.js
import React, { useState } from "react";
import { Box, TextField, Button, Typography, Paper } from "@mui/material";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await axios.post(
        "https://localhost:7264/api/auth/login",
        { email: email, password }
      );
      login(response.data.data);
      navigate("/add-patient");
    } catch (error) {
      setError("Invalid email or password");
    }
  };

  return (
    <Box sx={{ mt: 2, width: "100%" }}>
      <Paper elevation={3} sx={{ p: 2, maxWidth: 400, margin: "0 auto" }}>
        <Typography variant="h6" gutterBottom sx={{ mb: 1 }}>
          Login
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            margin="dense"
            required
            size="small"
            sx={{ mb: 1 }}
          />
          <TextField
            fullWidth
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
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
            Login
          </Button>
        </form>
        {error && (
          <Typography color="error" sx={{ mt: 1, fontSize: "0.875rem" }}>
            {error}
          </Typography>
        )}
      </Paper>
    </Box>
  );
};

export default Login;
