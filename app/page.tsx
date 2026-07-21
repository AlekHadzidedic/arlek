import TopBar from "../components/TopBar";
import Hero from "../components/Hero";
import Work from "../components/Work";
import Rebuild from "../components/Rebuild";
import Offer from "../components/Offer";
import About from "../components/About";
import CTA from "../components/CTA";
import Footer from "../components/Footer";

export default function Home() {
  return (
    <>
      <TopBar />
      <main>
        <Hero />
        <Work />
        <Rebuild />
        <Offer />
        <About />
        <CTA />
      </main>
      <Footer />
    </>
  );
}
