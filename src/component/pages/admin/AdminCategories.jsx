import React, { useEffect, useState } from "react";
import axios from "axios";
import DashboardLayout from "../../dashboard/DashboardLayout";

function AdminCategories() {
  const BASE_URL = import.meta.env.VITE_BASE_URL;
  const token = localStorage.getItem("token");

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [editCategory, setEditCategory] = useState(null);

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");

  const getCategories = async () => {
    try {
      setLoading(true);

      const res = await axios.get(`${BASE_URL}/api/categories?populate=*`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setCategories(res.data.data || []);
    } catch (error) {
      console.log("Category Error:", error.response?.data || error);
    } finally {
      setLoading(false);
    }
  };

  const openAddModal = () => {
    setEditCategory(null);
    setName("");
    setSlug("");
    setDescription("");
    setShowModal(true);
  };

  const openEditModal = (category) => {
    setEditCategory(category);
    setName(category.name || "");
    setSlug(category.slug || "");
    setDescription(category.description || "");
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditCategory(null);
    setName("");
    setSlug("");
    setDescription("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      alert("Category name is required");
      return;
    }

    const formData = {
      data: {
        name,
        slug,
        description,
      },
    };

    try {
      if (editCategory) {
        await axios.put(
          `${BASE_URL}/api/categories/${editCategory.documentId}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      } else {
        await axios.post(`${BASE_URL}/api/categories`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      }

      closeModal();
      getCategories();
    } catch (error) {
      console.log("Save Category Error:", error.response?.data || error);
    }
  };

  const handleDelete = async (documentId) => {
    if (!window.confirm("Are you sure you want to delete this category?")) return;

    try {
      await axios.delete(`${BASE_URL}/api/categories/${documentId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      getCategories();
    } catch (error) {
      console.log("Delete Category Error:", error.response?.data || error);
    }
  };

  useEffect(() => {
    getCategories();
  }, []);

  return (
    <DashboardLayout role="admin">
      <div className="container-fluid px-4 py-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="fw-bold mb-0">Categories</h2>

          <button className="btn btn-primary rounded-pill px-4" onClick={openAddModal}>
            <i className="bi bi-plus-circle me-2"></i>
            Add Category
          </button>
        </div>

        <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th className="ps-4">#</th>
                  <th>Name</th>
                  <th>Slug</th>
                  <th>Description</th>
                  <th className="text-center">Action</th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="5" className="text-center py-4">
                      Loading...
                    </td>
                  </tr>
                ) : categories.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-center py-4 text-muted">
                      No categories found.
                    </td>
                  </tr>
                ) : (
                  categories.map((category, index) => (
                    <tr key={category.documentId || category.id}>
                      <td className="ps-4">{index + 1}</td>

                      <td className="fw-semibold">{category.name}</td>

                      <td>{category.slug || "N/A"}</td>

                      <td>
                        {category.description
                          ? category.description.substring(0, 60)
                          : "N/A"}
                      </td>

                      <td className="text-center">
                        <button
                          className="btn btn-sm btn-outline-primary rounded-pill px-3 me-2"
                          onClick={() => openEditModal(category)}
                        >
                          <i className="bi bi-pencil-square me-1"></i>
                          Edit
                        </button>

                        <button
                          className="btn btn-sm btn-outline-danger rounded-pill px-3"
                          onClick={() => handleDelete(category.documentId)}
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

        {showModal && (
          <div
            className="modal fade show"
            style={{
              display: "block",
              backgroundColor: "rgba(0,0,0,0.5)",
            }}
          >
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content rounded-4 border-0">
                <div className="modal-header">
                  <h5 className="modal-title fw-bold">
                    {editCategory ? "Edit Category" : "Add Category"}
                  </h5>

                  <button
                    type="button"
                    className="btn-close"
                    onClick={closeModal}
                  ></button>
                </div>

                <form onSubmit={handleSubmit}>
                  <div className="modal-body">
                    <div className="mb-3">
                      <label className="form-label fw-semibold">
                        Category Name
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Enter category name"
                        value={name}
                        onChange={(e) => {
                          setName(e.target.value);
                          setSlug(
                            e.target.value
                              .toLowerCase()
                              .trim()
                              .replace(/\s+/g, "-")
                          );
                        }}
                      />
                    </div>

                    <div className="mb-3">
                      <label className="form-label fw-semibold">Slug</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="category-slug"
                        value={slug}
                        onChange={(e) => setSlug(e.target.value)}
                      />
                    </div>

                    <div className="mb-3">
                      <label className="form-label fw-semibold">
                        Description
                      </label>
                      <textarea
                        className="form-control"
                        rows="4"
                        placeholder="Enter description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                      ></textarea>
                    </div>
                  </div>

                  <div className="modal-footer">
                    <button
                      type="button"
                      className="btn btn-light"
                      onClick={closeModal}
                    >
                      Cancel
                    </button>

                    <button type="submit" className="btn btn-primary">
                      {editCategory ? "Update Category" : "Add Category"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

export default AdminCategories;