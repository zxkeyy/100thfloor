"use client";

import { Phone, MapPin, MessageCircle } from "lucide-react";
import Image from "next/image";
import logoIcon from "@/public/100thlogo.png";
import logoText from "@/public/100thlogotext.png";
import { useTranslations, useLocale } from "next-intl";

function Footer() {
  const t = useTranslations("Footer");
  const locale = useLocale();

  const footerLinks = {
    // product1: {
    //   title: t("product"),
    //   links: [
    //     { name: t("links.features"), href: "#" },
    //     { name: t("links.solutions"), href: "#" },
    //     { name: t("links.pricing"), href: "#" },
    //     { name: t("links.tutorials"), href: "#" },
    //     { name: t("links.updates"), href: "#" },
    //   ],
    // },
    remaining1: {
      title: t("remaining"),
      links: [
        { name: t("links.blog"), href: "/blog" },
        // { name: t("links.newsletter"), href: "#" },
        // { name: t("links.helpCentre"), href: "#" },
        // { name: t("links.careers"), href: "#" },
        // { name: t("links.support"), href: "#" },
      ],
    },
    // product2: {
    //   title: t("product"),
    //   links: [
    //     { name: t("links.features"), href: "#" },
    //     { name: t("links.solutions"), href: "#" },
    //     { name: t("links.pricing"), href: "#" },
    //     { name: t("links.tutorials"), href: "#" },
    //     { name: t("links.updates"), href: "#" },
    //   ],
    // },
    // remaining2: {
    //   title: t("remaining"),
    //   links: [
    //     { name: t("links.blog"), href: "#" },
    //     { name: t("links.newsletter"), href: "#" },
    //     { name: t("links.helpCentre"), href: "#" },
    //     { name: t("links.careers"), href: "#" },
    //     { name: t("links.support"), href: "#" },
    //   ],
    // },
  };

  return (
    <footer style={{ backgroundColor: "#02131A" }} className="text-white w-full">
      <div className="max-w-[1400px] mx-auto px-4 md:px-6 py-8 md:py-12">
        {/* Mobile and Tablet Layout */}
        <div className="block lg:hidden">
          {/* Brand Section */}
          <div className="mb-8 md:mb-10">
            {/* Logo */}
            <div className="flex items-center gap-2 md:gap-3 mb-4 justify-center md:justify-start">
              <Image src={logoIcon || "/placeholder.svg"} alt="100th Floor" width={56} height={56} className="h-10 md:h-12 w-auto object-contain" />
              <Image src={logoText || "/placeholder.svg"} alt="100th Floor" width={100} height={100} className="h-8 md:h-10 w-auto object-contain" />
            </div>

            {/* Description */}
            <p className={`text-white font-semibold leading-relaxed mb-6 text-center md:text-left text-sm md:text-base ${locale === "ar" ? "md:text-right" : ""}`}>{t("description")}</p>

            {/* Social Media */}
            <div className="flex space-x-3 md:space-x-4 justify-center md:justify-start">
              <a href="https://wa.me/966596824505" target="_blank" rel="noopener noreferrer" className="w-10 h-10 md:w-12 md:h-12 bg-primary rounded-full flex items-center justify-center hover:bg-green-600 transition-colors relative">
                <MessageCircle size={25} className="md:w-5 md:h-5" />
                <Phone size={10} fill="white" className="md:w-3 md:h-3 absolute" />
              </a>
              <a href="https://maps.app.goo.gl/3DV4wzVCTJScNxT19?g_st=iw" target="_blank" rel="noopener noreferrer" className="w-10 h-10 md:w-12 md:h-12 bg-primary rounded-full flex items-center justify-center hover:bg-red-600 transition-colors">
                <MapPin size={18} className="md:w-5 md:h-5" />
              </a>
            </div>
            <div className="flex flex-col items-center mt-6">
              <span className="">(+966) 596824505</span>
              <span className="">(+966) 597555556</span>
            </div>
          </div>

          {/* Links Grid for Mobile/Tablet */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            {Object.entries(footerLinks).map(([key, section]) => (
              <div key={key}>
                <h3 className={`font-semibold text-white mb-3 md:mb-4 text-sm md:text-base ${locale === "ar" ? "text-right" : "text-left"}`}>{section.title}</h3>
                <ul className="space-y-2 md:space-y-3">
                  {section.links.map((link, index) => (
                    <li key={index}>
                      <a href={link.href} className={`text-gray-400 hover:text-white transition-colors text-xs md:text-sm ${locale === "ar" ? "text-right" : "text-left"} block`}>
                        {link.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Desktop Layout */}
        <div className="hidden lg:block">
          <div className="grid grid-cols-6 gap-8">
            {/* Brand Section */}
            <div className="col-span-2">
              {/* Logo */}
              <div className="flex items-center gap-3 mb-4">
                <Image src={logoIcon || "/placeholder.svg"} alt="100th Floor" width={56} height={56} className="h-14 w-auto object-contain" />
                <Image src={logoText || "/placeholder.svg"} alt="100th Floor" width={100} height={100} className="h-12 w-auto object-contain" />
              </div>

              {/* Description */}
              <p className={`text-white font-semibold leading-relaxed mb-6 ${locale === "ar" ? "text-right" : "text-left"}`}>{t("description")}</p>

              {/* Social Media */}
              <div className="flex space-x-4">
                <a href="https://wa.me/966596824505" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-primary rounded-full flex items-center justify-center hover:bg-green-600 transition-colors relative">
                  <MessageCircle size={25} />
                  <Phone size={12} fill="white" className="absolute" />
                </a>
                <a href="https://maps.google.com/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-primary rounded-full flex items-center justify-center hover:bg-red-600 transition-colors">
                  <MapPin size={20} />
                </a>
              </div>
            </div>

            {/* Links Columns */}
            {Object.entries(footerLinks).map(([key, section]) => (
              <div key={key} className={`col-span-1 flex ${locale === "ar" ? "justify-start" : "justify-end"}`}>
                <div>
                  <h3 className={`font-semibold text-white mb-4 ${locale === "ar" ? "text-right" : "text-left"}`}>{section.title}</h3>
                  <ul className="space-y-3">
                    {section.links.map((link, index) => (
                      <li key={index}>
                        <a href={link.href} className={`text-gray-400 hover:text-white transition-colors text-sm ${locale === "ar" ? "text-right" : "text-left"} block`}>
                          {link.name}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-800 mt-12 md:mt-16 lg:mt-20 pt-6 md:pt-8 w-full flex justify-center">
          <p className={`text-center font-bold text-xs md:text-sm ${locale === "ar" ? "text-right" : "text-left"}`}>{t("copyright")}</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
