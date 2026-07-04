import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'

function Hero() {
  const BASE_URL = import.meta.env.VITE_BASE_URL;

  const [users,setUsers] = useState([]);
  const [courses,setCourses] = useState([]);

  const fetchUsers = async()=>{
    const res = await axios.get(`${BASE_URL}/api/users`);
    setUsers(res.data);
  }

  const fetchCourses = async()=>{
    const res = await axios.get(`${BASE_URL}/api/courses`);
    setCourses(res.data.data);
  }

  const students = users.filter((user)=> user.userRole == 'student');
  const instuctors = users.filter((user)=> user.userRole == 'instructor');

  useEffect(()=>{
    fetchUsers();
    fetchCourses();
  },[]);
  return (
    <>
      <section
        className="py-5"
        style={{
          background:
            "linear-gradient(90deg,#f1efff 0%, #eaf8ff 100%)",
          minHeight: "90vh",
        }}
      >
        <div className="container">

          {/* Heading */}
          <div className="text-center">
            <h1
              className="fw-bold"
              style={{
                fontSize: "clamp(3rem,8vw,6rem)",
                lineHeight: "1.1",
              }}
            >
              Learn anything,
              <span
                style={{
                  background:
                    "linear-gradient(135deg,#4F46E5,#8B5CF6)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                {" "}taught by experts.
              </span>
            </h1>

            <p
              className="mx-auto mt-4 text-secondary"
              style={{
                maxWidth: "700px",
                fontSize: "1.25rem",
              }}
            >
              Project-based courses in design, development,
              data and business from instructors who actually ship.
            </p>

            <div className="mt-5 d-flex justify-content-center gap-3 flex-wrap">
              <Link to="/course" className="btn btn-primary btn-lg px-5 rounded-4">
                Browse Courses →
              </Link>
            </div>

            {/* Stats */}
            <div className="row mt-5 pt-5 justify-content-center">
              <div className="col-4 col-md-2">
                <h2 className="fw-bold">{courses.length || 0}</h2>
                <p className="text-uppercase text-muted small">
                  Courses
                </p>
              </div>

              <div className="col-4 col-md-2">
                <h2 className="fw-bold">{instuctors.length || 0}</h2>
                <p className="text-uppercase text-muted small">
                  Instructors
                </p>
              </div>

              <div className="col-4 col-md-2">
                <h2 className="fw-bold">{students.length || 0}</h2>
                <p className="text-uppercase text-muted small">
                  Students
                </p>
              </div>
            </div>
          </div>

        </div>
      </section>
    </>
  )
}

export default Hero
