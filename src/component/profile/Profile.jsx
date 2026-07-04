import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import DashboardLayout from "../dashboard/DashboardLayout";
import styles from "./Profile.module.css";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const API_URL = import.meta.env.VITE_BASE_URL;

const profileSchema = z.object({
  username: z.string().min(1, "Username is required"),
  FullName: z.string().min(1, "Full name is required"),
  email: z.string().min(1, "Email is required").email("Invalid email"),
  bio: z.string().max(250, "Bio must be max 250 characters").optional(),
});

function Profile() {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  const fileInputRef = useRef(null);

  const [userId, setUserId] = useState(null);
  const [avatar, setAvatar] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState("");
  const [message, setMessage] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      username: "",
      FullName: "",
      email: "",
      bio: "",
    },
  });

  useEffect(() => {
    getProfile();
  }, []);

  function getProfile() {
    try {
      const localUser = JSON.parse(localStorage.getItem("user"));

      if (!localUser) return;

      setUserId(localUser.id);
      setAvatar(localUser.avatar || null);

      reset({
        username: localUser.username || "",
        FullName: localUser.FullName || "",
        email: localUser.email || "",
        bio: localUser.bio || "",
      });
    } catch (error) {
      console.log("Profile Error:", error);
    }
  }

  function handleAvatarClick() {
    fileInputRef.current.click();
  }

  function handleAvatarChange(e) {
    const file = e.target.files[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setMessage("Please select only image file");
      return;
    }

    setAvatar(file);
    setAvatarPreview(URL.createObjectURL(file));
  }

  async function onSubmit(data) {
    setMessage("");

    try {
      let avatarId = avatar?.id || null;
      let avatarData = avatar;

      if (avatar instanceof File) {
        const formData = new FormData();
        formData.append("files", avatar);

        const uploadResponse = await axios.post(
          `${API_URL}/api/upload`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        avatarData = uploadResponse.data[0];
        avatarId = avatarData.id;
      }

      await axios.put(
        `${API_URL}/api/users/${userId}`,
        {
          username: data.username,
          FullName: data.FullName,
          email: data.email,
          bio: data.bio,
          avatar: avatarId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const oldUser = JSON.parse(localStorage.getItem("user"));

      localStorage.setItem(
        "user",
        JSON.stringify({
          ...oldUser,
          username: data.username,
          FullName: data.FullName,
          email: data.email,
          bio: data.bio,
          avatar: avatarData,
        })
      );

      setAvatar(avatarData);
      setAvatarPreview("");
      setMessage("Profile updated successfully");
    } catch (error) {
      console.log("Update Error:", error.response?.data || error);
      setMessage("Something went wrong");
    }
  }

  const avatarUrl = avatarPreview
    ? avatarPreview
    : avatar?.url
    ? `${API_URL}${avatar.url}`
    : "https://cdn-icons-png.flaticon.com/512/3135/3135715.png";

  const username = watch("username");
  const fullName = watch("FullName");
  const email = watch("email");

  return (
    <DashboardLayout role={`${user.userRole}`}>
      <div className={`${styles.profilePage} ms-5`}>
        <div className={styles.header}>
          <h2>Profile settings</h2>
          <p>Update your personal information across Learnix.</p>
        </div>

        <div className={styles.card}>
          <div className={styles.userInfo}>
            <div className={styles.avatarBox}>
              <img src={avatarUrl} alt="avatar" className={styles.avatar} />

              <button
                type="button"
                className={styles.cameraBtn}
                onClick={handleAvatarClick}
              >
                <i className="bi bi-camera-fill"></i>
              </button>

              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={handleAvatarChange}
                hidden
              />
            </div>

            <div>
              <h5>{fullName || username}</h5>
              <p>{email}</p>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="row">
              <div className="col-md-6 mb-4">
                <label className={styles.label}>Full name</label>
                <input
                  type="text"
                  {...register("FullName")}
                  className={`${styles.input} ${
                    errors.FullName ? styles.inputError : ""
                  }`}
                />
                {errors.FullName && (
                  <p className={styles.errorText}>
                    {errors.FullName.message}
                  </p>
                )}
              </div>

              <div className="col-md-6 mb-4">
                <label className={styles.label}>Username</label>
                <input
                  type="text"
                  {...register("username")}
                  className={`${styles.input} ${
                    errors.username ? styles.inputError : ""
                  }`}
                />
                {errors.username && (
                  <p className={styles.errorText}>
                    {errors.username.message}
                  </p>
                )}
              </div>

              <div className="col-md-6 mb-4">
                <label className={styles.label}>Email</label>
                <input
                  type="email"
                  {...register("email")}
                  className={`${styles.input} ${
                    errors.email ? styles.inputError : ""
                  }`}
                />
                {errors.email && (
                  <p className={styles.errorText}>{errors.email.message}</p>
                )}
              </div>
            </div>

            <div className="mb-4">
              <label className={styles.label}>Bio</label>
              <textarea
                {...register("bio")}
                className={`${styles.textarea} ${
                  errors.bio ? styles.inputError : ""
                }`}
              ></textarea>
              {errors.bio && (
                <p className={styles.errorText}>{errors.bio.message}</p>
              )}
            </div>

            {message && <p className={styles.message}>{message}</p>}

            <div className={styles.buttonBox}>
              <button
                type="submit"
                className={styles.saveBtn}
                disabled={isSubmitting}
              >
                <i className="bi bi-save me-2"></i>
                {isSubmitting ? "Saving..." : "Save changes"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default Profile;