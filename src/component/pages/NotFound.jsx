import { Link } from "react-router-dom";

function NotFound() {
  return (
    <div
      className="d-flex align-items-center justify-content-center bg-light"
      style={{ minHeight: "100vh" }}
    >
      <div
        className="card border-0 shadow-lg text-center p-4 p-md-5"
        style={{ maxWidth: "650px", width: "100%" }}
      >
        <h1
          className="fw-bold text-primary mb-0"
          style={{ fontSize: "7rem" }}
        >
          404
        </h1>

        <h2 className="fw-bold mt-2">Page Not Found</h2>

        <p className="text-muted mt-3 mb-4">
          Sorry, the page you are looking for doesn't exist or has been moved.
        </p>

        <div className="d-flex justify-content-center gap-3 flex-wrap">
          <Link to="/" className="btn btn-primary px-4">
            <i className="bi bi-house-door me-2"></i>
            Home
          </Link>
        </div>
      </div>
    </div>
  );
}

export default NotFound;