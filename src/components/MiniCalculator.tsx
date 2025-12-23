import { motion, AnimatePresence, Reorder } from 'framer-motion';
import { 
  BookOpen, 
  GraduationCap, 
  Plus, 
  Trash2, 
  GripVertical,
  ChevronDown,
  ChevronUp,
  ListChecks
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCalculatorState, Assignment, toLetterGrade, letterGradeToPercentage } from '@/hooks/useCalculatorState';
import { useIsMobile } from '@/hooks/use-mobile';
import { useState, useRef, useCallback } from 'react';

const LONG_PRESS_DELAY = 200; // ms

const MiniCalculator = () => {
  const {
    activeProfile,
    calculateCourseGPA,
    calculateOverallGPA,
    addCourse,
    updateCourse,
    deleteCourse,
    addAssignment,
    updateAssignment,
    deleteAssignment,
    reorderAssignments,
    reorderCourses,
  } = useCalculatorState();
  
  const isMobile = useIsMobile();
  const [isDragEnabled, setIsDragEnabled] = useState<string | null>(null);
  const longPressTimerRef = useRef<NodeJS.Timeout | null>(null);

  const handlePointerDown = useCallback((id: string) => {
    if (!isMobile) return;
    longPressTimerRef.current = setTimeout(() => {
      setIsDragEnabled(id);
    }, LONG_PRESS_DELAY);
  }, [isMobile]);

  const handlePointerUp = useCallback(() => {
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }
    setIsDragEnabled(null);
  }, []);

  const courses = activeProfile?.courses || [];

  return (
    <motion.div 
      className="glass-card rounded-2xl p-4 sm:p-5 shadow-xl max-h-[420px] sm:max-h-[500px] overflow-y-auto w-full"
      whileHover={{ y: -3 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
            <GraduationCap className="w-4 h-4 sm:w-5 sm:h-5 text-primary-foreground" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground text-xs sm:text-sm">Quick Preview</h3>
            <p className="text-[10px] sm:text-xs text-muted-foreground">Try it out!</p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-[10px] text-muted-foreground uppercase tracking-wider">GPA</div>
          <div className="text-lg sm:text-xl font-display font-bold gradient-text">
            {calculateOverallGPA().toFixed(2)}
          </div>
        </div>
      </div>

      {/* Course List */}
      <Reorder.Group
        axis="y"
        values={courses}
        onReorder={reorderCourses}
        className="space-y-2"
        layoutScroll
      >
        {courses.map((course) => {
          const { percentage, gpa } = calculateCourseGPA(course);
          
          return (
            <Reorder.Item
              key={course.id}
              value={course}
              className="rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors cursor-grab active:cursor-grabbing"
              dragTransition={{ bounceStiffness: 600, bounceDamping: 20 }}
              dragListener={!isMobile || isDragEnabled === course.id}
              onPointerDown={() => handlePointerDown(course.id)}
              onPointerUp={handlePointerUp}
              onPointerCancel={handlePointerUp}
            >
              <div className="p-2 sm:p-3">
                {/* Course Header */}
                <div className="flex items-center gap-1 sm:gap-2">
                  <GripVertical className="w-3 h-3 text-muted-foreground flex-shrink-0" />
                  <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <BookOpen className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-primary" />
                  </div>
                  <input
                    type="text"
                    value={course.name}
                    onChange={(e) => updateCourse(course.id, { name: e.target.value })}
                    className="flex-1 bg-transparent text-xs sm:text-sm font-medium text-foreground focus:outline-none min-w-0"
                    placeholder="Course name"
                  />
                  {/* Letter Grade Box */}
                  <div className="flex items-center gap-1">
                    {course.inputMode === 'letterGrade' ? (
                      <input
                        type="text"
                        value={course.manualGrade !== undefined ? toLetterGrade(course.manualGrade) : ''}
                        onChange={(e) => {
                          const val = e.target.value.toUpperCase();
                          const fromLetter = letterGradeToPercentage(val);
                          if (fromLetter !== undefined) {
                            updateCourse(course.id, { manualGrade: fromLetter });
                          } else {
                            const num = parseFloat(val);
                            if (!isNaN(num) && num >= 0 && num <= 100) {
                              updateCourse(course.id, { manualGrade: num });
                            } else if (val === '') {
                              updateCourse(course.id, { manualGrade: undefined });
                            }
                          }
                        }}
                        className="w-8 sm:w-10 text-[10px] sm:text-xs text-center font-semibold px-1 py-0.5 rounded bg-primary/20 border border-primary/30 text-primary"
                        placeholder="-"
                      />
                    ) : (
                      <div className="w-8 sm:w-10 text-[10px] sm:text-xs text-center font-semibold px-1 py-0.5 rounded bg-primary/20 border border-primary/30 text-primary">
                        {percentage > 0 ? toLetterGrade(percentage) : '-'}
                      </div>
                    )}
                    <button
                      onClick={() => updateCourse(course.id, { 
                        inputMode: course.inputMode === 'assignments' ? 'letterGrade' : 'assignments' 
                      })}
                      className={`p-1 rounded transition-colors ${
                        course.inputMode === 'assignments' 
                          ? 'bg-primary/20 text-primary' 
                          : 'bg-muted/50 text-muted-foreground hover:text-foreground'
                      }`}
                      title={course.inputMode === 'assignments' ? 'Using assignments' : 'Click to use assignments'}
                    >
                      <ListChecks className="w-3 h-3" />
                    </button>
                  </div>
                  <input
                    type="number"
                    value={course.credits}
                    onChange={(e) => updateCourse(course.id, { credits: parseInt(e.target.value) || 1 })}
                    min="1"
                    max="12"
                    className="w-10 sm:w-12 text-[10px] sm:text-xs text-center px-1 py-0.5 rounded bg-muted border border-border text-foreground"
                    title="Credits"
                  />
                  <div className="text-right min-w-[30px] sm:min-w-[40px]">
                    <div className="text-[10px] sm:text-xs font-semibold text-foreground">{percentage.toFixed(0)}%</div>
                    <div className="text-[8px] sm:text-[10px] text-secondary">{gpa.toFixed(2)}</div>
                  </div>
                  <button
                    onClick={() => updateCourse(course.id, { isCollapsed: !course.isCollapsed })}
                    className="p-0.5 sm:p-1 hover:bg-muted rounded"
                  >
                    {course.isCollapsed ? (
                      <ChevronDown className="w-3 h-3 text-muted-foreground" />
                    ) : (
                      <ChevronUp className="w-3 h-3 text-muted-foreground" />
                    )}
                  </button>
                  <button
                    onClick={() => deleteCourse(course.id)}
                    className="p-0.5 sm:p-1 hover:bg-destructive/10 rounded text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>

                {/* Assignments (only shown when in assignments mode and expanded) */}
                <AnimatePresence>
                  {!course.isCollapsed && course.inputMode === 'assignments' && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="mt-2 ml-2 sm:ml-5">
                        <div className="space-y-1">
                          <Reorder.Group
                            axis="y"
                            values={course.assignments}
                            onReorder={(newOrder) => reorderAssignments(course.id, newOrder)}
                            className="space-y-1"
                            layoutScroll
                          >
                            {course.assignments.map(assignment => (
                              <Reorder.Item
                                key={assignment.id}
                                value={assignment}
                                className="flex items-center gap-1 sm:gap-2 p-1.5 sm:p-2 rounded-lg bg-background/30 cursor-grab active:cursor-grabbing hover:bg-background/50 transition-colors"
                                dragTransition={{ bounceStiffness: 600, bounceDamping: 20 }}
                                whileDrag={{ scale: 1.02, boxShadow: "0 5px 15px rgba(0,0,0,0.15)" }}
                                dragListener={!isMobile || isDragEnabled === assignment.id}
                                onPointerDown={() => handlePointerDown(assignment.id)}
                                onPointerUp={handlePointerUp}
                                onPointerCancel={handlePointerUp}
                              >
                                <GripVertical className="w-2.5 h-2.5 text-muted-foreground" />
                                <input
                                  type="text"
                                  value={assignment.name}
                                  onChange={(e) => updateAssignment(course.id, assignment.id, { name: e.target.value })}
                                  className="flex-1 bg-transparent text-[10px] sm:text-xs text-foreground focus:outline-none min-w-0"
                                  placeholder="Assignment"
                                />
                                <input
                                  type="number"
                                  value={assignment.grade || ''}
                                  onChange={(e) => updateAssignment(course.id, assignment.id, { grade: parseFloat(e.target.value) || 0 })}
                                  min="0"
                                  max="100"
                                  className="w-10 sm:w-12 text-[10px] sm:text-xs text-center px-1 py-0.5 rounded bg-muted border border-border text-foreground"
                                  placeholder="%"
                                />
                                <input
                                  type="number"
                                  value={assignment.weight || ''}
                                  onChange={(e) => updateAssignment(course.id, assignment.id, { weight: parseFloat(e.target.value) || 0 })}
                                  min="0"
                                  max="100"
                                  className="w-10 sm:w-12 text-[10px] sm:text-xs text-center px-1 py-0.5 rounded bg-muted border border-border text-foreground"
                                  placeholder="wt"
                                />
                                <button
                                  onClick={() => deleteAssignment(course.id, assignment.id)}
                                  className="p-0.5 hover:bg-destructive/10 rounded text-muted-foreground hover:text-destructive"
                                >
                                  <Trash2 className="w-2.5 h-2.5" />
                                </button>
                              </Reorder.Item>
                            ))}
                          </Reorder.Group>
                          <button
                            onClick={() => addAssignment(course.id)}
                            className="flex items-center gap-1 text-[10px] sm:text-xs text-primary hover:text-primary/80 transition-colors ml-1"
                          >
                            <Plus className="w-3 h-3" />
                            Add Assignment
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </Reorder.Item>
          );
        })}
      </Reorder.Group>

      {/* Add Course Button */}
      <Button
        variant="outline"
        size="sm"
        onClick={addCourse}
        className="w-full mt-3 text-xs"
      >
        <Plus className="w-3 h-3 mr-1" />
        Add Course
      </Button>

      {/* Bottom Stats */}
      <div className="mt-3 pt-3 border-t border-border/50">
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground">Total Credits</span>
          <span className="font-semibold text-foreground">
            {courses.reduce((sum, c) => sum + c.credits, 0)}
          </span>
        </div>
      </div>
    </motion.div>
  );
};

export default MiniCalculator;