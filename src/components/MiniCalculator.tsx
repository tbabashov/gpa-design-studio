import { useState, useCallback } from 'react';
import { motion, AnimatePresence, Reorder } from 'framer-motion';
import { 
  BookOpen, 
  GraduationCap, 
  Plus, 
  Trash2, 
  GripVertical,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Assignment {
  id: string;
  name: string;
  grade: number;
  weight: number;
}

interface Course {
  id: string;
  name: string;
  credits: number;
  assignments: Assignment[];
  isCollapsed: boolean;
}

const generateId = () => Math.random().toString(36).substring(2, 9);

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

const MiniCalculator = () => {
  const [courses, setCourses] = useState<Course[]>([
    { 
      id: generateId(), 
      name: 'Mathematics', 
      credits: 4, 
      isCollapsed: true,
      assignments: [
        { id: generateId(), name: 'Midterm', grade: 95, weight: 40 },
        { id: generateId(), name: 'Final', grade: 92, weight: 60 },
      ]
    },
    { 
      id: generateId(), 
      name: 'Physics', 
      credits: 3,
      isCollapsed: true,
      assignments: [
        { id: generateId(), name: 'Lab Report', grade: 88, weight: 30 },
        { id: generateId(), name: 'Exam', grade: 85, weight: 70 },
      ]
    },
  ]);

  const calculateCourseGPA = useCallback((course: Course) => {
    if (course.assignments.length === 0) return { percentage: 0, gpa: 0 };
    
    const totalWeight = course.assignments.reduce((sum, a) => sum + (a.weight || 0), 0);
    if (totalWeight === 0) return { percentage: 0, gpa: 0 };
    
    const weightedSum = course.assignments.reduce((sum, a) => {
      return sum + (a.grade || 0) * (a.weight || 0) / 100;
    }, 0);
    
    const percentage = (weightedSum / totalWeight) * 100;
    return { percentage, gpa: toGPA(percentage) };
  }, []);

  const calculateOverallGPA = useCallback(() => {
    if (courses.length === 0) return 0;
    
    let totalCredits = 0;
    let totalPoints = 0;
    
    courses.forEach(course => {
      const { gpa } = calculateCourseGPA(course);
      totalPoints += gpa * course.credits;
      totalCredits += course.credits;
    });
    
    return totalCredits > 0 ? totalPoints / totalCredits : 0;
  }, [courses, calculateCourseGPA]);

  const addCourse = () => {
    setCourses(prev => [...prev, {
      id: generateId(),
      name: 'New Course',
      credits: 3,
      assignments: [],
      isCollapsed: false,
    }]);
  };

  const updateCourse = (courseId: string, updates: Partial<Course>) => {
    setCourses(prev => prev.map(c => 
      c.id === courseId ? { ...c, ...updates } : c
    ));
  };

  const deleteCourse = (courseId: string) => {
    setCourses(prev => prev.filter(c => c.id !== courseId));
  };

  const addAssignment = (courseId: string) => {
    setCourses(prev => prev.map(c => 
      c.id === courseId 
        ? { ...c, assignments: [...c.assignments, { id: generateId(), name: '', grade: 0, weight: 0 }] }
        : c
    ));
  };

  const updateAssignment = (courseId: string, assignmentId: string, updates: Partial<Assignment>) => {
    setCourses(prev => prev.map(c => 
      c.id === courseId
        ? { ...c, assignments: c.assignments.map(a => a.id === assignmentId ? { ...a, ...updates } : a) }
        : c
    ));
  };

  const deleteAssignment = (courseId: string, assignmentId: string) => {
    setCourses(prev => prev.map(c => 
      c.id === courseId
        ? { ...c, assignments: c.assignments.filter(a => a.id !== assignmentId) }
        : c
    ));
  };

  const reorderAssignments = (courseId: string, newOrder: Assignment[]) => {
    setCourses(prev => prev.map(c => 
      c.id === courseId ? { ...c, assignments: newOrder } : c
    ));
  };

  return (
    <motion.div 
      className="glass-card rounded-2xl p-5 shadow-xl max-h-[500px] overflow-y-auto"
      whileHover={{ y: -3 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
            <GraduationCap className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground text-sm">Quick Preview</h3>
            <p className="text-xs text-muted-foreground">Try it out!</p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-[10px] text-muted-foreground uppercase tracking-wider">GPA</div>
          <div className="text-xl font-display font-bold gradient-text">
            {calculateOverallGPA().toFixed(2)}
          </div>
        </div>
      </div>

      {/* Course List */}
      <Reorder.Group
        axis="y"
        values={courses}
        onReorder={setCourses}
        className="space-y-2"
      >
        {courses.map((course) => {
          const { percentage, gpa } = calculateCourseGPA(course);
          
          return (
            <Reorder.Item
              key={course.id}
              value={course}
              className="rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors cursor-grab active:cursor-grabbing"
            >
              <div className="p-3">
                {/* Course Header */}
                <div className="flex items-center gap-2">
                  <GripVertical className="w-3 h-3 text-muted-foreground flex-shrink-0" />
                  <div className="w-6 h-6 rounded-lg bg-primary/10 flex items-center justify-center">
                    <BookOpen className="w-3 h-3 text-primary" />
                  </div>
                  <input
                    type="text"
                    value={course.name}
                    onChange={(e) => updateCourse(course.id, { name: e.target.value })}
                    className="flex-1 bg-transparent text-sm font-medium text-foreground focus:outline-none min-w-0"
                    placeholder="Course name"
                  />
                  <input
                    type="number"
                    value={course.credits}
                    onChange={(e) => updateCourse(course.id, { credits: parseInt(e.target.value) || 1 })}
                    min="1"
                    max="12"
                    className="w-12 text-xs text-center px-1 py-0.5 rounded bg-background/50 border border-border/50 text-foreground"
                    title="Credits"
                  />
                  <div className="text-right min-w-[50px]">
                    <div className="text-xs font-semibold text-foreground">{percentage.toFixed(0)}%</div>
                    <div className="text-[10px] text-secondary">{gpa.toFixed(2)}</div>
                  </div>
                  <button
                    onClick={() => updateCourse(course.id, { isCollapsed: !course.isCollapsed })}
                    className="p-1 hover:bg-muted rounded"
                  >
                    {course.isCollapsed ? (
                      <ChevronDown className="w-3 h-3 text-muted-foreground" />
                    ) : (
                      <ChevronUp className="w-3 h-3 text-muted-foreground" />
                    )}
                  </button>
                  <button
                    onClick={() => deleteCourse(course.id)}
                    className="p-1 hover:bg-destructive/10 rounded text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>

                {/* Assignments */}
                <AnimatePresence>
                  {!course.isCollapsed && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="mt-2 ml-5 space-y-1">
                        <Reorder.Group
                          axis="y"
                          values={course.assignments}
                          onReorder={(newOrder) => reorderAssignments(course.id, newOrder)}
                          className="space-y-1"
                        >
                          {course.assignments.map(assignment => (
                            <Reorder.Item
                              key={assignment.id}
                              value={assignment}
                              className="flex items-center gap-2 p-2 rounded-lg bg-background/30 cursor-grab active:cursor-grabbing"
                            >
                              <GripVertical className="w-2.5 h-2.5 text-muted-foreground" />
                              <input
                                type="text"
                                value={assignment.name}
                                onChange={(e) => updateAssignment(course.id, assignment.id, { name: e.target.value })}
                                className="flex-1 bg-transparent text-xs text-foreground focus:outline-none min-w-0"
                                placeholder="Assignment"
                              />
                              <input
                                type="number"
                                value={assignment.grade || ''}
                                onChange={(e) => updateAssignment(course.id, assignment.id, { grade: parseFloat(e.target.value) || 0 })}
                                min="0"
                                max="100"
                                className="w-12 text-xs text-center px-1 py-0.5 rounded bg-background/50 border border-border/50"
                                placeholder="%"
                              />
                              <input
                                type="number"
                                value={assignment.weight || ''}
                                onChange={(e) => updateAssignment(course.id, assignment.id, { weight: parseFloat(e.target.value) || 0 })}
                                min="0"
                                max="100"
                                className="w-12 text-xs text-center px-1 py-0.5 rounded bg-background/50 border border-border/50"
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
                          className="flex items-center gap-1 text-xs text-primary hover:text-primary/80 transition-colors ml-1"
                        >
                          <Plus className="w-3 h-3" />
                          Add Assignment
                        </button>
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
