import { motion } from 'framer-motion';
import { 
  Calculator, 
  BarChart3, 
  Target,
  ArrowRight,
  Zap, 
  Settings2, 
  Save,
  Layers
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface FeaturesSectionProps {
  onNavigate?: (section: string) => void;
}

const FeaturesSection = ({ onNavigate }: FeaturesSectionProps) => {
  return (
    <section id="features" className="py-24 lg:py-32 relative">
      {/* Background effect */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-primary/5 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-6 lg:px-8 relative">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold mb-6">
            Why Students Love{' '}
            <span className="gradient-text">EasyGPA</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Designed for clarity, precision, and a premium experience.
          </p>
        </motion.div>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
          {/* Box 1 - Large - Assignment Accuracy */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5 }}
            whileHover={{ y: -8, transition: { duration: 0.3 } }}
            className="lg:col-span-2 group"
          >
            <div className="h-full p-8 rounded-2xl glass-card hover:border-primary/30 transition-all duration-300 hover:shadow-[0_20px_60px_-15px_hsl(217_91%_60%/_0.2)]">
              <div className="flex items-start gap-6">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center group-hover:from-primary/30 group-hover:to-secondary/30 transition-colors flex-shrink-0">
                  <Calculator className="w-7 h-7 text-primary" />
                </div>
                <div>
                  <h3 className="text-2xl font-display font-semibold mb-3 text-foreground">
                    Assignment-Level Accuracy
                  </h3>
                  <p className="text-muted-foreground leading-relaxed text-lg">
                    Enter each assignment with its weight and points for exact, precise results. 
                    Track every quiz, test, and project individually.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Box 2 - Small - Goal 4.0 GPA */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: 0.1 }}
            whileHover={{ y: -8, transition: { duration: 0.3 } }}
            className="group"
          >
            <div className="h-full p-8 rounded-2xl bg-gradient-to-br from-primary to-secondary hover:shadow-[0_20px_60px_-15px_hsl(217_91%_60%/_0.4)] transition-all duration-300 flex flex-col items-center justify-center text-center">
              <Target className="w-12 h-12 text-primary-foreground mb-4" />
              <h3 className="text-4xl font-display font-bold text-primary-foreground mb-2">
                4.00
              </h3>
              <p className="text-primary-foreground/80 font-medium">
                Your Goal GPA
              </p>
              <p className="text-primary-foreground/60 text-sm mt-2">
                Track your progress
              </p>
            </div>
          </motion.div>

          {/* Box 3 - Small - Auto Conversion */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: 0.2 }}
            whileHover={{ y: -8, transition: { duration: 0.3 } }}
            className="group"
          >
            <div className="h-full p-6 rounded-2xl glass-card hover:border-primary/30 transition-all duration-300 hover:shadow-[0_20px_60px_-15px_hsl(217_91%_60%/_0.2)]">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center group-hover:from-primary/30 group-hover:to-secondary/30 transition-colors mb-4">
                <BarChart3 className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-display font-semibold mb-2 text-foreground">
                Auto GPA Conversion
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Grades instantly converted using a precise scale.
              </p>
            </div>
          </motion.div>

          {/* Box 4 - Small - Credit Weighted */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: 0.3 }}
            whileHover={{ y: -8, transition: { duration: 0.3 } }}
            className="group"
          >
            <div className="h-full p-6 rounded-2xl glass-card hover:border-primary/30 transition-all duration-300 hover:shadow-[0_20px_60px_-15px_hsl(217_91%_60%/_0.2)]">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center group-hover:from-primary/30 group-hover:to-secondary/30 transition-colors mb-4">
                <Layers className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-display font-semibold mb-2 text-foreground">
                Credit-Weighted
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Weighted GPA across all courses with different credits.
              </p>
            </div>
          </motion.div>

          {/* Box 5 - CTA - See All Features */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: 0.4 }}
            whileHover={{ y: -8, transition: { duration: 0.3 } }}
            className="group"
          >
            <div 
              onClick={() => onNavigate?.('features-expanded')}
              className="h-full p-6 rounded-2xl border-2 border-dashed border-primary/30 hover:border-primary/50 transition-all duration-300 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-primary/5"
            >
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <ArrowRight className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-lg font-display font-semibold text-foreground mb-2">
                See All Features
              </h3>
              <p className="text-muted-foreground text-sm">
                Explore everything EasyGPA offers
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
