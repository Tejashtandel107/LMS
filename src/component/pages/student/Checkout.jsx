import React, { useState,useEffect } from "react";
import axios from "axios";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import Header from "../../app/Header";
import Footer from "../../app/Footer";
import { removeFromCart } from "../../../features/cartSlice";

function Checkout() {
  const BASE_URL = import.meta.env.VITE_BASE_URL;
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  const cartItems = location.state?.cartItems || [];
  const totalAmount = Number(location.state?.totalAmount || 0);

  const gstRate = 18;
  const gstAmount = totalAmount > 0 ? (totalAmount * gstRate) / 100 : 0;
  const finalAmount = totalAmount + gstAmount;

  const [processing, setProcessing] = useState(false);

  const enrollCourses = async () => {
    for (const item of cartItems) {
      await axios.post(
        `${BASE_URL}/api/enrollments`,
        {
          data: {
            course: item.course.id,
            student: user.id,
            enrolledAt: new Date().toISOString(),
          },
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (item.documentId) {
        dispatch(removeFromCart(item.documentId));
      }
    }
  };

  useEffect(() => {
   document.title = "Checkout | Learning Management System";
  }, []);
  const handlePayment = async () => {
    try {
      if (!token || !user) {
        navigate("/login");
        return;
      }

      setProcessing(true);

      if (finalAmount === 0) {
        await enrollCourses();
        alert("Enrollment successful");
        navigate("/student/learning");
        return;
      }

      const { data } = await axios.post(
        `${BASE_URL}/api/payment/create-order`,
        {
          amount: finalAmount,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const options = {
        key: data.key,
        amount: data.order.amount,
        currency: data.order.currency,
        name: "Learnix",
        description: `Course Payment with ${gstRate}% GST`,
        order_id: data.order.id,

        handler: async function (response) {
          const verifyRes = await axios.post(
            `${BASE_URL}/api/payment/verify-payment`,
            response,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          if (verifyRes.data.success) {
            await enrollCourses();
            alert("Payment successful");
            navigate("/student/learning");
          } else {
            alert("Payment verification failed");
          }
        },

        prefill: {
          name: user?.FullName || user?.username || "",
          email: user?.email || "",
        },

        theme: {
          color: "#0d6efd",
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();

      razorpay.on("payment.failed", function () {
        alert("Payment failed");
      });
    } catch (error) {
      console.log("Payment error:", error.response?.data || error);
      alert("Something went wrong");
    } finally {
      setProcessing(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <>
        <Header />
        <div className="container py-5">
          <div className="alert alert-info">
            No course selected for checkout.
          </div>
          <Link to="/student/cart" className="btn btn-primary">
            Back to Cart
          </Link>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />

      <div className="container py-5">
        <h2 className="fw-bold mb-4">Checkout</h2>

        <div className="row g-4">
          <div className="col-lg-8">
            <div className="card border-0 shadow-sm rounded-4 p-4">
              <h4 className="fw-bold mb-3">Billing Details</h4>

              <div className="mb-3">
                <label className="form-label">Student Name</label>
                <input
                  type="text"
                  className="form-control"
                  value={user?.FullName || user?.username || ""}
                  disabled
                />
              </div>

              <div className="mb-4">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  className="form-control"
                  value={user?.email || ""}
                  disabled
                />
              </div>

              <h5 className="fw-bold mb-3">Selected Courses</h5>

              {cartItems.map((item) => {
                const course = item.course;

                const imageUrl = course?.thumbnail?.url
                  ? `${BASE_URL}${course.thumbnail.url}`
                  : "https://via.placeholder.com/120x80";

                return (
                  <div
                    key={item.id}
                    className="d-flex align-items-center border rounded-3 p-3 mb-3"
                  >
                    <img
                      src={imageUrl}
                      alt={course?.title}
                      style={{
                        width: "100px",
                        height: "70px",
                        objectFit: "cover",
                        borderRadius: "10px",
                      }}
                    />

                    <div className="ms-3 flex-grow-1">
                      <h6 className="fw-bold mb-1">{course?.title}</h6>
                      <p className="text-muted small mb-0">
                        {course?.description?.slice(0, 60)}...
                      </p>
                    </div>

                    <strong>
                      {Number(course?.price) === 0
                        ? "Free"
                        : `₹${Number(course?.price).toFixed(2)}`}
                    </strong>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="col-lg-4">
            <div className="card border-0 shadow-sm rounded-4">
              <div className="card-body p-4">
                <h4 className="fw-bold mb-4">Payment Summary</h4>

                <div className="d-flex justify-content-between mb-2">
                  <span>Total Courses</span>
                  <strong>{cartItems.length}</strong>
                </div>

                <div className="d-flex justify-content-between mb-2">
                  <span>Subtotal</span>
                  <strong>₹{totalAmount.toFixed(2)}</strong>
                </div>

                <div className="d-flex justify-content-between mb-3">
                  <span>GST ({gstRate}%)</span>
                  <strong className="text-success">
                    ₹{gstAmount.toFixed(2)}
                  </strong>
                </div>

                <hr />

                <div className="d-flex justify-content-between mb-4">
                  <h5 className="fw-bold">Grand Total</h5>
                  <h5 className="fw-bold text-primary">
                    ₹{finalAmount.toFixed(2)}
                  </h5>
                </div>

                <button
                  onClick={handlePayment}
                  disabled={processing}
                  className="btn btn-primary w-100 fw-bold py-2"
                >
                  {processing
                    ? "Processing..."
                    : finalAmount === 0
                    ? "Complete Enrollment"
                    : `Pay ₹${finalAmount.toFixed(2)}`}
                </button>

                <Link to="/student/cart" className="btn btn-outline-dark w-100 mt-2">
                  Back to Cart
                </Link>

                <p className="text-muted small text-center mt-3 mb-0">
                  Secure payment with Razorpay
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}

export default Checkout;