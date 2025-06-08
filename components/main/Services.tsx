"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import ImageCarousel from "@/components/Carousel";
import { useLocale, useTranslations } from "next-intl";
import Logo from "../Logo";

function Services() {
  const t = useTranslations("Services");
  const locale = useLocale();
  const isArabic = locale === "ar";

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4  mt-20 lg:mt-0">
      {/* NavBar Spacer */}
      <div className="w-full h-16 md:h-25" />

      <div className="max-w-[1400px] w-full">
        <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-0">
          {/* Content Section */}
          <div className="w-full lg:w-[50%] flex flex-col justify-center text-center lg:text-left">
            {/* Section Title */}
            <div className={`flex items-center justify-center lg:justify-start space-x-2 md:space-x-3 text-gray-500 ${isArabic ? "" : "tracking-wide md:tracking-widest"} text-lg md:text-2xl lg:text-3xl mb-4 md:mb-5`}>
              <Logo color="#176B87" className="h-6 md:h-8 w-auto" width={5} height={5} />
              <span>{t("sectionTitle")}</span>
            </div>

            {/* Main Content */}
            <div className="mb-6 md:mb-8">
              <div className="mb-4 md:mb-6">
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                  {t("title")}
                  <br />
                  <span style={{ color: "#176B87" }}>{t("titleHighlight")}</span>
                  <br />
                  {t("titleContinue")}
                </h1>
              </div>
              <p className="text-gray-500 text-base md:text-lg leading-relaxed max-w-lg mx-auto lg:mx-0">{t("description")}</p>
            </div>

            {/* CTA Button */}
            <div className="flex justify-center lg:justify-start">
              <Button className="bg-primary cursor-pointer hover:bg-primary-foreground text-white h-auto w-full sm:w-auto py-3 md:py-4 px-6 md:px-8 text-lg md:text-xl font-medium rounded-sm group transition-all duration-300">
                {t("cta")}
                <ArrowRight className="ml-2 w-4 h-4 md:w-5 md:h-5 group-hover:translate-x-3 transition-transform" />
              </Button>
            </div>
          </div>

          {/* Carousel Section */}
          <div className="w-full lg:w-[50%] h-[400px] md:h-[500px] lg:h-[630px] flex flex-col justify-center items-center">
            <div className="w-[300px] md:w-[500px] lg:w-[90%]">
              <ImageCarousel />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Services;
