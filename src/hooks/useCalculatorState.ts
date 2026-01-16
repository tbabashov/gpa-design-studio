import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface Assignment {
  id: string;
  name: string;
  grade: number | null;
  weight: number;
}

export type CourseInputMode = 'assignments' | 'letterGrade';

export interface Course {
  id: string;
  name: string;
  credits: number;
  assignments: Assignment[];
  isCollapsed: boolean;
  inputMode: CourseInputMode;
  manualGrade?: number; // 0-100 percentage when using letterGrade mode
  manualLetterGrade?: string; // Direct letter grade entry (A, B+, C-, etc.)
}

export interface Profile {
  id: string;
  name: string;
  courses: Course[];
}

export interface CalculatorState {
  profiles: Profile[];
  activeProfileId: string | null;
}

const STORAGE_KEY = 'easygpa_state';
const SYNC_DEBOUNCE_MS = 1000;

const generateId = () => Math.random().toString(36).substring(2, 9);

export const toGPA = (p: number): number => {
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

export const toLetterGrade = (p: number): string => {
  if (p >= 94) return 'A';
  if (p >= 90) return 'A-';
  if (p >= 87) return 'B+';
  if (p >= 83) return 'B';
  if (p >= 80) return 'B-';
  if (p >= 77) return 'C+';
  if (p >= 73) return 'C';
  if (p >= 70) return 'C-';
  if (p >= 67) return 'D+';
  if (p >= 60) return 'D';
  return 'F';
};

export const letterGradeToPercentage = (letter: string): number | undefined => {
  const map: Record<string, number> = {
    'A': 97, 'A+': 97,
    'A-': 92,
    'B+': 89,
    'B': 85,
    'B-': 82,
    'C+': 78,
    'C': 75,
    'C-': 72,
    'D+': 68,
    'D': 65,
    'D-': 62,
    'F': 50,
  };
  return map[letter.toUpperCase()];
};

const getInitialState = (): CalculatorState => {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch {
      return { profiles: [], activeProfileId: null };
    }
  }
  
  // Start with empty state - no default workspaces
  return { profiles: [], activeProfileId: null };
};

// Simple event emitter for cross-component sync
const listeners = new Set<(state: CalculatorState) => void>();

const notifyListeners = (state: CalculatorState) => {
  listeners.forEach(listener => listener(state));
};

