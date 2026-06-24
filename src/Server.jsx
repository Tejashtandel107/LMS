import React, { useState } from "react";
import axios from "axios";

function Server() {
  const WEBHOOK_URL = "https://bungee-enlarging-document.ngrok-free.dev/webhook-test/61c526d3-4623-4b24-b9fd-069ab29f0eea";

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    course: "",
  });

  const [loading, setLoading] = useState(false);
  const [responseMsg, setResponseMsg] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setResponseMsg("");

      const res = await axios.post(WEBHOOK_URL, formData);

      console.log("n8n response:", res.data);

      if (res.data.status === "exists") {
        setResponseMsg("User already exists. Mail sent successfully.");
      } else if (res.data.status === "created") {
        setResponseMsg("New user added. Mail sent successfully.");
      } else {
        setResponseMsg("Request sent successfully.");
      }

      setFormData({
        name: "",
        email: "",
        course: "",
      });
    } catch (error) {
      console.log(error);
      setResponseMsg("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card shadow p-4">
            <h3 className="text-center mb-4">Course Enquiry Form</h3>

            {responseMsg && (
              <div className="alert alert-info">{responseMsg}</div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label>Name</label>
                <input
                  type="text"
                  name="name"
                  className="form-control"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="mb-3">
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  className="form-control"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="mb-3">
                <label>Course</label>
                <select
                  name="course"
                  className="form-control"
                  value={formData.course}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Course</option>
                  <option value="React JS">React JS</option>
                  <option value="Node JS">Node JS</option>
                  <option value="MERN Stack">MERN Stack</option>
                </select>
              </div>

              <button className="btn btn-primary w-100" disabled={loading}>
                {loading ? "Sending..." : "Submit"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Server;