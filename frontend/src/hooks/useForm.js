import { useState, useCallback } from 'react';

const useForm = (initialValues = {}, validationSchema = null) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle input change
  const handleChange = useCallback((name, value) => {
    setValues(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  }, [errors]);

  // Handle input blur
  const handleBlur = useCallback((name) => {
    setTouched(prev => ({
      ...prev,
      [name]: true
    }));

    // Validate field on blur if validation schema exists
    if (validationSchema) {
      validateField(name, values[name]);
    }
  }, [values, validationSchema]);

  // Validate single field
  const validateField = useCallback((name, value) => {
    if (!validationSchema || !validationSchema[name]) return true;

    const fieldValidation = validationSchema[name];
    let error = '';

    // Required validation
    if (fieldValidation.required && !value) {
      error = fieldValidation.message || `${name} is required`;
    }

    // Min length validation
    if (fieldValidation.minLength && value && value.length < fieldValidation.minLength) {
      error = fieldValidation.message || `${name} must be at least ${fieldValidation.minLength} characters`;
    }

    // Max length validation
    if (fieldValidation.maxLength && value && value.length > fieldValidation.maxLength) {
      error = fieldValidation.message || `${name} must be at most ${fieldValidation.maxLength} characters`;
    }

    // Pattern validation
    if (fieldValidation.pattern && value && !fieldValidation.pattern.test(value)) {
      error = fieldValidation.message || `${name} is invalid`;
    }

    // Custom validation
    if (fieldValidation.validate && value) {
      const customError = fieldValidation.validate(value, values);
      if (customError) error = customError;
    }

    setErrors(prev => ({
      ...prev,
      [name]: error
    }));

    return !error;
  }, [values, validationSchema]);

  // Validate all fields
  const validateForm = useCallback(() => {
    if (!validationSchema) return true;

    const newErrors = {};
    let isValid = true;

    Object.keys(validationSchema).forEach(fieldName => {
      const fieldValidation = validationSchema[fieldName];
      const value = values[fieldName];
      let error = '';

      // Required validation
      if (fieldValidation.required && !value) {
        error = fieldValidation.message || `${fieldName} is required`;
        isValid = false;
      }

      // Min length validation
      if (fieldValidation.minLength && value && value.length < fieldValidation.minLength) {
        error = fieldValidation.message || `${fieldName} must be at least ${fieldValidation.minLength} characters`;
        isValid = false;
      }

      // Max length validation
      if (fieldValidation.maxLength && value && value.length > fieldValidation.maxLength) {
        error = fieldValidation.message || `${fieldName} must be at most ${fieldValidation.maxLength} characters`;
        isValid = false;
      }

      // Pattern validation
      if (fieldValidation.pattern && value && !fieldValidation.pattern.test(value)) {
        error = fieldValidation.message || `${fieldName} is invalid`;
        isValid = false;
      }

      // Custom validation
      if (fieldValidation.validate && value) {
        const customError = fieldValidation.validate(value, values);
        if (customError) {
          error = customError;
          isValid = false;
        }
      }

      if (error) {
        newErrors[fieldName] = error;
      }
    });

    setErrors(newErrors);
    return isValid;
  }, [values, validationSchema]);

  // Handle form submission
  const handleSubmit = useCallback((onSubmit) => {
    return async (e) => {
      if (e) e.preventDefault();

      const isValid = validateForm();
      
      if (!isValid) {
        // Mark all fields as touched to show errors
        const allTouched = Object.keys(values).reduce((acc, key) => {
          acc[key] = true;
          return acc;
        }, {});
        setTouched(allTouched);
        return;
      }

      setIsSubmitting(true);

      try {
        await onSubmit(values);
      } catch (error) {
        console.error('Form submission error:', error);
      } finally {
        setIsSubmitting(false);
      }
    };
  }, [values, validateForm]);

  // Reset form
  const resetForm = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
    setIsSubmitting(false);
  }, [initialValues]);

  // Set form values
  const setFormValues = useCallback((newValues) => {
    setValues(prev => ({
      ...prev,
      ...newValues
    }));
  }, []);

  // Set form errors
  const setFormErrors = useCallback((newErrors) => {
    setErrors(prev => ({
      ...prev,
      ...newErrors
    }));
  }, []);

  // Get field props for easy integration
  const getFieldProps = useCallback((name) => {
    return {
      name,
      value: values[name] || '',
      onChange: (e) => handleChange(name, e.target.value),
      onBlur: () => handleBlur(name),
      error: touched[name] ? errors[name] : ''
    };
  }, [values, errors, touched, handleChange, handleBlur]);

  return {
    values,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
    resetForm,
    setFormValues,
    setFormErrors,
    validateForm,
    validateField,
    getFieldProps
  };
};

export default useForm;
