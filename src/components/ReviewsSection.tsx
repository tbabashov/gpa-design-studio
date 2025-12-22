import { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

const reviews = [
  { name: 'Alyssa R.', university: 'Stanford University', rating: 5, text: "This GPA calculator is amazing! Saved me so much time and stress during finals.", avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/Stanford_Cardinal_logo.svg/200px-Stanford_Cardinal_logo.svg.png' },
  { name: 'James K.', university: 'MIT', rating: 4, text: "I can track my grades perfectly now. The interface is clean and intuitive.", avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0c/MIT_logo.svg/200px-MIT_logo.svg.png' },
  { name: 'Maria L.', university: 'UCLA', rating: 5, text: "The interface is beautiful and responsive. Best GPA tool I've ever used!", avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6c/UCLA_Bruins_script.svg/200px-UCLA_Bruins_script.svg.png' },
  { name: 'Daniel S.', university: 'Harvard University', rating: 5, text: "Adding courses and assignments is super easy. Love the drag and drop!", avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cc/Harvard_University_coat_of_arms.svg/200px-Harvard_University_coat_of_arms.svg.png' },
  { name: 'Sophia M.', university: 'UC Berkeley', rating: 5, text: "Helped me calculate my GPA accurately every semester. Highly recommend!", avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a1/Seal_of_University_of_California%2C_Berkeley.svg/200px-Seal_of_University_of_California%2C_Berkeley.svg.png' },
  { name: 'Alex T.', university: 'Yale University', rating: 5, text: "Finally a calculator that works exactly how I need it. Perfect for students!", avatar: 'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=100&h=100&fit=crop&crop=face', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/07/Yale_University_Shield_1.svg/200px-Yale_University_Shield_1.svg.png' },
  { name: 'Emily W.', university: 'Princeton', rating: 4, text: "Great app! The workspace feature lets me track multiple semesters easily.", avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&h=100&fit=crop&crop=face', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/Princeton_seal.svg/200px-Princeton_seal.svg.png' },
  { name: 'Ryan P.', university: 'Columbia University', rating: 5, text: "Clean design, fast calculations, and saves my progress. What more could I ask?", avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop&crop=face', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f1/Columbia_University_shield.svg/200px-Columbia_University_shield.svg.png' },
  { name: 'Jordan H.', university: 'Duke University', rating: 5, text: "The what-if calculator helped me plan my semester perfectly. Game changer!", avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/04/Duke_Blue_Devils_logo.svg/200px-Duke_Blue_Devils_logo.svg.png' },
  { name: 'Mia C.', university: 'Northwestern University', rating: 5, text: "So much better than spreadsheets. I use it every week to track my progress.", avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=face', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Northwestern_Wildcats_logo.svg/200px-Northwestern_Wildcats_logo.svg.png' },
  { name: 'Ethan B.', university: 'University of Michigan', rating: 4, text: "Love how I can export my GPA reports. Makes academic planning so much easier.", avatar: 'https://images.unsplash.com/photo-1463453091185-61582044d556?w=100&h=100&fit=crop&crop=face', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/93/Seal_of_the_University_of_Michigan.svg/200px-Seal_of_the_University_of_Michigan.svg.png' },
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
    <div className="flex items-center gap-3">
      <img 
        src={review.avatar} 
        alt={review.name}
        className="w-10 h-10 rounded-full object-cover ring-2 ring-primary/20"
      />
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-foreground">{review.name}</p>
        <div className="flex items-center gap-2">
          <img 
            src={review.logo} 
            alt={review.university}
            className="w-4 h-4 object-contain opacity-70"
          />
          <p className="text-sm text-muted-foreground/70 truncate">{review.university}</p>
        </div>
      </div>
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
