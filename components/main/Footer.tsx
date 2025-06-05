import { Facebook, Twitter } from "lucide-react";
import Image from "next/image";
import logoIcon from "@/public/100thlogo.png";
import logoText from "@/public/100thlogotext.png";
import { useTranslations, useLocale } from "next-intl";

function Footer() {
  const t = useTranslations("Footer");
  const locale = useLocale();

  const footerLinks = {
    product1: {
      title: t("product"),
      links: [
        { name: t("links.features"), href: "#" },
        { name: t("links.solutions"), href: "#" },
        { name: t("links.pricing"), href: "#" },
        { name: t("links.tutorials"), href: "#" },
        { name: t("links.updates"), href: "#" },
      ],
    },
    remaining1: {
      title: t("remaining"),
      links: [
        { name: t("links.blog"), href: "#" },
        { name: t("links.newsletter"), href: "#" },
        { name: t("links.helpCentre"), href: "#" },
        { name: t("links.careers"), href: "#" },
        { name: t("links.support"), href: "#" },
      ],
    },
    product2: {
      title: t("product"),
      links: [
        { name: t("links.features"), href: "#" },
        { name: t("links.solutions"), href: "#" },
        { name: t("links.pricing"), href: "#" },
        { name: t("links.tutorials"), href: "#" },
        { name: t("links.updates"), href: "#" },
      ],
    },
    remaining2: {
      title: t("remaining"),
      links: [
        { name: t("links.blog"), href: "#" },
        { name: t("links.newsletter"), href: "#" },
        { name: t("links.helpCentre"), href: "#" },
        { name: t("links.careers"), href: "#" },
        { name: t("links.support"), href: "#" },
      ],
    },
  };

  return (
    <footer style={{ backgroundColor: "#02131A" }} className="text-white w-full">
      <div className="max-w-[1400px] mx-auto px-6 py-12">
        <div className="grid grid-cols-6 gap-8">
          {/* Brand Section */}
          <div className="col-span-2">
            {/* Logo */}
            <div className="flex items-center gap-3 mb-4">
              <Image src={logoIcon} alt="100th Floor" width={56} height={56} className="h-14 w-auto object-contain" />
              <Image src={logoText} alt="100th Floor" width={100} height={100} className="h-12 w-auto object-contain" />
            </div>

            {/* Description */}
            <p className={`text-white font-semibold leading-relaxed mb-6 ${locale === "ar" ? "text-right" : "text-left"}`}>{t("description")}</p>

            {/* Social Media */}
            <div className="flex space-x-4">
              <a href="#" className="w-10 h-10 bg-primary rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="w-10 h-10 bg-primary rounded-full flex items-center justify-center hover:bg-blue-400 transition-colors">
                <Twitter size={20} />
              </a>
              <a href="#" className="w-10 h-10 bg-primary rounded-full flex items-center justify-center hover:bg-red-600 transition-colors">
                <span className="text-white font-bold text-lg">G+</span>
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

        {/* Copyright */}
        <div className="border-t border-gray-800 mt-20 pt-8 w-full flex justify-center">
          <p className={`text-center font-bold text-sm ${locale === "ar" ? "text-right" : "text-left"}`}>{t("copyright")}</p>
        </div>
      </div>
    </footer>
  );
}
export default Footer;