export const useCalculatorState = () => {
  const { user } = useAuth();
  const [state, setStateInternal] = useState<CalculatorState>(getInitialState);
  const [isLoading, setIsLoading] = useState(false);
  const syncTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const hasLoadedFromDbRef = useRef(false);

  // Sync state to database (debounced)
  const syncToDatabase = useCallback(async (stateToSync: CalculatorState) => {
    if (!user) return;
    
    try {
      // Check if record exists first
      const { data: existing } = await supabase
        .from('calculator_states')
        .select('id')
        .eq('user_id', user.id)
        .maybeSingle();
      
      if (existing) {
        // Update existing record
        await supabase
          .from('calculator_states')
          .update({ state: JSON.parse(JSON.stringify(stateToSync)) })
          .eq('user_id', user.id);
      } else {
        // Insert new record - use raw SQL approach via RPC or direct insert
        const { error } = await supabase.rpc('insert_calculator_state' as never, {
          p_user_id: user.id,
          p_state: JSON.parse(JSON.stringify(stateToSync)),
        } as never);
        
        // Fallback to direct insert if RPC doesn't exist
        if (error) {
          await supabase
            .from('calculator_states')
            .insert([{
              user_id: user.id,
              state: JSON.parse(JSON.stringify(stateToSync)),
            }] as never);
        }
      }
    } catch (err) {
      console.error('Error syncing to database:', err);
    }
  }, [user]);

  const setState = useCallback((newState: CalculatorState | ((prev: CalculatorState) => CalculatorState)) => {
    setStateInternal(prev => {
      const nextState = typeof newState === 'function' ? newState(prev) : newState;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(nextState));
      notifyListeners(nextState);
      
      // Debounced sync to database
      if (syncTimeoutRef.current) {
        clearTimeout(syncTimeoutRef.current);
      }
      syncTimeoutRef.current = setTimeout(() => {
        syncToDatabase(nextState);
      }, SYNC_DEBOUNCE_MS);
      
      return nextState;
    });
  }, [syncToDatabase]);

  // Load state from database on login
  useEffect(() => {
    const loadFromDatabase = async () => {
      if (!user || hasLoadedFromDbRef.current) return;
      
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('calculator_states')
          .select('state')
          .eq('user_id', user.id)
          .maybeSingle();
        
        if (error) {
          console.error('Error loading from database:', error);
          return;
        }
        
        if (data?.state) {
          const dbState = data.state as unknown as CalculatorState;
          setStateInternal(dbState);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(dbState));
          notifyListeners(dbState);
        } else {
          // No data in DB yet, sync current local state to DB
          const currentState = getInitialState();
          syncToDatabase(currentState);
        }
        
        hasLoadedFromDbRef.current = true;
      } catch (err) {
        console.error('Error loading from database:', err);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadFromDatabase();
  }, [user, syncToDatabase]);

  // Reset the loaded flag when user logs out
  useEffect(() => {
    if (!user) {
      hasLoadedFromDbRef.current = false;
    }
  }, [user]);

  useEffect(() => {
    const handleUpdate = (newState: CalculatorState) => {
      setStateInternal(newState);
    };
    
    listeners.add(handleUpdate);
    return () => {
      listeners.delete(handleUpdate);
    };
  }, []);

  // Sync from storage on mount and when storage changes
  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY && e.newValue) {
        try {
          const newState = JSON.parse(e.newValue);
          setStateInternal(newState);
        } catch {
          // ignore parse errors
        }
      }
    };
    
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const activeProfile = state.profiles.find(p => p.id === state.activeProfileId);

  const calculateCourseGPA = useCallback((course: Course) => {
    // If using manual letter grade mode
    if (course.inputMode === 'letterGrade') {
      // If user entered a letter grade directly, use its mapped percentage for GPA
      if (course.manualLetterGrade) {
        const percentage = letterGradeToPercentage(course.manualLetterGrade) ?? 0;
        return { percentage, gpa: toGPA(Math.round(percentage)), letterGrade: course.manualLetterGrade };
      }
      // Otherwise use the percentage they entered
      const percentage = course.manualGrade ?? 0;
      return { percentage, gpa: toGPA(Math.round(percentage)) };
    }
    
    // Assignment-based calculation
    if (course.assignments.length === 0) return { percentage: 0, gpa: 0 };
    
    const totalWeight = course.assignments.reduce((sum, a) => sum + (a.weight || 0), 0);
    if (totalWeight === 0) return { percentage: 0, gpa: 0 };
    
    const weightedSum = course.assignments.reduce((sum, a) => {
      return sum + (a.grade ?? 0) * (a.weight || 0) / 100;
    }, 0);
    
    const percentage = (weightedSum / totalWeight) * 100;
    const roundedPercentage = Math.round(percentage);
    return { percentage, gpa: toGPA(roundedPercentage) };
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

  const getTotalCredits = useCallback(() => {
    if (!activeProfile) return 0;
    return activeProfile.courses.reduce((sum, c) => sum + c.credits, 0);
  }, [activeProfile]);

  const createProfile = useCallback((name: string, initialCourses?: Course[]) => {
    if (!name.trim()) return;
    
    // Generate new IDs for courses if provided to avoid conflicts
    const coursesWithNewIds = initialCourses?.map(course => ({
      ...course,
      id: generateId(),
      assignments: course.assignments.map(a => ({
        ...a,
        id: generateId()
      }))
    })) || [];
    
    const newProfile: Profile = {
      id: generateId(),
      name: name.trim(),
      courses: coursesWithNewIds,
    };
    
    setState(prev => ({
      profiles: [...prev.profiles, newProfile],
      activeProfileId: newProfile.id,
    }));
  }, [setState]);

  const deleteProfile = useCallback((id: string): Profile | null => {
    // Find the profile BEFORE setState runs (state is synchronously available)
    const deletedProfile = state.profiles.find(p => p.id === id) || null;
    setState(prev => ({
      profiles: prev.profiles.filter(p => p.id !== id),
      activeProfileId: prev.activeProfileId === id ? null : prev.activeProfileId,
    }));
    return deletedProfile;
  }, [setState, state.profiles]);

  const restoreProfile = useCallback((profile: Profile) => {
    setState(prev => ({
      ...prev,
      profiles: [...prev.profiles, profile],
      activeProfileId: profile.id,
    }));
  }, [setState]);

  const setActiveProfile = useCallback((id: string) => {
    setState(prev => ({ ...prev, activeProfileId: id }));
  }, [setState]);

  const resetProfile = useCallback(() => {
    if (!activeProfile) return;
    
    setState(prev => ({
      ...prev,
      profiles: prev.profiles.map(p =>
        p.id === prev.activeProfileId
          ? { ...p, courses: [] }
          : p
      ),
    }));
  }, [activeProfile, setState]);

  const addCourse = useCallback(() => {
    if (!activeProfile) return;
    
  const newCourse: Course = {
      id: generateId(),
      name: '',
      credits: 6,
      assignments: [],
      isCollapsed: false,
      inputMode: 'assignments',
      manualGrade: undefined,
      manualLetterGrade: undefined,
    };
    
    setState(prev => ({
      ...prev,
      profiles: prev.profiles.map(p =>
        p.id === prev.activeProfileId
          ? { ...p, courses: [...p.courses, newCourse] }
          : p
      ),
    }));
  }, [activeProfile, setState]);

  const updateCourse = useCallback((courseId: string, updates: Partial<Course>) => {
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
  }, [setState]);

  const deleteCourse = useCallback((courseId: string): Course | null => {
    let deletedCourse: Course | null = null;
    setState(prev => {
      const profile = prev.profiles.find(p => p.id === prev.activeProfileId);
      deletedCourse = profile?.courses.find(c => c.id === courseId) || null;
      return {
        ...prev,
        profiles: prev.profiles.map(p =>
          p.id === prev.activeProfileId
            ? { ...p, courses: p.courses.filter(c => c.id !== courseId) }
            : p
        ),
      };
    });
    return deletedCourse;
  }, [setState]);

  const restoreCourse = useCallback((course: Course) => {
    setState(prev => ({
      ...prev,
      profiles: prev.profiles.map(p =>
        p.id === prev.activeProfileId
          ? { ...p, courses: [...p.courses, course] }
          : p
      ),
    }));
  }, [setState]);

  const addAssignment = useCallback((courseId: string) => {
    const newAssignment: Assignment = {
      id: generateId(),
      name: '',
      grade: null,
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
  }, [setState]);

  const updateAssignment = useCallback((courseId: string, assignmentId: string, updates: Partial<Assignment>) => {
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
  }, [setState]);

  const deleteAssignment = useCallback((courseId: string, assignmentId: string) => {
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
  }, [setState]);

  const reorderCourses = useCallback((newOrder: Course[]) => {
    setState(prev => ({
      ...prev,
      profiles: prev.profiles.map(p =>
        p.id === prev.activeProfileId
          ? { ...p, courses: newOrder }
          : p
      ),
    }));
  }, [setState]);

  const reorderAssignments = useCallback((courseId: string, newOrder: Assignment[]) => {
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
  }, [setState]);

  return {
    state,
    activeProfile,
    isLoading,
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
  };
};
