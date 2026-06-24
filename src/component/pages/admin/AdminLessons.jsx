import React, { useEffect, useState } from "react";
import axios from "axios";
import DashboardLayout from "../../dashboard/DashboardLayout";

function AdminLessons() {
  const BASE_URL = import.meta.env.VITE_BASE_URL;
  const token = localStorage.getItem("token");

  const [courses, setCourses] = useState([]);
  const [lessons, setLessons] = useState([]);

  const [selectedCourse, setSelectedCourse] = useState("");
  const [loading, setLoading] = useState(false);

  const getCourses = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/courses?populate=*`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setCourses(res.data.data || []);
    } catch (error) {
      console.log("Courses Error:", error.response?.data || error);
    }
  };

  const getLessonsByCourse = async (courseDocumentId) => {
    if (!courseDocumentId) {
      setLessons([]);
      return;
    }

    try {
      setLoading(true);

      const res = await axios.get(
        `${BASE_URL}/api/lessons?populate=*&filters[course][documentId][$eq]=${courseDocumentId}&sort=order:asc`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setLessons(res.data.data || []);
    } catch (error) {
      console.log("Lessons Error:", error.response?.data || error);
    } finally {
      setLoading(false);
    }
  };

  const handleCourseChange = (e) => {
    const courseDocumentId = e.target.value;
    setSelectedCourse(courseDocumentId);
    getLessonsByCourse(courseDocumentId);
  };

  const handleDelete = async (lessonDocumentId) => {
    if (!window.confirm("Are you sure you want to delete this lesson?")) return;

    try {
      await axios.delete(`${BASE_URL}/api/lessons/${lessonDocumentId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setLessons((prev) =>
        prev.filter((lesson) => lesson.documentId !== lessonDocumentId)
      );
    } catch (error) {
      console.log("Delete Lesson Error:", error.response?.data || error);
    }
  };

  useEffect(() => {
    getCourses();
  }, []);

  return (
    <DashboardLayout role="admin">
      <div className="container-fluid px-4 py-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="fw-bold mb-0">Lessons</h2>
        </div>

        <div className="card border-0 shadow-sm rounded-4 p-4 mb-4">
          <label className="form-label fw-semibold">Select Course</label>

          <select
            className="form-select"
            value={selectedCourse}
            onChange={handleCourseChange}
          >
            <option value="">-- Select Course --</option>

            {courses.map((course) => (
              <option key={course.documentId} value={course.documentId}>
                {course.title}
              </option>
            ))}
          </select>
        </div>

        <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th className="ps-4">#</th>
                  <th>Lesson Title</th>
                  <th>Course</th>
                  <th>Order</th>
                  <th>Video</th>
                  <th className="text-center">Action</th>
                </tr>
              </thead>

              <tbody>
                {!selectedCourse ? (
                  <tr>
                    <td colSpan="6" className="text-center py-4 text-muted">
                      Please select a course to view lessons.
                    </td>
                  </tr>
                ) : loading ? (
                  <tr>
                    <td colSpan="6" className="text-center py-4">
                      Loading...
                    </td>
                  </tr>
                ) : lessons.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center py-4 text-muted">
                      No lessons found for this course.
                    </td>
                  </tr>
                ) : (
                  lessons.map((lesson, index) => {
                    const videoUrl = lesson.video?.url
                      ? `${BASE_URL}${lesson.video.url}`
                      : null;

                    return (
                      <tr key={lesson.documentId || lesson.id}>
                        <td className="ps-4">{index + 1}</td>

                        <td className="fw-semibold">{lesson.title}</td>

                        <td>{lesson.course?.title || "N/A"}</td>

                        <td>{lesson.order || "N/A"}</td>

                        <td>
                          {videoUrl ? (
                            <a
                              href={videoUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="btn btn-sm btn-outline-primary rounded-pill px-3"
                            >
                              <i className="bi bi-play-circle me-1"></i>
                              View Video
                            </a>
                          ) : (
                            "No Video"
                          )}
                        </td>

                        <td className="text-center">
                          <button
                            className="btn btn-sm btn-outline-danger rounded-pill px-3"
                            onClick={() => handleDelete(lesson.documentId)}
                          >
                            <i className="bi bi-trash me-1"></i>
                            Delete
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default AdminLessons;