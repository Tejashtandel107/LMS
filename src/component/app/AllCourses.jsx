import React, { useEffect, useState } from "react";
import styles from "./AllCourses.module.css";
import axios from "axios";
import Header from "./Header";
import { useNavigate } from "react-router-dom";
import Footer from "./Footer";

function AllCourses() {
  const BASE_URL = import.meta.env.VITE_BASE_URL;

  const [courses, setCourses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [courseType, setCourseType] = useState([]);

  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedCourseType, setSelectedCourseType] = useState("");

  const [page, setPage] = useState(1);
  const navigate = useNavigate();

  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 3,
    pageCount: 1,
    total: 0,
  });

  useEffect(() => {
    getCategory();
    getCourseType();
  }, []);

  useEffect(() => {
    const delay = setTimeout(() => {
      getCourses(page);
    }, 400);

    return () => clearTimeout(delay);
  }, [page, search, selectedCategory, selectedCourseType]);

  async function getCourses(currentPage) {
    try {
      let url = `${BASE_URL}/api/courses?populate[thumbnail]=true&populate[category]=true&populate[course_type]=true&populate[instructor]=true&populate[lessons]=true&populate[enrollments]=true&populate[ratings]=true&pagination[page]=${currentPage}&pagination[pageSize]=3`;

      if (search) {
        url += `&filters[title][$containsi]=${search}`;
      }

      if (selectedCategory) {
        url += `&filters[category][id][$eq]=${selectedCategory}`;
      }

      if (selectedCourseType) {
        url += `&filters[course_type][id][$eq]=${selectedCourseType}`;
      }

      const response = await axios.get(url);

      setCourses(response.data.data || []);
      setPagination(response.data.meta.pagination);
    } catch (error) {
      console.log("Course API Error:", error);
    }
  }

  async function getCategory() {
    try {
      const response = await axios.get(`${BASE_URL}/api/categories`);
      setCategories(response.data.data || []);
    } catch (e) {
      console.log(e);
    }
  }

  async function getCourseType() {
    try {
      const response = await axios.get(`${BASE_URL}/api/course-types`);
      setCourseType(response.data.data || []);
    } catch (e) {
      console.log(e);
    }
  }

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

  const handleSearch = (e) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const handleCategory = (e) => {
    setSelectedCategory(e.target.value);
    setPage(1);
  };

  const handleCourseType = (e) => {
    setSelectedCourseType(e.target.value);
    setPage(1);
  };

  return (
    <>
      <Header />

      <section className={styles.page}>
        <div className={styles.container}>
          <div className={styles.header}>
            <div>
              <h3 className="fw-bold mb-1">All courses</h3>
              <p className="text-muted small mb-0">
                {pagination.total} courses available
              </p>
            </div>
          </div>

          <div className={styles.filters}>
            <div className={styles.searchBox}>
              <i className="bi bi-search"></i>
              <input
                type="text"
                placeholder="Search courses..."
                value={search}
                onChange={handleSearch}
              />
            </div>

            <select value={selectedCategory} onChange={handleCategory}>
              <option value="">All Categories</option>

              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>

            <select value={selectedCourseType} onChange={handleCourseType}>
              <option value="">All Types</option>

              {courseType.map((type) => (
                <option key={type.id} value={type.id}>
                  {type.name}
                </option>
              ))}
            </select>
          </div>

          <div className="row g-4">
            {courses.length === 0 ? (
              <div className="col-12 text-center py-5">
                <h5>No courses found</h5>
              </div>
            ) : (
              courses.map((course) => {
                const imageUrl = course.thumbnail?.url
                  ? `${BASE_URL}${course.thumbnail.url}`
                  : "https://via.placeholder.com/600x350?text=Course";

                const price =
                  Number(course.price) === 0 ? "Free" : `$${course.price}`;

                const averageRating = getAverageRating(course);

                return (
                  <div key={course.id} className="col-lg-4 col-md-6">
                    <div
                      className={styles.card}
                      onClick={() => navigate(`/course/${course.documentId}`)}
                      style={{ cursor: "pointer" }}
                    >
                      <div className={styles.imageWrap}>
                        <img src={imageUrl} alt={course.title} />

                        <span className={styles.badge}>
                          {course.course_type?.name || "FREE"}
                        </span>
                      </div>

                      <div className={styles.body}>
                        <small className={styles.category}>
                          {course.category?.name || "General"}
                        </small>

                        <h6>{course.title}</h6>

                        <p className={styles.instructor}>
                          👨‍🏫 {course.instructor?.FullName || "Instructor"}
                        </p>

                        <div className={styles.meta}>
                          <span>⭐ {averageRating}</span>
                          <span>📖 {course.lessons?.length || 0} lessons</span>
                          <span>🕒 {course.duration || "0h"}</span>
                        </div>

                        <hr />

                        <div className={styles.footer}>
                          <strong
                            className={price === "Free" ? styles.free : ""}
                          >
                            {price}
                          </strong>

                          <small>
                            {course.enrollments?.length || 0} students
                          </small>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {pagination.pageCount > 1 && (
            <div className={styles.pagination}>
              <button disabled={page === 1} onClick={() => setPage(page - 1)}>
                Prev
              </button>

              {[...Array(pagination.pageCount)].map((_, index) => (
                <button
                  key={index}
                  onClick={() => setPage(index + 1)}
                  className={page === index + 1 ? styles.active : ""}
                >
                  {index + 1}
                </button>
              ))}

              <button
                disabled={page === pagination.pageCount}
                onClick={() => setPage(page + 1)}
              >
                Next
              </button>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </>
  );
}

export default AllCourses;