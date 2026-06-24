import React, { useEffect, useState } from "react";
import axios from "axios";
import DashboardLayout from "../../dashboard/DashboardLayout";
import styles from "./ManageLessons.module.css";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const lessonSchema = z.object({
  course: z.string().min(1, "Course is required"),
  title: z.string().min(1, "Lesson title is required"),
  content: z.string().optional(),
  duration: z.string().min(1, "Duration is required"),
  order: z
    .string()
    .min(1, "Order is required")
    .refine((value) => Number(value) > 0, {
      message: "Order must be greater than 0",
    }),
});

function AddLesson() {
  const API_URL = import.meta.env.VITE_BASE_URL;

  const [courses, setCourses] = useState([]);
  const [courseError, setCourseError] = useState("");
  const [loading, setLoading] = useState(false);
  const [videoFile, setVideoFile] = useState(null);
  const [videoError, setVideoError] = useState("");

  const token = localStorage.getItem("token");

  const {register,handleSubmit,reset,formState: { errors }} = useForm({
    resolver: zodResolver(lessonSchema),
    defaultValues: {
      title: "",
      content: "",
      order: "",
      course: "",
      duration: "",
    },
  });

  const getCourses = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));

      const response = await axios.get(`${API_URL}/api/courses?populate=*&filters[instructor][id][$eq]=${user.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const courseList = response.data.data || [];
      setCourses(courseList);

      if (courseList.length === 0) {
        setCourseError("No courses found. Please create a course before adding lessons.");
      } else {
        setCourseError("");
      }
    } catch (error) {
      console.log("Course fetch error:", error.response?.data || error);
    }
  };

  useEffect(() => {
    getCourses();
  }, []);

  const uploadVideo = async () => {
    if (!videoFile) {
      setVideoError("Video is required");
      return null;
    }

    const uploadData = new FormData();
    uploadData.append("files", videoFile);

    const response = await axios.post(`${API_URL}/api/upload`, uploadData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data[0].id;
  };

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      setVideoError("");

      const uploadedVideoId = await uploadVideo();

      if (!uploadedVideoId) {
        setLoading(false);
        return;
      }

      const lessonData = {
        title: data.title,
        content: data.content,
        duration: data.duration,
        order: Number(data.order),
        course: data.course,
        video: uploadedVideoId,
      };

      await axios.post(
        `${API_URL}/api/lessons`,
        {
          data: lessonData,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Lesson added successfully");

      reset();
      setVideoFile(null);
      document.getElementById("videoInput").value = "";
    } catch (error) {
      console.log("Add lesson error:", error.response?.data || error);
      alert("Failed to add lesson");
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout role="instructor">
      <div className={`${styles.lessonPage} ms-5`}>
        <div className="mb-4">
          <h2 className="fw-bold mb-1">Add Lesson</h2>
          <p className="text-muted mb-0">
            Create a lesson and assign it to a specific course.
          </p>
        </div>

        <div className="card border-0 shadow-sm rounded-4">
          <div className="card-body p-4">
            {courseError && (
              <div className="alert alert-warning mb-4">
                <i className="bi bi-exclamation-triangle me-2"></i>
                {courseError}
              </div>
            )}
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="mb-3">
                <label className="form-label fw-semibold">Select Course</label>
                <select className="form-select" {...register("course")}>
                  <option value="">Select course</option>

                  {courses.map((course) => (
                    <option key={course.id} value={course.documentId}>
                      {course.title}
                    </option>
                  ))}
                </select>
                {errors.course && (
                  <small className="text-danger">{errors.course.message}</small>
                )}
              </div>

              <div className="mb-3">
                <label className="form-label fw-semibold">Lesson Title</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter lesson title"
                  {...register("title")}
                />
                {errors.title && (
                  <small className="text-danger">{errors.title.message}</small>
                )}
              </div>

              <div className="mb-3">
                <label className="form-label fw-semibold">Content</label>
                <textarea
                  className="form-control"
                  rows="5"
                  placeholder="Enter lesson content"
                  {...register("content")}
                ></textarea>
              </div>

              <div className="mb-3">
                <label className="form-label fw-semibold">Lesson Video</label>
                <input
                  id="videoInput"
                  type="file"
                  accept="video/*"
                  className="form-control"
                  onChange={(e) => {
                    setVideoFile(e.target.files[0]);
                    setVideoError("");
                  }}
                />
                {videoError && (
                  <small className="text-danger">{videoError}</small>
                )}
              </div>

              <div className="mb-3">
  <label className="form-label fw-semibold">
    Duration
  </label>

  <input
    type="text"
    className="form-control"
    placeholder="e.g. 15 Minutes"
    {...register("duration")}
  />

  {errors.duration && (
    <small className="text-danger">
      {errors.duration.message}
    </small>
  )}
</div>

              <div className="mb-4">
                <label className="form-label fw-semibold">Order</label>
                <input
                  type="number"
                  className="form-control"
                  placeholder="1"
                  {...register("order")}
                />
                {errors.order && (
                  <small className="text-danger">{errors.order.message}</small>
                )}
              </div>

              <button
                type="submit"
                className="btn btn-primary rounded-3 px-4"
                disabled={loading}
              >
                {loading ? "Adding..." : "Add Lesson"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default AddLesson;