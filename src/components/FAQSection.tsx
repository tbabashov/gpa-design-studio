import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus } from 'lucide-react';

const faqs = [
  {
    question: 'What is GPA?',
    answer: 'GPA (Grade Point Average) is a numerical representation of your overall academic performance. It is calculated based on the grades you earn in each course, weighted by credits.',
  },
  {
    question: 'How do I get started?',
    answer: 'Create a workspace by entering a name (like "Fall 2025") and clicking create. Then add courses, assignments, and grades. Your GPA is calculated automatically in real-time.',
  },
  {
    question: 'How do I add courses and assignments?',
    answer: 'Inside your workspace, click "+ Add Course" to create a new course. Set the course name and credits, then add assignments with their grades and weights. You can drag and drop to reorder.',
  },
  {
    question: 'What are workspaces?',
    answer: 'Workspaces let you organize your courses by semester, year, or program. Create multiple workspaces to track different academic periods separately, each with its own courses and GPA.',
  },
  {
    question: 'How is my GPA calculated?',
    answer: 'Course GPA is based on your weighted assignment grades converted to the 4.0 scale. Overall GPA = Σ (Course GPA × Credits) ÷ Total Credits, accounting for different credit values.',
  },
  {
    question: 'Can I enter letter grades directly?',
    answer: 'Yes! Toggle between assignment mode and letter grade mode for each course. In letter grade mode, you can directly enter your final letter grade (A, B+, C, etc.) instead of individual assignments.',
  },
  {
    question: 'Is my data saved automatically?',
    answer: 'Yes! When signed in, your data syncs securely to the cloud across all devices. You can also save snapshots of your GPA to your dashboard to track progress over time.',
  },
  {
    question: 'Do I need an account?',
    answer: 'You can use EasyGPA without an account, but your data will only be saved locally in your browser. Sign in with Google or Microsoft to sync across devices and access your dashboard.',
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
          className="max-w-5xl mx-auto glass-card rounded-2xl p-6 lg:p-8"
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
