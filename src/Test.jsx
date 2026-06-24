import React, { useRef } from "react";

function Test() {
  const coursesRef = useRef(null);

  const scrollToCourses = () => {
    coursesRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return (
    <>
      <section style={{ height: "100vh" }}>
        <h1>Hero Section</h1>

        <button onClick={scrollToCourses}>
          View Courses
        </button>
      </section>

      <section
        ref={coursesRef}
        style={{ height: "100vh" }}
      >
        <h2>Featured Courses</h2>
      </section>
    </>
  );
}

export default Test;