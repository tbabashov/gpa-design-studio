import { useState, useRef, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import FeaturesSection from '@/components/FeaturesSection';
import StatsSection from '@/components/StatsSection';
import ReviewsSection from '@/components/ReviewsSection';
import FAQSection from '@/components/FAQSection';
import CTASection from '@/components/CTASection';
import Footer from '@/components/Footer';
import CalculatorPage from './CalculatorPage';

const Index = () => {
  const [showCalculator, setShowCalculator] = useState(false);
  
  const homeRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);
  const faqRef = useRef<HTMLDivElement>(null);
  const contactRef = useRef<HTMLDivElement>(null);

  const handleNavigate = useCallback((section: string) => {
    if (section === 'calculator') {
      setShowCalculator(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setShowCalculator(false);
    
    setTimeout(() => {
      const refs: Record<string, React.RefObject<HTMLDivElement>> = {
        home: homeRef,
        features: featuresRef,
        faq: faqRef,
        contact: contactRef,
      };

      const ref = refs[section];
      if (ref?.current) {
        const offset = 80;
        const top = ref.current.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      } else if (section === 'home') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }, 100);
  }, []);

  if (showCalculator) {
    return (
      <>
        <Helmet>
          <title>GPA Calculator | EasyGPA - Smart Grade Calculator</title>
          <meta name="description" content="Calculate your GPA with precision. Add courses, assignments, and track your academic progress with EasyGPA's smart calculator." />
        </Helmet>
        <CalculatorPage onNavigateHome={() => setShowCalculator(false)} />
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>EasyGPA - Smart GPA Calculator for Students</title>
        <meta name="description" content="EasyGPA helps students calculate and track their GPA with precision. Assignment-level accuracy, automatic GPA conversion, and beautiful design." />
        <meta name="keywords" content="GPA calculator, grade calculator, student GPA, academic performance, grade tracking" />
      </Helmet>
      
      <div className="min-h-screen">
        <Navbar onNavigate={handleNavigate} />
        
        <div ref={homeRef}>
          <HeroSection onNavigate={handleNavigate} />
        </div>
        
        <div ref={featuresRef}>
          <FeaturesSection />
        </div>
        
        <StatsSection />
        
        <ReviewsSection />
        
        <div ref={faqRef}>
          <FAQSection />
        </div>

        <CTASection onNavigate={handleNavigate} />
        
        <div ref={contactRef}>
          <Footer onNavigate={handleNavigate} />
        </div>
      </div>
    </>
  );
};

export default Index;
