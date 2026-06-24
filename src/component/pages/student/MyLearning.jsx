import React, { useEffect, useState } from "react";
import axios from "axios";
import DashboardLayout from "../../dashboard/DashboardLayout";
import { useNavigate } from "react-router-dom";

function MyLearning() {
  const BASE_URL = import.meta.env.VITE_BASE_URL;
  const navigate = useNavigate();

  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    getMyCourses();
  }, []);

  const getMyCourses = async () => {
    try {
      const res = await axios.get(
        `${BASE_URL}/api/enrollments?filters[student][id][$eq]=${user.id}&populate[course][populate][thumbnail]=true`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setEnrollments(res.data.data);
    } catch (error) {
      console.log("My Learning Error:", error.response?.data || error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout role="student">
      <h2 className="fw-bold mb-4">My Learning</h2>

      {loading ? (
        <div className="spinner-border text-primary"></div>
      ) : enrollments.length === 0 ? (
        <div className="alert alert-info">
          You have not enrolled in any course yet.
        </div>
      ) : (
        <div className="row g-4">
          {enrollments.map((enrollment) => {
            const course = enrollment.course;

            const imageUrl = course?.thumbnail?.url
              ? `${BASE_URL}${course.thumbnail.url}`
              : "https://via.placeholder.com/300x180";

            return (
              <div className="col-md-6 col-lg-4" key={enrollment.id}>
                <div className="card h-100 border-0 shadow-sm rounded-4 overflow-hidden">
                  <img
                    src={imageUrl}
                    alt={course?.title}
                    className="card-img-top"
                    style={{
                      height: "180px",
                      objectFit: "cover",
                    }}
                  />

                  <div className="card-body">
                    <h5 className="fw-bold">{course?.title}</h5>

                    <p className="text-muted small">
                      {course?.description?.slice(0, 80)}...
                    </p>

                    <button
                      className="btn btn-primary w-100"
                      onClick={() => navigate(`/course/${course.documentId}`)}
                    >
                      Continue Learning
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </DashboardLayout>
  );
}

export default MyLearning;