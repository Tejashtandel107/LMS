import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form"
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useNavigate } from "react-router";

function Register() {
  const BASE_URL = import.meta.env.VITE_BASE_URL;
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const navigate = useNavigate();

  const validationSchema = z.object({
    username: z.string().min(2, { message: "Username is required" }),
    email: z.string().email({ message: "Invalid email format" }),
    password: z.string().min(6, { message: "Password must be at least 6 characters" }),
    confirmPassword: z.string().min(6, { message: "Please confirm your password" })
  }).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"]
  });

   const onSubmit = async(data)=>{
    try{
      const response = await axios.post(`${BASE_URL}/api/auth/local/register`, {
        username: data.username,
        email: data.email,
        password: data.password,
      });
      setErrorMsg("");
      setSuccessMsg("Registration successful! You can now log in.");
      setTimeout(() => {
        navigate("/student/learning");
      }, 2000);
    }
   catch (error) {
      setSuccessMsg("");
      const apiError =
        error.response?.data?.error?.message || "Error occurred while registering. Please try again.";
      setErrorMsg(apiError);
    }
   }
   const {register,handleSubmit,watch,formState: { errors }} =  
      useForm({resolver: zodResolver(validationSchema)})

  return (
    <>
    <title>Register | Learning Management System</title>
    <div className="container-fluid p-0">
      <div className="row g-0 min-vh-100">

        {/* Left Side */}
        <div className="col-lg-6 d-none d-lg-flex bg-success text-white align-items-center justify-content-center">
          <div className="text-center px-5">
            <h1 className="display-4 fw-bold mb-4">
              Join Our LMS
            </h1>

            <p className="fs-5 opacity-75">
              Create your account and start learning from anywhere.
            </p>

            <img
              src="https://cdn-icons-png.flaticon.com/512/3135/3135789.png"
              alt="Register"
              className="img-fluid mt-4"
              style={{ maxWidth: "300px" }}
            />
          </div>
        </div>

        {/* Right Side */}
        <div className="col-lg-6 bg-light d-flex align-items-center justify-content-center">
          <div
            className="bg-white shadow-lg rounded-4 p-5"
            style={{ width: "100%", maxWidth: "550px" }}
          >
            <div className="text-center mb-4">
              <h2 className="fw-bold">Create Account 🚀</h2>
              <p className="text-muted">
                Start your learning journey today
              </p>
            </div>
            {errorMsg && <div className="alert alert-danger">{errorMsg}</div>}
            {successMsg && <div className="alert alert-success">{successMsg}</div>}

            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="mb-3">
                <label className="form-label fw-semibold">
                  Username
                </label>
                <input
                  type="text"
                  className="form-control form-control-lg"
                  placeholder="Enter your username"
                  {...register("username", { required: 'Username is required' })}
                />
                {errors.username && <small  className="text-danger">{errors.username.message}</small>}
              </div>

              <div className="mb-3">
                <label className="form-label fw-semibold">
                  Email Address
                </label>
                <input
                  type="email"
                  className="form-control form-control-lg"
                  placeholder="john@example.com"
                  {...register("email", { required: 'Email is required' })}
                />
                {errors.email && <small className="text-danger">{errors.email.message}</small>}
              </div>

              <div className="mb-3">
                <label className="form-label fw-semibold">
                  Password
                </label>
                <input
                  type="password"
                  className="form-control form-control-lg"
                  placeholder="Create password"
                  {...register("password", { required: 'Password is required' })}
                />
                {errors.password && <small className="text-danger">{errors.password.message}</small>}
              </div>

              <div className="mb-4">
                <label className="form-label fw-semibold">
                  Confirm Password
                </label>
                <input
                  type="password"
                  className="form-control form-control-lg"
                  placeholder="Confirm password" 
                  {...register("confirmPassword", { required: 'Please confirm your password' ,
                    validate:value => value === watch('password') || 'Passwords do not match'}
                  )}
                />
                {errors.confirmPassword && <small className="text-danger">{errors.confirmPassword.message}</small>}
              </div>

              <button
                type="submit"
                className="btn btn-success btn-lg w-100"
              >
                Create Account
              </button>
              <div className="text-center mt-4">
                <span className="text-muted">
                  Already have an account?
                </span>{" "}
                <Link
                  to="/login"
                  className="fw-bold text-decoration-none"
                >
                  Sign In
                </Link>
              </div>
            </form>
          </div>
        </div>

      </div>
    </div>
    </>
  );
}

export default Register;