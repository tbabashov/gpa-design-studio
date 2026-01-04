import { useState, useRef, useCallback, useEffect } from 'react';
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
import FeaturesPage from './FeaturesPage';
import ContactPage from './ContactPage';
import UsernamePickerModal from '@/components/UsernamePickerModal';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

type ActivePage = 'home' | 'calculator' | 'features' | 'contact';

const Index = () => {
  const [activePage, setActivePage] = useState<ActivePage>('home');
  const { user } = useAuth();
  const prevUserRef = useRef<string | null>(null);
  const hasShownWelcomeRef = useRef(false);
  
  const homeRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);
  const faqRef = useRef<HTMLDivElement>(null);

  // Show welcome toast when user signs in
  useEffect(() => {
    if (user && !prevUserRef.current && !hasShownWelcomeRef.current) {
      hasShownWelcomeRef.current = true;
      toast.success('Welcome back!', {
        description: 'You are now signed in.',
      });
    }
    prevUserRef.current = user?.id || null;
  }, [user]);

  const handleNavigate = useCallback((section: string) => {
    if (section === 'calculator') {
      setActivePage('calculator');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (section === 'features') {
      setActivePage('features');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (section === 'contact') {
      setActivePage('contact');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setActivePage('home');
    
    setTimeout(() => {
      const refs: Record<string, React.RefObject<HTMLDivElement>> = {
        home: homeRef,
        'features-preview': featuresRef,
        faq: faqRef,
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

  if (activePage === 'calculator') {
    return (
      <>
        <Helmet>
          <title>GPA Calculator | EasyGPA - Smart Grade Calculator</title>
          <meta name="description" content="Calculate your GPA with precision. Add courses, assignments, and track your academic progress with EasyGPA's smart calculator." />
        </Helmet>
        <CalculatorPage onNavigateHome={() => setActivePage('home')} />
      </>
    );
  }

  if (activePage === 'features') {
    return <FeaturesPage onNavigate={handleNavigate} />;
  }

  if (activePage === 'contact') {
    return <ContactPage onNavigate={handleNavigate} />;
  }

  return (
    <>
      <Helmet>
        <title>EasyGPA - Smart GPA Calculator for Students</title>
        <meta name="description" content="EasyGPA helps students calculate and track their GPA with precision. Assignment-level accuracy, automatic GPA conversion, and beautiful design." />
        <meta name="keywords" content="GPA calculator, grade calculator, student GPA, academic performance, grade tracking" />
      </Helmet>
      
      <UsernamePickerModal />
      
      <div className="min-h-screen">
        <Navbar onNavigate={handleNavigate} />
        
        <div ref={homeRef}>
          <HeroSection onNavigate={handleNavigate} />
        </div>
        
        <div ref={featuresRef}>
          <FeaturesSection onNavigate={handleNavigate} />
        </div>
        
        <StatsSection />
        
        <ReviewsSection />
        
        <div ref={faqRef}>
          <FAQSection />
        </div>

        <CTASection onNavigate={handleNavigate} />
        
        <Footer onNavigate={handleNavigate} />
      </div>
    </>
  );
};

export default Index;
