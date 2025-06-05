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
  const [isOpen, setIsOpen] = useState(false);
  const t = useTranslations("About");
  const locale = useLocale();
  const isArabic = locale === "ar";

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      {/* NavBar Spacer */}
      <div className="w-full h-25" />
      <div className="max-w-[1400px] w-full">
        <div style={{ backgroundColor: "" }} className="flex">
          <div style={{ backgroundColor: "" }} className="w-[32%] flex flex-col justify-center gap-4">
            <div className="flex justify-end items-end h-[45%]">
              {/* Left vertical text */}
              <span style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }} className={`text-primary text-sm font-bold ${isArabic ? "" : "tracking-[0.6em]"}`}>
                {t("properties.opulentHaven")}
              </span>
              <span style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }} className={`text-gray-500 text-sm ${isArabic ? "" : "tracking-[0.1em]"}`}>
                {t("properties.opulentHavenAddress")}
              </span>
              <Image src={house2} alt="House 2" className="h-full w-auto ml-[5%]" />
            </div>
            <div className="flex justify-end items-end h-[45%]">
              {/* Left vertical text */}
              <span style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }} className={`text-primary text-sm font-bold ${isArabic ? "" : "tracking-[0.6em]"}`}>
                {t("properties.grandOak")}
              </span>
              <span style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }} className={`text-gray-500 text-sm ${isArabic ? "" : "tracking-[0.1em]"}`}>
                {t("properties.grandOakAddress")}
              </span>
              <Image src={house3} alt="House 3" className="h-full w-auto ml-[5%]" />
            </div>
          </div>
          <div style={{ backgroundColor: "green" }} className="w-[28%]">
            <div className="bg-slate-800 text-white p-10 mx-auto flex flex-col h-full">
              {/* Header */}
              <h1 className="text-5xl font-bold mb-8">
                {t("title")} <span className="text-primary">{t("titleHighlight")}</span>
              </h1>

              {/* Content */}
              <div className="flex-1 space-y-6 text-gray-300 leading-relaxed text-sm">
                <p>{t("description1")}</p>
                <p>{t("description2")}</p>
                <p>{t("description3")}</p>
                <p className="font-medium text-white">{t("conclusion")}</p>
              </div>

              {/* CTA Button */}
              <div className="mt-8 pt-4">
                <Button className="w-full h-12 text-lg bg-transparent border border-primary text-primary cursor-pointer hover:bg-primary hover:text-slate-800 py-3 px-6 rounded transition-all duration-300 flex items-center justify-center space-x-2 font-medium group transition-all duration-300">
                  {t("contactUs")}
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-3 transition-transform" />
                </Button>
              </div>
            </div>
          </div>
          <div className="w-[40%]">
            <div className="flex h-2/3 mt-5">
              <div className="h-full mr-[5%] relative">
                <Image src={house1} alt="House 1" className="h-full w-auto" />

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
                <Dialog open={isOpen} onOpenChange={setIsOpen}>
                  <DialogTrigger asChild>
                    <div className="absolute inset-0 flex items-center justify-center cursor-pointer">
                      <CirclePlay className="w-16 h-16 text-white hover:text-primary transition-colors duration-300" />
                    </div>
                  </DialogTrigger>
                  <DialogContent className="max-w-4xl p-0 bg-black border-none">
                    <div className="aspect-video w-full">
                      <iframe width="100%" height="100%" src={`https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ${isOpen ? "?autoplay=1&" : "?"}rel=0&modestbranding=1&showinfo=0`} title="Property Video" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen className="w-full h-full"></iframe>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
              {/* right vertical text */}
              <span style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }} className={`text-primary text-sm font-bold ${isArabic ? "" : "tracking-[0.6em]"}`}>
                {t("properties.serenityManor")}
              </span>
              <span style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }} className={`text-gray-500 text-sm ${isArabic ? "" : "tracking-[0.1em]"}`}>
                {t("properties.serenityManorAddress")}
              </span>
            </div>
            <div className="m-8">
              <div className="mb-4">
                <h1 className="text-4xl font-bold leading-tight">
                  {t("exploreTitle")}
                  <br />
                  <span style={{ color: "#176B87" }}>{t("exploreTitleHighlight")}</span>
                </h1>
              </div>
              <p className="text-gray-500 text-lg  leading-relaxed max-w-lg">{t("exploreDescription")}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default About;
