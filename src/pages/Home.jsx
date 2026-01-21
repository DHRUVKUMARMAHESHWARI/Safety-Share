import HeroSection from '../components/landing/HeroSection';
import FeaturesSection from '../components/landing/FeaturesSection';
import StatsSection from '../components/landing/StatsSection';
import CTASection from '../components/landing/CTASection';
import Footer from '../components/layout/Footer';

const Home = () => {
  return (
    <div style={{ overflowX: 'hidden' }}>
      <HeroSection />
      <FeaturesSection />
      {/* <HowItWorksSection /> - Placeholder for future implementing */}
      <StatsSection />
      {/* <TestimonialsSection /> - Placeholder */}
      <CTASection />
      <Footer />
    </div>
  );
};

export default Home;
