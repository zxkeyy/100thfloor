"use client";
import Image from "next/image";
import image1 from "@/public/Rectangle 16.png";
import image2 from "@/public/Rectangle 17.png";
import image3 from "@/public/Rectangle 18.png";
import image4 from "@/public/Rectangle 19.png";
import image5 from "@/public/Rectangle 20.png";
import { useLocale, useTranslations } from "next-intl";

function Portfolio() {
  const t = useTranslations("Portfolio");
  const locale = useLocale();
  const isArabic = locale === "ar";

  return (
    <>
      {/* NavBar Spacer */}
      <div className="w-full h-25" />
      {/* Portfolio Section */}
      <div className="flex justify-center">
        <div className="max-w-[1400px] w-full flex flex-col items-center justify-center">
          <div className="space-y-2 mb-2 mt-4">
            <h1 className="text-5xl font-bold leading-tight">
              {t("title")} <span style={{ color: "#176B87" }}>{t("titleHighlight")}</span>
            </h1>
          </div>

          {/* Description */}
          <p className="text-gray-700 text-lg text-center leading-relaxed max-w-lg mb-8">{t("description")}</p>

          <div className="grid grid-cols-4 grid-rows-2 w-full aspect-[1.38] gap-6 mb-40">
            <div className="col-span-2 relative h-full group overflow-hidden">
              <Image src={image1} alt="Portfolio Image 1" fill className="object-cover" sizes="(max-width: 768px) 100vw, 50vw" priority />
              <div className="absolute inset-0 bg-black/40 transition-opacity duration-500 group-hover:opacity-0" />
              <div className="absolute inset-0 p-8 flex flex-col justify-end">
                <div className="flex justify-between w-full">
                  <span className={`text-primary text-lg ${isArabic ? "" : "tracking-[0.6em]"}`}>{t("projects.company")}</span>
                  <span className={`text-white font-bold text-xl ${isArabic ? "" : "tracking-[0.15em]"}`}>{t("projects.date")}</span>
                </div>
                <h2 className="text-white font-bold text-3xl mt-2">{t("projects.project1")}</h2>
              </div>
            </div>

            <div className="col-span-1 relative h-full group overflow-hidden">
              <Image src={image4} alt="Portfolio Image 4" fill className="object-cover" sizes="(max-width: 768px) 100vw, 25vw" />
              <div className="absolute inset-0 bg-black/40 transition-opacity duration-500 group-hover:opacity-0" />
              <div className="absolute inset-0 p-8 flex flex-col justify-end">
                <span className={`text-primary text-lg ${isArabic ? "" : "tracking-[0.6em]"}`}>{t("projects.company")}</span>
                <h2 className="text-white font-bold text-3xl mt-1">{t("projects.project4")}</h2>
                <span className={`text-white font-bold text-xl ${isArabic ? "" : "tracking-[0.15em]"} mt-2`}>{t("projects.date")}</span>
              </div>
            </div>

            <div className="col-span-1 relative h-full group overflow-hidden">
              <Image src={image5} alt="Portfolio Image 5" fill className="object-cover" sizes="(max-width: 768px) 100vw, 25vw" />
              <div className="absolute inset-0 bg-black/40 transition-opacity duration-500 group-hover:opacity-0" />
              <div className="absolute inset-0 p-8 flex flex-col justify-end">
                <span className={`text-primary text-lg ${isArabic ? "" : "tracking-[0.6em]"}`}>{t("projects.company")}</span>
                <h2 className="text-white font-bold text-3xl mt-1">{t("projects.project5")}</h2>
                <span className={`text-white font-bold text-xl ${isArabic ? "" : "tracking-[0.15em]"} mt-2`}>{t("projects.date")}</span>
              </div>
            </div>

            <div className="col-span-2 relative h-full group overflow-hidden">
              <Image src={image2} alt="Portfolio Image 2" fill className="object-cover" sizes="(max-width: 768px) 100vw, 50vw" />
              <div className="absolute inset-0 bg-black/40 transition-opacity duration-500 group-hover:opacity-0" />
              <div className="absolute inset-0 p-8 flex flex-col justify-end">
                <div className="flex justify-between w-full">
                  <span className={`text-primary text-lg ${isArabic ? "" : "tracking-[0.6em]"}`}>{t("projects.company")}</span>
                  <span className={`text-white font-bold text-xl ${isArabic ? "" : "tracking-[0.15em]"}`}>{t("projects.date")}</span>
                </div>
                <h2 className="text-white font-bold text-3xl mt-2">{t("projects.project2")}</h2>
              </div>
            </div>

            <div className="col-span-2 relative h-full group overflow-hidden">
              <Image src={image3} alt="Portfolio Image 3" fill className="object-cover" sizes="(max-width: 768px) 100vw, 50vw" />
              <div className="absolute inset-0 bg-black/40 transition-opacity duration-500 group-hover:opacity-0" />
              <div className="absolute inset-0 p-8 flex flex-col justify-end">
                <div className="flex justify-between w-full">
                  <span className={`text-primary text-lg ${isArabic ? "" : "tracking-[0.6em]"}`}>{t("projects.company")}</span>
                  <span className={`text-white font-bold text-xl ${isArabic ? "" : "tracking-[0.15em]"}`}>{t("projects.date")}</span>
                </div>
                <h2 className="text-white font-bold text-3xl mt-2">{t("projects.project3")}</h2>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Portfolio;
