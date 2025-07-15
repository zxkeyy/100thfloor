"use client";
import { useState, useEffect } from "react";

export function Sidenav() {
  const [activeSection, setActiveSection] = useState("home");

  useEffect(() => {
    const handleScroll = () => {
      const sections = ["home", "about", "services", "portfolio", "contact"];
      for (const sectionId of sections) {
        const element = document.getElementById(sectionId);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 100 && rect.bottom >= 100) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="bg-black/40 fixed p-5 right-0 top-1/2 -translate-y-1/2 z-100 space-y-6">
      <div onClick={() => scrollToSection("home")} className={`${activeSection === "home" ? "text-primary" : "text-white/80"} text-lg font-light cursor-pointer hover:text-white transition-colors`}>
        01
      </div>
      <div onClick={() => scrollToSection("about")} className={`${activeSection === "about" ? "text-primary" : "text-white/80"} text-lg font-light cursor-pointer hover:text-white transition-colors`}>
        02
      </div>
      <div onClick={() => scrollToSection("services")} className={`${activeSection === "services" ? "text-primary" : "text-white/80"} text-lg font-light cursor-pointer hover:text-white transition-colors`}>
        03
      </div>
      {/* <div onClick={() => scrollToSection("portfolio")} className={`${activeSection === "portfolio" ? "text-primary" : "text-white/80"} text-lg font-light cursor-pointer hover:text-white transition-colors`}>
        04
      </div> */}
    </div>
  );
}
