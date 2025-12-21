import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, GraduationCap } from 'lucide-react';

interface Course {
  name: string;
  grade: number;
  credits: number;
}

const MiniCalculator = () => {
  const [courses] = useState<Course[]>([
    { name: 'Mathematics', grade: 95, credits: 4 },
    { name: 'Physics', grade: 88, credits: 3 },
    { name: 'Computer Science', grade: 92, credits: 4 },
  ]);

  const toGPA = (p: number): number => {
    if (p >= 94) return 4;
    if (p >= 90) return 3.67;
    if (p >= 87) return 3.33;
    if (p >= 83) return 3;
    if (p >= 80) return 2.67;
    if (p >= 77) return 2.33;
    if (p >= 73) return 2;
    if (p >= 70) return 1.67;
    if (p >= 67) return 1.33;
    if (p >= 60) return 1;
    return 0;
  };

  const calculateOverallGPA = (): number => {
    const totalCredits = courses.reduce((sum, c) => sum + c.credits, 0);
    const totalPoints = courses.reduce((sum, c) => sum + toGPA(c.grade) * c.credits, 0);
    return totalCredits ? totalPoints / totalCredits : 0;
  };

  const [displayGPA, setDisplayGPA] = useState(0);
  const targetGPA = calculateOverallGPA();

  useEffect(() => {
    const duration = 2000;
    const startTime = Date.now();
    
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayGPA(targetGPA * eased);
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    
    const timeout = setTimeout(animate, 800);
    return () => clearTimeout(timeout);
  }, [targetGPA]);

  return (
    <motion.div 
      className="glass-card rounded-2xl p-6 shadow-xl animate-float"
      whileHover={{ y: -5 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
            <GraduationCap className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">My Courses</h3>
            <p className="text-xs text-muted-foreground">Fall 2024</p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-xs text-muted-foreground uppercase tracking-wider">GPA</div>
          <div className="text-2xl font-display font-bold gradient-text">
            {displayGPA.toFixed(2)}
          </div>
        </div>
      </div>

      {/* Course List */}
      <div className="space-y-3">
        {courses.map((course, index) => (
          <motion.div
            key={course.name}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 + index * 0.1 }}
            className="flex items-center justify-between p-3 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors group"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <BookOpen className="w-4 h-4 text-primary" />
              </div>
              <div>
                <p className="font-medium text-sm text-foreground">{course.name}</p>
                <p className="text-xs text-muted-foreground">{course.credits} credits</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm font-semibold text-foreground">{course.grade}%</div>
              <div className="text-xs text-secondary">{toGPA(course.grade).toFixed(2)}</div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Bottom Bar */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="mt-6 pt-4 border-t border-border/50"
      >
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Total Credits</span>
          <span className="font-semibold text-foreground">
            {courses.reduce((sum, c) => sum + c.credits, 0)}
          </span>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default MiniCalculator;
