import React, { useEffect, useState } from "react";
import axios from "axios";

function Categories() {
  const BASE_URL = import.meta.env.VITE_BASE_URL;
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    getCategories();
  }, []);

  async function getCategories() {
    try {
      const response = await axios.get(`${BASE_URL}/api/categories?populate=*`);
      setCategories(response.data.data || []);
    } catch (error) {
      console.log("Category Error:", error);
    }
  }

  return (
    <section className="py-5 bg-white">
      <div className="container">
        <div className="text-center mb-5">
          <h2 className="fw-bold display-6">Explore by category</h2>
          <p className="text-muted">
            Find your path across expert-led tracks.
          </p>
        </div>
        <div className="row g-4 justify-content-center">
          {categories.map((item) => (
            <div
              key={item.id}
              className="col-xl-2 col-lg-3 col-md-4 col-sm-6 col-10"
            >
              <div className="category-card h-100 text-center p-4 border rounded-4">
                
                {/* Icon */}
                <div className="icon-wrapper mx-auto mb-3">
                  <i className="bi bi-book fs-4"></i>
                </div>

                <h6 className="fw-semibold mb-2">
                  {item.name}
                </h6>

                <small className="text-muted">
                  {item.courses?.length || 0} Courses
                </small>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Categories;