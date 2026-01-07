import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { motion, AnimatePresence, Reorder } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { 
  Plus, 
  Trash2, 
  ChevronDown,
  TrendingUp,
  RotateCcw,
  Save,
  Loader2,
  GripVertical,
  ListChecks,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Pencil,
  Check
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from 'sonner';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import GPAGoalTracker from '@/components/GPAGoalTracker';
import WhatIfCalculator from '@/components/WhatIfCalculator';
import ExportShare from '@/components/ExportShare';
import { useCalculatorState, Course, toLetterGrade, letterGradeToPercentage } from '@/hooks/useCalculatorState';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useIsMobile } from '@/hooks/use-mobile';

const LONG_PRESS_DELAY = 200; // ms

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
    restoreProfile,
    setActiveProfile,
    resetProfile,
    addCourse,
    updateCourse,
    deleteCourse,
    restoreCourse,
    addAssignment,
    updateAssignment,
    deleteAssignment,
    reorderCourses,
    reorderAssignments,
  } = useCalculatorState();

  const { user } = useAuth();
  const [newProfileName, setNewProfileName] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [targetGPA, setTargetGPA] = useState<number | null>(() => {
    const saved = localStorage.getItem('easygpa_target');
    return saved ? parseFloat(saved) : null;
  });

  const isMobile = useIsMobile();
  const [isDragEnabled, setIsDragEnabled] = useState<string | null>(null);
  const longPressTimerRef = useRef<NodeJS.Timeout | null>(null);
  
  // Sorting state
  type SortOption = 'default' | 'alphabetical' | 'grade' | 'credits';
  type SortDirection = 'asc' | 'desc';
  const [sortBy, setSortBy] = useState<SortOption>('default');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  
  // Mobile edit mode for easier dragging
  const [isEditMode, setIsEditMode] = useState(false);

  const handleDragHandlePointerDown = useCallback(
    (e: React.PointerEvent, id: string) => {
      // Prevent mobile text selection / callouts when long-pressing the handle
      e.preventDefault();
      e.stopPropagation();

      if (!isMobile) {
        // On desktop, enable drag immediately on handle
        setIsDragEnabled(id);
        return;
      }

      // On mobile, require long press on handle
      longPressTimerRef.current = setTimeout(() => {
        setIsDragEnabled(id);
      }, LONG_PRESS_DELAY);
    },
    [isMobile]
  );

  const handlePointerUp = useCallback(() => {
    // Only clear the long-press timer, don't disable drag yet
    // (drag end is handled by framer-motion internally)
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }
  }, []);

  const handleDragEnd = useCallback(() => {
    setIsDragEnabled(null);
  }, []);
  
  // Sorted courses
  const sortedCourses = useMemo(() => {
    if (!activeProfile) return [];
    if (sortBy === 'default') return activeProfile.courses;
    
    const courses = [...activeProfile.courses];
    
    courses.sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'alphabetical':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'grade':
          const gradeA = calculateCourseGPA(a).percentage || 0;
          const gradeB = calculateCourseGPA(b).percentage || 0;
          comparison = gradeA - gradeB;
          break;
        case 'credits':
          comparison = a.credits - b.credits;
          break;
      }
      
      return sortDirection === 'desc' ? -comparison : comparison;
    });
    
    return courses;
  }, [activeProfile, sortBy, sortDirection, calculateCourseGPA]);


  // Persist target GPA
  useEffect(() => {
    if (targetGPA !== null) {
      localStorage.setItem('easygpa_target', targetGPA.toString());
    } else {
      localStorage.removeItem('easygpa_target');
    }
  }, [targetGPA]);

  const handleSaveToDatabase = async () => {
    if (!user) {
      toast.error('Please sign in to save your GPA');
      return;
    }
    
    if (!activeProfile || activeProfile.courses.length === 0) {
      toast.error('Add some courses first');
      return;
    }

    setIsSaving(true);
    try {
      const gpa = calculateOverallGPA();
      const totalCredits = getTotalCredits();
      
      const { error } = await supabase.from('gpa_calculations').insert({
        user_id: user.id,
        gpa,
        total_credits: totalCredits,
        semester_name: activeProfile.name
      });

      if (error) throw error;
      toast.success('GPA saved to dashboard!');
    } catch (error) {
      console.error('Error saving GPA:', error);
      toast.error('Failed to save GPA');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCreateProfile = () => {
    if (!newProfileName.trim()) return;
    createProfile(newProfileName);
    setNewProfileName('');
    toast.success('Workspace created!');
  };

  const handleDeleteProfile = (id: string) => {
    if (!confirm('Delete this workspace?')) return;
    const deletedProfile = deleteProfile(id);
    if (deletedProfile) {
      toast.success('Workspace deleted', {
        action: {
          label: 'Undo',
          onClick: () => {
            restoreProfile(deletedProfile);
            toast.success('Workspace restored');
          },
        },
      });
    }
  };

  const handleResetProfile = () => {
    if (!activeProfile) return;
    if (!confirm('Reset all courses in this profile?')) return;
    resetProfile();
    toast.success('Profile reset');
  };

  const handleDeleteCourse = (courseId: string) => {
    const deletedCourse = deleteCourse(courseId);
    if (deletedCourse) {
      toast.success('Course deleted', {
        action: {
          label: 'Undo',
          onClick: () => {
            restoreCourse(deletedCourse);
            toast.success('Course restored');
          },
        },
      });
    }
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
              Track multiple workspaces, add assignments, and watch your GPA update in real-time.
            </p>
          </div>

          {/* GPA Summary Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl p-4 sm:p-6 mb-8 sm:mb-10 border border-border/30"
            style={{
              background: 'linear-gradient(135deg, hsl(var(--card)) 0%, hsl(var(--muted)) 40%, hsl(var(--primary) / 0.15) 100%)'
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
                      {activeProfile?.courses.length || 0} courses • {getTotalCredits()} credits
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
                  onClick={handleSaveToDatabase}
                  disabled={isSaving || !activeProfile}
                  className="border-primary/50 text-primary hover:bg-primary/10 text-xs sm:text-sm"
                >
                  {isSaving ? (
                    <Loader2 className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 animate-spin" />
                  ) : (
                    <Save className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                  )}
                  {isSaving ? 'Saving...' : 'Save'}
                </Button>
              </div>
            </div>
          </motion.div>

          {/* Goal Tracker + What-If + Export Row */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-10">
            <GPAGoalTracker 
              currentGPA={calculateOverallGPA()} 
              targetGPA={targetGPA}
              onSetTarget={setTargetGPA}
            />
            <WhatIfCalculator 
              currentGPA={calculateOverallGPA()} 
              totalCredits={getTotalCredits()} 
            />
            <ExportShare 
              profile={activeProfile}
              overallGPA={calculateOverallGPA()}
              totalCredits={getTotalCredits()}
              calculateCourseGPA={calculateCourseGPA}
            />
          </div>
          {/* Workspace Section */}
          <div className="mb-6 sm:mb-8">
            <h2 className="text-xs uppercase tracking-wider text-muted-foreground font-semibold mb-3 sm:mb-4">
              Workspace
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
                placeholder="New workspace name..."
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
              {/* Sort Controls & Edit Mode */}
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <ArrowUpDown className="w-4 h-4 text-muted-foreground" />
                  <Select
                    value={sortBy}
                    onValueChange={(value) => setSortBy(value as SortOption)}
                  >
                    <SelectTrigger className="w-[140px] sm:w-[160px] h-9 text-sm">
                      <SelectValue placeholder="Sort by..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="default">Default Order</SelectItem>
                      <SelectItem value="alphabetical">Alphabetical</SelectItem>
                      <SelectItem value="grade">Grade</SelectItem>
                      <SelectItem value="credits">Credits</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  {/* Sort Direction Toggle - only show when not default */}
                  {sortBy !== 'default' && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc')}
                      className="h-9 w-9"
                    >
                      {sortDirection === 'asc' ? (
                        <ArrowUp className="w-4 h-4" />
                      ) : (
                        <ArrowDown className="w-4 h-4" />
                      )}
                    </Button>
                  )}
                </div>
                
                {/* Mobile Edit Mode Toggle */}
                {isMobile && (
                  <Button
                    variant={isEditMode ? "default" : "outline"}
                    size="sm"
                    onClick={() => setIsEditMode(!isEditMode)}
                    className={`gap-2 ${isEditMode ? 'bg-primary text-primary-foreground' : ''}`}
                  >
                    {isEditMode ? (
                      <>
                        <Check className="w-4 h-4" />
                        Done
                      </>
                    ) : (
                      <>
                        <Pencil className="w-4 h-4" />
                        Edit
                      </>
                    )}
                  </Button>
                )}
              </div>

              <Reorder.Group
                axis="y"
                values={sortBy === 'default' ? activeProfile.courses : sortedCourses}
                onReorder={sortBy === 'default' ? reorderCourses : () => {}}
                className="space-y-4 sm:space-y-6"
                layoutScroll
              >
                {sortedCourses.map(course => {
                  const { percentage, gpa } = calculateCourseGPA(course);
                  
                  return (
                    <Reorder.Item
                      key={course.id}
                      value={course}
                      className={`rounded-2xl border overflow-hidden transition-all ${
                        isEditMode && isMobile 
                          ? 'border-primary/50 bg-primary/5' 
                          : 'border-border/50'
                      }`}
                      dragTransition={{ bounceStiffness: 300, bounceDamping: 25 }}
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      whileDrag={{ scale: 1.02, boxShadow: "0 10px 30px rgba(0,0,0,0.2)", zIndex: 50 }}
                      dragListener={sortBy === 'default' && (isEditMode || isDragEnabled === course.id)}
                      onDragEnd={handleDragEnd}
                    >
                      <motion.div layout="position">
                        {/* Course Header */}
                        <div className="p-3 sm:p-4 border-b border-border/30">
                          <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                            {/* Drag Handle - only show when sortBy is default and not mobile (use edit mode on mobile) */}
                            {sortBy === 'default' && (!isMobile || isEditMode) && (
                              <div
                                className={`cursor-grab active:cursor-grabbing touch-none select-none p-1.5 -m-1 rounded hover:bg-muted/50 transition-colors ${
                                  isEditMode ? 'text-primary bg-primary/10' : ''
                                }`}
                                onPointerDown={(e) => handleDragHandlePointerDown(e, course.id)}
                                onPointerUp={handlePointerUp}
                                onPointerCancel={handlePointerUp}
                                onContextMenu={(e) => e.preventDefault()}
                              >
                                <GripVertical className={`w-4 h-4 sm:w-5 sm:h-5 ${isEditMode ? 'text-primary' : 'text-muted-foreground'}`} />
                              </div>
                            )}
                            <button
                              onClick={() => updateCourse(course.id, { isCollapsed: !course.isCollapsed })}
                              className="text-muted-foreground hover:text-foreground transition-colors"
                            >
                              <ChevronDown className={`w-4 h-4 sm:w-5 sm:h-5 transition-transform ${course.isCollapsed ? '-rotate-90' : ''}`} />
                            </button>
                            <span className="text-[10px] sm:text-xs text-muted-foreground uppercase tracking-wider flex-1">Course Name</span>
                            
                            {/* Letter Grade Box */}
                            <div className="flex items-center gap-2">
                              {(course.inputMode || 'assignments') === 'letterGrade' ? (
                                <div className="flex items-center">
                                  <input
                                    type="text"
                                    value={course.manualGrade ?? ''}
                                    onChange={(e) => {
                                      const val = e.target.value;
                                      // First check if it's a letter grade
                                      const fromLetter = letterGradeToPercentage(val.toUpperCase());
                                      if (fromLetter !== undefined) {
                                        updateCourse(course.id, { manualGrade: fromLetter });
                                      } else {
                                        // Parse as number
                                        const num = parseFloat(val);
                                        if (!isNaN(num) && num >= 0 && num <= 100) {
                                          updateCourse(course.id, { manualGrade: num });
                                        } else if (val === '') {
                                          updateCourse(course.id, { manualGrade: undefined });
                                        }
                                      }
                                    }}
                                    className="w-14 sm:w-16 text-sm sm:text-base text-center px-2 py-1 rounded-l-lg bg-muted/50 border border-border/50 text-foreground"
                                    placeholder="%"
                                  />
                                  <div className="w-10 sm:w-12 text-sm sm:text-base text-center font-bold px-2 py-1 rounded-r-lg bg-primary/20 border-2 border-primary/40 text-primary border-l-0">
                                    {course.manualGrade !== undefined ? toLetterGrade(course.manualGrade) : '-'}
                                  </div>
                                </div>
                              ) : (
                                <div className="w-12 sm:w-14 text-sm sm:text-base text-center font-bold px-2 py-1 rounded-lg bg-primary/20 border-2 border-primary/40 text-primary">
                                  {percentage > 0 ? toLetterGrade(Math.round(percentage)) : '-'}
                                </div>
                              )}
                              <button
                                onClick={() => updateCourse(course.id, { 
                                  inputMode: (course.inputMode || 'assignments') === 'assignments' ? 'letterGrade' : 'assignments' 
                                })}
                                className={`flex items-center gap-1.5 px-2 py-1 rounded-lg transition-all duration-200 hover:scale-105 text-xs sm:text-sm ${
                                  (course.inputMode || 'assignments') === 'assignments' 
                                    ? 'bg-primary/20 text-primary border border-primary/30 hover:bg-primary/30' 
                                    : 'bg-muted/50 text-muted-foreground hover:text-foreground border border-border/30 hover:bg-muted'
                                }`}
                                title={(course.inputMode || 'assignments') === 'assignments' ? 'Using assignments' : 'Click to use assignments'}
                              >
                                <ListChecks className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                <span className="hidden sm:inline">
                                  {(course.inputMode || 'assignments') === 'assignments' ? 'Assignments' : 'Manual'}
                                </span>
                              </button>
                            </div>
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
                                      onChange={(e) => updateCourse(course.id, { credits: parseInt(e.target.value) || 0 })}
                                      min="0"
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

                                {(course.inputMode || 'assignments') === 'assignments' ? (
                                  /* Assignments Section */
                                  <div className="mb-4">
                                    <h3 className="text-[10px] sm:text-xs uppercase tracking-wider text-muted-foreground font-semibold mb-3 sm:mb-4">
                                      Assignments
                                    </h3>
                                    
                                    <Reorder.Group
                                      axis="y"
                                      values={course.assignments}
                                      onReorder={(newOrder) => reorderAssignments(course.id, newOrder)}
                                      className="space-y-3"
                                      layoutScroll
                                    >
                                      {course.assignments.map(assignment => (
                                        <Reorder.Item
                                          key={assignment.id}
                                          value={assignment}
                                          className={`flex flex-wrap items-center gap-2 sm:gap-3 p-3 sm:p-4 rounded-xl border bg-background/50 transition-all ${
                                            isEditMode && isMobile 
                                              ? 'border-primary/30' 
                                              : 'border-border/30'
                                          }`}
                                          dragTransition={{ bounceStiffness: 300, bounceDamping: 25 }}
                                          transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                          whileDrag={{ scale: 1.02, boxShadow: "0 8px 20px rgba(0,0,0,0.15)", zIndex: 10 }}
                                          dragListener={isEditMode || isDragEnabled === assignment.id}
                                          onDragEnd={handleDragEnd}
                                        >
                                          {/* Drag Handle */}
                                          <div
                                            className={`cursor-grab active:cursor-grabbing touch-none select-none p-1.5 -m-1 rounded hover:bg-muted/50 transition-colors ${
                                              isEditMode ? 'text-primary bg-primary/10' : ''
                                            }`}
                                            onPointerDown={(e) => !isEditMode && handleDragHandlePointerDown(e, assignment.id)}
                                            onPointerUp={handlePointerUp}
                                            onPointerCancel={handlePointerUp}
                                            onContextMenu={(e) => e.preventDefault()}
                                          >
                                            <GripVertical className={`w-4 h-4 flex-shrink-0 ${isEditMode ? 'text-primary' : 'text-muted-foreground'}`} />
                                          </div>
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
                                            onChange={(e) =>
                                              updateAssignment(course.id, assignment.id, {
                                                grade: e.target.value === '' ? null : parseFloat(e.target.value),
                                              })
                                            }
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
                                        </Reorder.Item>
                                      ))}
                                    </Reorder.Group>

                                    <button
                                      onClick={() => addAssignment(course.id)}
                                      className="w-full py-2.5 sm:py-3 rounded-xl border-2 border-dashed border-border/50 text-muted-foreground hover:border-primary/50 hover:text-foreground transition-colors flex items-center justify-center gap-2 text-sm sm:text-base mt-3"
                                    >
                                      <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
                                      Add Assignment
                                    </button>
                                  </div>
                                ) : null}

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
                                    <span className="font-medium text-primary">{gpa.toFixed(2)}</span>
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
