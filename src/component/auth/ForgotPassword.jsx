import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

function ForgotPassword() {
  const BASE_URL = import.meta.env.VITE_BASE_URL;

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleForgotPassword = async (e) => {
    e.preventDefault();

    setSuccess("");
    setError("");

    if (!email) {
      setError("Email is required");
      return;
    }

    try {
      setLoading(true);

      await axios.post(`${BASE_URL}/api/auth/forgot-password`, {
        email,
      });

      setSuccess("Reset password link sent successfully. Please check Mailtrap inbox.");
      setEmail("");
    } catch (error) {
      console.log("Forgot Password Error:", error.response?.data || error);

      setError(
        error.response?.data?.error?.message ||
          "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid p-0">
      <div className="row g-0 min-vh-100">
        <div className="col-lg-6 d-none d-lg-flex bg-warning align-items-center justify-content-center">
          <div className="text-center px-5 text-dark">
            <h1 className="display-4 fw-bold mb-4">Reset Password</h1>

            <p className="fs-5">
              Don't worry. Enter your email and we'll send you a reset link.
            </p>

            <img
              src="https://cdn-icons-png.flaticon.com/512/6195/6195699.png"
              alt="Forgot Password"
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
              <h2 className="fw-bold">Forgot Password 🔐</h2>
              <p className="text-muted">
                Enter your email to receive a reset link.
              </p>
            </div>

            {success && (
              <div className="alert alert-success">
                {success}
              </div>
            )}

            {error && (
              <div className="alert alert-danger">
                {error}
              </div>
            )}

            <form onSubmit={handleForgotPassword}>
              <div className="mb-4">
                <label className="form-label fw-semibold">
                  Email Address
                </label>
                <input
                  type="email"
                  className="form-control form-control-lg"
                  placeholder="john@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <button
                type="submit"
                className="btn btn-warning btn-lg w-100"
                disabled={loading}
              >
                {loading ? "Sending..." : "Send Reset Link"}
              </button>

              <div className="text-center mt-4">
                <Link to="/login" className="text-decoration-none fw-bold">
                  ← Back to Login
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;