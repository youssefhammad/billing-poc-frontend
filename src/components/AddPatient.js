// src/components/AddPatient.js
import React, { useState, useEffect } from "react";
import { Box, Button, Typography, Paper } from "@mui/material";
import api from "../utils/api";
import { renderFormField, renderSelectField } from "../utils/formUtils";
import { validateField, validateAllFields } from "../utils/validationUtils";

const AddPatient = () => {
  const [formFields, setFormFields] = useState([]);
  const [formData, setFormData] = useState({});
  const [formErrors, setFormErrors] = useState({});
  const [insuranceCompanies, setInsuranceCompanies] = useState([]);
  const [plans, setPlans] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchFormStructure = async () => {
      try {
        const response = await api.get("/Patient/form-structure");
        setFormFields(response.data);
        const initialFormData = response.data.reduce((acc, field) => {
          if (field.type.toLowerCase() === "datetime" && field.defaultValue) {
            acc[field.name] = new Date(field.defaultValue);
          } else {
            acc[field.name] = field.defaultValue;
          }
          return acc;
        }, {});
        setFormData(initialFormData);
      } catch (error) {
        console.error("Error fetching form structure:", error);
        setMessage("Error fetching form structure. Please try again.");
      }
    };

    const fetchInsuranceCompanies = async () => {
      try {
        const response = await api.get("/Patient/get-insturance-companies");
        setInsuranceCompanies(response.data);
      } catch (error) {
        console.error("Error fetching insurance companies:", error);
        setMessage("Error fetching insurance companies. Please try again.");
      }
    };

    fetchFormStructure();
    fetchInsuranceCompanies();
  }, []);

  useEffect(() => {
    const fetchPlans = async () => {
      if (formData.insuranceCompanyId) {
        try {
          const response = await api.get(
            `/Patient/get-plans?insuranceCompany=${formData.insuranceCompanyId}`
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
  }, [formData.insuranceCompanyId]);

  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;
    const newValue = type === "checkbox" ? checked : value;
    setFormData((prev) => ({ ...prev, [name]: newValue }));
    const field = formFields.find((f) => f.name === name);
    validateField(field, newValue, setFormErrors);

    if (name === "insuranceCompanyId") {
      setFormData((prev) => ({ ...prev, planId: "" }));
    }
  };

  const handleDateChange = (name, date) => {
    setFormData((prev) => ({ ...prev, [name]: date }));
    const field = formFields.find((f) => f.name === name);
    validateField(field, date, setFormErrors);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    validateAllFields(formFields, formData, setFormErrors);

    if (Object.keys(formErrors).length > 0) {
      setMessage("Please correct the errors before submitting.");
      return;
    }

    try {
      await api.post("/Patient/add-patient", formData);
      setMessage("Patient added successfully!");
      const defaultFormData = formFields.reduce((acc, field) => {
        if (field.type.toLowerCase() === "datetime" && field.defaultValue) {
          acc[field.name] = new Date(field.defaultValue);
        } else {
          acc[field.name] = field.defaultValue;
        }
        return acc;
      }, {});
      setFormData(defaultFormData);
      setFormErrors({});
    } catch (error) {
      console.error("Error adding patient:", error);
      setMessage("Error adding patient. Please try again.");
    }
  };

  const renderSpecialFields = () => {
    return (
      <>
        {renderSelectField(
          {
            name: "insuranceCompanyId",
            label: "Insurance Company",
            isRequired: true,
          },
          formData,
          handleChange,
          insuranceCompanies.map((company) => ({
            value: company.insuranceCompanyId,
            label: company.name,
          }))
        )}
        {renderSelectField(
          { name: "planId", label: "Plan", isRequired: true },
          formData,
          handleChange,
          plans.map((plan) => ({
            value: plan.planId,
            label: plan.planName,
          })),
          "insuranceCompanyId"
        )}
      </>
    );
  };

  const renderFormFields = () => {
    const nonBoolFields = formFields.filter(
      (field) => field.type.toLowerCase() !== "bool"
    );
    const boolFields = formFields.filter(
      (field) => field.type.toLowerCase() === "bool"
    );

    return (
      <>
        {nonBoolFields.map((field) => (
          <React.Fragment key={field.name}>
            {renderFormField(
              field,
              formData,
              handleChange,
              handleDateChange,
              formErrors
            )}
          </React.Fragment>
        ))}
        {renderSpecialFields()}
        {boolFields.map((field) => (
          <React.Fragment key={field.name}>
            {renderFormField(
              field,
              formData,
              handleChange,
              handleDateChange,
              formErrors
            )}
          </React.Fragment>
        ))}
      </>
    );
  };

  return (
    <Box sx={{ mt: 2, width: "100%" }}>
      <Paper elevation={3} sx={{ p: 2, maxWidth: 400, margin: "0 auto" }}>
        <Typography variant="h6" gutterBottom sx={{ mb: 1 }}>
          Add Patient
        </Typography>
        <form onSubmit={handleSubmit}>
          {renderFormFields()}
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
