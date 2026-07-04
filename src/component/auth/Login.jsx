import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { redirectUser } from "./redirectUser";

const loginSchema = z.object({
  identifier: z
  .string()
  .min(1, "Email or Username is required"),

  password: z
    .string()
    .min(1, "Password is required")
    .min(6, "Password must be at least 6 characters"),
});

function Login() {
  const navigate = useNavigate();
  const BASE_URL = import.meta.env.VITE_BASE_URL;

  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const {register,handleSubmit,formState: { errors, isSubmitting }} = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      identifier: "",
      password: "",
    },
  });

  const onSubmit = async (data) => {
    setErrorMsg("");
    setSuccessMsg("");

    try {
      const response = await axios.post(`${BASE_URL}/api/auth/local`, {
        identifier: data.identifier,
        password: data.password,
      });

      const users = await axios.get(`${BASE_URL}/api/users/me?populate=*`,{
        headers:{
          Authorization : `Bearer ${response.data.jwt}`
        }
      });
      
      localStorage.setItem("token", response.data.jwt);
      localStorage.setItem("user", JSON.stringify(users.data));

      setSuccessMsg("Login successful! Redirecting...");

      setTimeout(() => {
        redirectUser(response.data.user, navigate);
      }, 1200);
    } catch (error) {
      console.error("Login Error:", error.response?.data || error);

      setErrorMsg(
        error.response?.data?.error?.message || "Invalid email or password"
      );
    }
  };

  return (
    <>
    <title>Login | Learning Management System</title>
    <div className="container-fluid p-0">
      <div className="row g-0 min-vh-100">
        <div className="col-lg-6 d-none d-lg-flex bg-primary text-white align-items-center justify-content-center">
          <div className="text-center px-5">
            <h1 className="display-4 fw-bold mb-4">
              Learning Management System
            </h1>

            <p className="fs-5 opacity-75">
              Access courses, track your progress, and continue your learning
              journey from anywhere.
            </p>

            <img
              src="https://cdn-icons-png.flaticon.com/512/3135/3135755.png"
              alt="Learning"
              className="img-fluid mt-4"
              style={{ maxWidth: "300px" }}
            />
          </div>
        </div>

        <div className="col-lg-6 bg-light d-flex align-items-center justify-content-center">
          <div
            className="bg-white shadow-lg rounded-4 p-5"
            style={{ width: "100%", maxWidth: "500px" }}
          >
            <div className="text-center mb-4">
              <h2 className="fw-bold">Welcome Back 👋</h2>
              <p className="text-muted">Sign in to access your account</p>
            </div>

            {successMsg && (
              <div className="alert alert-success" role="alert">
                {successMsg}
              </div>
            )}

            {errorMsg && (
              <div className="alert alert-danger" role="alert">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="mb-3">
                <label className="form-label fw-semibold"> Email or Username</label>
                <input
                  type="text"
                  className={`form-control form-control-lg ${
                    errors.identifier ? "is-invalid" : ""
                  }`}
                  placeholder="john@example.com"
                  {...register("identifier")}
                />
                <div className="invalid-feedback">
                  {errors.identifier?.message}
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label fw-semibold">Password</label>
                <input
                  type="password"
                  className={`form-control form-control-lg ${
                    errors.password ? "is-invalid" : ""
                  }`}
                  placeholder="••••••••"
                  {...register("password")}
                />
                <div className="invalid-feedback">
                  {errors.password?.message}
                </div>
              </div>

              <div className="d-flex justify-content-between align-items-center mb-4">
                <div className="form-check">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id="remember"
                  />
                  <label className="form-check-label" htmlFor="remember">
                    Remember me
                  </label>
                </div>

                <Link to="/forgot-password" className="text-decoration-none">
                  Forgot Password?
                </Link>
              </div>

              <button
                type="submit"
                className="btn btn-primary btn-lg w-100"
                disabled={isSubmitting || successMsg}
              >
                {isSubmitting ? "Signing In..." : "Sign In"}
              </button>

              <div className="text-center my-4 text-muted">
                ───── OR ─────
              </div>

             <button
                type="button"
                className="btn btn-light border shadow-sm w-100 d-flex align-items-center justify-content-center gap-2 py-3 fw-semibold"
                onClick={() => {
                  window.location.href = `${BASE_URL}/api/connect/google`;
                }}
              >
                <img
                  src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                  alt="Google"
                  width="22"
                  height="22"
                />
                Continue with Google
              </button>

              <div className="text-center mt-4">
                <span className="text-muted">Don't have an account?</span>{" "}
                <Link to="/register" className="fw-bold text-decoration-none">
                  Create Account
                </Link>
              </div>

              <div className="text-center mt-3">
                <Link to="/" className="text-decoration-none">
                  ← Back to Home
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

export default Login;