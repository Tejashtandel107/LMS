import React, { useEffect, useState } from "react";
import axios from "axios";
import DashboardLayout from "../../dashboard/DashboardLayout";

function AdminCourses() {
  const BASE_URL = import.meta.env.VITE_BASE_URL;
  const token = localStorage.getItem("token");

  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const getCourses = async () => {
    try {
      setLoading(true);

      const res = await axios.get(
        `${BASE_URL}/api/courses?populate=*&pagination[page]=${currentPage}&pagination[pageSize]=${pageSize}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setCourses(res.data.data || []);

      const pagination = res.data.meta.pagination;

      setTotal(pagination.total);
      setTotalPages(pagination.pageCount);
    } catch (error) {
      console.log("Courses Error:", error.response?.data || error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (documentId) => {
    if (!window.confirm("Are you sure you want to delete this course?")) return;

    try {
      await axios.delete(`${BASE_URL}/api/courses/${documentId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      getCourses();
    } catch (error) {
      console.log("Delete Course Error:", error.response?.data || error);
    }
  };

  useEffect(() => {
    getCourses();
  }, [currentPage]);

  return (
    <DashboardLayout role="admin">
      <div className="container-fluid px-4 py-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="fw-bold mb-0">Courses</h2>

          <span className="badge bg-primary fs-6">Total: {total}</span>
        </div>

        <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th className="ps-4">#</th>
                  <th>Course</th>
                  <th>Category</th>
                  <th>Type</th>
                  <th>Instructor</th>
                  <th>Price</th>
                  <th className="text-center">Action</th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="7" className="text-center py-4">
                      Loading...
                    </td>
                  </tr>
                ) : courses.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="text-center py-4 text-muted">
                      No courses found.
                    </td>
                  </tr>
                ) : (
                  courses.map((course, index) => {
                    const imageUrl = course.thumbnail?.url
                      ? `${BASE_URL}${course.thumbnail.url}`
                      : "https://via.placeholder.com/70x45";

                    return (
                      <tr key={course.documentId || course.id}>
                        <td className="ps-4">
                          {(currentPage - 1) * pageSize + index + 1}
                        </td>

                        <td style={{ minWidth: "260px" }}>
                          <div className="d-flex align-items-center gap-3">
                            <img
                              src={imageUrl}
                              alt={course.title}
                              className="rounded"
                              style={{
                                width: "70px",
                                height: "45px",
                                objectFit: "cover",
                              }}
                            />

                            <div>
                              <div className="fw-semibold">
                                {course.title}
                              </div>
                            </div>
                          </div>
                        </td>

                        <td>{course.category?.name || "N/A"}</td>

                        <td>{course.course_type?.name || "N/A"}</td>

                        <td>
                          {course.instructor?.FullName ||
                            course.instructor?.username ||
                            "N/A"}
                        </td>

                        <td>
                          {Number(course.price) === 0
                            ? "Free"
                            : `$${course.price}`}
                        </td>

                        <td className="text-center">
                          <button
                            className="btn btn-sm btn-outline-danger rounded-pill px-3"
                            onClick={() => handleDelete(course.documentId)}
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

          {totalPages > 1 && (
            <div className="d-flex justify-content-center align-items-center gap-2 py-3">
              <button
                className="btn btn-sm btn-outline-primary"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((prev) => prev - 1)}
              >
                Prev
              </button>

              {[...Array(totalPages)].map((_, index) => (
                <button
                  key={index}
                  className={`btn btn-sm ${
                    currentPage === index + 1
                      ? "btn-primary"
                      : "btn-outline-primary"
                  }`}
                  onClick={() => setCurrentPage(index + 1)}
                >
                  {index + 1}
                </button>
              ))}

              <button
                className="btn btn-sm btn-outline-primary"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((prev) => prev + 1)}
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}

export default AdminCourses;