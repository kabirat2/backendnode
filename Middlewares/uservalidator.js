    const yup = require("yup")
const validateUserSignUp = yup.object().shape({
    FullName: yup
      .string("FullName must be a string ")
      .min(6, "FullName must be at least 6 characters").max(20, "FullName must not be more than 20 characters")
      .required("FullName is Required"),
    Email: yup.string("Email Must be a string").email("Invalid Email").required("Email is required"),
    Password: yup
      .string("Password Must be a string")
      .min(6, "Password must not be less than 6 characters").max(20, "Password must not be more than 20 characters").matches(/^[a-zA-Z0-9@.,;']+$/, "Password must start with an uppercase letter, must contain special characters...")
      .required("Password is Required"),
  });
  
  module.exports = { validateUserSignUp };
  