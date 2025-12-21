import { useState, useEffect, useCallback } from 'react';

export interface Assignment {
  id: string;
  name: string;
  grade: number;
  weight: number;
}

export interface Course {
  id: string;
  name: string;
  credits: number;
  assignments: Assignment[];
  isCollapsed: boolean;
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

const getInitialState = (): CalculatorState => {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch {
      return { profiles: [], activeProfileId: null };
    }
  }
  
  // Default state for preview
  const defaultProfile: Profile = {
    id: generateId(),
    name: 'Preview',
    courses: [
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
    ],
  };
  
  return { 
    profiles: [defaultProfile], 
    activeProfileId: defaultProfile.id 
  };
};

// Simple event emitter for cross-component sync
const listeners = new Set<(state: CalculatorState) => void>();

const notifyListeners = (state: CalculatorState) => {
  listeners.forEach(listener => listener(state));
};

export const useCalculatorState = () => {
  const [state, setStateInternal] = useState<CalculatorState>(getInitialState);

  const setState = useCallback((newState: CalculatorState | ((prev: CalculatorState) => CalculatorState)) => {
    setStateInternal(prev => {
      const nextState = typeof newState === 'function' ? newState(prev) : newState;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(nextState));
      notifyListeners(nextState);
      return nextState;
    });
  }, []);

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

  const getTotalCredits = useCallback(() => {
    if (!activeProfile) return 0;
    return activeProfile.courses.reduce((sum, c) => sum + c.credits, 0);
  }, [activeProfile]);

  const createProfile = useCallback((name: string) => {
    if (!name.trim()) return;
    
    const newProfile: Profile = {
      id: generateId(),
      name: name.trim(),
      courses: [],
    };
    
    setState(prev => ({
      profiles: [...prev.profiles, newProfile],
      activeProfileId: newProfile.id,
    }));
  }, [setState]);

  const deleteProfile = useCallback((id: string) => {
    setState(prev => ({
      profiles: prev.profiles.filter(p => p.id !== id),
      activeProfileId: prev.activeProfileId === id ? null : prev.activeProfileId,
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

  const deleteCourse = useCallback((courseId: string) => {
    setState(prev => ({
      ...prev,
      profiles: prev.profiles.map(p =>
        p.id === prev.activeProfileId
          ? { ...p, courses: p.courses.filter(c => c.id !== courseId) }
          : p
      ),
    }));
  }, [setState]);

  const addAssignment = useCallback((courseId: string) => {
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
    reorderAssignments,
  };
};
