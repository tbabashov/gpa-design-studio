import { useState } from 'react';
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
import { useCalculatorState, Course } from '@/hooks/useCalculatorState';

interface CalculatorPageProps {
  onNavigateHome: () => void;
}

const CalculatorPage = ({ onNavigateHome }: CalculatorPageProps) => {
  const {
    state,
    activeProfile,
    calculateCourseGPA,
    calculateOverallGPA,
    getTotalCredits,
    createProfile,
    deleteProfile,
    setActiveProfile,
    resetProfile,
    addCourse,
    updateCourse,
    deleteCourse,
    addAssignment,
    updateAssignment,
    deleteAssignment,
    reorderCourses,
  } = useCalculatorState();

  const [newProfileName, setNewProfileName] = useState('');

  const handleCreateProfile = () => {
    if (!newProfileName.trim()) return;
    createProfile(newProfileName);
    setNewProfileName('');
    toast.success('Profile created!');
  };

  const handleDeleteProfile = (id: string) => {
    if (!confirm('Delete this profile?')) return;
    deleteProfile(id);
    toast.success('Profile deleted');
  };

  const handleResetProfile = () => {
    if (!activeProfile) return;
    if (!confirm('Reset all courses in this profile?')) return;
    resetProfile();
    toast.success('Profile reset');
  };

  const handleDeleteCourse = (courseId: string) => {
    deleteCourse(courseId);
    toast.success('Course deleted');
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
      
      <main className="flex-1 pt-20 sm:pt-24 pb-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-8 sm:mb-12">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold mb-4">
              <span className="text-foreground">Advanced </span>
              <span className="gradient-text">GPA Calculator</span>
            </h1>
            <p className="text-muted-foreground text-base sm:text-lg px-4">
              Track multiple profiles, add assignments, and watch your GPA update in real-time.
            </p>
          </div>

          {/* GPA Summary Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl p-4 sm:p-6 mb-8 sm:mb-10"
            style={{
              background: 'linear-gradient(135deg, hsl(var(--muted)) 0%, hsl(var(--card)) 50%, hsl(260 30% 15%) 100%)'
            }}
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-primary/20 flex items-center justify-center flex-shrink-0">
                  <TrendingUp className="w-6 h-6 sm:w-7 sm:h-7 text-primary" />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wider text-muted-foreground font-semibold mb-1">Current GPA</p>
                  <div className="flex flex-wrap items-baseline gap-2 sm:gap-3">
                    <span className="text-3xl sm:text-4xl font-display font-bold gradient-text">
                      {calculateOverallGPA().toFixed(2)}
                    </span>
                    <span className="text-muted-foreground text-xs sm:text-sm">
                      {activeProfile?.courses.length || 0} courses {getTotalCredits()} credits
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 sm:gap-3">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleResetProfile}
                  disabled={!activeProfile}
                  className="border-border/50 text-xs sm:text-sm"
                >
                  <RotateCcw className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                  Reset
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="border-primary/50 text-primary hover:bg-primary/10 text-xs sm:text-sm"
                >
                  <Save className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                  Saved
                </Button>
              </div>
            </div>
          </motion.div>

          {/* Profiles Section */}
          <div className="mb-6 sm:mb-8">
            <h2 className="text-xs uppercase tracking-wider text-muted-foreground font-semibold mb-3 sm:mb-4">
              Profiles
            </h2>
            <div className="flex flex-wrap gap-2 mb-4">
              {state.profiles.map(profile => (
                <motion.button
                  key={profile.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setActiveProfile(profile.id)}
                  className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full flex items-center gap-2 transition-all text-xs sm:text-sm font-medium ${
                    profile.id === state.activeProfileId
                      ? 'bg-gradient-to-r from-primary to-secondary text-primary-foreground'
                      : 'bg-muted/50 text-foreground hover:bg-muted border border-border/50'
                  }`}
                >
                  <span>{profile.name}</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteProfile(profile.id);
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
                onKeyDown={(e) => e.key === 'Enter' && handleCreateProfile()}
                placeholder="New profile name..."
                className="flex-1 px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl bg-muted/30 border border-border/50 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 transition-colors text-sm sm:text-base"
              />
              <Button 
                variant="default" 
                size="icon" 
                onClick={handleCreateProfile}
                className="h-10 w-10 sm:h-12 sm:w-12 rounded-xl bg-primary hover:bg-primary/90"
              >
                <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
              </Button>
            </div>
          </div>

          {/* Courses */}
          {activeProfile && (
            <div className="space-y-4 sm:space-y-6">
              <Reorder.Group
                axis="y"
                values={activeProfile.courses}
                onReorder={reorderCourses}
                className="space-y-4 sm:space-y-6"
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
                        <div className="p-3 sm:p-4 border-b border-border/30">
                          <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                            <button
                              onClick={() => updateCourse(course.id, { isCollapsed: !course.isCollapsed })}
                              className="text-muted-foreground hover:text-foreground transition-colors"
                            >
                              <ChevronDown className={`w-4 h-4 sm:w-5 sm:h-5 transition-transform ${course.isCollapsed ? '-rotate-90' : ''}`} />
                            </button>
                            <span className="text-[10px] sm:text-xs text-muted-foreground uppercase tracking-wider">Course Name</span>
                          </div>
                          <input
                            type="text"
                            value={course.name}
                            onChange={(e) => updateCourse(course.id, { name: e.target.value })}
                            className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl text-base sm:text-lg font-medium text-foreground focus:outline-none"
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
                              <div className="p-3 sm:p-4">
                                {/* Credits Row */}
                                <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
                                  <div>
                                    <span className="text-[10px] sm:text-xs text-muted-foreground uppercase tracking-wider block mb-2">Credits</span>
                                    <input
                                      type="number"
                                      value={course.credits}
                                      onChange={(e) => updateCourse(course.id, { credits: parseInt(e.target.value) || 1 })}
                                      min="1"
                                      max="12"
                                      className="w-16 sm:w-20 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg bg-muted/50 border border-border/50 text-foreground text-center focus:outline-none focus:border-primary/50 text-sm sm:text-base"
                                    />
                                  </div>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => handleDeleteCourse(course.id)}
                                    className="text-destructive hover:text-destructive hover:bg-destructive/10 mt-5 sm:mt-6"
                                  >
                                    <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
                                  </Button>
                                </div>

                                {/* Assignments Section */}
                                <div className="mb-4">
                                  <h3 className="text-[10px] sm:text-xs uppercase tracking-wider text-muted-foreground font-semibold mb-3 sm:mb-4">
                                    Assignments
                                  </h3>
                                  
                                  {course.assignments.map(assignment => (
                                    <div 
                                      key={assignment.id}
                                      className="flex flex-wrap items-center gap-2 sm:gap-3 p-3 sm:p-4 rounded-xl border border-border/30 mb-3"
                                    >
                                      <input
                                        type="text"
                                        value={assignment.name}
                                        onChange={(e) => updateAssignment(course.id, assignment.id, { name: e.target.value })}
                                        className="flex-1 min-w-[120px] sm:min-w-[200px] px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg bg-transparent border border-border/50 text-foreground focus:outline-none focus:border-primary/50 text-sm sm:text-base"
                                        placeholder="Assignment name"
                                      />
                                      <input
                                        type="number"
                                        value={assignment.grade ?? ''}
                                        onChange={(e) => updateAssignment(course.id, assignment.id, { grade: e.target.value === '' ? 0 : parseFloat(e.target.value) })}
                                        min="0"
                                        max="100"
                                        className="w-16 sm:w-24 px-2 sm:px-4 py-1.5 sm:py-2 rounded-lg bg-transparent border border-border/50 text-foreground text-center focus:outline-none focus:border-primary/50 text-sm sm:text-base"
                                        placeholder="Score"
                                      />
                                      <input
                                        type="number"
                                        value={assignment.weight || ''}
                                        onChange={(e) => updateAssignment(course.id, assignment.id, { weight: parseFloat(e.target.value) || 0 })}
                                        min="0"
                                        max="100"
                                        className="w-16 sm:w-24 px-2 sm:px-4 py-1.5 sm:py-2 rounded-lg bg-transparent border border-border/50 text-foreground text-center focus:outline-none focus:border-primary/50 text-sm sm:text-base"
                                        placeholder="Weight"
                                      />
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => deleteAssignment(course.id, assignment.id)}
                                        className="text-destructive hover:text-destructive hover:bg-destructive/10 h-8 w-8 sm:h-10 sm:w-10"
                                      >
                                        <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                                      </Button>
                                    </div>
                                  ))}

                                  <button
                                    onClick={() => addAssignment(course.id)}
                                    className="w-full py-2.5 sm:py-3 rounded-xl border-2 border-dashed border-border/50 text-muted-foreground hover:border-primary/50 hover:text-foreground transition-colors flex items-center justify-center gap-2 text-sm sm:text-base"
                                  >
                                    <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
                                    Add Assignment
                                  </button>
                                </div>

                                {/* Course Summary */}
                                <div className="pt-3 sm:pt-4 border-t border-border/30 space-y-2">
                                  <div className="flex items-center justify-between text-xs sm:text-sm">
                                    <span className="text-muted-foreground">Course Score:</span>
                                    <span className={`font-medium ${isNaN(percentage) ? 'text-destructive' : 'text-primary'}`}>
                                      {isNaN(percentage) ? 'NaN%' : `${percentage.toFixed(1)}%`}
                                    </span>
                                  </div>
                                  <div className="flex items-center justify-between text-xs sm:text-sm">
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
                className="w-full py-3 sm:py-4 rounded-2xl border-2 border-dashed border-border/50 text-muted-foreground hover:border-primary/50 hover:text-foreground transition-colors flex items-center justify-center gap-2 text-sm sm:text-base"
              >
                <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
                Add Course
              </button>
            </div>
          )}

          {/* Empty State */}
          {!activeProfile && state.profiles.length === 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-12 sm:py-16 rounded-2xl border border-border/50"
            >
              <TrendingUp className="w-12 h-12 sm:w-16 sm:h-16 mx-auto text-muted-foreground/50 mb-4" />
              <h3 className="text-lg sm:text-xl font-semibold text-foreground mb-2">Welcome to EasyGPA!</h3>
              <p className="text-muted-foreground mb-6 text-sm sm:text-base px-4">Create a profile above to start tracking your grades</p>
            </motion.div>
          )}
        </div>
      </main>

      <Footer onNavigate={handleNavigate} />
    </div>
  );
};

export default CalculatorPage;
