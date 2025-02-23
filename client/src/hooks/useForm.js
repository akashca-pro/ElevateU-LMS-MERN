import { useState } from "react";

const useForm = () =>{

    const [formData,setFormData] =  useState({
        firstName : '',
        email : '',
        password : '',
        confirmPassword : ''
     })

     const [errors,setErrors] = useState({});
     const [showPassword,setShowPassword] = useState(false);
     const [showConfirmPassword,setShowConfirmPassword] = useState(false);

    // Toggle password visibility
     const togglePasswordVisibility = () => setShowPassword((prev) => !prev);
     const toggleConfirmPasswordVisibility = () => setShowConfirmPassword((prev)=>!prev);

    // password strength validation
    
    const checkPasswordStrength = (password) => 
        password.length < 6 
        ? 'Too short'
        : !/\d/.test(password)
        ? "Must include number"
        : !/[!@#$%^&*]/.test(password) 
        ? "Must include a special character" 
        : "" ;
        
    const validateForm = (name,value) =>{
        const error = 
            name === 'firstName' && value.length < 3 
            ? "Username must be at least 3 characters long." 
            : name === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
            ? "Invalid email format" 
            : name === 'password'
            ? checkPasswordStrength(value)
            : name === 'confirmPassword' && value != formData.password
            ? "Password do not match" 
            : '';

        setErrors((prevError)=> ({ ...prevError , [name] : error }) )
    };

    const handleChange =(e)=>{
        const {name , value} = e.target;
        setFormData((prev)=>({...prev , [name] : value}));
        validateForm(name,value);
    }

    return {
        formData,
        errors,
        handleChange,
        showPassword,
        showConfirmPassword,
        togglePasswordVisibility,
        toggleConfirmPasswordVisibility
    }

}

export default useForm