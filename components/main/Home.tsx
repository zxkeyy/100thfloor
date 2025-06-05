import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import modernHouse from "@/public/modern-house.png";
import fadedLogoBg from "@/public/fadedlogobg.png";
import logoIcon from "@/public/100thlogo.png";
import { useTranslations } from "next-intl";

function Home() {
  const t = useTranslations("Home");

  return (
    <div className="min-h-screen items-center relative overflow-x-hidden text-white flex flex-col">
      {/* House Background Image - Right Side */}
      <div
        className="absolute inset-0"
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
      {/* Faded Logo Background - Left Side */}
      <div
        className="absolute inset-0"
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

      {/* Background Elements */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-20 right-20 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex items-center min-h-screen max-w-[1400px] w-full pt-28">
        <div className="container mx-auto ">
          <div className="max-w-2xl">
            {/* Welcome Text */}
            <div className="flex items-center space-x-3 text-white/70 font-medium tracking-widest text-3xl">
              <Image src={logoIcon} alt="100th Floor" className="h-8 w-auto" width={32} height={32} />
              <span>{t("welcome")}</span>
            </div>

            {/* Main Heading */}
            <div className="space-y-2 mb-8">
              <h1 className="text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight">
                {t("title")}
                <br />
                {t("titleContinue")} <span style={{ color: "#176B87" }}>{t("titleHighlight")}</span>
              </h1>
            </div>

            {/* Description */}
            <p className="text-white text-lg leading-relaxed max-w-lg mb-8">{t("description")}</p>

            {/* CTA Button */}
            <Button className="bg-primary cursor-pointer hover:bg-primary-foreground text-white h-auto w-3xs py-4 text-xl font-medium rounded-sm group transition-all duration-300">
              {t("contactUs")}
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-3 transition-transform" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
