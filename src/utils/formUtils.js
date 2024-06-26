// src/utils/formUtils.js
import React from "react";
import {
  TextField,
  Checkbox,
  FormControlLabel,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";

export const renderTextField = (field, formData, handleChange, formErrors) => {
  const commonProps = {
    fullWidth: true,
    label: field.name,
    name: field.name,
    value: formData[field.name] || "",
    onChange: handleChange,
    required: field.isRequired,
    error: !!formErrors[field.name],
    helperText: formErrors[field.name],
    margin: "dense",
    size: "small",
    sx: { mb: 1 },
  };

  return <TextField {...commonProps} />;
};

export const renderNumberField = (
  field,
  formData,
  handleChange,
  formErrors
) => {
  const commonProps = {
    ...renderTextField(field, formData, handleChange, formErrors).props,
    type: "number",
  };

  return <TextField {...commonProps} />;
};

export const renderDateField = (
  field,
  formData,
  handleDateChange,
  formErrors
) => {
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <DatePicker
        label={field.name}
        value={formData[field.name] || null}
        onChange={(date) => handleDateChange(field.name, date)}
        renderInput={(params) => (
          <TextField
            {...params}
            fullWidth
            margin="dense"
            required={field.isRequired}
            size="small"
            error={!!formErrors[field.name]}
            helperText={formErrors[field.name]}
            sx={{
              mb: 1,
              width: "100%",
              "& .MuiInputBase-root": {
                height: "40px",
                width: "100%",
              },
              "& .MuiInputBase-input": {
                padding: "8.5px 14px",
                height: "23px",
              },
            }}
          />
        )}
        sx={{ width: "100%" }}
      />
    </LocalizationProvider>
  );
};

export const renderBooleanField = (field, formData, handleChange) => {
  return (
    <FormControlLabel
      control={
        <Checkbox
          checked={formData[field.name] || false}
          onChange={handleChange}
          name={field.name}
        />
      }
      label={field.name}
      sx={{ mb: 1 }}
    />
  );
};

export const renderSelectField = (
  field,
  formData,
  handleChange,
  options,
  dependentField = null
) => {
  return (
    <FormControl fullWidth margin="dense" size="small" sx={{ mb: 1 }}>
      <InputLabel
        id={`${field.name}-label`}
        shrink={true}
        sx={{
          backgroundColor: "white",
          px: 0.5,
          transform: "translate(14px, -9px) scale(0.75)",
          "&.Mui-focused": {
            color: "primary.main",
          },
        }}
      >
        {field.label || field.name}
      </InputLabel>
      <Select
        labelId={`${field.name}-label`}
        name={field.name}
        value={formData[field.name] || ""}
        onChange={handleChange}
        required={field.isRequired}
        disabled={dependentField && !formData[dependentField]}
        sx={{
          height: "40px",
          "& .MuiSelect-select": {
            paddingTop: "8px",
            paddingBottom: "8px",
          },
        }}
        MenuProps={{
          PaperProps: {
            style: {
              maxHeight: 48 * 4.5 + 8,
              width: 250,
            },
          },
        }}
      >
        <MenuItem value="" disabled>
          <em>Select {field.label || field.name}</em>
        </MenuItem>
        {options.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export const renderFormField = (
  field,
  formData,
  handleChange,
  handleDateChange,
  formErrors
) => {
  switch (field.type.toLowerCase()) {
    case "string":
      return renderTextField(field, formData, handleChange, formErrors);
    case "int":
    case "decimal":
      return renderNumberField(field, formData, handleChange, formErrors);
    case "datetime":
      return renderDateField(field, formData, handleDateChange, formErrors);
    case "bool":
      return renderBooleanField(field, formData, handleChange);
    default:
      return null;
  }
};
