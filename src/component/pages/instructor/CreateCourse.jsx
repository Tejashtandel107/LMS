import React, { useEffect, useState } from "react";
import DashboardLayout from "../../dashboard/DashboardLayout";
import "./CreateCourse.css";
import axios from "axios";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { useNavigate, useParams } from "react-router-dom";

const courseSchema = z.object({
  title: z.string().min(1, "Course title is required"),
  description: z.string().min(1, "Description is required"),
  category: z.string().min(1, "Category is required"),
  course_type: z.string().min(1, "Course type is required"),
  duration: z.string().min(1, "Duration is required"),
  language: z.string().min(1, "Language is required"),
  price: z
    .string()
    .min(1, "Price is required")
    .refine((value) => Number(value) > 0, {
      message: "Price must be greater than 0",
    }),
  thumbnail: z.any().optional(),
});

function CreateCourse() {
  const token = localStorage.getItem("token");
  const [categories, setCategories] = useState([]);
  const [courseTypes, setCourseTypes] = useState([]);
  const [preview, setPreview] = useState(null);

  const BASE_URL = import.meta.env.VITE_BASE_URL;

  const { id } = useParams();
  const navigate = useNavigate();

  const isEdit = Boolean(id);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    resolver: zodResolver(courseSchema),
    defaultValues: {
      title: "",
      description: "",
      category: "",
      course_type: "",
      duration: "",
      language: "",
      price: "",
      thumbnail: "",
    },
  });

  const thumbnailRegister = register("thumbnail");

  useEffect(() => {
    fetchCategories();
    fetchCourseTypes();

    if (id) {
      fetchCourseById();
    }
  }, [id]);

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/categories`);
      setCategories(response.data.data || []);
    } catch (error) {
      console.error("Category API Error:", error);
    }
  };

  const fetchCourseTypes = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/course-types`);
      setCourseTypes(response.data.data || []);
    } catch (error) {
      console.error("Course Type API Error:", error);
    }
  };

  const fetchCourseById = async () => {
    try {
      const response = await axios.get(
        `${BASE_URL}/api/courses/${id}?populate=*`
      );

      const course = response.data.data;

      reset({
        title: course.title || "",
        description: course.description || "",
        category: course.category?.id?.toString() || "",
        course_type: course.course_type?.id?.toString() || "",
        duration: course.duration || "",
        language: Array.isArray(course.language)
          ? course.language.join(", ")
          : course.language || "",
        price: course.price?.toString() || "",
        thumbnail: "",
      });

      if (course.thumbnail?.url) {
        setPreview(`${BASE_URL}${course.thumbnail.url}`);
      }
    } catch (error) {
      console.error("Fetch Course Error:", error.response?.data || error);
    }
  };

  const uploadThumbnail = async (file) => {
    const formData = new FormData();
    formData.append("files", file);

    const response = await axios.post(`${BASE_URL}/api/upload`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data[0].id;
  };

  const onSubmit = async (data) => {
    try {
      let thumbnailId = null;

      if (data.thumbnail && data.thumbnail.length > 0) {
        thumbnailId = await uploadThumbnail(data.thumbnail[0]);
      }

      const user = JSON.parse(localStorage.getItem("user"));

      const body = {
        data: {
          title: data.title,
          description: data.description,
          duration: data.duration,

          // JSON field in Strapi
          language: data.language
            .split(",")
            .map((lang) => lang.trim())
            .filter(Boolean),

          price: Number(data.price),
          isPublished: false,
          category: Number(data.category),
          course_type: Number(data.course_type),
          instructor: user.id,
        },
      };

      if (thumbnailId) {
        body.data.thumbnail = thumbnailId;
      }

      if (isEdit) {
        await axios.put(`${BASE_URL}/api/courses/${id}`, body, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        alert("Course updated successfully");
      } else {
        if (!thumbnailId) {
          alert("Thumbnail is required");
          return;
        }

        await axios.post(`${BASE_URL}/api/courses`, body, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        alert("Course created successfully");
      }

      reset();
      setPreview(null);
      navigate("/instructor/courses");
    } catch (error) {
      console.error("Course Save Error:", error.response?.data || error);
      alert("Course save failed");
    }
  };

  return (
    <DashboardLayout role="instructor">
      <div className="create-course-page ms-5">
        <div className="mb-4">
          <h2 className="fw-bold mb-1">
            {isEdit ? "Update course" : "Create a new course"}
          </h2>
          <p className="text-muted mb-0">
            Set the essentials — you can add lessons after.
          </p>
        </div>

        <div className="course-form-card">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-4">
              <label className="form-label fw-semibold">Course title</label>
              <input
                type="text"
                className={`form-control form-control-lg ${
                  errors.title ? "is-invalid" : ""
                }`}
                placeholder="e.g. Mastering React Server Components"
                {...register("title")}
              />
              <div className="invalid-feedback">{errors.title?.message}</div>
            </div>

            <div className="mb-4">
              <label className="form-label fw-semibold">Description</label>
              <textarea
                className={`form-control ${
                  errors.description ? "is-invalid" : ""
                }`}
                rows="6"
                placeholder="Write short course description..."
                {...register("description")}
              ></textarea>
              <div className="invalid-feedback">
                {errors.description?.message}
              </div>
            </div>

            <div className="row g-3 mb-4">
              <div className="col-md-4">
                <label className="form-label fw-semibold">Category</label>
                <select
                  className={`form-select form-select-lg ${
                    errors.category ? "is-invalid" : ""
                  }`}
                  {...register("category")}
                >
                  <option value="">Select Category</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name || category.title}
                    </option>
                  ))}
                </select>
                <div className="invalid-feedback">
                  {errors.category?.message}
                </div>
              </div>

              <div className="col-md-4">
                <label className="form-label fw-semibold">Course type</label>
                <select
                  className={`form-select form-select-lg ${
                    errors.course_type ? "is-invalid" : ""
                  }`}
                  {...register("course_type")}
                >
                  <option value="">Select Course Type</option>
                  {courseTypes.map((type) => (
                    <option key={type.id} value={type.id}>
                      {type.name || type.title}
                    </option>
                  ))}
                </select>
                <div className="invalid-feedback">
                  {errors.course_type?.message}
                </div>
              </div>

              <div className="col-md-4">
                <label className="form-label fw-semibold">Price (USD)</label>
                <input
                  type="number"
                  className={`form-control form-control-lg ${
                    errors.price ? "is-invalid" : ""
                  }`}
                  {...register("price")}
                />
                <div className="invalid-feedback">{errors.price?.message}</div>
              </div>

              <div className="col-md-4">
                <label className="form-label fw-semibold">Duration</label>
                <input
                  type="text"
                  placeholder="e.g. 8 Hours 5 minute"
                  className={`form-control form-control-lg ${
                    errors.duration ? "is-invalid" : ""
                  }`}
                  {...register("duration")}
                />
                <div className="invalid-feedback">
                  {errors.duration?.message}
                </div>
              </div>

              <div className="col-md-8">
                <label className="form-label fw-semibold">Language</label>
                <input
                  type="text"
                  placeholder="e.g. English, Hindi, Gujarati"
                  className={`form-control form-control-lg ${
                    errors.language ? "is-invalid" : ""
                  }`}
                  {...register("language")}
                />
                <div className="invalid-feedback">
                  {errors.language?.message}
                </div>
                <small className="text-muted">
                  Add multiple languages separated by comma.
                </small>
              </div>
            </div>

            <div className="mb-4">
              <label className="form-label fw-semibold">Thumbnail</label>

              <label
                className={`upload-box w-100 ${
                  errors.thumbnail ? "border border-danger" : ""
                }`}
              >
                <input
                  type="file"
                  hidden
                  accept="image/png,image/jpeg,image/jpg"
                  name={thumbnailRegister.name}
                  ref={thumbnailRegister.ref}
                  onBlur={thumbnailRegister.onBlur}
                  onChange={(e) => {
                    thumbnailRegister.onChange(e);

                    const file = e.target.files?.[0];

                    if (file) {
                      setPreview(URL.createObjectURL(file));
                    }
                  }}
                />

                <div className="text-center">
                  {preview ? (
                    <img
                      src={preview}
                      alt="Thumbnail Preview"
                      className="img-fluid rounded"
                      style={{ maxHeight: "220px" }}
                    />
                  ) : (
                    <>
                      <div className="upload-icon mb-2">
                        <i className="bi bi-upload"></i>
                      </div>

                      <h6 className="fw-bold mb-1">Upload thumbnail</h6>
                      <small className="text-muted">
                        JPG / PNG · 1280 × 720 recommended
                      </small>
                    </>
                  )}
                </div>
              </label>

              {errors.thumbnail && (
                <div className="text-danger mt-2">
                  {errors.thumbnail.message}
                </div>
              )}
            </div>

            <div className="d-flex justify-content-end gap-3">
              <button
                type="button"
                className="btn btn-light px-4"
                onClick={() => navigate("/instructor/courses")}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="btn btn-primary px-4"
                disabled={isSubmitting}
              >
                {isSubmitting
                  ? isEdit
                    ? "Updating..."
                    : "Creating..."
                  : isEdit
                  ? "Update course"
                  : "Create course"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default CreateCourse;