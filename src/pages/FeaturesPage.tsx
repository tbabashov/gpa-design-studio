import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { 
  Calculator, 
  BarChart3, 
  Layers, 
  Zap, 
  Settings2, 
  Save,
  Target,
  Smartphone,
  Shield,
  Clock,
  Users,
  Sparkles
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

interface FeaturesPageProps {
  onNavigate: (section: string) => void;
}

const features = [
  {
    icon: Calculator,
    title: 'Assignment-Level Accuracy',
    description: 'Enter each assignment with its weight and points for exact, precise results. No more guessing or approximations.',
    color: 'primary',
  },
  {
    icon: BarChart3,
    title: 'Automatic GPA Conversion',
    description: 'Your grades are instantly converted using a precise GPA scale. See your letter grades and GPA side by side.',
    color: 'secondary',
  },
  {
    icon: Layers,
    title: 'Credit-Weighted Calculations',
    description: 'Weighted GPA calculation across all your courses with different credit values for accurate semester totals.',
    color: 'tertiary',
  },
  {
    icon: Save,
    title: 'Cloud Sync',
    description: 'Sign in to save your data securely in the cloud. Access your grades from any device, anytime.',
    color: 'primary',
  },
  {
    icon: Settings2,
    title: 'Fully Customizable',
    description: 'Rename subjects, add or remove assignments freely with intuitive drag & drop reordering.',
    color: 'secondary',
  },
  {
    icon: Zap,
    title: 'Lightning Fast',
    description: 'Clean, distraction-free interface. Just instant, accurate results when you need them.',
    color: 'tertiary',
  },
  {
    icon: Target,
    title: 'Goal Tracking',
    description: 'Set your target GPA and track your progress throughout the semester with visual indicators.',
    color: 'primary',
  },
  {
    icon: Smartphone,
    title: 'Mobile Friendly',
    description: 'Works beautifully on any device - phone, tablet, or desktop with responsive design.',
    color: 'secondary',
  },
  {
    icon: Shield,
    title: 'Secure & Private',
    description: 'Your data is encrypted and stored securely. We never share your information with third parties.',
    color: 'tertiary',
  },
  {
    icon: Clock,
    title: 'Real-Time Updates',
    description: 'See your GPA change instantly as you enter grades with live calculations.',
    color: 'primary',
  },
  {
    icon: Users,
    title: 'Multiple Profiles',
    description: 'Create separate profiles for different semesters, scenarios, or "what-if" calculations.',
    color: 'secondary',
  },
  {
    icon: Sparkles,
    title: 'Beautiful Design',
    description: 'A premium experience that makes tracking grades enjoyable with modern aesthetics.',
    color: 'tertiary',
  },
];

const getColorClasses = (color: string) => {
  switch (color) {
    case 'primary':
      return {
        bg: 'from-primary/20 to-primary/5',
        icon: 'text-primary',
        hover: 'hover:shadow-[0_20px_60px_-15px_hsl(320_70%_60%/_0.3)]',
        border: 'hover:border-primary/30',
      };
    case 'secondary':
      return {
        bg: 'from-secondary/20 to-secondary/5',
        icon: 'text-secondary',
        hover: 'hover:shadow-[0_20px_60px_-15px_hsl(170_70%_45%/_0.3)]',
        border: 'hover:border-secondary/30',
      };
    case 'tertiary':
      return {
        bg: 'from-tertiary/20 to-tertiary/5',
        icon: 'text-tertiary',
        hover: 'hover:shadow-[0_20px_60px_-15px_hsl(200_80%_55%/_0.3)]',
        border: 'hover:border-tertiary/30',
      };
    default:
      return {
        bg: 'from-primary/20 to-primary/5',
        icon: 'text-primary',
        hover: 'hover:shadow-[0_20px_60px_-15px_hsl(320_70%_60%/_0.3)]',
        border: 'hover:border-primary/30',
      };
  }
};

const FeaturesPage = ({ onNavigate }: FeaturesPageProps) => {
  return (
    <>
      <Helmet>
        <title>Features | EasyGPA - All The Tools You Need</title>
        <meta name="description" content="Explore all features of EasyGPA - assignment-level accuracy, automatic GPA conversion, credit-weighted calculations, and more." />
      </Helmet>

      <div className="min-h-screen">
        <Navbar onNavigate={onNavigate} />

        {/* Hero */}
        <section className="pt-32 pb-16 lg:pt-40 lg:pb-24 relative">
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="absolute top-20 left-1/4 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px]" />
            <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-secondary/10 rounded-full blur-[100px]" />
          </div>

          <div className="container mx-auto px-6 lg:px-8 relative">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center max-w-3xl mx-auto"
            >
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-6">
                All The{' '}
                <span className="gradient-text aurora-glow">Features</span>{' '}
                You Need
              </h1>
              <p className="text-lg text-muted-foreground">
                Everything to make tracking your academic performance effortless and enjoyable.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="py-16 lg:py-24">
          <div className="container mx-auto px-6 lg:px-8">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {features.map((feature, index) => {
                const colors = getColorClasses(feature.color);
                return (
                  <motion.div
                    key={feature.title}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.5, delay: index * 0.05 }}
                    whileHover={{ y: -8, transition: { duration: 0.3 } }}
                    className="group"
                  >
                    <div className={`h-full p-6 rounded-2xl glass-card ${colors.border} ${colors.hover} transition-all duration-300`}>
                      <div className={`mb-4 w-12 h-12 rounded-xl bg-gradient-to-br ${colors.bg} flex items-center justify-center`}>
                        <feature.icon className={`w-6 h-6 ${colors.icon}`} />
                      </div>
                      <h3 className="text-lg font-display font-semibold mb-2 text-foreground">
                        {feature.title}
                      </h3>
                      <p className="text-muted-foreground text-sm leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 lg:py-24">
          <div className="container mx-auto px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <h2 className="text-2xl md:text-3xl font-display font-bold mb-6">
                Ready to try it out?
              </h2>
              <Button variant="hero" size="lg" onClick={() => onNavigate('calculator')}>
                Start Calculating Now
              </Button>
            </motion.div>
          </div>
        </section>

        <Footer onNavigate={onNavigate} />
      </div>
    </>
  );
};

export default FeaturesPage;