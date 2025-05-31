import { Button } from "@/components/ui/button";
import { ArrowRight, CirclePlay } from "lucide-react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import house1 from "../assets/house1.png";
import house2 from "../assets/house2.png";
import house3 from "../assets/house3.png";
import { useState } from "react";

function About() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      {/* NavBar Spacer */}
      <div className="w-full h-25" />
      <div className="max-w-[1400px] w-full">
        <div style={{ backgroundColor: "" }} className="flex">
          <div style={{ backgroundColor: "" }} className="w-[32%] flex flex-col justify-center gap-4">
            <div className="flex justify-end items-end h-[45%]">
              {/* Left vertical text */}
              <span style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }} className="text-primary text-sm font-bold tracking-[0.6em]">
                OPULENT HAVEN MANSION
              </span>
              <span style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }} className="text-gray-500 text-sm tracking-[0.1em]">
                9876, Boulevard Goldington, TX 12345 US
              </span>
              <img src={house2} alt="House 2" className="h-full w-auto ml-[5%]" />
            </div>
            <div className="flex justify-end items-end h-[45%]">
              {/* Left vertical text */}
              <span style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }} className="text-primary text-sm font-bold tracking-[0.6em]">
                GRAND OAK ESTATE
              </span>
              <span style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }} className="text-gray-500 text-sm tracking-[0.1em]">
                5678 CY, Cedar Heights, NY 54321, US
              </span>
              <img src={house3} alt="House 3" className="h-full w-auto ml-[5%]" />
            </div>
          </div>
          <div style={{ backgroundColor: "green" }} className="w-[28%]">
            <div className="bg-slate-800 text-white p-10 mx-auto flex flex-col">
              {/* Header */}
              <h1 className="text-5xl font-bold mb-8">
                About <span className="text-primary">Us</span>
              </h1>

              {/* Content */}
              <div className="flex-1 space-y-6 text-gray-300 leading-relaxed text-sm">
                <p>Welcome to 100 flour, where the future of architecture intertwines with sustainability to create transformative spaces. Founded with a vision to revolutionize the architectural landscape.</p>

                <p>Our mission is simple: to design spaces that inspire, function, and endure. We strive to meet the needs of today without compromising the ability of future generations to meet their own needs. Our goal is to create buildings that not only stand the test of time but also contribute positively to their surroundings.</p>

                <p>At Arockt, we are constantly exploring new horizons in architecture and sustainability. We invite you to join us as we continue to design not just buildings, but better futures. Whether you are a potential client, a future team member, or someone interested in sustainable architecture, connect with us and be a part of our journey to make the world a better place through thoughtful and innovative design.</p>

                <p className="font-medium text-white">Together, let's build the future.</p>
              </div>

              {/* CTA Button */}
              <div className="mt-8 pt-4">
                <Button className="w-full h-12 text-lg bg-transparent border border-primary text-primary cursor-pointer hover:bg-primary hover:text-slate-800 py-3 px-6 rounded transition-all duration-300 flex items-center justify-center space-x-2 font-medium group transition-all duration-300">
                  Contact Us
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-3 transition-transform" />
                </Button>
              </div>
            </div>
          </div>
          <div className="w-[40%]">
            <div className="flex h-2/3 mt-5">
              <div className="h-full mr-[5%] relative">
                <img src={house1} alt="House 1" className="h-full w-auto" />
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
              <span style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }} className="text-primary text-sm font-bold tracking-[0.6em]">
                SERENETY MANOR
              </span>
              <span style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }} className="text-gray-500 text-sm tracking-[0.1em]">
                1234 Tranquil Avenue Willowbrook, CA 98765, US
              </span>
            </div>
            <div className="m-8">
              <div className="mb-4">
                <h1 className="text-4xl font-bold leading-tight">
                  Explore Our Modern
                  <br />
                  <span style={{ color: "#176B87" }}>Residential Architectures</span>
                </h1>
              </div>
              <p className="text-gray-500 text-lg  leading-relaxed max-w-lg">That harmonize everyday living with elegance and Eco-friendliness. From spacious family homes to compact urban residences.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default About;
