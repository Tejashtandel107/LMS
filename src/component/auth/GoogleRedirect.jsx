import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { redirectUser } from "./redirectUser";

function GoogleRedirect() {
  const BASE_URL = import.meta.env.VITE_BASE_URL;
  const location = useLocation();
  const navigate = useNavigate();

  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const loginWithGoogle = async () => {
      try {
        const params = new URLSearchParams(location.search);
        const accessToken = params.get("access_token");

        if (!accessToken) {
          setErrorMsg("No access_token found. Please start login from Strapi Google button.");
          return;
        }

        const response = await axios.get(
          `${BASE_URL}/api/auth/google/callback?access_token=${accessToken}`
        );

        const jwt = response.data.jwt;

        const userRes = await axios.get(`${BASE_URL}/api/users/me?populate=*`, {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        });

        localStorage.setItem("token", jwt);
        localStorage.setItem("user", JSON.stringify(userRes.data));

        redirectUser(userRes.data, navigate);
      } catch (error) {
        console.log("Google Login Error:", error.response?.data || error);
        setErrorMsg(
           "Google login failed"
        );
        setTimeout(()=>{
            navigate('/login');
        },2000)
      }
    };

    loginWithGoogle();
  }, [BASE_URL, location.search, navigate]);

  return (
    <div className="container min-vh-100 d-flex align-items-center justify-content-center">
      {errorMsg ? (
        <div className="alert alert-danger">{errorMsg}</div>
      ) : (
        <h4>Google login processing...</h4>
      )}
    </div>
  );
}

export default GoogleRedirect;