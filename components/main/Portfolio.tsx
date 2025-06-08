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
      <div className="w-full h-16 md:h-25" />

      {/* Portfolio Section */}
      <div className="flex justify-center px-4 sm:px-8 lg:px-8">
        <div className="max-w-[1400px] w-full flex flex-col items-center justify-center">
          {/* Header */}
          <div className="space-y-2 mb-4 md:mb-6 mt-4 text-center">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight">
              {t("title")} <span style={{ color: "#176B87" }}>{t("titleHighlight")}</span>
            </h1>
          </div>

          {/* Description */}
          <p className="text-gray-700 text-base md:text-lg text-center leading-relaxed max-w-lg mb-8 md:mb-12">{t("description")}</p>

          {/* Mobile Layout - Single Column */}
          <div className="block md:hidden w-full space-y-6 mb-20">
            {/* Project 1 */}
            <div className="relative aspect-[4/3] group overflow-hidden ">
              <Image src={image1 || "/placeholder.svg"} alt="Portfolio Image 1" fill className="object-cover" sizes="100vw" />
              <div className="absolute inset-0 bg-black/40 transition-opacity duration-500 group-hover:opacity-0" />
              <div className="absolute inset-0 p-4 flex flex-col justify-end">
                <div className="flex justify-between items-end w-full mb-2">
                  <span className={`text-primary text-sm ${isArabic ? "" : "tracking-[0.4em]"}`}>{t("projects.company")}</span>
                  <span className={`text-white font-bold text-sm ${isArabic ? "" : "tracking-[0.1em]"}`}>{t("projects.date")}</span>
                </div>
                <h2 className="text-white font-bold text-xl">{t("projects.project1")}</h2>
              </div>
            </div>

            {/* Project 2 */}
            <div className="relative aspect-[4/3] group overflow-hidden  ">
              <Image src={image2 || "/placeholder.svg"} alt="Portfolio Image 2" fill className="object-cover" sizes="100vw" />
              <div className="absolute inset-0 bg-black/40 transition-opacity duration-500 group-hover:opacity-0" />
              <div className="absolute inset-0 p-4 flex flex-col justify-end">
                <div className="flex justify-between items-end w-full mb-2">
                  <span className={`text-primary text-sm ${isArabic ? "" : "tracking-[0.4em]"}`}>{t("projects.company")}</span>
                  <span className={`text-white font-bold text-sm ${isArabic ? "" : "tracking-[0.1em]"}`}>{t("projects.date")}</span>
                </div>
                <h2 className="text-white font-bold text-xl">{t("projects.project2")}</h2>
              </div>
            </div>

            {/* Project 3 */}
            <div className="relative aspect-[4/3] group overflow-hidden  ">
              <Image src={image3 || "/placeholder.svg"} alt="Portfolio Image 3" fill className="object-cover" sizes="100vw" />
              <div className="absolute inset-0 bg-black/40 transition-opacity duration-500 group-hover:opacity-0" />
              <div className="absolute inset-0 p-4 flex flex-col justify-end">
                <div className="flex justify-between items-end w-full mb-2">
                  <span className={`text-primary text-sm ${isArabic ? "" : "tracking-[0.4em]"}`}>{t("projects.company")}</span>
                  <span className={`text-white font-bold text-sm ${isArabic ? "" : "tracking-[0.1em]"}`}>{t("projects.date")}</span>
                </div>
                <h2 className="text-white font-bold text-xl">{t("projects.project3")}</h2>
              </div>
            </div>

            {/* Projects 4 & 5 - Side by side on mobile */}
            <div className="grid grid-cols-2 gap-4">
              <div className="relative aspect-[3/4] group overflow-hidden  ">
                <Image src={image4 || "/placeholder.svg"} alt="Portfolio Image 4" fill className="object-cover" sizes="50vw" />
                <div className="absolute inset-0 bg-black/40 transition-opacity duration-500 group-hover:opacity-0" />
                <div className="absolute inset-0 p-3 flex flex-col justify-end">
                  <span className={`text-primary text-xs ${isArabic ? "" : "tracking-[0.3em]"}`}>{t("projects.company")}</span>
                  <h2 className="text-white font-bold text-sm mt-1">{t("projects.project4")}</h2>
                  <span className={`text-white font-bold text-xs ${isArabic ? "" : "tracking-[0.1em]"} mt-1`}>{t("projects.date")}</span>
                </div>
              </div>

              <div className="relative aspect-[3/4] group overflow-hidden  ">
                <Image src={image5 || "/placeholder.svg"} alt="Portfolio Image 5" fill className="object-cover" sizes="50vw" />
                <div className="absolute inset-0 bg-black/40 transition-opacity duration-500 group-hover:opacity-0" />
                <div className="absolute inset-0 p-3 flex flex-col justify-end">
                  <span className={`text-primary text-xs ${isArabic ? "" : "tracking-[0.3em]"}`}>{t("projects.company")}</span>
                  <h2 className="text-white font-bold text-sm mt-1">{t("projects.project5")}</h2>
                  <span className={`text-white font-bold text-xs ${isArabic ? "" : "tracking-[0.1em]"} mt-1`}>{t("projects.date")}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Tablet Layout - 2 Column Grid */}
          <div className="hidden md:block lg:hidden w-full mb-32">
            <div className="grid grid-cols-2 gap-6">
              {/* Project 1 */}
              <div className="relative aspect-[4/3] group overflow-hidden  ">
                <Image src={image1 || "/placeholder.svg"} alt="Portfolio Image 1" fill className="object-cover" sizes="50vw" />
                <div className="absolute inset-0 bg-black/40 transition-opacity duration-500 group-hover:opacity-0" />
                <div className="absolute inset-0 p-6 flex flex-col justify-end">
                  <div className="flex justify-between items-end w-full mb-2">
                    <span className={`text-primary text-base ${isArabic ? "" : "tracking-[0.5em]"}`}>{t("projects.company")}</span>
                    <span className={`text-white font-bold text-lg ${isArabic ? "" : "tracking-[0.1em]"}`}>{t("projects.date")}</span>
                  </div>
                  <h2 className="text-white font-bold text-2xl">{t("projects.project1")}</h2>
                </div>
              </div>

              {/* Project 2 */}
              <div className="relative aspect-[4/3] group overflow-hidden  ">
                <Image src={image2 || "/placeholder.svg"} alt="Portfolio Image 2" fill className="object-cover" sizes="50vw" />
                <div className="absolute inset-0 bg-black/40 transition-opacity duration-500 group-hover:opacity-0" />
                <div className="absolute inset-0 p-6 flex flex-col justify-end">
                  <div className="flex justify-between items-end w-full mb-2">
                    <span className={`text-primary text-base ${isArabic ? "" : "tracking-[0.5em]"}`}>{t("projects.company")}</span>
                    <span className={`text-white font-bold text-lg ${isArabic ? "" : "tracking-[0.1em]"}`}>{t("projects.date")}</span>
                  </div>
                  <h2 className="text-white font-bold text-2xl">{t("projects.project2")}</h2>
                </div>
              </div>

              {/* Project 3 */}
              <div className="relative aspect-[4/3] group overflow-hidden  ">
                <Image src={image3 || "/placeholder.svg"} alt="Portfolio Image 3" fill className="object-cover" sizes="50vw" />
                <div className="absolute inset-0 bg-black/40 transition-opacity duration-500 group-hover:opacity-0" />
                <div className="absolute inset-0 p-6 flex flex-col justify-end">
                  <div className="flex justify-between items-end w-full mb-2">
                    <span className={`text-primary text-base ${isArabic ? "" : "tracking-[0.5em]"}`}>{t("projects.company")}</span>
                    <span className={`text-white font-bold text-lg ${isArabic ? "" : "tracking-[0.1em]"}`}>{t("projects.date")}</span>
                  </div>
                  <h2 className="text-white font-bold text-2xl">{t("projects.project3")}</h2>
                </div>
              </div>

              {/* Projects 4 & 5 in one row */}
              <div className="grid grid-cols-2 gap-4">
                <div className="relative aspect-[3/4] group overflow-hidden  ">
                  <Image src={image4 || "/placeholder.svg"} alt="Portfolio Image 4" fill className="object-cover" sizes="25vw" />
                  <div className="absolute inset-0 bg-black/40 transition-opacity duration-500 group-hover:opacity-0" />
                  <div className="absolute inset-0 p-4 flex flex-col justify-end">
                    <span className={`text-primary text-sm ${isArabic ? "" : "tracking-[0.4em]"}`}>{t("projects.company")}</span>
                    <h2 className="text-white font-bold text-lg mt-1">{t("projects.project4")}</h2>
                    <span className={`text-white font-bold text-base ${isArabic ? "" : "tracking-[0.1em]"} mt-1`}>{t("projects.date")}</span>
                  </div>
                </div>

                <div className="relative aspect-[3/4] group overflow-hidden  ">
                  <Image src={image5 || "/placeholder.svg"} alt="Portfolio Image 5" fill className="object-cover" sizes="25vw" />
                  <div className="absolute inset-0 bg-black/40 transition-opacity duration-500 group-hover:opacity-0" />
                  <div className="absolute inset-0 p-4 flex flex-col justify-end">
                    <span className={`text-primary text-sm ${isArabic ? "" : "tracking-[0.4em]"}`}>{t("projects.company")}</span>
                    <h2 className="text-white font-bold text-lg mt-1">{t("projects.project5")}</h2>
                    <span className={`text-white font-bold text-base ${isArabic ? "" : "tracking-[0.1em]"} mt-1`}>{t("projects.date")}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Desktop Layout - Original Complex Grid */}
          <div className="hidden lg:block w-full">
            <div className="grid grid-cols-4 grid-rows-2 w-full aspect-[1.38] gap-6 mb-40">
              <div className="col-span-2 relative h-full group overflow-hidden  ">
                <Image src={image1 || "/placeholder.svg"} alt="Portfolio Image 1" fill className="object-cover" sizes="50vw" priority />
                <div className="absolute inset-0 bg-black/40 transition-opacity duration-500 group-hover:opacity-0" />
                <div className="absolute inset-0 p-8 flex flex-col justify-end">
                  <div className="flex justify-between w-full">
                    <span className={`text-primary text-lg ${isArabic ? "" : "tracking-[0.6em]"}`}>{t("projects.company")}</span>
                    <span className={`text-white font-bold text-xl ${isArabic ? "" : "tracking-[0.15em]"}`}>{t("projects.date")}</span>
                  </div>
                  <h2 className="text-white font-bold text-3xl mt-2">{t("projects.project1")}</h2>
                </div>
              </div>

              <div className="col-span-1 relative h-full group overflow-hidden  ">
                <Image src={image4 || "/placeholder.svg"} alt="Portfolio Image 4" fill className="object-cover" sizes="25vw" />
                <div className="absolute inset-0 bg-black/40 transition-opacity duration-500 group-hover:opacity-0" />
                <div className="absolute inset-0 p-8 flex flex-col justify-end">
                  <span className={`text-primary text-lg ${isArabic ? "" : "tracking-[0.6em]"}`}>{t("projects.company")}</span>
                  <h2 className="text-white font-bold text-3xl mt-1">{t("projects.project4")}</h2>
                  <span className={`text-white font-bold text-xl ${isArabic ? "" : "tracking-[0.15em]"} mt-2`}>{t("projects.date")}</span>
                </div>
              </div>

              <div className="col-span-1 relative h-full group overflow-hidden  ">
                <Image src={image5 || "/placeholder.svg"} alt="Portfolio Image 5" fill className="object-cover" sizes="25vw" />
                <div className="absolute inset-0 bg-black/40 transition-opacity duration-500 group-hover:opacity-0" />
                <div className="absolute inset-0 p-8 flex flex-col justify-end">
                  <span className={`text-primary text-lg ${isArabic ? "" : "tracking-[0.6em]"}`}>{t("projects.company")}</span>
                  <h2 className="text-white font-bold text-3xl mt-1">{t("projects.project5")}</h2>
                  <span className={`text-white font-bold text-xl ${isArabic ? "" : "tracking-[0.15em]"} mt-2`}>{t("projects.date")}</span>
                </div>
              </div>

              <div className="col-span-2 relative h-full group overflow-hidden  ">
                <Image src={image2 || "/placeholder.svg"} alt="Portfolio Image 2" fill className="object-cover" sizes="50vw" />
                <div className="absolute inset-0 bg-black/40 transition-opacity duration-500 group-hover:opacity-0" />
                <div className="absolute inset-0 p-8 flex flex-col justify-end">
                  <div className="flex justify-between w-full">
                    <span className={`text-primary text-lg ${isArabic ? "" : "tracking-[0.6em]"}`}>{t("projects.company")}</span>
                    <span className={`text-white font-bold text-xl ${isArabic ? "" : "tracking-[0.15em]"}`}>{t("projects.date")}</span>
                  </div>
                  <h2 className="text-white font-bold text-3xl mt-2">{t("projects.project2")}</h2>
                </div>
              </div>

              <div className="col-span-2 relative h-full group overflow-hidden  ">
                <Image src={image3 || "/placeholder.svg"} alt="Portfolio Image 3" fill className="object-cover" sizes="50vw" />
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
      </div>
    </>
  );
}

export default Portfolio;
