import { Button } from "@/components/ui/button";
import logoIcon from "@/public/100thlogo.png";
import { ArrowRight } from "lucide-react";
import ImageCarousel from "@/components/Carousel";
import Image from "next/image";
import { useTranslations } from "next-intl";

function Services() {
  const t = useTranslations("Services");

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      {/* NavBar Spacer */}
      <div className="w-full h-25" />

      <div className="max-w-[1400px] w-full">
        <div className="flex items-center">
          <div className="w-[50%] flex flex-col justify-center ">
            <div className="flex items-center space-x-3 text-gray-500 tracking-widest text-3xl mb-5">
              <Image src={logoIcon} alt="100th Floor" style={{ color: "#176B87" }} className="h-8 w-auto" width={32} height={32} />
              <span>{t("sectionTitle")}</span>
            </div>
            <div className="mb-4">
              <div className="mb-4">
                <h1 className="text-6xl font-bold leading-tight">
                  {t("title")}
                  <br />
                  <span style={{ color: "#176B87" }}>{t("titleHighlight")}</span>
                  <br />
                  {t("titleContinue")}
                </h1>
              </div>
              <p className="text-gray-500 text-lg  leading-relaxed max-w-lg">{t("description")}</p>
            </div>
            <Button className="bg-primary cursor-pointer hover:bg-primary-foreground text-white h-auto w-xs py-3 text-xl font-medium rounded-sm group transition-all duration-300">
              {t("cta")}
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-3 transition-transform" />
            </Button>
          </div>
          <div className="w-[50%] h-[650px] flex flex-col justify-center items-center">
            <ImageCarousel />
          </div>
        </div>
      </div>
    </div>
  );
}
export default Services;
