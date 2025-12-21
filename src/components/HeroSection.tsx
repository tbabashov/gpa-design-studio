import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Calculator, Sparkles, ArrowRight } from 'lucide-react';
import MiniCalculator from './MiniCalculator';

interface HeroSectionProps {
  onNavigate: (section: string) => void;
}

const HeroSection = ({ onNavigate }: HeroSectionProps) => {
  return (
    <section id="home" className="min-h-screen pt-20 sm:pt-24 lg:pt-32 pb-12 sm:pb-16 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-secondary/10 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-20 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card"
            >
              <Sparkles className="w-4 h-4 text-secondary" />
              <span className="text-sm text-muted-foreground">
                The smartest GPA calculator
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-display font-bold leading-[1.1] tracking-tight"
            >
              Calculate Your{' '}
              <span className="gradient-text">GPA</span>{' '}
              <br className="hidden sm:block" />
              Like Never Before
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-lg"
            >
              EasyGPA helps you track every assignment, course, and credit — giving you crystal-clear GPA calculations, beautifully and effortlessly.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Button 
                variant="default" 
                size="xl"
                onClick={() => onNavigate('calculator')}
                className="bg-white text-background hover:bg-white/90 font-semibold group"
              >
                <Calculator className="w-5 h-5" />
                Start Calculating
                <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
              </Button>
              <Button 
                variant="heroOutline" 
                size="xl"
                onClick={() => onNavigate('features')}
              >
                See How It Works
              </Button>
            </motion.div>

            {/* Trust badges */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.7 }}
              className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 pt-2 sm:pt-4"
            >
              <div className="flex -space-x-2">
                {[
                  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face',
                  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
                  'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100&h=100&fit=crop&crop=face',
                  'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&h=100&fit=crop&crop=face',
                ].map((src, i) => (
                  <img
                    key={i}
                    src={src}
                    alt={`Student ${i + 1}`}
                    className="w-10 h-10 rounded-full border-2 border-background object-cover"
                  />
                ))}
              </div>
              <div className="text-sm text-muted-foreground">
                <span className="text-foreground font-semibold">10,000+</span> students trust EasyGPA
              </div>
            </motion.div>
          </div>

          {/* Right Content - Mini Calculator */}
          <motion.div
            initial={{ opacity: 0, x: 50, rotateY: -10 }}
            animate={{ opacity: 1, x: 0, rotateY: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="relative w-full max-w-md mx-auto lg:max-w-none"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-3xl blur-3xl -z-10" />
            <MiniCalculator />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
