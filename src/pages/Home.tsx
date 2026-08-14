import Hero from "../components/home/Hero";
import Features from "../components/home/Features";
import HowItWorks from "../components/home/HowItWorks";
import Testimonials from "../components/home/Testimonials";
import Pricing from "../components/home/Pricing";
import FAQ from "../components/home/FAQ";
import Footer from "../components/home/Footer";

export default function Home() {
    return (
        <div className="min-h-screen">
            <Hero />
            <Features />
            <HowItWorks />
            <Testimonials />
            <Pricing />
            <FAQ />
            <Footer />
        </div>
    );
}
