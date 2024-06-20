// src/App.js

import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import PatientPage from "./components/PatientPage";
import HomePage from "./components/HomePage"; // Assuming you have a HomePage component or create one

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/patients" element={<PatientPage />} />
      </Routes>
    </Router>
  );
};

export default App;
