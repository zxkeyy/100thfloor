import image1 from "../assets/Rectangle 16.png";
import image2 from "../assets/Rectangle 17.png";
import image3 from "../assets/Rectangle 18.png";
import image4 from "../assets/Rectangle 19.png";
import image5 from "../assets/Rectangle 20.png";

function Portfolio() {
  return (
    <>
      {/* NavBar Spacer */}
      <div className="w-full h-25" />
      <div className="flex justify-center">
        <div className="max-w-[1400px] w-full flex flex-col items-center justify-center">
          <div className="space-y-2 mb-2 mt-4">
            <h1 className="text-5xl font-bold leading-tight">
              Checkout Our <span style={{ color: "#176B87" }}>Work</span>
            </h1>
          </div>

          {/* Description */}
          <p className="text-gray-700 text-lg text-center leading-relaxed max-w-lg mb-8"> Join us in exploring spaces designed not just for today, but for a sustainable tomorrow.</p>

          <div className="grid grid-cols-4 grid-rows-2 w-full aspect-[1.38] gap-6 mb-40">
            <div
              style={{
                backgroundImage: `url(${image1})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
              className="col-span-2 p-8 flex flex-col justify-end relative before:content-[''] before:absolute before:inset-0 before:bg-gradient-to-t before:from-black/30 before:to-transparent before:pointer-events-none after:content-[''] after:absolute after:inset-0 after:bg-black/20 after:pointer-events-none hover:after:opacity-0 after:transition-opacity"
            >
              <div className="flex justify-between w-full z-2">
                <span className="text-primary text-lg tracking-[0.6em]">AROCKT</span>
                <span className="text-white font-bold text-xl tracking-[0.15em]">20.12.2024</span>
              </div>

              <h2 className="text-white font-bold text-3xl mt-2 z-2">First-Time Homebuyers Rejoice as Mortgage Rates Hit All-Time Low</h2>
            </div>
            <div
              style={{
                backgroundImage: `url(${image4})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
              className="col-span-1 p-8 flex flex-col justify-end relative before:content-[''] before:absolute before:inset-0 before:bg-gradient-to-t before:from-black/30 before:to-transparent before:pointer-events-none after:content-[''] after:absolute after:inset-0 after:bg-black/20 after:pointer-events-none hover:after:opacity-0 after:transition-opacity"
            >
              <span className="text-primary text-lg tracking-[0.6em] z-2">AROCKT</span>
              <h2 className="text-white font-bold text-3xl mt-1 z-2">Commercial Real Estate Booms</h2>
              <span className="text-white font-bold text-xl tracking-[0.15em] mt-2 z-2">20.12.2024</span>
            </div>
            <div
              style={{
                backgroundImage: `url(${image5})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
              className="col-span-1 p-8 flex flex-col justify-end relative before:content-[''] before:absolute before:inset-0 before:bg-gradient-to-t before:from-black/30 before:to-transparent before:pointer-events-none after:content-[''] after:absolute after:inset-0 after:bg-black/20 after:pointer-events-none hover:after:opacity-0 after:transition-opacity"
            >
              <span className="text-primary text-lg tracking-[0.6em] z-2">AROCKT</span>
              <h2 className="text-white font-bold text-3xl mt-1 z-2">Commercial Real Estate Booms</h2>
              <span className="text-white font-bold text-xl tracking-[0.15em] mt-2 z-2">20.12.2024</span>
            </div>
            <div
              style={{
                backgroundImage: `url(${image2})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
              className="col-span-2 p-8 flex flex-col justify-end relative before:content-[''] before:absolute before:inset-0 before:bg-gradient-to-t before:from-black/30 before:to-transparent before:pointer-events-none after:content-[''] after:absolute after:inset-0 after:bg-black/20 after:pointer-events-none hover:after:opacity-0 after:transition-opacity"
            >
              <div className="flex justify-between w-full z-2">
                <span className="text-primary text-lg tracking-[0.6em]">AROCKT</span>
                <span className="text-white font-bold text-xl tracking-[0.15em]">20.12.2024</span>
              </div>

              <h2 className="text-white font-bold text-3xl mt-2 z-2">Real Estate Market Soars as Demand Surges, Prices Reach Record Highs</h2>
            </div>
            <div
              style={{
                backgroundImage: `url(${image3})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
              className="col-span-2 p-8 flex flex-col justify-end relative before:content-[''] before:absolute before:inset-0 before:bg-gradient-to-t before:from-black/30 before:to-transparent before:pointer-events-none after:content-[''] after:absolute after:inset-0 after:bg-black/20 after:pointer-events-none hover:after:opacity-0 after:transition-opacity"
            >
              <div className="flex justify-between w-full z-2">
                <span className="text-primary text-lg tracking-[0.6em]">AROCKT</span>
                <span className="text-white font-bold text-xl tracking-[0.15em]">20.12.2024</span>
              </div>

              <h2 className="text-white font-bold text-3xl mt-2 z-2">New Luxury Condo Complex Redefines Modern Living in the Heart of the City</h2>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
export default Portfolio;
