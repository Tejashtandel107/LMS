import React, { useRef } from 'react'
import { Link } from "react-router-dom";
import Header from './app/Header';
import Categories from './app/Category';
import FeaturedCourses from './app/FeaturedCourses';
import WhyLearnix from './app/WhyLearnix';
import Hero from './app/Hero';
import Footer from './app/Footer';

function Home() {
  const categoriesRef = useRef(null);
  const whyRef = useRef(null);
  const coursesRef = useRef(null);

  const scrollToSection = (ref)=>{
    ref.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    })
  }

  return (
    <>
     <Header scrollToCategories={() => scrollToSection(categoriesRef)}
        scrollToCourses={() => scrollToSection(coursesRef)}
        scrollToWhy={() => scrollToSection(whyRef)}/>
     <Hero />
     <div ref={categoriesRef}>
        <Categories />
      </div>

      <div ref={coursesRef}>
        <FeaturedCourses />
      </div>

      <div ref={whyRef}>
        <WhyLearnix />
      </div>
      <Footer/>
    </>
  )
}

export default Home
