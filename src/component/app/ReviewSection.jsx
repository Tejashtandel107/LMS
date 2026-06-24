import React, { useState } from "react";
import axios from "axios";

function ReviewSection({
  reviews,
  averageRating,
  isEnrolled,
  alreadyReviewed,
  user,
  token,
  BASE_URL,
  course,
  getCourse,
}) {
  const [reviewText, setReviewText] = useState("");
  const [rating, setRating] = useState(5);
  const [showReviewModal, setShowReviewModal] = useState(false);

  const [editingReview, setEditingReview] = useState(null);
  const [editText, setEditText] = useState("");
  const [editRating, setEditRating] = useState(5);

  const handleSubmitReview = async (e) => {
    e.preventDefault();

    if (!reviewText.trim()) {
      alert("Please write your review");
      return;
    }

    try {
      await axios.post(
        `${BASE_URL}/api/ratings`,
        {
          data: {
            rating,
            comment: reviewText,
            user: user.id,
            course: course.id,
          },
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setReviewText("");
      setRating(5);
      getCourse();
    } catch (error) {
      console.log("Review Error:", error.response?.data || error);
    }
  };

  const handleEditClick = (review) => {
    setEditingReview(review);
    setEditText(review.comment);
    setEditRating(review.rating);
  };

  const handleUpdateReview = async (e) => {
    e.preventDefault();

    try {
      await axios.put(
        `${BASE_URL}/api/ratings/${editingReview.documentId || editingReview.id}`,
        {
          data: {
            rating: editRating,
            comment: editText,
          },
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setEditingReview(null);
      getCourse();
    } catch (error) {
      console.log("Update Review Error:", error.response?.data || error);
    }
  };

  const handleDeleteReview = async (review) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this review?"
    );

    if (!confirmDelete) return;

    try {
      await axios.delete(
        `${BASE_URL}/api/ratings/${review.documentId || review.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      getCourse();
    } catch (error) {
      console.log("Delete Review Error:", error.response?.data || error);
    }
  };

  return (
    <>
      <div className="mt-5">
        <h3 className="fw-bold mb-4">Student Reviews</h3>

        {isEnrolled && !alreadyReviewed && (
          <form
            onSubmit={handleSubmitReview}
            className="border rounded-4 p-4 mb-5 shadow-sm bg-white"
          >
            <h5 className="fw-bold mb-3">Write a Review</h5>

            <select
              className="form-select mb-3"
              value={rating}
              onChange={(e) => setRating(Number(e.target.value))}
            >
              <option value={5}>5 - Excellent</option>
              <option value={4}>4 - Very Good</option>
              <option value={3}>3 - Good</option>
              <option value={2}>2 - Average</option>
              <option value={1}>1 - Poor</option>
            </select>

            <textarea
              className="form-control mb-3"
              rows="4"
              placeholder="Write your review..."
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
            />

            <button className="btn btn-primary fw-bold">Submit Review</button>
          </form>
        )}

        {isEnrolled && alreadyReviewed && (
          <div className="alert alert-success">
            You already reviewed this course. You can edit or delete your review.
          </div>
        )}

        {!isEnrolled && (
          <div className="alert alert-warning">
            Only enrolled students can write a review.
          </div>
        )}

        <h3 className="fw-bold mb-4">
          <span className="text-warning">★</span> {averageRating} course rating •{" "}
          {reviews.length} ratings
        </h3>

        <div className="row g-4">
          {reviews.length === 0 ? (
            <p className="text-muted">No reviews yet.</p>
          ) : (
            reviews.slice(0, 2).map((review) => (
              <ReviewCard
                key={review.id}
                review={review}
                currentUser={user}
                onEdit={handleEditClick}
                onDelete={handleDeleteReview}
              />
            ))
          )}
        </div>

        {reviews.length > 2 && (
          <button
            type="button"
            className="btn btn-outline-primary fw-bold mt-4"
            onClick={() => setShowReviewModal(true)}
          >
            Show all reviews
          </button>
        )}
      </div>

      {showReviewModal && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          style={{ background: "rgba(0,0,0,0.6)" }}
        >
          <div className="modal-dialog modal-xl modal-dialog-centered modal-dialog-scrollable">
            <div className="modal-content rounded-4">
              <div className="modal-header">
                <h5 className="modal-title fw-bold">
                  <span className="text-warning">★</span> {averageRating} course
                  rating • {reviews.length} ratings
                </h5>

                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowReviewModal(false)}
                ></button>
              </div>

              <div className="modal-body">
                <div className="row g-4">
                  {reviews.map((review) => (
                    <ReviewCard
                      key={review.id}
                      review={review}
                      currentUser={user}
                      onEdit={handleEditClick}
                      onDelete={handleDeleteReview}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {editingReview && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          style={{ background: "rgba(0,0,0,0.6)" }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content rounded-4">
              <div className="modal-header">
                <h5 className="modal-title fw-bold">Edit Review</h5>

                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setEditingReview(null)}
                ></button>
              </div>

              <form onSubmit={handleUpdateReview}>
                <div className="modal-body">
                  <select
                    className="form-select mb-3"
                    value={editRating}
                    onChange={(e) => setEditRating(Number(e.target.value))}
                  >
                    <option value={5}>5 - Excellent</option>
                    <option value={4}>4 - Very Good</option>
                    <option value={3}>3 - Good</option>
                    <option value={2}>2 - Average</option>
                    <option value={1}>1 - Poor</option>
                  </select>

                  <textarea
                    className="form-control"
                    rows="4"
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                  />
                </div>

                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-light"
                    onClick={() => setEditingReview(null)}
                  >
                    Cancel
                  </button>

                  <button className="btn btn-primary fw-bold">
                    Update Review
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function ReviewCard({ review, currentUser, onEdit, onDelete }) {
  const studentName =
    review.user?.FullName || review.user?.username || "Student";

  const isMyReview = currentUser && review.user?.id === currentUser.id;

  return (
    <div className="col-md-6">
      <div className="border-top pt-4 h-100">
        <div className="d-flex gap-3">
          <div
            className="rounded-circle bg-dark text-white d-flex align-items-center justify-content-center fw-bold"
            style={{
              width: "46px",
              height: "46px",
              minWidth: "46px",
              fontSize: "18px",
            }}
          >
            {studentName.charAt(0).toUpperCase()}
          </div>

          <div className="w-100">
            <div className="d-flex justify-content-between">
              <h6 className="fw-bold mb-1">{studentName}</h6>

              {isMyReview && (
                <div className="dropdown">
                  <button
                    type="button"
                    className="btn btn-sm fw-bold"
                    data-bs-toggle="dropdown"
                  >
                    ⋮
                  </button>

                  <ul className="dropdown-menu dropdown-menu-end">
                    <li>
                      <button
                        type="button"
                        className="dropdown-item"
                        onClick={() => onEdit(review)}
                      >
                        Edit
                      </button>
                    </li>

                    <li>
                      <button
                        type="button"
                        className="dropdown-item text-danger"
                        onClick={() => onDelete(review)}
                      >
                        Delete
                      </button>
                    </li>
                  </ul>
                </div>
              )}
            </div>

            <div className="small mb-2">
              <span className="text-warning">
                {"★".repeat(Number(review.rating || 0))}
              </span>

              <span className="text-muted ms-2">
                {review.createdAt
                  ? new Date(review.createdAt).toLocaleDateString()
                  : "Recently"}
              </span>
            </div>

            <p className="mb-3 text-dark small lh-lg">{review.comment}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ReviewSection;