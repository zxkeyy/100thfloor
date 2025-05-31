import { Fade } from "./components/Fade";
import { Navbar } from "./components/Navbar";
import { Sidenav } from "./components/Sidenav";
import About from "./pages/About";
import Footer from "./pages/Footer";
import Home from "./pages/Home";
import Portfolio from "./pages/Portfolio";
import Services from "./pages/Services";
import StayInTouch from "./pages/StayInTouch";

function App() {
  return (
    <>
      <Navbar />
      <Sidenav />
      <section id="home">
        <Home />
      </section>
      <Fade />
      <section id="about">
        <About />
      </section>
      <section id="services">
        <Services />
      </section>
      <section id="portfolio">
        <Portfolio />
      </section>
      <section id="contact">
        <StayInTouch />
      </section>
      <Footer />
    </>
  );
}

export default App;
