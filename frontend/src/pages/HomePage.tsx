import { HeroSection } from '../sections/HeroSection';
import { HowItWorks } from '../sections/HowItWorks';
import { RoastPreview } from '../sections/RoastPreview';
import { FeaturesSection } from '../sections/FeaturesSection';
import { FAQSection } from '../sections/FAQSection';
import { FinalCTA } from '../sections/FinalCTA';

export function HomePage() {
  return (
    <>
      <HeroSection />
      <HowItWorks />
      <RoastPreview />
      <FeaturesSection />
      <FAQSection />
      <FinalCTA />
    </>
  );
}