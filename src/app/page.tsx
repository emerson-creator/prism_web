import { Hero } from "@/components/modules/landing/Hero";
import { FeaturedCollections } from "@/components/modules/landing/FeaturedCollections";
import { FeaturedProducts } from "@/components/modules/landing/FeaturedProducts";
import { TrustStrip } from "@/components/modules/landing/TrustStrip";

export default function Home() {
  return (
    <main>
      <Hero />
      <FeaturedCollections />
      <FeaturedProducts />
      <TrustStrip />
    </main>
  );
}
