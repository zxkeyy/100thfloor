"use client";
import { useState } from "react";
import { ChevronRight, Play } from "lucide-react";
import Image from "next/image";
import image1 from "@/public/Rectangle 6.png";
import image2 from "@/public/Rectangle 7.png";
import image3 from "@/public/Rectangle 8.png";
import image4 from "@/public/Rectangle3.png";
import { useTranslations } from "next-intl";

export default function ImageCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const t = useTranslations("Services.carousel");

  const slides = [
    {
      id: 1,
      title: t("interiorDesign"),
      image: image1,
      description: t("interiorDesignDesc"),
      features: [t("interiorDesignFeatures.feature1"), t("interiorDesignFeatures.feature2"), t("interiorDesignFeatures.feature3"), t("interiorDesignFeatures.feature4")],
    },
    {
      id: 2,
      title: t("construction"),
      image: image2,
      description: t("constructionDesc"),
      features: [t("constructionFeatures.feature1"), t("constructionFeatures.feature2"), t("constructionFeatures.feature3")],
    },
    {
      id: 3,
      title: t("planning"),
      image: image3,
      description: t("planningDesc"),
      features: [t("planningFeatures.feature1"), t("planningFeatures.feature2"), t("planningFeatures.feature3")],
    },
    {
      id: 4,
      title: t("slide4"),
      image: image4,
      features: [t("slide4Features.feature1"), t("slide4Features.feature2"), t("slide4Features.feature3")],
    },
  ];

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex === slides.length - 1 ? 0 : prevIndex + 1));
  };

  return (
    <div className="relative w-full overflow-hidden">
      {/* Main carousel container */}
      <div className="relative h-[323px] md:h-[400px] lg:h-[623px]">
        {slides.map((slide, index) => {
          let position = "translate-x-full";
          let zIndex = "z-0";
          let scale = "scale-75";
          let overlay = "bg-white/60"; // default overlay for inactive slides
          let opacity = "opacity-0";

          if (index === currentIndex) {
            position = "translate-x-0";
            zIndex = "z-30";
            scale = "scale-100";
            overlay = "bg-transparent"; // no overlay for active slide
            opacity = "opacity-100";
          } else if (index === (currentIndex + 1) % slides.length) {
            position = "translate-x-1/4";
            zIndex = "z-20";
            scale = "scale-90";
            overlay = "bg-white/40"; // lighter overlay for next slide
            opacity = "opacity-80";
          } else if (index === (currentIndex + 2) % slides.length) {
            position = "translate-x-1/2";
            zIndex = "z-10";
            scale = "scale-75";
            overlay = "bg-white/60";
            opacity = "opacity-60";
          } else {
            position = "translate-x-full";
            zIndex = "z-0";
            scale = "scale-75";
            overlay = "bg-white/80";
            opacity = "opacity-0";
          }

          return (
            <div key={slide.id} className={`w-[80%] absolute inset-0 transition-all duration-500 ease-in-out transform ${position} ${zIndex} ${scale} ${opacity}`}>
              <div className="relative w-[226px] md:w-[280px] lg:w-[437px] h-[323px] md:h-[400px] lg:h-[623px] overflow-hidden shadow-[0_0_40px_0_rgba(44,151,234,0.1)]">
                <Image src={slide.image} alt={slide.title} fill className="object-cover" priority={index === currentIndex} />

                {/* White overlay */}
                <div className={`absolute inset-0 transition-colors duration-500 ${overlay}`} />

                {/* Title overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-3 md:p-4 lg:p-6 m-2 md:m-3 bg-black/5 backdrop-blur-xs">
                  <h3 className="text-white text-lg md:text-xl font-bold mb-1 md:mb-2">{slide.title}</h3>
                  {slide.features.map((feature, featureIndex) => (
                    <p key={featureIndex} className="text-white text-xs md:text-sm lg:text-md mt-1 md:mt-2 gap-1 md:gap-2 flex items-start md:items-center leading-tight">
                      <Play fill="currentColor" size={14} className="md:w-5 md:h-5 flex-shrink-0 mt-0.5 md:mt-0" />
                      <span className="break-words">{feature}</span>
                    </p>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Navigation arrows */}

      <button onClick={nextSlide} className="cursor-pointer absolute right-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors z-40">
        <ChevronRight className="w-6 h-6 text-gray-600" />
      </button>
    </div>
  );
}
