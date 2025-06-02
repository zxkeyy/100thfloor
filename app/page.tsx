"use client";
import { Fade } from "@/components/Fade";
import About from "@/components/main/About";
import Home from "@/components/main/Home";
import Portfolio from "@/components/main/Portfolio";
import Services from "@/components/main/Services";
import StayInTouch from "@/components/main/StayInTouch";
import { Sidenav } from "@/components/Sidenav";

export default function Page() {
  return (
    <>
      <Sidenav />
      <section id="home">
        <Home />
      </section>
      <Fade />
      <section id="about">
        <About />
      </section>
      <section id="services">
        <Services />
      </section>
      <section id="portfolio">
        <Portfolio />
      </section>
      <section id="contact">
        <StayInTouch />
      </section>
    </>
  );
}
