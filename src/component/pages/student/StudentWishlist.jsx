import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchWishlist, wishlist } from "../../../features/wishlistSlice";
import styles from "./StudentWishlist.module.css";
import Header from "../../app/Header";
import Footer from "../../app/Footer";

function StudentWishlist() {
  const BASE_URL = import.meta.env.VITE_BASE_URL;
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { items, loading } = useSelector((state) => state.wishlist);

  useEffect(() => {
    document.title = "My Wishlist | Learning Management System";
    dispatch(fetchWishlist());
  }, [dispatch]);

  const removeWishlist = (course) => {
    dispatch(wishlist(course));
  };

  if (loading) {
    return (
      <>
        <Header />
        <div className={styles.page}>
          <h3>Loading wishlist...</h3>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />

      <div className={styles.page}>
        <div className={styles.container}>
          <h1 className={styles.title}>My Wishlist</h1>

          {items.length === 0 ? (
            <div className={styles.empty}>
              <h3>Your wishlist is empty</h3>
              <p>Save courses you like and view them here.</p>

              <Link to="/course" className={styles.browseBtn}>
                Browse Courses
              </Link>
            </div>
          ) : (
            <div className={styles.grid}>
              {items.map((item) => {
                const course = item.course;

                const languages = Array.isArray(course?.language)
                  ? course.language.join(", ")
                  : course?.language || "English";

                return (
                  <div
                    className={styles.card}
                    key={item.documentId}
                    onClick={() => navigate(`/course/${course?.documentId}`)}
                    style={{ cursor: "pointer" }}
                  >
                    <div className={styles.imageBox}>
                      <img
                        src={
                          course?.thumbnail?.url
                            ? `${BASE_URL}${course.thumbnail.url}`
                            : "https://via.placeholder.com/600x350?text=Course"
                        }
                        alt={course?.title || "Course"}
                        className={styles.image}
                      />

                      <button
                        className={styles.heartBtn}
                        onClick={(e) => {
                          e.stopPropagation();
                          removeWishlist(course);
                        }}
                      >
                        ♥
                      </button>
                    </div>

                    <Link
                      to={`/course/${course?.documentId}`}
                      className={styles.courseTitle}
                      onClick={(e) => e.stopPropagation()}
                    >
                      {course?.title || "Untitled Course"}
                    </Link>

                    <p className={styles.instructor}>
                      {course?.instructor?.FullName || "Unknown Instructor"}
                    </p>

                    <div className={styles.rating}>
                      <strong>{course?.rating || "4.5"}</strong>
                      <span>★★★★★</span>
                      <small>
                        ({course?.enrollments?.length || 0} students)
                      </small>
                    </div>

                    <p className={styles.meta}>
                      {course?.duration || "10"} total hours •{" "}
                      {course?.lessons?.length || 0} lectures
                    </p>

                    <p className={styles.language}>🌐 {languages}</p>

                    <div className={styles.price}>
                      {Number(course?.price) === 0
                        ? "Free"
                        : `₹${course?.price}`}
                    </div>

                    <span className={styles.badge}>
                      {course?.course_type?.name || "Bestseller"}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <Footer />
    </>
  );
}

export default StudentWishlist;