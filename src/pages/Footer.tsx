import { Facebook, Twitter } from "lucide-react";
import logoIcon from "../assets/100thlogo.png";
import logoText from "../assets/100thlogotext.png";

function Footer() {
  const footerLinks = {
    product1: {
      title: "Product",
      links: [
        { name: "Features", href: "#" },
        { name: "Solutions", href: "#" },
        { name: "Pricing", href: "#" },
        { name: "Tutorials", href: "#" },
        { name: "Updates", href: "#" },
      ],
    },
    remaining1: {
      title: "Remaining",
      links: [
        { name: "Blog", href: "#" },
        { name: "Newsletter", href: "#" },
        { name: "Help Centre", href: "#" },
        { name: "Careers", href: "#" },
        { name: "Support", href: "#" },
      ],
    },
    product2: {
      title: "Product",
      links: [
        { name: "Features", href: "#" },
        { name: "Solutions", href: "#" },
        { name: "Pricing", href: "#" },
        { name: "Tutorials", href: "#" },
        { name: "Updates", href: "#" },
      ],
    },
    remaining2: {
      title: "Remaining",
      links: [
        { name: "Blog", href: "#" },
        { name: "Newsletter", href: "#" },
        { name: "Help Centre", href: "#" },
        { name: "Careers", href: "#" },
        { name: "Support", href: "#" },
      ],
    },
  };
  return (
    <footer style={{ backgroundColor: "#02131A" }} className="text-white">
      <div className="max-w-[1400px] mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-6 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            {/* Logo */}
            {/* Logo */}
            <div className="flex items-center gap-3 mb-4">
              <img src={logoIcon} alt="100th Floor" className="h-14 w-auto" />
              <img src={logoText} alt="100th Floor" className="h-12 w-auto" />
            </div>

            {/* Description */}
            <p className="text-white font-semibold leading-relaxed mb-6">We are pioneers in crafting environments that enhance human interactions and respect our planet.</p>

            {/* Social Media */}
            <div className="flex space-x-4">
              <a href="#" className="w-10 h-10 bg-primary rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="w-10 h-10 bg-primary rounded-full flex items-center justify-center hover:bg-blue-500 transition-colors">
                <Twitter size={20} />
              </a>
              <a href="#" className="w-10 h-10 bg-primary rounded-full flex items-center justify-center hover:bg-red-600 transition-colors">
                <span className="text-white font-bold text-lg">G+</span>
              </a>
            </div>
          </div>

          {/* Links Columns */}
          {Object.entries(footerLinks).map(([key, section]) => (
            <div key={key} className="lg:col-span-1 flex justify-end">
              <div>
                <h3 className="font-semibold text-white mb-4">{section.title}</h3>
                <ul className="space-y-3">
                  {section.links.map((link, index) => (
                    <li key={index}>
                      <a href={link.href} className="text-gray-400 hover:text-white transition-colors text-sm">
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
        <div className="border-t border-gray-800 mt-20 pt-8">
          <p className="text-center font-bold text-sm">Copyright © 2024 Arockt. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
export default Footer;
