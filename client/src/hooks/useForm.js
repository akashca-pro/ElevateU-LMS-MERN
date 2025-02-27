import { useState } from "react";

const useForm = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    dob: "",
    bio: "",
    profileImage: null,
    email: "",
    password: "",
    confirmPassword: "",
    expertise : [],
    experience : ''
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Toggle password visibility
  const togglePasswordVisibility = () => setShowPassword((prev) => !prev);
  const toggleConfirmPasswordVisibility = () => setShowConfirmPassword((prev) => !prev);

  // Password strength validation
  const checkPasswordStrength = (password) =>
    password.length < 6
      ? "Too short"
      : !/\d/.test(password)
      ? "Must include a number"
      : !/[!@#$%^&*]/.test(password)
      ? "Must include a special character"
      : "";

  // Validation function
  const validateForm = (name, value) => {
    let error = "";
  
    if (name === "firstName" || name === "lastName") {
      error = value.length < 3 ? "Must be at least 3 characters long." : "";
    } else if (name === "email") {
      error = !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? "Invalid email format" : "";
    } else if (name === "password") {
      error = checkPasswordStrength(value);
    } else if (name === "confirmPassword") {
      error = value !== formData.password ? "Passwords do not match" : "";
    } else if (name === "dob") {
      error = value === "" ? "Birthday is required!" : "";
    }else if (name === "phone") {
      if (!/^\d{10}$/.test(value)) {
        error = "Phone number must be 10 digits long"; 
      }
    }
  
    setErrors((prevErrors) => ({ ...prevErrors, [name]: error }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    validateForm(name, value); 
  };
  return {
    formData,
    errors,
    handleChange,
    showPassword,
    showConfirmPassword,
    togglePasswordVisibility,
    toggleConfirmPasswordVisibility,
    setFormData
  };
};

export default useForm;