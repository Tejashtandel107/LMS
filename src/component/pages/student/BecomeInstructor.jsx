import React, { useState,useEffect } from "react";
import styles from "./BecomeInstructor.module.css";
import DashboardLayout from "../../dashboard/DashboardLayout";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";

const instructorSchema = z.object({
    expertise: z.string().min(1, "Area of expertise is required"),
    experience: z.string().min(10, "Experience must be at least 10 characters"),
    portfolioLink: z
        .string()
        .min(1, "Portfolio link is required")
        .url("Please enter a valid URL"),
    resume: z
        .any()
        .refine((files) => files?.length > 0, "Resume is required")
        .refine(
            (files) => files?.[0]?.type === "application/pdf",
            "Only PDF file is allowed"
        )
        .refine(
            (files) => files?.[0]?.size <= 5 * 1024 * 1024,
            "PDF size must be less than 5MB"
        ),
});

function BecomeInstructor() {
    const BASE_URL = import.meta.env.VITE_BASE_URL;

    const [successMsg, setSuccessMsg] = useState("");
    const [errorMsg, setErrorMsg] = useState("");
    const [existingRequest, setExistingRequest] = useState(null);

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset,
    } = useForm({
        resolver: zodResolver(instructorSchema),
    });

    const onSubmit = async (data) => {
        setSuccessMsg("");
        setErrorMsg("");

        try {
            const token = localStorage.getItem("token");
            const user = JSON.parse(localStorage.getItem("user"));

            if (!token || !user?.documentId) {
            setErrorMsg("Please login first.");
            return;
            }

            // 1. Upload resume first
            const formData = new FormData();
            formData.append("files", data.resume[0]);

            const uploadResponse = await axios.post(
            `${BASE_URL}/api/upload`,
            formData,
            {
                headers: {
                Authorization: `Bearer ${token}`,
                },
            }
            );

            const uploadedResumeId = uploadResponse.data[0].id;

            // 2. Create instructor request
            await axios.post(
            `${BASE_URL}/api/instructor-requests`,
            {
                data: {
                expertise: data.expertise,
                experience: [
                    {
                        type: "paragraph",
                        children: [
                            {
                            type: "text",
                            text: data.experience,
                            },
                        ],
                    },
                ],
                portfolioLink: data.portfolioLink,
                resume: uploadedResumeId,
                user: {
                    connect: [user.documentId],
                },
                },
            },
            {
                headers: {
                Authorization: `Bearer ${token}`,
                },
            }
            );

            setSuccessMsg("Your instructor application has been submitted successfully.");
            reset();
        } catch (error) {
            console.error("Instructor Request Error:", error.response?.data || error);

            setErrorMsg(error.response?.data?.error?.message || "Something went wrong while submitting application."
            );
        }
    };

        useEffect(() => {
    const checkExistingRequest = async () => {
        try {
        const token = localStorage.getItem("token");
        const user = JSON.parse(localStorage.getItem("user"));

        if (!token || !user?.documentId) return;

        const response = await axios.get(
            `${BASE_URL}/api/instructor-requests?filters[user][documentId][$eq]=${user.documentId}&populate=*`,
            {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            }
        );

        if (response.data.data.length > 0) {
            setExistingRequest(response.data.data[0]);
        }
        } catch (error) {
        console.error("Check request error:", error.response?.data || error);
        }
    };

    checkExistingRequest();
    }, [BASE_URL]);

    return (
        <DashboardLayout role="student">
            <div className={`container-fluid ${styles.page}`}>
                {existingRequest ? (
  <div className="text-center py-4">
    <h4 className="mb-3">
      Instructor Request Already Submitted
    </h4>

    <p className="text-muted mb-3">
      Your application is currently under review.
    </p>

    <div
      className={`badge fs-6 px-4 py-2 ${
        existingRequest.requestStatus === "approved"
          ? "bg-success"
          : existingRequest.requestStatus === "rejected"
          ? "bg-danger"
          : "bg-warning text-dark"
      }`}
    >
      Status: {existingRequest.requestStatus}
    </div>

    {existingRequest.requestStatus === "approved" && (
      <div className="alert alert-success mt-4">
        Congratulations! Your instructor request has been approved.
      </div>
    )}

    {existingRequest.requestStatus === "rejected" && (
      <div className="alert alert-danger mt-4">
        Your instructor request was rejected. Please contact support for more information.
      </div>
    )}

    {existingRequest.requestStatus === "pending" && (
      <div className="alert alert-info mt-4">
        Your instructor request is pending review.
      </div>
    )}
  </div>
) : (

                <div className={styles.contentWrapper}>
                    <h1 className={styles.heading}>Become an Instructor</h1>

                    <p className={styles.subHeading}>
                        Share what you know — apply to teach on Learnix.
                    </p>

                    <div className={styles.card}>
                        <div className={styles.cardBody}>
                            {successMsg && (
                                <div className="alert alert-success">{successMsg}</div>
                            )}

                            {errorMsg && (
                                <div className="alert alert-danger">{errorMsg}</div>
                            )}

                            <form onSubmit={handleSubmit(onSubmit)}>
                                <div className="mb-4">
                                    <label className={styles.label}>Area of expertise</label>
                                    <input
                                        type="text"
                                        className={`form-control ${styles.input} ${errors.expertise ? "is-invalid" : ""
                                            }`}
                                        placeholder="e.g. Frontend Engineering, UX Design..."
                                        {...register("expertise")}
                                    />
                                    <div className="invalid-feedback">
                                        {errors.expertise?.message}
                                    </div>
                                </div>

                                <div className="mb-4">
                                    <label className={styles.label}>Experience</label>
                                    <textarea
                                        rows="5"
                                        className={`form-control ${styles.textarea} ${errors.experience ? "is-invalid" : ""
                                            }`}
                                        placeholder="Tell us about your background, projects, and teaching experience."
                                        {...register("experience")}
                                    ></textarea>
                                    <div className="invalid-feedback">
                                        {errors.experience?.message}
                                    </div>
                                </div>

                                <div className="mb-4">
                                    <label className={styles.label}>Portfolio / website link</label>
                                    <input
                                        type="url"
                                        className={`form-control ${styles.input} ${errors.portfolioLink ? "is-invalid" : ""
                                            }`}
                                        placeholder="https://..."
                                        {...register("portfolioLink")}
                                    />
                                    <div className="invalid-feedback">
                                        {errors.portfolioLink?.message}
                                    </div>
                                </div>

                                <div className="mb-4">
                                    <label className={styles.label}>Resume / CV</label>

                                    <label className={styles.uploadBox}>
                                        <div className={styles.uploadIcon}>⬆</div>

                                        <p className={styles.uploadText}>
                                            <strong>Click to upload</strong> or drag and drop
                                        </p>

                                        <small className={styles.uploadHint}>PDF up to 5MB</small>

                                        <input
                                            type="file"
                                            accept=".pdf"
                                            className="d-none"
                                            {...register("resume")}
                                        />
                                    </label>

                                    {errors.resume && (
                                        <small className="text-danger">
                                            {errors.resume.message}
                                        </small>
                                    )}
                                </div>

                                <button
                                    type="submit"
                                    className={`btn w-100 ${styles.submitBtn}`}
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? "Submitting..." : "Submit application"}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
)}

            </div>
            
        </DashboardLayout>
    );
}

export default BecomeInstructor;