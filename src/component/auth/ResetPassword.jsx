import React, { useActionState, useReducer } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const initialState = {
  password: "",
  passwordConfirmation: "",
};

function reducer(state, action) {
  switch (action.type) {
    case "CHANGE":
      return {
        ...state,
        [action.name]: action.value,
      };

    case "RESET":
      return initialState;

    default:
      return state;
  }
}

function ResetPassword() {
  const BASE_URL = import.meta.env.VITE_BASE_URL;
  const location = useLocation();
  const navigate = useNavigate();

  const params = new URLSearchParams(location.search);
  const code = params.get("code");

  const [formData, dispatchForm] = useReducer(reducer, initialState);

  const resetPasswordAction = async (prevState, formDataObj) => {
    const password = formData.password;
    const passwordConfirmation = formData.passwordConfirmation;

    if (!code) {
      return {
        error: "Invalid reset password link.",
        success: "",
      };
    }

    if (!password || !passwordConfirmation) {
      return {
        error: "Both password fields are required.",
        success: "",
      };
    }

    if (password.length < 6) {
      return {
        error: "Password must be at least 6 characters.",
        success: "",
      };
    }

    if (password !== passwordConfirmation) {
      return {
        error: "Password and confirm password do not match.",
        success: "",
      };
    }

    try {
      await axios.post(`${BASE_URL}/api/auth/reset-password`, {
        code,
        password,
        passwordConfirmation,
      });

      dispatchForm({ type: "RESET" });

      setTimeout(() => {
        navigate("/login");
      }, 1500);

      return {
        success: "Password reset successfully. Redirecting to login...",
        error: "",
      };
    } catch (error) {
      return {
        success: "",
        error:
          error.response?.data?.error?.message ||
          "Password reset failed. Please try again.",
      };
    }
  };

  const [state, formAction, isPending] = useActionState(
    resetPasswordAction,
    {
      success: "",
      error: "",
    }
  );

  return (
    <>
    <title>Reset Password | Learning Management System</title>
    <div className="container-fluid p-0">
      <div className="row g-0 min-vh-100">
        <div className="col-lg-6 d-none d-lg-flex bg-info text-white align-items-center justify-content-center">
          <div className="text-center px-5">
            <h1 className="display-4 fw-bold mb-4">Create New Password</h1>

            <p className="fs-5 opacity-75">
              Choose a strong password to keep your account secure.
            </p>

            <img
              src="https://cdn-icons-png.flaticon.com/512/3064/3064155.png"
              alt="Reset Password"
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
              <h2 className="fw-bold">Reset Password 🔑</h2>
              <p className="text-muted">Enter your new password below.</p>
            </div>

            {state.success && (
              <div className="alert alert-success">{state.success}</div>
            )}

            {state.error && (
              <div className="alert alert-danger">{state.error}</div>
            )}

            <form action={formAction}>
              <div className="mb-3">
                <label className="form-label fw-semibold">New Password</label>
                <input
                  type="password"
                  name="password"
                  className="form-control form-control-lg"
                  placeholder="Enter new password"
                  value={formData.password}
                  onChange={(e) =>
                    dispatchForm({
                      type: "CHANGE",
                      name: e.target.name,
                      value: e.target.value,
                    })
                  }
                />
              </div>

              <div className="mb-4">
                <label className="form-label fw-semibold">
                  Confirm Password
                </label>
                <input
                  type="password"
                  name="passwordConfirmation"
                  className="form-control form-control-lg"
                  placeholder="Confirm new password"
                  value={formData.passwordConfirmation}
                  onChange={(e) =>
                    dispatchForm({
                      type: "CHANGE",
                      name: e.target.name,
                      value: e.target.value,
                    })
                  }
                />
              </div>

              <button
                type="submit"
                className="btn btn-info text-white btn-lg w-100"
                disabled={isPending}
              >
                {isPending ? "Resetting..." : "Reset Password"}
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
    </>
  );
}

export default ResetPassword;