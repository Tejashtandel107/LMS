import React, { useEffect, useState } from "react";
import DashboardLayout from "../../dashboard/DashboardLayout";
import styles from "./ManageCourses.module.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
const API_URL = import.meta.env.VITE_BASE_URL;

function ManageCourses() {
  const token = localStorage.getItem('token');
  const [courses,setCourses] = useState([]);

  const navigate = useNavigate();
  useEffect(()=>{
    getCourses();
  },[]);

  async function getCourses(){
     try {
      const user = JSON.parse(localStorage.getItem("user"));
      const response = await axios.get(`${API_URL}/api/courses?populate=*&filters[instructor][id][$eq]=${user.id}`,{
        headers : {
          Authorization : `Bearer ${token}`
        }
      });
      setCourses(response.data.data || []);
    } catch (error) {
      console.log("Error:", error);
    }
  }

  const handleAddCourse = () => {
    navigate("/instructor/create-course");
  };

  const handleDelete = async (documentId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this course?");

    if (!confirmDelete) return;

    try {
      await axios.delete(`${API_URL}/api/courses/${documentId}`,{
        headers:{
          Authorization: `Bearer ${token}`
        }
      });

      alert("Course deleted successfully");

      setCourses((prevCourses) =>
        prevCourses.filter((course) => course.documentId !== documentId)
      );
    } catch (error) {
      console.error("Delete Course Error:", error.response?.data || error);
      alert("Course delete failed");
    }
  };

  return (
    <DashboardLayout role="instructor">
      <div className={`${styles.page} ms-5`}>
        <div className={styles.header}>
          <div>
            <h2 className="fw-bold mb-1">My courses</h2>
            <p className="text-muted mb-0">
              Manage, publish, and edit your course catalog.
            </p>
          </div>
          <button className={styles.addBtn} onClick={handleAddCourse}>
            <i className="bi bi-plus-lg me-2"></i>New course
          </button>
        </div>

        <div className={styles.tableCard}>
          <table className="table align-middle mb-0">
            <thead>
              <tr>
                <th>COURSE</th>
                <th>PRICE</th>
                <th className="text-end">ACTIONS</th>
              </tr>
            </thead>

            <tbody>
              {courses.length > 0 ? (
                courses.map((course, index) => (
                <tr key={index}>
                  <td>
                    <div className="d-flex align-items-center gap-3">
                      <img
                        src={`${API_URL}${course.thumbnail?.url}`}
                        alt={course.title}
                        className={styles.courseImg}
                      />
                      <div>
                        <h6 className="fw-bold mb-1">
                          {course.title}
                        </h6>
                        <small className="text-muted">
                           {course.category?.name || "No category"}
                        </small>
                      </div>
                    </div>
                  </td>
                  <td className="fw-bold">{course.price}</td>
                  <td>
                    <div className="d-flex justify-content-end gap-3">
                      <button
                        className={styles.editBtn}
                        onClick={() => navigate(`/courses/edit/${course.documentId}`)}
                      >
                        <i className="bi bi-pencil"></i>
                      </button>

                      <button className={styles.deleteBtn} onClick={()=> handleDelete(course.documentId)}>
                        <i className="bi bi-trash"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
              ) : (
                <tr>
                  <td colSpan="3" className="text-center py-5">
                    <h5 className="mb-2">No courses created yet</h5>
                    <p className="text-muted mb-0">
                      Click "New course" to create your first course.
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default ManageCourses;