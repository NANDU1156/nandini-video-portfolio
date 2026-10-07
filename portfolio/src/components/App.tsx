"use client";
import { useEffect } from "react";
import { SmoothScroll } from "@/lib/scroll";
import Navigation from "./Navigation";
import Hero from "./hero/Hero";
import About from "./sections/About";
import Skills from "./sections/Skills";
import Work from "./sections/Work";
import Certifications from "./sections/Certifications";
import Experience from "./sections/Experience";
import Contact from "./sections/Contact";

export default function App() {
  // Global reveal observer: .rv (fade + rise) and .rv-mask (line slides up). Animates once.
  useEffect(() => {
    const io = new IntersectionObserver(
      (es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("is-in"); io.unobserve(e.target); } }),
      { threshold: 0.12, rootMargin: "0px 0px -6% 0px" },
    );
    document.querySelectorAll(".rv, .rv-mask").forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
  return (
    <>
      <SmoothScroll />
      <Navigation />
      <main>
        <Hero />
        <About />
        <Skills />
        <Work />
        <Certifications />
        <Experience />
      </main>
      <Contact />
    </>
  );
}
