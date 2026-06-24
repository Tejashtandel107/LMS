import React, { useEffect, useState } from "react";
import axios from "axios";
import DashboardLayout from "../../dashboard/DashboardLayout";
import { useSearchParams } from "react-router-dom";

function AdminUsers() {
  const BASE_URL = import.meta.env.VITE_BASE_URL;
  const token = localStorage.getItem("token");

  const [searchParams] = useSearchParams();
  const roleFromUrl = searchParams.get("role") || "";

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState(roleFromUrl);

  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 10;

  useEffect(() => {
    getUsers();
  }, []);

  useEffect(() => {
    setRoleFilter(roleFromUrl);
    setCurrentPage(1);
  }, [roleFromUrl]);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, roleFilter]);

  const getUsers = async () => {
    try {
      setLoading(true);

      const res = await axios.get(`${BASE_URL}/api/users?populate=*`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const usersWithoutAdmin = res.data.filter(
        (user) => user.userRole !== "admin"
      );

      setUsers(usersWithoutAdmin);
    } catch (error) {
      console.log("Users Error:", error.response?.data || error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (userId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this user?"
    );

    if (!confirmDelete) return;

    try {
      await axios.delete(`${BASE_URL}/api/users/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setUsers((prev) => prev.filter((user) => user.id !== userId));
    } catch (error) {
      console.log("Delete User Error:", error.response?.data || error);
    }
  };

  const filteredUsers = users.filter((user) => {
    const keyword = search.toLowerCase();

    const matchSearch =
      user.FullName?.toLowerCase().includes(keyword) ||
      user.username?.toLowerCase().includes(keyword) ||
      user.email?.toLowerCase().includes(keyword);

    const matchRole = roleFilter ? user.userRole === roleFilter : true;

    return matchSearch && matchRole;
  });

  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  const lastIndex = currentPage * usersPerPage;
  const firstIndex = lastIndex - usersPerPage;
  const currentUsers = filteredUsers.slice(firstIndex, lastIndex);

  return (
    <DashboardLayout role="admin">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold mb-0">Users</h2>
        <span className="badge bg-primary fs-6">
          Total: {filteredUsers.length}
        </span>
      </div>

      <div className="row g-3 mb-4">
        <div className="col-md-8">
          <input
            type="text"
            className="form-control"
            placeholder="Search by name, username or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="col-md-4">
          <select
            className="form-select"
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
          >
            <option value="">All Roles</option>
            <option value="student">Student</option>
            <option value="instructor">Instructor</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="spinner-border text-primary"></div>
      ) : (
        <>
          <div className="card border-0 shadow-sm rounded-4">
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-light">
                  <tr>
                    <th>#</th>
                    <th>User</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Created</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>
                  {currentUsers.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="text-center py-4">
                        No users found.
                      </td>
                    </tr>
                  ) : (
                    currentUsers.map((user, index) => (
                      <tr key={user.id}>
                        <td>{firstIndex + index + 1}</td>

                        <td>
                          <div className="fw-semibold">
                            {user.FullName || user.username}
                          </div>
                          <small className="text-muted">@{user.username}</small>
                        </td>

                        <td>{user.email}</td>

                        <td>
                          <span
                            className={`badge ${
                              user.userRole === "instructor"
                                ? "bg-success"
                                : "bg-primary"
                            }`}
                          >
                            {user.userRole || "student"}
                          </span>
                        </td>

                        <td>{new Date(user.createdAt).toLocaleDateString()}</td>

                        <td>
                          <button
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => handleDelete(user.id)}
                          >
                            <i className="bi bi-trash me-1"></i>
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {totalPages > 1 && 
          (
            <div className="d-flex justify-content-center mt-4">
              <nav>
                <ul className="pagination">
                  <li
                    className={`page-item ${
                      currentPage === 1 ? "disabled" : ""
                    }`}
                  >
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
        </>
      )}
    </DashboardLayout>
  );
}

export default AdminUsers;