import { motion } from 'framer-motion';
import { 
  Calculator, 
  BarChart3, 
  Layers, 
  Zap, 
  Settings2, 
  Save
} from 'lucide-react';

const features = [
  {
    icon: Calculator,
    title: 'Assignment-Level Accuracy',
    description: 'Enter each assignment with its weight and points for exact, precise results.',
  },
  {
    icon: BarChart3,
    title: 'Automatic GPA Conversion',
    description: 'Your grades are instantly converted using a precise GPA scale.',
  },
  {
    icon: Layers,
    title: 'Credit-Weighted Calculations',
    description: 'Weighted GPA calculation across all your courses with different credit values.',
  },
  {
    icon: Save,
    title: 'Saved Progress',
    description: 'Return anytime — your data is remembered automatically in your browser.',
  },
  {
    icon: Settings2,
    title: 'Fully Customizable',
    description: 'Rename subjects, add or remove assignments freely with drag & drop.',
  },
  {
    icon: Zap,
    title: 'Lightning Fast',
    description: 'No accounts required. No clutter. Just instant, accurate results.',
  },
];

const FeaturesSection = () => {
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
            Designed for clarity, precision, and a premium experience that makes tracking your academic progress a breeze.
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -8, transition: { duration: 0.3 } }}
              className="group"
            >
              <div className="h-full p-6 lg:p-8 rounded-2xl glass-card hover:border-primary/30 transition-all duration-300 hover:shadow-[0_20px_60px_-15px_hsl(217_91%_60%/_0.2)]">
                <div className="mb-5 w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center group-hover:from-primary/30 group-hover:to-secondary/30 transition-colors">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-display font-semibold mb-3 text-foreground">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
