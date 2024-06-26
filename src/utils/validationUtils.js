// src/utils/validationUtils.js

export const validateField = (field, value, setFormErrors) => {
  if (field && field.validationRegex) {
    const regex = new RegExp(field.validationRegex);
    if (!regex.test(value)) {
      setFormErrors((prev) => ({
        ...prev,
        [field.name]: `Invalid ${field.name}`,
      }));
    } else {
      setFormErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field.name];
        return newErrors;
      });
    }
  }
};

export const validateAllFields = (formFields, formData, setFormErrors) => {
  formFields.forEach((field) => {
    validateField(field, formData[field.name], setFormErrors);
  });
};
