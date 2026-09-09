import { AnnouncementBar } from "@/components/landing/AnnouncementBar";
import { Header } from "@/components/landing/Header";
import { HeroSection } from "@/components/landing/HeroSection";
import { FeaturedCategories } from "@/components/landing/FeaturedCategories";
import { BestSellers } from "@/components/landing/BestSellers";
import { ValueProposition } from "@/components/landing/ValueProposition";
import { Testimonials } from "@/components/landing/Testimonials";
import { NewsletterFooter } from "@/components/landing/NewsletterFooter";

export default function Home() {
  return (
    <>
      <AnnouncementBar />
      <Header />
      <main id="main-content">
        <HeroSection />
        <FeaturedCategories />
        <BestSellers />
        <ValueProposition />
        <Testimonials />
      </main>
      <NewsletterFooter />
    </>
  );
}
