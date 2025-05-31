import { useState } from "react";
import { ChevronRight } from "lucide-react";
import image1 from "../assets/Rectangle 6.png";
import image2 from "../assets/Rectangle 7.png";
import image3 from "../assets/Rectangle 8.png";

export default function ImageCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const slides = [
    {
      id: 1,
      title: "Interior Design",
      image: image1,
      description: "Modern architectural interior spaces",
    },
    {
      id: 2,
      title: "Construction",
      image: image2,
      description: "Professional construction services",
    },
    {
      id: 3,
      title: "Planning",
      image: image3,
      description: "Strategic project planning",
    },
  ];

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex === slides.length - 1 ? 0 : prevIndex + 1));
  };

  return (
    <div className="relative w-full">
      {/* Main carousel container */}
      <div className="relative h-[323px] md:h-[400px] lg:h-[623px]">
        {slides.map((slide, index) => {
          let position = "translate-x-full";
          let zIndex = "z-0";
          let scale = "scale-75";
          let overlay = "bg-white/60"; // default overlay for inactive slides

          if (index === currentIndex) {
            position = "translate-x-0";
            zIndex = "z-30";
            scale = "scale-100";
            overlay = "bg-transparent"; // no overlay for active slide
          } else if (index === (currentIndex + 1) % slides.length) {
            position = "translate-x-4/20";
            zIndex = "z-20";
            scale = "scale-85";
            overlay = "bg-white/50"; // lighter overlay for next slide
          } else if (index === (currentIndex + 2) % slides.length) {
            position = "translate-x-7/20";
            zIndex = "z-10";
            scale = "scale-75";
            overlay = "bg-white/50";
          }

          return (
            <div key={slide.id} className={`w-[100%] absolute inset-0 transition-all duration-500 ease-in-out transform ${position} ${zIndex} ${scale}`}>
              <div className="relative w-[226px] md:w-[280px] lg:w-[437px] h-[323px] md:h-[400px] lg:h-[623px] overflow-hidden shadow-[0_0_40px_0_rgba(44,151,234,0.1)]">
                {/* Image */}
                <img src={slide.image} alt={slide.title} className="w-[226px] md:w-[280px] lg:w-[437px] h-[323px] md:h-[400px] lg:h-[623px] object-cover" />

                {/* White overlay */}
                <div className={`absolute inset-0 transition-colors duration-500 ${overlay}`} />

                {/* Title overlay */}
                <div className="absolute bottom-0 left-0 right-0  p-6">
                  <h3 className="text-white text-xl font-bold">{slide.title}</h3>
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
