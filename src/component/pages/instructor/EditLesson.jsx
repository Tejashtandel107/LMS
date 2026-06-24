import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import DashboardLayout from "../../dashboard/DashboardLayout";
import styles from "./ManageLessons.module.css";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const lessonSchema = z.object({
  course: z.string().min(1, "Course is required"),
  title: z.string().min(1, "Lesson title is required"),
  content: z.string().optional(),
  order: z
    .string()
    .min(1, "Order is required")
    .refine((value) => Number(value) > 0, {
      message: "Order must be greater than 0",
    }),
});

function EditLesson() {
  const API_URL = import.meta.env.VITE_BASE_URL;
  const token = localStorage.getItem("token");

  const { documentId } = useParams();
  const navigate = useNavigate();

  const [courses, setCourses] = useState([]);
  const [videoFile, setVideoFile] = useState(null);
  const [currentVideo, setCurrentVideo] = useState(null);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(lessonSchema),
    defaultValues: {
      title: "",
      content: "",
      order: "",
      course: "",
    },
  });

  const getCourses = async () => {
    const response = await axios.get(`${API_URL}/api/courses`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    setCourses(response.data.data || []);
  };

  const getLesson = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/api/lessons/${documentId}?populate=*`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const lesson = response.data.data;

      reset({
        title: lesson.title || "",
        content: lesson.content || "",
        order: lesson.order ? String(lesson.order) : "",
        course: lesson.course?.documentId || "",
      });

      setCurrentVideo(lesson.video || null);
    } catch (error) {
      console.log("Lesson fetch error:", error.response?.data || error);
    }
  };

  useEffect(() => {
    getCourses();
    getLesson();
  }, []);

  const uploadVideo = async () => {
    if (!videoFile) return null;

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

      const uploadedVideoId = await uploadVideo();

      const lessonData = {
        title: data.title,
        content: data.content,
        order: Number(data.order),
        course: data.course,
      };

      if (uploadedVideoId) {
        lessonData.video = uploadedVideoId;
      }

      await axios.put(
        `${API_URL}/api/lessons/${documentId}`,
        {
          data: lessonData,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Lesson updated successfully");
      navigate("/instructor/lessons");
    } catch (error) {
      console.log("Update lesson error:", error.response?.data || error);
      alert("Failed to update lesson");
    } finally {
      setLoading(false);
    }
  };

  const currentVideoUrl = currentVideo?.url
    ? `${API_URL}${currentVideo.url}`
    : null;

  return (
    <DashboardLayout role="instructor">
      <div className={`${styles.lessonPage} ms-5`}>
        <div className="mb-4">
          <h2 className="fw-bold mb-1">Edit Lesson</h2>
          <p className="text-muted mb-0">
            Update lesson details and video.
          </p>
        </div>

        <div className="card border-0 shadow-sm rounded-4">
          <div className="card-body p-4">
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
                <label className="form-label fw-semibold">Current Video</label>

                {currentVideoUrl ? (
                  <div>
                    <video width="320" controls className="rounded border">
                      <source
                        src={currentVideoUrl}
                        type={currentVideo.mime}
                      />
                    </video>
                  </div>
                ) : (
                  <p className="text-muted mb-0">No video uploaded</p>
                )}
              </div>

              <div className="mb-3">
                <label className="form-label fw-semibold">
                  Replace Video
                </label>
                <input
                  type="file"
                  accept="video/*"
                  className="form-control"
                  onChange={(e) => setVideoFile(e.target.files[0])}
                />
                <small className="text-muted">
                  Leave empty if you do not want to change video.
                </small>
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
                {loading ? "Updating..." : "Update Lesson"}
              </button>

              <button
                type="button"
                className="btn btn-light rounded-3 px-4 ms-2"
                onClick={() => navigate("/instructor/lessons")}
              >
                Cancel
              </button>
            </form>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default EditLesson;