import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Header from "./Header";
import Footer from "./Footer";
import { fetchCart, removeFromCart } from "../../features/cartSlice";
import { useNavigate } from "react-router-dom";

function Cart() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const BASE_URL = import.meta.env.VITE_BASE_URL;

  const { items, loading } = useSelector((state) => state.cart);

  useEffect(() => {
    document.title = "Cart | Learning Management System";
    dispatch(fetchCart());
  }, [dispatch]);

  const totalAmount = items.reduce((total, item) => {
    return total + Number(item.course?.price || 0);
  }, 0);

  const handleCheckout = () => {
    navigate("/checkout", {
      state: {
        cartItems: items,
        totalAmount,
      },
    });
  };

  if (loading) {
    return (
      <>
        <Header />
        <div className="text-center py-5">
          <div className="spinner-border text-primary"></div>
        </div>
      </>
    );
  }

  return (
    <>
      <Header />

      <section className="container py-5">
        <h2 className="fw-bold mb-4">Checkout</h2>

        {items.length === 0 ? (
          <div className="alert alert-info">Your cart is empty.</div>
        ) : (
          <div className="row g-4">
            <div className="col-lg-8">
              {items.map((item) => {
                const course = item.course;

                const imageUrl = course?.thumbnail?.url
                  ? `${BASE_URL}${course.thumbnail.url}`
                  : "https://via.placeholder.com/300x180";

                return (
                  <div
                    className="card border-0 shadow-sm rounded-4 mb-3"
                    key={item.id}
                  >
                    <div className="row g-0 align-items-center">
                      <div className="col-md-4">
                        <img
                          src={imageUrl}
                          alt={course?.title}
                          className="img-fluid rounded-start-4"
                          style={{
                            height: "170px",
                            width: "100%",
                            objectFit: "cover",
                          }}
                        />
                      </div>

                      <div className="col-md-8">
                        <div className="card-body">
                          <h5 className="fw-bold">{course?.title}</h5>

                          <p className="text-muted small mb-2">
                            {course?.description?.slice(0, 100)}...
                          </p>

                          <h5 className="fw-bold mb-3">
                            {Number(course?.price) === 0
                              ? "Free"
                              : `₹${course?.price}`}
                          </h5>

                          <button
                            className="btn btn-outline-danger btn-sm"
                            onClick={() =>
                              dispatch(removeFromCart(item.documentId))
                            }
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="col-lg-4">
              <div className="card border-0 shadow-sm rounded-4 sticky-top">
                <div className="card-body p-4">
                  <h4 className="fw-bold mb-4">Order Summary</h4>

                  <div className="d-flex justify-content-between mb-2">
                    <span>Total Courses</span>
                    <strong>{items.length}</strong>
                  </div>

                  <div className="d-flex justify-content-between mb-3">
                    <span>Total Amount</span>
                    <strong>₹{totalAmount}</strong>
                  </div>

                  <hr />

                  <button
                    className="btn btn-primary w-100 py-2 fw-semibold"
                    onClick={handleCheckout}
                  >
                    Checkout
                  </button>

                  <p className="text-muted small mt-3 mb-0 text-center">
                    Secure payment with Razorpay
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </section>

      <Footer />
    </>
  );
}

export default Cart;