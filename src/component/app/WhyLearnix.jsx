import React from "react";
import styles from "./WhyLearnix.module.css";

function WhyLearnix() {
  const features = [
    {
      icon: "⚡",
      title: "Learn by doing",
      desc: "Every course includes real projects you'll add to your portfolio.",
    },
    {
      icon: "👥",
      title: "Top instructors",
      desc: "Engineers, designers, and operators from companies you know.",
    },
    {
      icon: "🛡️",
      title: "Lifetime access",
      desc: "Buy once, learn forever. New lessons get added at no extra cost.",
    },
    {
      icon: "🌍",
      title: "Learn anywhere",
      desc: "Fully responsive — pick up where you left off across all devices.",
    },
    {
      icon: "⭐",
      title: "4.8 average rating",
      desc: "Loved by 12k+ students across 60+ countries.",
    },
    {
      icon: "✨",
      title: "Become an instructor",
      desc: "Apply to teach and earn — share what you know with the world.",
    },
  ];

  return (
    <section className={`${styles.section} py-5`}>
      <div className="container">
        <div className={styles.header}>
          <h2 className="fw-bold display-6">
            Why Learnix
          </h2>

          <p className="text-muted">
            Everything you need to grow your skills.
          </p>
        </div>

        <div className="row g-4">
          {features.map((feature, index) => (
            <div className="col-lg-4 col-md-6 col-12" key={index}>
              <div className={styles.card}>
                <div className={styles.icon}>
                  {feature.icon}
                </div>

                <h4 className={styles.title}>
                  {feature.title}
                </h4>

                <p className={styles.desc}>
                  {feature.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default WhyLearnix;