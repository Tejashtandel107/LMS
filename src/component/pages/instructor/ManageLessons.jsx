import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../dashboard/DashboardLayout";
import styles from "./ManageLessons.module.css";

function ManageLessons() {
  const API_URL = import.meta.env.VITE_BASE_URL;
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const [courses, setCourses] = useState([]);
  const [lessons, setLessons] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [loading, setLoading] = useState(false);
  const [courseError, setCourseError] = useState("");

  const getCourses = async () => {
    try {
      setCourseError("");

      const user = JSON.parse(localStorage.getItem("user"));

      const response = await axios.get(
        `${API_URL}/api/courses?populate=*&filters[instructor][id][$eq]=${user.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const courseList = response.data.data || [];
      setCourses(courseList);

      if (courseList.length > 0) {
        setSelectedCourse(courseList[0].documentId);
      } else {
        setSelectedCourse("");
        setLessons([]);
        setCourseError("No course found. Please create a course first.");
      }
    } catch (error) {
      console.log("Course fetch error:", error.response?.data || error);
      setCourseError("Failed to load courses");
    }
  };

  const getLessonsByCourse = async (courseDocumentId) => {
    if (!courseDocumentId) return;

    try {
      setLoading(true);

      const response = await axios.get(
        `${API_URL}/api/lessons?filters[course][documentId][$eq]=${courseDocumentId}&sort=order:asc&populate=video`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setLessons(response.data.data || []);
    } catch (error) {
      console.log("Lesson fetch error:", error.response?.data || error);
    } finally {
      setLoading(false);
    }
  };

  const handleCourseChange = (e) => {
    setSelectedCourse(e.target.value);
  };

  const handleDeleteLesson = async (documentId) => {
    if (!window.confirm("Are you sure you want to delete this lesson?")) return;

    try {
      await axios.delete(`${API_URL}/api/lessons/${documentId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      getLessonsByCourse(selectedCourse);
    } catch (error) {
      console.log("Delete lesson error:", error.response?.data || error);
      alert("Failed to delete lesson");
    }
  };

  useEffect(() => {
    getCourses();
  }, []);

  useEffect(() => {
    if (selectedCourse) {
      getLessonsByCourse(selectedCourse);
    }
  }, [selectedCourse]);

  return (
    <DashboardLayout role="instructor">
      <div className={`${styles.lessonPage} ms-5`}>
        <div className="d-flex justify-content-between align-items-start mb-4">
          <div>
            <h2 className="fw-bold mb-1">Manage lessons</h2>
            <p className="text-muted mb-0">
              Reorder, edit, or add lessons to your courses.
            </p>
          </div>

          <button
            className="btn btn-primary rounded-3 px-4"
            onClick={() => navigate("/instructor/create-lessons")}
            disabled={courses.length === 0}
          >
            <i className="bi bi-plus-lg me-2"></i>
            Add lesson
          </button>
        </div>

        {courseError && (
          <div className="alert alert-warning rounded-3">
            {courseError}
          </div>
        )}

        <div className="mb-3">
          <select
            className={`form-select ${styles.courseSelect}`}
            value={selectedCourse}
            onChange={handleCourseChange}
            disabled={courses.length === 0}
          >
            <option value="">Select Course</option>

            {courses.map((course) => (
              <option key={course.id} value={course.documentId}>
                {course.title}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.lessonCard}>
          {courses.length === 0 ? (
            <div className="text-center py-5 text-muted">
              <i className="bi bi-journal-bookmark fs-1"></i>
              <h5 className="mt-3">No course created yet</h5>
              <p>Please create a course before adding lessons.</p>

              <button
                className="btn btn-primary rounded-3 px-4 mt-2"
                onClick={() => navigate("/instructor/create-course")}
              >
                <i className="bi bi-plus-lg me-2"></i>
                Create Course
              </button>
            </div>
          ) : loading ? (
            <div className="text-center py-4 text-muted">
              Loading lessons...
            </div>
          ) : lessons.length === 0 ? (
            <div className="text-center py-4 text-muted">
              No lessons found for this course.
            </div>
          ) : (
            lessons.map((lesson, index) => {
              const videoUrl = lesson.video?.url
                ? `${API_URL}${lesson.video.url}`
                : null;

              return (
                <div key={lesson.id} className={styles.lessonItem}>
                  <div className="d-flex align-items-center gap-3">
                    <i className="bi bi-grip-vertical text-muted"></i>

                    <span className={styles.lessonNumber}>
                      {lesson.order || index + 1}
                    </span>

                    <strong>{lesson.title}</strong>
                  </div>

                  <div className="d-flex align-items-center gap-3">
                    {videoUrl ? (
                      <a
                        href={videoUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-decoration-none small"
                      >
                        <i className="bi bi-play-circle me-1"></i>
                        View Video
                      </a>
                    ) : (
                      <small className="text-muted">No video</small>
                    )}

                    <button
                      className="btn btn-sm btn-outline-primary rounded-pill"
                      onClick={() =>
                        navigate(`/instructor/edit-lesson/${lesson.documentId}`)
                      }
                    >
                      <i className="bi bi-pencil"></i>
                    </button>

                    <button
                      className={styles.deleteBtn}
                      onClick={() => handleDeleteLesson(lesson.documentId)}
                    >
                      <i className="bi bi-trash"></i>
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}

export default ManageLessons;