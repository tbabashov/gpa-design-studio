import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus } from 'lucide-react';

const faqs = [
  {
    question: 'What is GPA?',
    answer: 'GPA (Grade Point Average) is a numerical representation of your overall academic performance. It is calculated based on the grades you earn in each course, weighted by credits.',
  },
  {
    question: 'How do I add a new course?',
    answer: 'Click the "+ Add Course" button in your active profile, then name the course, assign credits, and add assignments with grades. You can also drag and drop to reorder.',
  },
  {
    question: 'How is my course GPA calculated?',
    answer: 'Assignment points are calculated as (Grade% × Weight ÷ 100). The total percentage is then converted into GPA using the standard grade scale.',
  },
  {
    question: 'How is overall GPA calculated?',
    answer: 'Overall GPA = Σ (Course GPA × Course Credits) ÷ Total Credits. This weighted average accounts for courses with different credit values.',
  },
  {
    question: 'Can I save multiple profiles?',
    answer: 'Yes! You can create multiple profiles, each with its own courses and GPA calculations. Perfect for tracking different semesters or academic programs.',
  },
  {
    question: 'Is my data saved automatically?',
    answer: 'All data is stored locally in your browser, so your progress is saved automatically. Your data remains private and accessible only on your device.',
  },
];

const FAQItem = ({ faq, isOpen, onToggle }: { 
  faq: typeof faqs[0]; 
  isOpen: boolean; 
  onToggle: () => void 
}) => (
  <motion.div 
    className="border-b border-border/50 last:border-0"
    initial={false}
  >
    <button
      onClick={onToggle}
      className="w-full py-6 flex items-center justify-between text-left group"
    >
      <span className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors pr-8">
        {faq.question}
      </span>
      <motion.div
        animate={{ rotate: isOpen ? 180 : 0 }}
        transition={{ duration: 0.3 }}
        className="flex-shrink-0 w-8 h-8 rounded-lg bg-muted/50 flex items-center justify-center group-hover:bg-primary/10 transition-colors"
      >
        {isOpen ? (
          <Minus className="w-4 h-4 text-primary" />
        ) : (
          <Plus className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
        )}
      </motion.div>
    </button>
    <AnimatePresence initial={false}>
      {isOpen && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          className="overflow-hidden"
        >
          <p className="pb-6 text-muted-foreground leading-relaxed">
            {faq.answer}
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  </motion.div>
);

const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="py-24 lg:py-32">
      <div className="container mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold mb-6">
            Frequently Asked <span className="gradient-text">Questions</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Everything you need to know about EasyGPA
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-3xl mx-auto glass-card rounded-2xl p-6 lg:p-8"
        >
          {faqs.map((faq, index) => (
            <FAQItem
              key={index}
              faq={faq}
              isOpen={openIndex === index}
              onToggle={() => setOpenIndex(openIndex === index ? null : index)}
            />
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default FAQSection;
