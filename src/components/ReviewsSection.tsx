import { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

const reviews = [
  { name: 'Alyssa R.', university: 'Stanford University', rating: 5, text: "This GPA calculator is amazing! Saved me so much time and stress during finals." },
  { name: 'James K.', university: 'MIT', rating: 4, text: "I can track my grades perfectly now. The interface is clean and intuitive." },
  { name: 'Maria L.', university: 'UCLA', rating: 5, text: "The interface is beautiful and responsive. Best GPA tool I've ever used!" },
  { name: 'Daniel S.', university: 'Harvard University', rating: 5, text: "Adding courses and assignments is super easy. Love the drag and drop!" },
  { name: 'Sophia M.', university: 'UC Berkeley', rating: 5, text: "Helped me calculate my GPA accurately every semester. Highly recommend!" },
  { name: 'Alex T.', university: 'Yale University', rating: 5, text: "Finally a calculator that works exactly how I need it. Perfect for students!" },
  { name: 'Emily W.', university: 'Princeton', rating: 4, text: "Great app! The workspace feature lets me track multiple semesters easily." },
  { name: 'Ryan P.', university: 'Columbia University', rating: 5, text: "Clean design, fast calculations, and saves my progress. What more could I ask?" },
  { name: 'Jordan H.', university: 'Duke University', rating: 5, text: "The what-if calculator helped me plan my semester perfectly. Game changer!" },
  { name: 'Mia C.', university: 'Northwestern University', rating: 5, text: "So much better than spreadsheets. I use it every week to track my progress." },
  { name: 'Ethan B.', university: 'University of Michigan', rating: 4, text: "Love how I can export my GPA reports. Makes academic planning so much easier." },
];

const ReviewCard = ({ review }: { review: typeof reviews[0] }) => (
  <div className="flex-shrink-0 w-72 sm:w-80 p-4 sm:p-6 rounded-2xl glass-card hover:border-primary/30 transition-all duration-300 group">
    <div className="flex gap-0.5 mb-4">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`w-4 h-4 ${
            i < review.rating 
              ? 'fill-secondary text-secondary' 
              : 'text-muted-foreground/30'
          }`}
        />
      ))}
    </div>
    <p className="text-muted-foreground italic leading-relaxed mb-4">"{review.text}"</p>
    <div>
      <p className="font-semibold text-foreground">{review.name}</p>
      <p className="text-sm text-muted-foreground/70">{review.university}</p>
    </div>
  </div>
);

const ReviewsSection = () => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scrollElement = scrollRef.current;
    if (!scrollElement) return;

    let animationId: number;
    let scrollPos = 0;
    const scrollSpeed = 0.5;

    const scroll = () => {
      scrollPos += scrollSpeed;
      const maxScroll = scrollElement.scrollWidth / 2;
      
      if (scrollPos >= maxScroll) {
        scrollPos = 0;
      }
      
      scrollElement.scrollLeft = scrollPos;
      animationId = requestAnimationFrame(scroll);
    };

    animationId = requestAnimationFrame(scroll);

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <section className="py-24 lg:py-32 overflow-hidden">
      <div className="container mx-auto px-6 lg:px-8 mb-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold mb-4">
            What Students <span className="gradient-text">Say</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Join thousands of students who love EasyGPA
          </p>
        </motion.div>
      </div>

      {/* Scrolling Reviews */}
      <div 
        ref={scrollRef}
        className="flex gap-6 overflow-x-hidden cursor-grab active:cursor-grabbing"
        style={{ scrollBehavior: 'auto' }}
      >
        {/* Duplicate reviews for infinite scroll effect */}
        {[...reviews, ...reviews].map((review, index) => (
          <ReviewCard key={index} review={review} />
        ))}
      </div>
    </section>
  );
};

export default ReviewsSection;
