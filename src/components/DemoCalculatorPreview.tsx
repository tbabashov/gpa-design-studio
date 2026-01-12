import { motion } from 'framer-motion';
import { 
  GraduationCap, 
  BookOpen, 
  Sparkles,
  ArrowRight,
  Wand2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Course } from '@/hooks/useCalculatorState';

interface DemoCalculatorPreviewProps {
  onUseTemplate: (courses: Course[]) => void;
}

// Demo courses for the preview
const demoCourses: Omit<Course, 'id'>[] = [
  {
    name: 'Calculus II',
    credits: 4,
    isCollapsed: true,
    inputMode: 'letterGrade',
    manualGrade: 92,
    assignments: []
  },
  {
    name: 'Data Structures',
    credits: 3,
    isCollapsed: true,
    inputMode: 'letterGrade',
    manualGrade: 88,
    assignments: []
  },
  {
    name: 'Physics I',
    credits: 4,
    isCollapsed: true,
    inputMode: 'letterGrade',
    manualGrade: 85,
    assignments: []
  },
  {
    name: 'English Comp',
    credits: 3,
    isCollapsed: true,
    inputMode: 'letterGrade',
    manualGrade: 95,
    assignments: []
  }
];

const toLetterGrade = (percentage: number): string => {
  if (percentage >= 93) return 'A';
  if (percentage >= 90) return 'A-';
  if (percentage >= 87) return 'B+';
  if (percentage >= 83) return 'B';
  if (percentage >= 80) return 'B-';
  if (percentage >= 77) return 'C+';
  if (percentage >= 73) return 'C';
  if (percentage >= 70) return 'C-';
  if (percentage >= 67) return 'D+';
  if (percentage >= 63) return 'D';
  if (percentage >= 60) return 'D-';
  return 'F';
};

const percentageToGPA = (percentage: number): number => {
  if (percentage >= 93) return 4.0;
  if (percentage >= 90) return 3.7;
  if (percentage >= 87) return 3.3;
  if (percentage >= 83) return 3.0;
  if (percentage >= 80) return 2.7;
  if (percentage >= 77) return 2.3;
  if (percentage >= 73) return 2.0;
  if (percentage >= 70) return 1.7;
  if (percentage >= 67) return 1.3;
  if (percentage >= 63) return 1.0;
  if (percentage >= 60) return 0.7;
  return 0.0;
};

const calculateDemoGPA = () => {
  let totalPoints = 0;
  let totalCredits = 0;
  
  demoCourses.forEach(course => {
    if (course.manualGrade !== undefined && course.credits > 0) {
      const gpa = percentageToGPA(course.manualGrade);
      totalPoints += gpa * course.credits;
      totalCredits += course.credits;
    }
  });
  
  return totalCredits > 0 ? totalPoints / totalCredits : 0;
};

const DemoCalculatorPreview = ({ onUseTemplate }: DemoCalculatorPreviewProps) => {
  const overallGPA = calculateDemoGPA();
  const totalCredits = demoCourses.reduce((sum, c) => sum + c.credits, 0);

  const handleUseTemplate = () => {
    const coursesWithIds: Course[] = demoCourses.map((course, index) => ({
      ...course,
      id: `demo-${Date.now()}-${index}`
    }));
    onUseTemplate(coursesWithIds);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center py-8 sm:py-12"
    >
      {/* Sparkle badge */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card mb-6"
      >
        <Sparkles className="w-4 h-4 text-secondary" />
        <span className="text-sm text-muted-foreground">
          See what you can build
        </span>
      </motion.div>

      {/* Demo Calculator Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
        className="relative w-full max-w-md"
      >
        {/* Glow effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-3xl blur-2xl -z-10" />
        
        <div className="glass-card rounded-2xl p-5 shadow-xl">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                <GraduationCap className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground text-sm">Sample Semester</h3>
                <p className="text-xs text-muted-foreground">Example courses</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-[10px] text-muted-foreground uppercase tracking-wider">GPA</div>
              <motion.div 
                className="text-2xl font-display font-bold gradient-text"
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.5, type: "spring" }}
              >
                {overallGPA.toFixed(2)}
              </motion.div>
            </div>
          </div>

          {/* Course List */}
          <div className="space-y-2">
            {demoCourses.map((course, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + index * 0.1 }}
                className="flex items-center gap-2 p-3 rounded-xl bg-muted/30"
              >
                <div className="w-6 h-6 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <BookOpen className="w-3 h-3 text-primary" />
                </div>
                <span className="flex-1 text-sm font-medium text-foreground truncate">
                  {course.name}
                </span>
                <div className="w-9 text-xs text-center font-semibold px-1 py-0.5 rounded bg-primary/20 border border-primary/30 text-primary">
                  {toLetterGrade(course.manualGrade!)}
                </div>
                <span className="text-xs text-muted-foreground w-8 text-center">
                  {course.credits} cr
                </span>
                <div className="text-right min-w-[45px]">
                  <div className="text-xs font-semibold text-foreground">{course.manualGrade}%</div>
                  <div className="text-[10px] text-secondary">{percentageToGPA(course.manualGrade!).toFixed(2)}</div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Stats */}
          <div className="mt-4 pt-3 border-t border-border/50">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Total Credits</span>
              <span className="font-semibold text-foreground">{totalCredits}</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Action Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="flex flex-col sm:flex-row gap-3 mt-6"
      >
        <Button
          onClick={handleUseTemplate}
          className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold group"
        >
          <Wand2 className="w-4 h-4 mr-2" />
          Use as Template
          <ArrowRight className="w-4 h-4 ml-2 transition-transform duration-300 group-hover:translate-x-1" />
        </Button>
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="text-xs text-muted-foreground mt-4 text-center"
      >
        Or create a new workspace above to start fresh
      </motion.p>
    </motion.div>
  );
};

export default DemoCalculatorPreview;
