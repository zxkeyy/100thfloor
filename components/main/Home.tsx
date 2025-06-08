"use client";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useTranslations, useLocale } from "next-intl";
import modernHouse from "@/public/modern-house.png";
import fadedLogoBg from "@/public/fadedlogobg.png";
import Logo from "../Logo";

function Home() {
  const t = useTranslations("Home");
  const locale = useLocale();
  const isArabic = locale === "ar";

  return (
    <div className="min-h-screen items-center relative overflow-x-hidden text-white flex flex-col">
      {/* House Background Image - Responsive */}
      <div
        className="absolute inset-0 hidden md:block"
        style={{
          background: `
            linear-gradient(to right, #001C30 0%, #001C30 10%, transparent 70%),
            url(${modernHouse.src})
          `,
          backgroundSize: "60% auto",
          backgroundPosition: "right center",
          backgroundRepeat: "no-repeat",
        }}
      ></div>

      {/* Mobile House Background - Smaller and repositioned */}
      <div
        className="absolute inset-0 md:hidden"
        style={{
          background: `
            linear-gradient(to bottom, #001C30 0%, #001C30 60%, transparent 90%, #001C30 100%),
            url(${modernHouse.src})
          `,
          backgroundSize: "100% auto",
          backgroundPosition: "center bottom",
          backgroundRepeat: "no-repeat",
          //opacity: 0.3,
        }}
      ></div>

      {/* Faded Logo Background - Responsive */}
      <div
        className="absolute inset-0 hidden md:block"
        style={{
          backgroundColor: "#001C30",
          backgroundImage: `url(${fadedLogoBg.src})`,
          backgroundSize: "40% auto",
          backgroundPosition: "left center",
          backgroundRepeat: "no-repeat",
          opacity: 1,
          zIndex: -1,
        }}
      ></div>

      {/* Mobile Faded Logo Background */}
      <div
        className="absolute inset-x-0 top-0 bottom-[50%] md:hidden"
        style={{
          backgroundColor: "#001C30",
          backgroundImage: `url(${fadedLogoBg.src})`,
          backgroundSize: "100% auto",
          backgroundPosition: "center center",
          backgroundRepeat: "no-repeat",
          opacity: 1,
          zIndex: 1,
        }}
      ></div>

      {/* Background Elements - Responsive */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-10 right-10 md:top-20 md:right-20 w-32 h-32 md:w-64 md:h-64 bg-cyan-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 left-10 md:bottom-20 md:left-20 w-48 h-48 md:w-96 md:h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex md:items-center min-h-screen max-w-[1400px] w-full pt-20 md:pt-28 px-4 md:px-6">
        <div className="container mx-auto mt-[20%] md:mt-0">
          <div className="max-w-2xl">
            {/* Welcome Text - Responsive */}
            <div className={`flex items-center space-x-2 md:space-x-3 text-white/70 font-medium mb-4 md:mb-6 ${isArabic ? "text-lg md:text-2xl lg:text-3xl" : "tracking-wide md:tracking-widest text-lg md:text-2xl lg:text-3xl"}`}>
              <Logo className="h-6 md:h-8 w-auto" width={32} height={32} />
              <span>{t("welcome")}</span>
            </div>

            {/* Main Heading - Responsive */}
            <div className="space-y-2 mb-6 md:mb-8">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight">
                {t("title")}
                <br />
                {t("titleContinue")} <span style={{ color: "#176B87" }}>{t("titleHighlight")}</span>
              </h1>
            </div>

            {/* Description - Responsive */}
            <p className="text-white text-base md:text-lg leading-relaxed max-w-lg mb-6 md:mb-8">{t("description")}</p>

            {/* CTA Button - Responsive */}
            <Button className="bg-primary cursor-pointer hover:bg-primary-foreground text-white h-auto w-full sm:w-auto py-3 md:py-4 px-6 md:px-8 text-lg md:text-xl font-medium rounded-sm group transition-all duration-300">
              {t("contactUs")}
              <ArrowRight className="ml-2 w-4 h-4 md:w-5 md:h-5 group-hover:translate-x-3 transition-transform" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
