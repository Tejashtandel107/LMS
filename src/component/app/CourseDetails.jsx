import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";

import Header from "./Header";
import Footer from "./Footer";
import ReviewSection from "./ReviewSection";
import { addToCart, fetchCart } from "../../features/cartSlice";

function CourseDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const BASE_URL = import.meta.env.VITE_BASE_URL;

  const { items: cart, loading: cartLoading } = useSelector(
    (state) => state.cart
  );

  const [course, setCourse] = useState(null);
  const [open, setOpen] = useState(true);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState([]);
  const [alreadyReviewed, setAlreadyReviewed] = useState(false);

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    document.title = 'Course Details | Learning Management System';
    getCourse();

    if (user && token) {
      dispatch(fetchCart());
    }
  }, [id, dispatch]);

  async function getCourse() {
    try {
      setLoading(true);

      const response = await axios.get(
        `${BASE_URL}/api/courses/${id}?populate[thumbnail]=true&populate[category]=true&populate[course_type]=true&populate[instructor]=true&populate[lessons][populate][video]=true&populate[enrollments]=true&populate[ratings][populate][user]=true`
      );

      const courseData = response.data.data;
      setCourse(courseData);

      const reviewData = Array.isArray(courseData.ratings)
        ? courseData.ratings
        : [];

      const sortedReviews = [...reviewData].sort((a, b) => {
        if (a.user?.id === user?.id) return -1;
        if (b.user?.id === user?.id) return 1;
        return new Date(b.createdAt) - new Date(a.createdAt);
      });

      setReviews(sortedReviews);

      if (user && token) {
        const enrollmentRes = await axios.get(
          `${BASE_URL}/api/enrollments?filters[course][id][$eq]=${courseData.id}&filters[student][id][$eq]=${user.id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setIsEnrolled(enrollmentRes.data.data.length > 0);

        const myReview = reviewData.find(
          (review) => review.user?.id === user.id
        );

        setAlreadyReviewed(!!myReview);
      } else {
        setIsEnrolled(false);
        setAlreadyReviewed(false);
      }
    } catch (error) {
      console.log("Course Details Error:", error.response?.data || error);
    } finally {
      setLoading(false);
    }
  }

  const handleAddToCart = async () => {
    if (!user || !token) {
      navigate("/login");
      return;
    }

    await dispatch(addToCart(course.id));
  };

  const thumbnail = useMemo(() => {
    if (!course?.thumbnail?.url) {
      return "https://via.placeholder.com/800x450?text=Course";
    }

    return `${BASE_URL}${course.thumbnail.url}`;
  }, [course, BASE_URL]);

  const lessons = useMemo(() => {
    return [...(course?.lessons || [])].sort((a, b) => a.order - b.order);
  }, [course]);

  const isInCart = useMemo(() => {
    return cart.some((item) => item.course?.id === course?.id);
  }, [cart, course]);

  const languages = useMemo(() => {
    if (Array.isArray(course?.language)) {
      return course.language.join(", ");
    }

    return course?.language || "English";
  }, [course]);

const ratingCount = reviews.length;

const averageRating = useMemo(() => {
  if (!ratingCount) return null;

  const total = reviews.reduce((sum, review) => {
    return sum + Number(review.rating || 0);
  }, 0);

  return (total / ratingCount).toFixed(1);
}, [reviews, ratingCount]);

const ratingText = averageRating
  ? `${averageRating} Rating`
  : "No ratings yet";

  if (loading) {
    return (
      <>
        <Header />
        <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
          <div className="text-center">
            <div className="spinner-border text-primary"></div>
            <h5 className="mt-3 fw-bold">Loading course...</h5>
          </div>
        </div>
      </>
    );
  }

  if (!course) {
    return (
      <>
        <Header />
        <div className="text-center py-5">
          <h5>Course not found</h5>
        </div>
      </>
    );
  }

  return (
    <>
      <Header />

      <section
        className="text-white"
        style={{
          background:
            "radial-gradient(circle at top left, #4338ca, #0f172a 45%, #020617)",
          padding: "70px 0 90px",
        }}
      >
        <div className="container">
          <div className="row align-items-center g-5">
            <div className="col-lg-7">
              <div className="d-flex flex-wrap gap-2 mb-4">
                <span className="badge bg-warning text-dark px-3 py-2 rounded-pill">
                  {course.category?.name || "Development"}
                </span>

                <span className="badge bg-light text-dark px-3 py-2 rounded-pill">
                  {course.course_type?.name || "Premium"}
                </span>

                <span className="badge bg-success px-3 py-2 rounded-pill">
                  {isEnrolled ? "Enrolled" : "Available"}
                </span>
              </div>

              <h1 className="fw-bold display-5 mb-3">{course.title}</h1>

              <p
                className="mb-4"
                style={{
                  color: "#cbd5e1",
                  fontSize: "18px",
                  maxWidth: "700px",
                  lineHeight: "1.7",
                }}
              >
                {course.description}
              </p>

              <div className="d-flex flex-wrap gap-4 align-items-center small">
                <span className="fw-semibold text-warning">
                  ⭐ {ratingText}
                </span>
                <span>💬 {ratingCount} {ratingCount === 1 ? "Review" : "Reviews"}</span>
                <span>👥 {course.enrollments?.length || 0} Students</span>
                <span>👨‍🏫 {course.instructor?.FullName || "Instructor"}</span>
                <span>📚 {lessons.length} Lessons</span>
              </div>
            </div>

            <div className="col-lg-5 d-none d-lg-block">
              <div
                className="rounded-5 overflow-hidden shadow-lg"
                style={{
                  border: "1px solid rgba(255,255,255,0.15)",
                }}
              >
                <img
                  src={thumbnail}
                  alt={course.title}
                  style={{
                    width: "100%",
                    height: "320px",
                    objectFit: "cover",
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section style={{ background: "#f8fafc", paddingBottom: "70px" }}>
        <div className="container">
          <div
            className="row g-4"
            style={{
              marginTop: "-45px",
              position: "relative",
              zIndex: 2,
            }}
          >
            <InfoBox icon="🎥" title="Video" text={`${course.duration || "1h 5m"} on-demand`} />
            <InfoBox icon="📚" title="Lessons" text={`${lessons.length} lectures`} />
            <InfoBox icon="🌐" title="Language" text={languages} />
          </div>

          <div className="row g-5 mt-2">
            <div className="col-lg-8">
              <div className="bg-white rounded-5 p-4 p-lg-5 shadow-sm mb-4">
                <h3 className="fw-bold mb-3">About This Course</h3>
                <p className="text-muted mb-0" style={{ lineHeight: "1.8" }}>
                  {course.description}
                </p>
              </div>

              <div className="bg-white rounded-5 p-4 p-lg-5 shadow-sm mb-4">
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <div>
                    <h3 className="fw-bold mb-2">Course Content</h3>
                    <p className="text-muted mb-0">
                      1 section • {lessons.length} lectures •{" "}
                      {course.duration || "1h 5m"}
                    </p>
                  </div>
                </div>

                <div className="border rounded-4 overflow-hidden">
                  <div
                    className="p-4 d-flex justify-content-between align-items-center"
                    style={{
                      cursor: "pointer",
                      background: "#f8fafc",
                    }}
                    onClick={() => setOpen(!open)}
                  >
                    <h5 className="fw-bold mb-0">
                      {open ? "⌃" : "⌄"} Course Lessons
                    </h5>

                    <span className="badge bg-dark rounded-pill">
                      {lessons.length} lectures
                    </span>
                  </div>

                  {open &&
                    lessons.map((lesson, index) => {
                      const videoUrl = lesson.video?.url
                        ? `${BASE_URL}${lesson.video.url}`
                        : null;

                      return (
                        <div key={lesson.id} className="p-4 border-top bg-white">
                          <div className="d-flex justify-content-between gap-3">
                            <div className="d-flex gap-3 w-100">
                              <div
                                className="rounded-circle d-flex align-items-center justify-content-center fw-bold"
                                style={{
                                  width: "46px",
                                  height: "46px",
                                  minWidth: "46px",
                                  background: isEnrolled ? "#dcfce7" : "#fee2e2",
                                  color: isEnrolled ? "#16a34a" : "#dc2626",
                                }}
                              >
                                {isEnrolled ? "▶" : "🔒"}
                              </div>

                              <div className="w-100">
                                <h6 className="fw-bold mb-1">
                                  {index + 1}. {lesson.title}
                                </h6>

                                {lesson.content && (
                                  <p className="text-muted small mb-2">
                                    {lesson.content}
                                  </p>
                                )}

                                {isEnrolled && videoUrl ? (
                                  <video
                                    src={videoUrl}
                                    controls
                                    className="rounded-4 mt-3 shadow-sm"
                                    style={{
                                      width: "100%",
                                      maxWidth: "560px",
                                      height: "315px",
                                      objectFit: "cover",
                                    }}
                                  />
                                ) : (
                                  <span className="small text-danger fw-semibold">
                                    Enroll to watch this lesson
                                  </span>
                                )}
                              </div>
                            </div>

                            <span className="text-muted small text-nowrap">
                              {lesson.duration || "15 min"}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>

              <div className="bg-white rounded-5 p-4 p-lg-5 shadow-sm">
                <ReviewSection
                  reviews={reviews}
                  averageRating={averageRating}
                  isEnrolled={isEnrolled}
                  alreadyReviewed={alreadyReviewed}
                  user={user}
                  token={token}
                  BASE_URL={BASE_URL}
                  course={course}
                  getCourse={getCourse}
                />
              </div>
            </div>

            <div className="col-lg-4">
              <div
                className="card border-0 shadow-lg rounded-5 overflow-hidden sticky-lg-top"
                style={{
                  top: "110px",
                  zIndex: 1,
                }}
              >
                <img
                  src={thumbnail}
                  alt={course.title}
                  className="card-img-top"
                  style={{ height: "240px", objectFit: "cover" }}
                />

                <div className="card-body p-4">
                  <h2 className="fw-bold mb-3">
                    {Number(course.price) === 0 ? "Free" : `₹${course.price}`}
                  </h2>

                  {!isEnrolled && (
                    <>
                      <button
                        className="btn w-100 fw-bold py-3 mb-3 rounded-4 text-white"
                        style={{
                          background:
                            "linear-gradient(135deg, #4f46e5, #7c3aed)",
                          border: "none",
                        }}
                        onClick={() => {
                          if (!user || !token) {
                            navigate("/login");
                            return;
                          }

                          navigate("/checkout", {
                            state: {
                              cartItems: [
                                {
                                  id: course.id,
                                  documentId: null,
                                  course: course,
                                },
                              ],
                              totalAmount: Number(course.price || 0),
                            },
                          });
                        }}
                      >
                        Enroll Now
                      </button>

                      {!isInCart ? (
                        <button
                          onClick={handleAddToCart}
                          disabled={cartLoading}
                          className="btn btn-outline-dark w-100 fw-bold py-3 mb-4 rounded-4"
                        >
                          {cartLoading ? "Adding..." : "Add to cart"}
                        </button>
                      ) : (
                        <button
                          disabled
                          className="btn btn-success w-100 fw-bold py-3 mb-4 rounded-4"
                        >
                          ✓ Already in Cart
                        </button>
                      )}
                    </>
                  )}

                  {isEnrolled && (
                    <button
                      disabled
                      className="btn btn-success w-100 fw-bold py-3 mb-4 rounded-4"
                    >
                      ✓ You are enrolled
                    </button>
                  )}

                  <h6 className="fw-bold mb-3">This course includes:</h6>

                  <ul className="list-unstyled small mb-0">
                    <li className="mb-3">🎥 {course.duration || "1h 5m"} video</li>
                    <li className="mb-3">📚 {lessons.length} lessons</li>
                    <li className="mb-3">🌐 {languages}</li>
                    <li className="mb-3">
                      🏷️ {course.course_type?.name || "Premium"}
                    </li>
                    <li className="mb-3">⭐ {ratingText}</li>
                    <li>🔐 Lifetime access</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}

function InfoBox({ icon, title, text }) {
  return (
    <div className="col-md-4">
      <div
        className="bg-white rounded-5 p-4 h-100 shadow-sm"
        style={{
          border: "1px solid #e2e8f0",
        }}
      >
        <div className="d-flex align-items-center gap-3">
          <div
            className="rounded-circle d-flex align-items-center justify-content-center"
            style={{
              width: "48px",
              height: "48px",
              background: "#eef2ff",
              fontSize: "22px",
            }}
          >
            {icon}
          </div>

          <div>
            <h6 className="fw-bold mb-1">{title}</h6>
            <p className="mb-0 text-muted small">{text}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CourseDetails; 