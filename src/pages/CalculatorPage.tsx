import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence, Reorder } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { 
  Plus, 
  Trash2, 
  ChevronDown,
  TrendingUp,
  RotateCcw,
  Save
} from 'lucide-react';
import { toast } from 'sonner';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

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

  const [newProfileName, setNewProfileName] = useState('');

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

  const getTotalCredits = () => {
    if (!activeProfile) return 0;
    return activeProfile.courses.reduce((sum, c) => sum + c.credits, 0);
  };

  const createProfile = () => {
    if (!newProfileName.trim()) return;
    
    const newProfile: Profile = {
      id: generateId(),
      name: newProfileName.trim(),
      courses: [],
    };
    
    setState(prev => ({
      profiles: [...prev.profiles, newProfile],
      activeProfileId: newProfile.id,
    }));
    setNewProfileName('');
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

  const resetProfile = () => {
    if (!activeProfile) return;
    if (!confirm('Reset all courses in this profile?')) return;
    
    setState(prev => ({
      ...prev,
      profiles: prev.profiles.map(p =>
        p.id === prev.activeProfileId
          ? { ...p, courses: [] }
          : p
      ),
    }));
    toast.success('Profile reset');
  };

  const addCourse = () => {
    if (!activeProfile) {
      toast.error('Create a profile first');
      return;
    }
    
    const newCourse: Course = {
      id: generateId(),
      name: '',
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

  const handleNavigate = (section: string) => {
    if (section === 'home') {
      onNavigateHome();
    } else if (section === 'calculator') {
      // Already on calculator
    } else {
      onNavigateHome();
      setTimeout(() => {
        window.dispatchEvent(new CustomEvent('navigate', { detail: section }));
      }, 100);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar onNavigate={handleNavigate} />
      
      <main className="flex-1 pt-24 pb-16">
        <div className="container mx-auto px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">
              <span className="text-foreground">Advanced </span>
              <span className="gradient-text">GPA Calculator</span>
            </h1>
            <p className="text-muted-foreground text-lg">
              Track multiple profiles, add assignments, and watch your GPA update in real-time.
            </p>
          </div>

          {/* GPA Summary Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl p-6 mb-10"
            style={{
              background: 'linear-gradient(135deg, hsl(var(--muted)) 0%, hsl(var(--card)) 50%, hsl(260 30% 15%) 100%)'
            }}
          >
            <div className="flex flex-wrap items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-xl bg-primary/20 flex items-center justify-center">
                  <TrendingUp className="w-7 h-7 text-primary" />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wider text-muted-foreground font-semibold mb-1">Current GPA</p>
                  <div className="flex items-baseline gap-3">
                    <span className="text-4xl font-display font-bold gradient-text">
                      {calculateOverallGPA().toFixed(2)}
                    </span>
                    <span className="text-muted-foreground text-sm">
                      {activeProfile?.courses.length || 0} courses {getTotalCredits()} credits
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={resetProfile}
                  disabled={!activeProfile}
                  className="border-border/50"
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Reset
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="border-primary/50 text-primary hover:bg-primary/10"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Saved
                </Button>
              </div>
            </div>
          </motion.div>

          {/* Profiles Section */}
          <div className="mb-8">
            <h2 className="text-xs uppercase tracking-wider text-muted-foreground font-semibold mb-4">
              Profiles
            </h2>
            <div className="flex flex-wrap gap-2 mb-4">
              {state.profiles.map(profile => (
                <motion.button
                  key={profile.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setState(prev => ({ ...prev, activeProfileId: profile.id }))}
                  className={`px-4 py-2 rounded-full flex items-center gap-2 transition-all text-sm font-medium ${
                    profile.id === state.activeProfileId
                      ? 'bg-gradient-to-r from-primary to-secondary text-primary-foreground'
                      : 'bg-muted/50 text-foreground hover:bg-muted border border-border/50'
                  }`}
                >
                  <span>{profile.name}</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteProfile(profile.id);
                    }}
                    className="opacity-60 hover:opacity-100 transition-opacity ml-1"
                  >
                    ×
                  </button>
                </motion.button>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={newProfileName}
                onChange={(e) => setNewProfileName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && createProfile()}
                placeholder="New profile name..."
                className="flex-1 px-4 py-3 rounded-xl bg-muted/30 border border-border/50 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 transition-colors"
              />
              <Button 
                variant="default" 
                size="icon" 
                onClick={createProfile}
                className="h-12 w-12 rounded-xl bg-primary hover:bg-primary/90"
              >
                <Plus className="w-5 h-5" />
              </Button>
            </div>
          </div>

          {/* Courses */}
          {activeProfile && (
            <div className="space-y-6">
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
                      className="rounded-2xl border border-border/50 overflow-hidden cursor-grab active:cursor-grabbing"
                    >
                      <motion.div layout>
                        {/* Course Header */}
                        <div className="p-4 border-b border-border/30">
                          <div className="flex items-center gap-3 mb-3">
                            <button
                              onClick={() => updateCourse(course.id, { isCollapsed: !course.isCollapsed })}
                              className="text-muted-foreground hover:text-foreground transition-colors"
                            >
                              <ChevronDown className={`w-5 h-5 transition-transform ${course.isCollapsed ? '-rotate-90' : ''}`} />
                            </button>
                            <span className="text-xs text-muted-foreground uppercase tracking-wider">Course Name</span>
                          </div>
                          <input
                            type="text"
                            value={course.name}
                            onChange={(e) => updateCourse(course.id, { name: e.target.value })}
                            className="w-full px-4 py-3 rounded-xl text-lg font-medium text-foreground focus:outline-none"
                            style={{
                              background: 'linear-gradient(90deg, hsl(var(--primary) / 0.2) 0%, hsl(180 60% 30% / 0.3) 100%)'
                            }}
                            placeholder="Enter course name"
                          />
                        </div>

                        {/* Course Content */}
                        <AnimatePresence>
                          {!course.isCollapsed && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.3 }}
                              className="overflow-hidden"
                            >
                              <div className="p-4">
                                {/* Credits Row */}
                                <div className="flex items-center gap-4 mb-6">
                                  <div>
                                    <span className="text-xs text-muted-foreground uppercase tracking-wider block mb-2">Credits</span>
                                    <input
                                      type="number"
                                      value={course.credits}
                                      onChange={(e) => updateCourse(course.id, { credits: parseInt(e.target.value) || 1 })}
                                      min="1"
                                      max="12"
                                      className="w-20 px-4 py-2 rounded-lg bg-muted/50 border border-border/50 text-foreground text-center focus:outline-none focus:border-primary/50"
                                    />
                                  </div>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => deleteCourse(course.id)}
                                    className="text-destructive hover:text-destructive hover:bg-destructive/10 mt-6"
                                  >
                                    <Trash2 className="w-5 h-5" />
                                  </Button>
                                </div>

                                {/* Assignments Section */}
                                <div className="mb-4">
                                  <h3 className="text-xs uppercase tracking-wider text-muted-foreground font-semibold mb-4">
                                    Assignments
                                  </h3>
                                  
                                  {course.assignments.map(assignment => (
                                    <div 
                                      key={assignment.id}
                                      className="flex flex-wrap items-center gap-3 p-4 rounded-xl border border-border/30 mb-3"
                                    >
                                      <input
                                        type="text"
                                        value={assignment.name}
                                        onChange={(e) => updateAssignment(course.id, assignment.id, { name: e.target.value })}
                                        className="flex-1 min-w-[200px] px-4 py-2 rounded-lg bg-transparent border border-border/50 text-foreground focus:outline-none focus:border-primary/50"
                                        placeholder="Assignment name"
                                      />
                                      <input
                                        type="number"
                                        value={assignment.grade || ''}
                                        onChange={(e) => updateAssignment(course.id, assignment.id, { grade: parseFloat(e.target.value) || 0 })}
                                        min="0"
                                        max="100"
                                        className="w-24 px-4 py-2 rounded-lg bg-transparent border border-border/50 text-foreground text-center focus:outline-none focus:border-primary/50"
                                        placeholder="Score"
                                      />
                                      <input
                                        type="number"
                                        value={assignment.weight || ''}
                                        onChange={(e) => updateAssignment(course.id, assignment.id, { weight: parseFloat(e.target.value) || 0 })}
                                        min="0"
                                        max="100"
                                        className="w-24 px-4 py-2 rounded-lg bg-transparent border border-border/50 text-foreground text-center focus:outline-none focus:border-primary/50"
                                        placeholder="Weight"
                                      />
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => deleteAssignment(course.id, assignment.id)}
                                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                                      >
                                        <Trash2 className="w-4 h-4" />
                                      </Button>
                                    </div>
                                  ))}

                                  <button
                                    onClick={() => addAssignment(course.id)}
                                    className="w-full py-3 rounded-xl border-2 border-dashed border-border/50 text-muted-foreground hover:border-primary/50 hover:text-foreground transition-colors flex items-center justify-center gap-2"
                                  >
                                    <Plus className="w-4 h-4" />
                                    Add Assignment
                                  </button>
                                </div>

                                {/* Course Summary */}
                                <div className="pt-4 border-t border-border/30 space-y-2">
                                  <div className="flex items-center justify-between text-sm">
                                    <span className="text-muted-foreground">Course Score:</span>
                                    <span className={`font-medium ${isNaN(percentage) ? 'text-destructive' : 'text-primary'}`}>
                                      {isNaN(percentage) ? 'NaN%' : `${percentage.toFixed(1)}%`}
                                    </span>
                                  </div>
                                  <div className="flex items-center justify-between text-sm">
                                    <span className="text-muted-foreground">Course GPA:</span>
                                    <span className="font-medium text-primary">{gpa.toFixed(1)}</span>
                                  </div>
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    </Reorder.Item>
                  );
                })}
              </Reorder.Group>

              {/* Add Course Button */}
              <button
                onClick={addCourse}
                className="w-full py-4 rounded-2xl border-2 border-dashed border-border/50 text-muted-foreground hover:border-primary/50 hover:text-foreground transition-colors flex items-center justify-center gap-2"
              >
                <Plus className="w-5 h-5" />
                Add Course
              </button>
            </div>
          )}

          {/* Empty State */}
          {!activeProfile && state.profiles.length === 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-16 rounded-2xl border border-border/50"
            >
              <TrendingUp className="w-16 h-16 mx-auto text-muted-foreground/50 mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-2">Welcome to EasyGPA!</h3>
              <p className="text-muted-foreground mb-6">Create a profile above to start tracking your grades</p>
            </motion.div>
          )}
        </div>
      </main>

      <Footer onNavigate={handleNavigate} />
    </div>
  );
};

export default CalculatorPage;
