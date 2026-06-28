import TopBar from "../components/TopBar";
import Hero from "../components/Hero";
import Work from "../components/Work";
import CTA from "../components/CTA";
import Footer from "../components/Footer";

export default function Home() {
  return (
    <>
      <TopBar />
      <main>
        <Hero />
        <Work />
        <CTA />
      </main>
      <Footer />
    </>
  );
}
