import React from "react";
import { Link } from "react-router-dom";
import styles from "./Footer.module.css";

function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.top}>
        <div>
          <h3>Learnix</h3>
          <p>
            Learn new skills online with expert instructors and practical
            courses.
          </p>
        </div>

        <div>
          <h5>Quick Links</h5>
          <Link to="/">Home</Link>
          <Link to="/course">Courses</Link>
          <Link to="/login">Login</Link>
          <Link to="/register">Register</Link>
        </div>

        <div>
          <h5>Student</h5>
          <Link to="/student/learning">My Learning</Link>
          <Link to="/student/wishlist">Wishlist</Link>
          <Link to="/student/cart">Cart</Link>
          <Link to="/student/become-instructor">Become Instructor</Link>
        </div>

        <div>
          <h5>Contact</h5>
          <p>📧 support@learnix.com</p>
          <p>📍 India</p>

          <div className={styles.social}>
            <span>🌐</span>
            <span>📘</span>
            <span>📸</span>
            <span>▶️</span>
          </div>
        </div>
      </div>

      <div className={styles.bottom}>
        <p>© {new Date().getFullYear()} Learnix. All rights reserved.</p>
        <div>
          <Link to="/">Privacy Policy</Link>
          <Link to="/">Terms</Link>
        </div>
      </div>
    </footer>
  );
}

export default Footer;