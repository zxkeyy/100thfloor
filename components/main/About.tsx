"use client";
import { Button } from "@/components/ui/button";
import { ArrowRight, CirclePlay } from "lucide-react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import house1 from "@/public/house1.png";
import house2 from "@/public/house2.png";
import house3 from "@/public/house3.png";
import { useState } from "react";
import Image from "next/image";
import { useTranslations, useLocale } from "next-intl";

function About() {
  const [isMobileVideoOpen, setIsMobileVideoOpen] = useState(false);
  const [isDesktopVideoOpen, setIsDesktopVideoOpen] = useState(false);
  const t = useTranslations("About");
  const locale = useLocale();
  const isArabic = locale === "ar";

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 sm:px-15 lg:px-0">
      {/* NavBar Spacer */}
      <div className="w-full h-16 md:h-25" />

      <div className="max-w-[1400px] w-full">
        {/* Mobile Layout */}
        <div className="block lg:hidden space-y-8">
          {/* About Section - Mobile */}
          <div className="bg-slate-800 text-white p-6 md:p-8 rounded-lg">
            <h1 className="text-3xl md:text-4xl font-bold mb-6">
              {t("title")} <span className="text-primary">{t("titleHighlight")}</span>
            </h1>

            <div className="space-y-4 text-gray-300 leading-relaxed text-sm md:text-base">
              <p>{t("description1")}</p>
              <p>{t("description2")}</p>
              <p>{t("description3")}</p>
              <p className="font-medium text-white">{t("conclusion")}</p>
            </div>

            <div className="mt-6">
              <Button className="w-full h-12 text-lg bg-transparent border border-primary text-primary cursor-pointer hover:bg-primary hover:text-slate-800 py-3 px-6 rounded transition-all duration-300 flex items-center justify-center space-x-2 font-medium group">
                {t("contactUs")}
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-3 transition-transform" />
              </Button>
            </div>
          </div>
          {/* Explore Section - Mobile */}
          <div className="text-center md:text-left">
            <h1 className="text-3xl md:text-4xl font-bold leading-tight mb-4">
              {t("exploreTitle")}
              <br />
              <span style={{ color: "#176B87" }}>{t("exploreTitleHighlight")}</span>
            </h1>
            <p className="text-gray-500 text-base md:text-lg leading-relaxed">{t("exploreDescription")}</p>
          </div>

          {/* Main House with Video - Mobile */}
          <div className="relative">
            <div className="relative aspect-[4/3] w-full">
              <Image src={house1 || "/placeholder.svg"} alt="House 1" fill className="object-cover rounded-lg" />
              <div className="absolute inset-0 bg-[#176B8799] rounded-lg" style={{ mixBlendMode: "normal" }} />
              <Dialog open={isMobileVideoOpen} onOpenChange={setIsMobileVideoOpen}>
                <DialogTrigger asChild>
                  <div className="absolute inset-0 flex items-center justify-center cursor-pointer">
                    <CirclePlay className="w-12 h-12 md:w-16 md:h-16 text-white hover:text-primary transition-colors duration-300" />
                  </div>
                </DialogTrigger>
                <DialogContent className="max-w-[95vw] md:max-w-4xl p-0 bg-black border-none">
                  <div className="aspect-video w-full">
                    <iframe width="100%" height="100%" src={`https://www.youtube-nocookie.com/embed/es-aLJ3YPBg${isMobileVideoOpen ? "?autoplay=1&" : "?"}rel=0&modestbranding=1&showinfo=0`} title="Property Video" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen className="w-full h-full" />
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            {/* Property Label - Mobile */}
            <div className="mt-4 text-center">
              <h3 className="text-primary text-lg font-bold">{t("properties.serenityManor")}</h3>
              <p className="text-gray-500 text-sm">{t("properties.serenityManorAddress")}</p>
            </div>
          </div>
        </div>

        {/* Desktop Layout */}
        <div className="hidden lg:flex">
          {/* Left Column - 32% */}
          <div className="w-[32%] flex flex-col justify-center gap-4">
            <div className="flex justify-end items-end h-[45%]">
              <span style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }} className={`text-primary text-sm font-bold ${isArabic ? "" : "tracking-[0.6em]"}`}>
                {t("properties.opulentHaven")}
              </span>
              <span style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }} className={`text-gray-500 text-sm ${isArabic ? "" : "tracking-[0.1em]"}`}>
                {t("properties.opulentHavenAddress")}
              </span>
              <Image src={house2 || "/placeholder.svg"} alt="House 2" className="h-full w-auto ml-[5%]" />
            </div>
            <div className="flex justify-end items-end h-[45%]">
              <span style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }} className={`text-primary text-sm font-bold ${isArabic ? "" : "tracking-[0.6em]"}`}>
                {t("properties.grandOak")}
              </span>
              <span style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }} className={`text-gray-500 text-sm ${isArabic ? "" : "tracking-[0.1em]"}`}>
                {t("properties.grandOakAddress")}
              </span>
              <Image src={house3 || "/placeholder.svg"} alt="House 3" className="h-full w-auto ml-[5%]" />
            </div>
          </div>

          {/* Center Column - 28% */}
          <div className="w-[28%]">
            <div className="bg-slate-800 text-white p-6 xl:p-10 mx-auto flex flex-col h-full">
              <h1 className="text-3xl xl:text-5xl font-bold mb-6 xl:mb-8">
                {t("title")} <span className="text-primary">{t("titleHighlight")}</span>
              </h1>

              <div className="flex-1 space-y-4 xl:space-y-6 text-gray-300 leading-relaxed text-xs xl:text-sm">
                <p>{t("description1")}</p>
                <p>{t("description2")}</p>
                <p>{t("description3")}</p>
                <p className="font-medium text-white">{t("conclusion")}</p>
              </div>

              <div className="mt-6 xl:mt-8 pt-4">
                <Button onClick={() => scrollToSection("footer")} className="w-full h-10 xl:h-12 text-sm xl:text-lg bg-transparent border border-primary text-primary cursor-pointer hover:bg-primary hover:text-slate-800 py-3 px-4 xl:px-6 rounded transition-all duration-300 flex items-center justify-center space-x-2 font-medium group">
                  {t("contactUs")}
                  <ArrowRight className="ml-2 w-4 h-4 xl:w-5 xl:h-5 group-hover:translate-x-3 transition-transform" />
                </Button>
              </div>
            </div>
          </div>

          {/* Right Column - 40% */}
          <div className="w-[40%]">
            <div className="flex h-2/3 mt-5">
              <div className="h-full mr-[5%] relative">
                <Image src={house1 || "/placeholder.svg"} alt="House 1" className="h-full w-auto" />
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: "#176B8799",
                    mixBlendMode: "normal",
                    pointerEvents: "none",
                  }}
                />
                <Dialog open={isDesktopVideoOpen} onOpenChange={setIsDesktopVideoOpen}>
                  <DialogTrigger asChild>
                    <div className="absolute inset-0 flex items-center justify-center cursor-pointer">
                      <CirclePlay className="w-12 h-12 xl:w-16 xl:h-16 text-white hover:text-primary transition-colors duration-300" />
                    </div>
                  </DialogTrigger>
                  <DialogContent className="max-w-4xl p-0 bg-black border-none">
                    <div className="aspect-video w-full">
                      <iframe width="100%" height="100%" src={`https://www.youtube-nocookie.com/embed/es-aLJ3YPBg${isDesktopVideoOpen ? "?autoplay=1&" : "?"}rel=0&modestbranding=1&showinfo=0`} title="Property Video" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen className="w-full h-full" />
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
              <span style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }} className={`text-primary text-sm font-bold ${isArabic ? "" : "tracking-[0.6em]"}`}>
                {t("properties.serenityManor")}
              </span>
              <span style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }} className={`text-gray-500 text-sm ${isArabic ? "" : "tracking-[0.1em]"}`}>
                {t("properties.serenityManorAddress")}
              </span>
            </div>
            <div className="m-4 xl:m-8">
              <div className="mb-4">
                <h1 className="text-2xl xl:text-4xl font-bold leading-tight">
                  {t("exploreTitle")}
                  <br />
                  <span style={{ color: "#176B87" }}>{t("exploreTitleHighlight")}</span>
                </h1>
              </div>
              <p className="text-gray-500 text-sm xl:text-lg leading-relaxed max-w-lg">{t("exploreDescription")}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default About;
