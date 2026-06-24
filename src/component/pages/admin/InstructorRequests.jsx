import { useEffect, useState } from "react";
import axios from "axios";
import DashboardLayout from "../../dashboard/DashboardLayout";

function InstructorRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const [currentPage, setCurrentPage] = useState(1);
  const requestsPerPage = 10;

  const API_URL = import.meta.env.VITE_BASE_URL;
  const roleId = import.meta.env.VITE_INSTRUCTOR_ROLE_ID;

  const handleUpdateStatus = async (request, status) => {
    try {
      const token = localStorage.getItem("token");

      await axios.put(
        `${API_URL}/api/instructor-requests/${request.documentId}`,
        {
          data: {
            requestStatus: status,
          },
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (status === "Approved") {
        await axios.put(
          `${API_URL}/api/users/${request.user.id}`,
          {
            role: roleId,
            userRole: "instructor",
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      }

      getInstructorRequests();
    } catch (error) {
      console.log("Update error:", error.response?.data || error);
    }
  };

  const getInstructorRequests = async () => {
    try {
      setLoading(true);

      const response = await axios.get(
        `${API_URL}/api/instructor-requests?populate=*`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setRequests(response.data.data || []);
      setCurrentPage(1);
    } catch (error) {
      console.log("Error fetching instructor requests:", error.response?.data || error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getInstructorRequests();
  }, []);

  const totalPages = Math.ceil(requests.length / requestsPerPage);
  const lastIndex = currentPage * requestsPerPage;
  const firstIndex = lastIndex - requestsPerPage;
  const currentRequests = requests.slice(firstIndex, lastIndex);

  return (
    <DashboardLayout role="admin">
      <div className="container-fluid px-4 py-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h2 className="fw-bold mb-1">Instructor requests</h2>
            <p className="text-muted mb-0">
              Review and approve applications to teach on Learnix.
            </p>
          </div>

          <span className="badge bg-primary fs-6">
            Total: {requests.length}
          </span>
        </div>

        <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th className="ps-4 text-uppercase small text-muted">#</th>
                  <th className="text-uppercase small text-muted">Applicant</th>
                  <th className="text-uppercase small text-muted">Expertise</th>
                  <th className="text-uppercase small text-muted">Portfolio</th>
                  <th className="text-uppercase small text-muted">Resume</th>
                  <th className="text-uppercase small text-muted">Status</th>
                  <th className="text-uppercase small text-muted text-center">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="7" className="text-center py-4">
                      Loading...
                    </td>
                  </tr>
                ) : currentRequests.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="text-center py-4 text-muted">
                      No instructor requests found.
                    </td>
                  </tr>
                ) : (
                  currentRequests.map((item, index) => {
                    const data = item;
                    const resumeFile = Array.isArray(data.resume)
                      ? data.resume[0]
                      : data.resume;

                    return (
                      <tr key={data.id}>
                        <td className="ps-4">
                          {firstIndex + index + 1}
                        </td>

                        <td style={{ minWidth: "180px" }}>
                          <div className="d-flex align-items-center gap-3">
                            <div
                              className="rounded-circle bg-light d-flex align-items-center justify-content-center flex-shrink-0"
                              style={{ width: "42px", height: "42px" }}
                            >
                              👨‍🏫
                            </div>

                            <div>
                              <div className="fw-semibold">
                                {data.user?.username || "N/A"}
                              </div>
                              <small className="text-muted">
                                {data.createdAt
                                  ? new Date(data.createdAt).toLocaleDateString()
                                  : ""}
                              </small>
                            </div>
                          </div>
                        </td>

                        <td style={{ minWidth: "200px" }}>
                          {data.expertise || "N/A"}
                        </td>

                        <td style={{ minWidth: "120px" }}>
                          {data.portfolioLink ? (
                            <a
                              href={data.portfolioLink}
                              target="_blank"
                              rel="noreferrer"
                              className="text-decoration-none"
                            >
                              🔗 Portfolio
                            </a>
                          ) : (
                            <span className="text-muted">No portfolio</span>
                          )}
                        </td>

                        <td style={{ minWidth: "170px" }}>
                          {resumeFile?.url ? (
                            <a
                              href={`${API_URL}${resumeFile.url}`}
                              target="_blank"
                              rel="noreferrer"
                              className="text-decoration-none text-muted"
                            >
                              📄 {resumeFile.name || "View Resume"}
                            </a>
                          ) : (
                            <span className="text-muted">No resume</span>
                          )}
                        </td>

                        <td style={{ minWidth: "120px" }}>
                          <span
                            className={`badge rounded-pill ${
                              data.requestStatus === "Approved"
                                ? "bg-success"
                                : data.requestStatus === "Rejected"
                                ? "bg-danger"
                                : "bg-warning text-dark"
                            }`}
                          >
                            {data.requestStatus || "Pending"}
                          </span>
                        </td>

                        <td className="text-center" style={{ minWidth: "170px" }}>
                          {data.requestStatus !== "Approved" ? (
                            <div className="d-flex flex-column flex-md-row gap-2 justify-content-center">
                              <button
                                className="btn btn-success btn-sm rounded-pill px-3"
                                onClick={() =>
                                  handleUpdateStatus(data, "Approved")
                                }
                              >
                                Approve
                              </button>

                              <button
                                className="btn btn-danger btn-sm rounded-pill px-3"
                                onClick={() =>
                                  handleUpdateStatus(data, "Rejected")
                                }
                              >
                                Reject
                              </button>
                            </div>
                          ) : (
                            <span className="text-muted small">No action</span>
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {totalPages > 1 && (
          <div className="d-flex justify-content-center mt-4">
            <nav>
              <ul className="pagination mb-0">
                <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                  <button
                    className="page-link"
                    onClick={() => setCurrentPage(currentPage - 1)}
                  >
                    Previous
                  </button>
                </li>

                {[...Array(totalPages)].map((_, index) => (
                  <li
                    key={index}
                    className={`page-item ${
                      currentPage === index + 1 ? "active" : ""
                    }`}
                  >
                    <button
                      className="page-link"
                      onClick={() => setCurrentPage(index + 1)}
                    >
                      {index + 1}
                    </button>
                  </li>
                ))}

                <li
                  className={`page-item ${
                    currentPage === totalPages ? "disabled" : ""
                  }`}
                >
                  <button
                    className="page-link"
                    onClick={() => setCurrentPage(currentPage + 1)}
                  >
                    Next
                  </button>
                </li>
              </ul>
            </nav>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

export default InstructorRequests;