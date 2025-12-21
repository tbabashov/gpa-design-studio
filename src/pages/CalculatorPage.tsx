import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence, Reorder } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { 
  Plus, 
  Trash2, 
  GripVertical, 
  ChevronDown, 
  ChevronUp,
  Home,
  BookOpen,
  User,
  Info
} from 'lucide-react';
import { toast } from 'sonner';

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

interface Profile {
  id: string;
  name: string;
  courses: Course[];
}

interface State {
  profiles: Profile[];
  activeProfileId: string | null;
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

interface CalculatorPageProps {
  onNavigateHome: () => void;
}

const CalculatorPage = ({ onNavigateHome }: CalculatorPageProps) => {
  const [state, setState] = useState<State>(() => {
    const saved = localStorage.getItem('easygpa_state');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return { profiles: [], activeProfileId: null };
      }
    }
    return { profiles: [], activeProfileId: null };
  });

  useEffect(() => {
    localStorage.setItem('easygpa_state', JSON.stringify(state));
  }, [state]);

  const activeProfile = state.profiles.find(p => p.id === state.activeProfileId);

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
    if (!activeProfile || activeProfile.courses.length === 0) return 0;
    
    let totalCredits = 0;
    let totalPoints = 0;
    
    activeProfile.courses.forEach(course => {
      const { gpa } = calculateCourseGPA(course);
      totalPoints += gpa * course.credits;
      totalCredits += course.credits;
    });
    
    return totalCredits > 0 ? totalPoints / totalCredits : 0;
  }, [activeProfile, calculateCourseGPA]);

  const createProfile = () => {
    const name = prompt('Enter profile name:');
    if (!name) return;
    
    const newProfile: Profile = {
      id: generateId(),
      name,
      courses: [],
    };
    
    setState(prev => ({
      profiles: [...prev.profiles, newProfile],
      activeProfileId: newProfile.id,
    }));
    toast.success('Profile created!');
  };

  const deleteProfile = (id: string) => {
    if (!confirm('Delete this profile?')) return;
    
    setState(prev => ({
      profiles: prev.profiles.filter(p => p.id !== id),
      activeProfileId: prev.activeProfileId === id ? null : prev.activeProfileId,
    }));
    toast.success('Profile deleted');
  };

  const addCourse = () => {
    if (!activeProfile) {
      toast.error('Create a profile first');
      return;
    }
    
    const newCourse: Course = {
      id: generateId(),
      name: 'New Course',
      credits: 3,
      assignments: [],
      isCollapsed: false,
    };
    
    setState(prev => ({
      ...prev,
      profiles: prev.profiles.map(p =>
        p.id === prev.activeProfileId
          ? { ...p, courses: [...p.courses, newCourse] }
          : p
      ),
    }));
  };

  const updateCourse = (courseId: string, updates: Partial<Course>) => {
    setState(prev => ({
      ...prev,
      profiles: prev.profiles.map(p =>
        p.id === prev.activeProfileId
          ? {
              ...p,
              courses: p.courses.map(c =>
                c.id === courseId ? { ...c, ...updates } : c
              ),
            }
          : p
      ),
    }));
  };

  const deleteCourse = (courseId: string) => {
    if (!confirm('Delete this course?')) return;
    
    setState(prev => ({
      ...prev,
      profiles: prev.profiles.map(p =>
        p.id === prev.activeProfileId
          ? { ...p, courses: p.courses.filter(c => c.id !== courseId) }
          : p
      ),
    }));
    toast.success('Course deleted');
  };

  const addAssignment = (courseId: string) => {
    const newAssignment: Assignment = {
      id: generateId(),
      name: '',
      grade: 0,
      weight: 0,
    };
    
    setState(prev => ({
      ...prev,
      profiles: prev.profiles.map(p =>
        p.id === prev.activeProfileId
          ? {
              ...p,
              courses: p.courses.map(c =>
                c.id === courseId
                  ? { ...c, assignments: [...c.assignments, newAssignment] }
                  : c
              ),
            }
          : p
      ),
    }));
  };

  const updateAssignment = (courseId: string, assignmentId: string, updates: Partial<Assignment>) => {
    setState(prev => ({
      ...prev,
      profiles: prev.profiles.map(p =>
        p.id === prev.activeProfileId
          ? {
              ...p,
              courses: p.courses.map(c =>
                c.id === courseId
                  ? {
                      ...c,
                      assignments: c.assignments.map(a =>
                        a.id === assignmentId ? { ...a, ...updates } : a
                      ),
                    }
                  : c
              ),
            }
          : p
      ),
    }));
  };

  const deleteAssignment = (courseId: string, assignmentId: string) => {
    setState(prev => ({
      ...prev,
      profiles: prev.profiles.map(p =>
        p.id === prev.activeProfileId
          ? {
              ...p,
              courses: p.courses.map(c =>
                c.id === courseId
                  ? { ...c, assignments: c.assignments.filter(a => a.id !== assignmentId) }
                  : c
              ),
            }
          : p
      ),
    }));
  };

  const reorderCourses = (newOrder: Course[]) => {
    setState(prev => ({
      ...prev,
      profiles: prev.profiles.map(p =>
        p.id === prev.activeProfileId
          ? { ...p, courses: newOrder }
          : p
      ),
    }));
  };

  const reorderAssignments = (courseId: string, newOrder: Assignment[]) => {
    setState(prev => ({
      ...prev,
      profiles: prev.profiles.map(p =>
        p.id === prev.activeProfileId
          ? {
              ...p,
              courses: p.courses.map(c =>
                c.id === courseId ? { ...c, assignments: newOrder } : c
              ),
            }
          : p
      ),
    }));
  };

  return (
    <div className="min-h-screen pb-24">
      {/* Header */}
      <header className="sticky top-0 z-50 glass border-b border-border/50">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-display font-bold gradient-text">EasyGPA Calculator</h1>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="nav" onClick={onNavigateHome}>
              <Home className="w-4 h-4 mr-2" />
              Home
            </Button>
            <Button variant="hero" size="sm" onClick={createProfile}>
              <Plus className="w-4 h-4" />
              New Profile
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        {/* Profiles */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <User className="w-5 h-5 text-primary" />
            Profiles
          </h2>
          <div className="flex flex-wrap gap-2">
            {state.profiles.length === 0 ? (
              <p className="text-muted-foreground">No profiles yet. Create one to get started!</p>
            ) : (
              state.profiles.map(profile => (
                <motion.button
                  key={profile.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setState(prev => ({ ...prev, activeProfileId: profile.id }))}
                  className={`px-4 py-2 rounded-full flex items-center gap-2 transition-all ${
                    profile.id === state.activeProfileId
                      ? 'bg-gradient-to-r from-primary to-secondary text-primary-foreground font-semibold'
                      : 'bg-muted/50 text-foreground hover:bg-muted'
                  }`}
                >
                  <span>{profile.name}</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteProfile(profile.id);
                    }}
                    className="opacity-60 hover:opacity-100 transition-opacity"
                  >
                    ×
                  </button>
                </motion.button>
              ))
            )}
          </div>
        </div>

        {/* Courses */}
        {activeProfile && (
          <div className="space-y-6">
            {activeProfile.courses.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-16 glass-card rounded-2xl"
              >
                <BookOpen className="w-16 h-16 mx-auto text-muted-foreground/50 mb-4" />
                <h3 className="text-xl font-semibold text-foreground mb-2">No courses yet</h3>
                <p className="text-muted-foreground mb-6">Add your first course to start tracking your GPA</p>
                <Button variant="hero" onClick={addCourse}>
                  <Plus className="w-4 h-4" />
                  Add Course
                </Button>
              </motion.div>
            ) : (
              <Reorder.Group
                axis="y"
                values={activeProfile.courses}
                onReorder={reorderCourses}
                className="space-y-6"
              >
                {activeProfile.courses.map(course => {
                  const { percentage, gpa } = calculateCourseGPA(course);
                  
                  return (
                    <Reorder.Item
                      key={course.id}
                      value={course}
                      className="glass-card rounded-2xl p-6 cursor-grab active:cursor-grabbing"
                    >
                      <motion.div layout>
                        {/* Course Header */}
                        <div className="flex flex-wrap items-center gap-4 mb-4">
                          <GripVertical className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                          
                          <input
                            type="text"
                            value={course.name}
                            onChange={(e) => updateCourse(course.id, { name: e.target.value })}
                            className="flex-1 min-w-[200px] px-4 py-3 rounded-xl bg-gradient-to-br from-primary/10 to-secondary/10 border border-primary/30 text-lg font-semibold text-foreground focus:outline-none focus:border-primary/50"
                            placeholder="Course name"
                          />
                          
                          <input
                            type="number"
                            value={course.credits}
                            onChange={(e) => updateCourse(course.id, { credits: parseInt(e.target.value) || 1 })}
                            min="1"
                            max="12"
                            className="w-24 px-4 py-3 rounded-xl bg-muted/50 border border-border text-foreground focus:outline-none focus:border-primary/50"
                            placeholder="Credits"
                          />
                          
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => addAssignment(course.id)}
                            >
                              <Plus className="w-4 h-4" />
                              Assignment
                            </Button>
                            
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => updateCourse(course.id, { isCollapsed: !course.isCollapsed })}
                            >
                              {course.isCollapsed ? (
                                <ChevronDown className="w-4 h-4" />
                              ) : (
                                <ChevronUp className="w-4 h-4" />
                              )}
                            </Button>
                            
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => deleteCourse(course.id)}
                              className="text-destructive hover:text-destructive hover:bg-destructive/10"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>

                        {/* Assignments */}
                        <AnimatePresence>
                          {!course.isCollapsed && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.3 }}
                              className="overflow-hidden"
                            >
                              {course.assignments.length > 0 && (
                                <Reorder.Group
                                  axis="y"
                                  values={course.assignments}
                                  onReorder={(newOrder) => reorderAssignments(course.id, newOrder)}
                                  className="space-y-3 mt-4"
                                >
                                  {course.assignments.map(assignment => (
                                    <Reorder.Item
                                      key={assignment.id}
                                      value={assignment}
                                      className="flex flex-wrap items-center gap-3 p-4 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors cursor-grab active:cursor-grabbing"
                                    >
                                      <GripVertical className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                                      
                                      <input
                                        type="text"
                                        value={assignment.name}
                                        onChange={(e) => updateAssignment(course.id, assignment.id, { name: e.target.value })}
                                        className="flex-1 min-w-[150px] px-3 py-2 rounded-lg bg-background/50 border border-border/50 text-foreground focus:outline-none focus:border-primary/50"
                                        placeholder="Assignment name"
                                      />
                                      
                                      <input
                                        type="number"
                                        value={assignment.grade || ''}
                                        onChange={(e) => updateAssignment(course.id, assignment.id, { grade: parseFloat(e.target.value) || 0 })}
                                        min="0"
                                        max="100"
                                        className="w-24 px-3 py-2 rounded-lg bg-background/50 border border-border/50 text-foreground focus:outline-none focus:border-primary/50"
                                        placeholder="Grade %"
                                      />
                                      
                                      <div className="relative flex items-center">
                                        <input
                                          type="number"
                                          value={assignment.weight || ''}
                                          onChange={(e) => updateAssignment(course.id, assignment.id, { weight: parseFloat(e.target.value) || 0 })}
                                          min="0"
                                          max="100"
                                          className="w-24 px-3 py-2 pr-8 rounded-lg bg-background/50 border border-border/50 text-foreground focus:outline-none focus:border-primary/50"
                                          placeholder="Weight"
                                        />
                                        <div 
                                          className="absolute right-2 w-4 h-4 rounded-full border border-muted-foreground/50 flex items-center justify-center text-[10px] text-muted-foreground cursor-help"
                                          title="Percentage of overall course grade"
                                        >
                                          <Info className="w-3 h-3" />
                                        </div>
                                      </div>
                                      
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => deleteAssignment(course.id, assignment.id)}
                                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                                      >
                                        <Trash2 className="w-4 h-4" />
                                      </Button>
                                    </Reorder.Item>
                                  ))}
                                </Reorder.Group>
                              )}
                            </motion.div>
                          )}
                        </AnimatePresence>

                        {/* Course Footer */}
                        <div className="mt-4 pt-4 border-t border-border/50 flex items-center justify-between text-sm">
                          <div className="flex items-center gap-6">
                            <div>
                              <span className="text-muted-foreground">Course GPA: </span>
                              <span className="font-semibold text-secondary">{gpa.toFixed(2)}</span>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Percentage: </span>
                              <span className="font-semibold text-secondary">{percentage.toFixed(1)}%</span>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    </Reorder.Item>
                  );
                })}
              </Reorder.Group>
            )}

            {activeProfile.courses.length > 0 && (
              <Button variant="outline" onClick={addCourse} className="w-full">
                <Plus className="w-4 h-4" />
                Add Course
              </Button>
            )}
          </div>
        )}

        {!activeProfile && state.profiles.length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-16 glass-card rounded-2xl"
          >
            <User className="w-16 h-16 mx-auto text-muted-foreground/50 mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2">Welcome to EasyGPA!</h3>
            <p className="text-muted-foreground mb-6">Create a profile to start tracking your grades</p>
            <Button variant="hero" onClick={createProfile}>
              <Plus className="w-4 h-4" />
              Create Profile
            </Button>
          </motion.div>
        )}
      </main>

      {/* GPA Summary Bar */}
      <div className="fixed bottom-0 left-0 right-0 glass border-t border-border/50 z-40">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="text-sm text-muted-foreground uppercase tracking-wider font-semibold">
            Overall GPA
          </div>
          <div className="text-3xl font-display font-bold gradient-text">
            {calculateOverallGPA().toFixed(2)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalculatorPage;
