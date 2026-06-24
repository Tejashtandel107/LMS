import { useEffect, useState } from "react";
import DashboardLayout from "../../dashboard/DashboardLayout";
import styles from "./AdminDashboard.module.css";
import axios from "axios";
import { Link } from "react-router-dom";

function AdminDashboard() {
  const BASE_URL = import.meta.env.VITE_BASE_URL;

  const [users, setUsers] = useState([]);
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    getUsers();
    getCourses();
  }, []);

  async function getUsers() {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.get(`${BASE_URL}/api/users?populate=*`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setUsers(response.data || []);
    } catch (error) {
      console.log("Users Error:", error.response?.data || error);
    }
  }

  async function getCourses() {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.get(`${BASE_URL}/api/courses`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setCourses(response.data.data || []);
    } catch (error) {
      console.log("Courses Error:", error.response?.data || error);
    }
  }

  const students = users.filter((user) => user.userRole === "student");
  const instructors = users.filter((user) => user.userRole === "instructor");

  return (
    <DashboardLayout role="admin">
      <h1>Admin Dashboard</h1>

      <div className="row g-3 mt-2">
        <div className="col-md-4 col-sm-6">
          <Link
            to="/admin/users?role=student"
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <div
              className={`${styles.box} d-flex justify-content-between bg-info`}
            >
              <div>
                <div>Students</div>
                <div>{students.length}</div>
              </div>

              <div className={`bi bi-people ${styles.icon}`}></div>
            </div>
          </Link>
        </div>

        <div className="col-md-4 col-sm-6">
          <Link
            to="/admin/users?role=instructor"
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <div
              className={`${styles.box} d-flex justify-content-between bg-warning`}
            >
              <div>
                <div>Instructors</div>
                <div>{instructors.length}</div>
              </div>

              <div className={`bi bi-person-workspace ${styles.icon}`}></div>
            </div>
          </Link>
        </div>

        <div className="col-md-4 col-sm-6">
          <Link
            to="/admin/courses"
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <div className={`${styles.box} d-flex justify-content-between`}>
              <div>
                <div>Courses</div>
                <div>{courses.length}</div>
              </div>

              <div className={`bi bi-book ${styles.icon}`}></div>
            </div>
          </Link>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default AdminDashboard;