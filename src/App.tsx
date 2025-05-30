import { Fade } from "./components/Fade";
import { Navbar } from "./components/Navbar";
import { Sidenav } from "./components/Sidenav";
import About from "./pages/About";
import Home from "./pages/Home";
import Services from "./pages/Services";

function App() {
  return (
    <>
      <Navbar />
      <Sidenav />
      <Home />
      <Fade />
      <About />
      <Services />
    </>
  );
}

export default App;
