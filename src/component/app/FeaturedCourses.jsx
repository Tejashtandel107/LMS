import React, { useEffect, useState } from "react";
import styles from "./FeaturedCourses.module.css";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { wishlist, fetchWishlist } from "../../features/wishlistSlice";
import { toast } from "react-toastify";
import { useLocation } from "react-router-dom";

function FeaturedCourses() {
  const BASE_URL = import.meta.env.VITE_BASE_URL;

  const [courses, setCourses] = useState([]);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { items: wishlistItems } = useSelector((state) => state.wishlist);

  const handleWishlist = (course) => {
    const token = localStorage.getItem("token");

    if (!token) {
      toast.warning("Please login first");

      setTimeout(() => {
        navigate("/login", {
          state: {
            from: location.pathname,
          },
        });
      }, 1000);

      return;
    }

    dispatch(wishlist(course));
  };

  const isWishlisted = (courseId) => {
    return wishlistItems.some((item) => item.course?.id === courseId);
  };

  const getAverageRating = (course) => {
    const ratingData = Array.isArray(course.rating)
      ? course.rating
      : course.rating
      ? [course.rating]
      : [];

    if (ratingData.length === 0) return "0.0";

    const total = ratingData.reduce((sum, item) => {
      return sum + Number(item.rating || 0);
    }, 0);

    return (total / ratingData.length).toFixed(1);
  };

  useEffect(() => {
    getCourses();

    if (localStorage.getItem("token")) {
      dispatch(fetchWishlist());
    }
  }, [dispatch]);

  async function getCourses() {
    try {
      const response = await axios.get(
        `${BASE_URL}/api/courses?populate[thumbnail]=true&populate[category]=true&populate[course_type]=true&populate[instructor]=true&populate[lessons]=true&populate[enrollments]=true&populate[ratings]=true&pagination[pageSize]=3`
      );

      setCourses(response.data.data || []);
    } catch (error) {
      console.log("Error fetching courses:", error);
    }
  }

  return (
    <section className={`${styles.section} py-5`}>
      <div className="container">
        <div className={styles.header}>
          <div>
            <h2 className="fw-bold display-6 mb-2">Featured Courses</h2>
            <p className="text-muted mb-0">
              Hand-picked by our editorial team.
            </p>
          </div>

          <Link to="/course" className="text-decoration-none fw-semibold">
            View all →
          </Link>
        </div>

        <div className="row g-4">
          {courses.map((course) => {
            const active = isWishlisted(course.id);
            const averageRating = getAverageRating(course);

            return (
              <div key={course.id} className="col-lg-4 col-md-6 col-12">
                <div className={styles.card}>
                  <div className={styles.imageWrapper}>
                    <img
                      src={
                        course.thumbnail?.url
                          ? `${BASE_URL}${course.thumbnail.url}`
                          : "https://via.placeholder.com/600x350?text=Course+Image"
                      }
                      alt={course.title || "Course Image"}
                      className={styles.image}
                    />

                    <span className={styles.badge}>
                      {course.course_type?.name || "FREE"}
                    </span>

                    <button
                      onClick={() => handleWishlist(course)}
                      className={styles.wishlistBtn}
                    >
                      {active ? "♥" : "♡"}
                    </button>
                  </div>

                  <div className={styles.content}>
                    <small className={styles.category}>
                      {course.category?.name || "General"}
                    </small>

                    <Link
                      to={`/course/${course.documentId}`}
                      className="text-decoration-none text-dark"
                    >
                      <h4 className={styles.title}>
                        {course.title || "Untitled Course"}
                      </h4>
                    </Link>

                    <div className={styles.instructor}>
                      <img
                        src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                          course.instructor?.FullName || "Instructor"
                        )}`}
                        alt="Instructor"
                        className={styles.avatar}
                      />

                      <span className="text-muted">
                        {course.instructor?.FullName || "Unknown Instructor"}
                      </span>
                    </div>

                    <div className={styles.meta}>
                      <span>⭐ {averageRating}</span>
                      <span>📖 {course.lessons?.length || 0} lessons</span>
                      <span>🕒 {course.duration || "N/A"}</span>
                    </div>

                    <hr />

                    <div className={styles.footer}>
                      <h3 className={styles.price}>
                        {Number(course.price) === 0
                          ? "Free"
                          : `$${course.price || 0}`}
                      </h3>

                      <small className={styles.students}>
                        {course.enrollments?.length || 0} students
                      </small>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          {courses.length === 0 && (
            <div className="col-12 text-center text-muted">
              No courses found.
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default FeaturedCourses;