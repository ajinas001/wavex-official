"use client";

import { useState } from "react";
import Loader from "@/components/Loader";
import Header from "@/components/Navbar";
import Hero from "@/components/Hero";
import Marquee from "@/components/Marquee";
import About from "@/components/About";

import Services from "@/components/Services";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import CinematicHero from "@/components/Hero";
import Navbar from "@/components/Navbar";
import HeroScene from "@/components/HeroScene";
import AboutWaveX from "@/components/Aboutsection";
import  { DimensionalWarpShowcase } from "@/components/Work";

export default function Home() {
  const [loading, setLoading] = useState(true);

  return (
    <>
      {/* <Loader onComplete={() => setLoading(false)} /> */}

      {/* {!loading && <Header />} */}

      <main id="main-content">
        <Navbar/>
        <Hero/>
        <Marquee />
        <About />
        <DimensionalWarpShowcase/> 
        <Services />
        <AboutWaveX/>
        <Contact />
      </main>

      <Footer />



      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ProfessionalService",
            name: "Studio Noir",
            description:
              "Independent web design and development studio building cinematic, high-performance websites.",
            url: "https://studio-noir.example",
            email: "hello@studionoir.co",
          }),
        }}
      />
    </>
  );
}
