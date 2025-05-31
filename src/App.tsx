import { Fade } from "./components/Fade";
import { Navbar } from "./components/Navbar";
import { Sidenav } from "./components/Sidenav";
import About from "./pages/About";
import Home from "./pages/Home";
import Portfolio from "./pages/Portfolio";
import Services from "./pages/Services";
import StayInTouch from "./pages/StayInTouch";

function App() {
  return (
    <>
      <Navbar />
      <Sidenav />
      <Home />
      <Fade />
      <About />
      <Services />
      <Portfolio />
      <StayInTouch />
    </>
  );
}

export default App;
