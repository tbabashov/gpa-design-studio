import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Calculator, BookOpen, ArrowRight } from 'lucide-react';

interface CTASectionProps {
  onNavigate: (section: string) => void;
}

const CTASection = ({ onNavigate }: CTASectionProps) => {
  return (
    <section className="py-24 lg:py-32 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-gradient-to-r from-primary/20 to-secondary/20 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-6 lg:px-8 relative">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto text-center"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/20 mb-8">
            <BookOpen className="w-8 h-8 text-primary" />
          </div>
          
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold mb-6">
            Ready to Take Control of{' '}
            <span className="gradient-text">Your GPA?</span>
          </h2>
          
          <p className="text-lg text-muted-foreground mb-10 max-w-2xl mx-auto">
            Join thousands of students who trust EasyGPA for accurate grade calculations. 
            No sign-up required. Start calculating in seconds.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button 
              variant="default" 
              size="xl"
              onClick={() => onNavigate('calculator')}
              className="bg-white text-background hover:bg-white/90 font-semibold group"
            >
              <Calculator className="w-5 h-5" />
              Start Calculating Now
              <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
            </Button>
            <Button 
              variant="heroOutline" 
              size="xl"
              onClick={() => onNavigate('features')}
            >
              Learn More
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CTASection;
