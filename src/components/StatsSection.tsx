import { useState, useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Users, BookOpen, Star, Target } from 'lucide-react';

const stats = [
  { icon: Users, value: 120000, suffix: '+', label: 'Active Users' },
  { icon: BookOpen, value: 1.8, suffix: 'M', label: 'Courses Calculated', decimals: 1 },
  { icon: Star, value: 4.9, suffix: '', label: 'Average Rating', decimals: 1 },
  { icon: Target, value: 99.9, suffix: '%', label: 'Accuracy', decimals: 1 },
];

const AnimatedNumber = ({ value, suffix, decimals = 0 }: { value: number; suffix: string; decimals?: number }) => {
  const [displayValue, setDisplayValue] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  useEffect(() => {
    if (!isInView) return;

    const duration = 2000;
    const startTime = Date.now();
    
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayValue(value * eased);
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    animate();
  }, [isInView, value]);

  const formatValue = (val: number) => {
    if (value >= 1000) {
      return Math.floor(val / 1000) + 'K';
    }
    return val.toFixed(decimals);
  };

  return (
    <div ref={ref} className="text-4xl md:text-5xl lg:text-6xl font-display font-bold gradient-text">
      {formatValue(displayValue)}{suffix}
    </div>
  );
};

const StatsSection = () => {
  return (
    <section className="py-24 lg:py-32 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent pointer-events-none" />
      
      <div className="container mx-auto px-6 lg:px-8 relative">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold">
            Trusted <span className="gradient-text">Worldwide</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="text-center"
            >
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/10 to-secondary/10 mb-4">
                <stat.icon className="w-7 h-7 text-primary" />
              </div>
              <AnimatedNumber 
                value={stat.value} 
                suffix={stat.suffix} 
                decimals={stat.decimals} 
              />
              <p className="text-muted-foreground mt-2">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
