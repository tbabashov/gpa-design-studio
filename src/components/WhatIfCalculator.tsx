import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calculator, ChevronDown, HelpCircle, Lightbulb } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toGPA } from '@/hooks/useCalculatorState';

interface WhatIfCalculatorProps {
  currentGPA: number;
  totalCredits: number;
}

const WhatIfCalculator = ({ currentGPA, totalCredits }: WhatIfCalculatorProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [scenario, setScenario] = useState<'target' | 'course'>('target');
  
  // Target GPA scenario
  const [targetGPA, setTargetGPA] = useState('');
  const [newCredits, setNewCredits] = useState('');
  
  // Course grade scenario
  const [courseCredits, setCourseCredits] = useState('');
  const [currentCourseGrade, setCurrentCourseGrade] = useState('');
  const [remainingWeight, setRemainingWeight] = useState('');
  
  // Calculate required grade for target GPA
  const calculateRequiredGrade = () => {
    const target = parseFloat(targetGPA);
    const credits = parseFloat(newCredits);
    
    if (!target || !credits || credits <= 0) return null;
    
    const currentPoints = currentGPA * totalCredits;
    const totalNewCredits = totalCredits + credits;
    const requiredPoints = target * totalNewCredits;
    const neededPoints = requiredPoints - currentPoints;
    const requiredGPA = neededPoints / credits;
    
    if (requiredGPA > 4) return { achievable: false, required: requiredGPA };
    if (requiredGPA < 0) return { achievable: true, required: 0, message: 'Any grade will work!' };
    
    return { achievable: true, required: requiredGPA };
  };

  // Calculate required score on remaining work
  const calculateRequiredScore = () => {
    const current = parseFloat(currentCourseGrade);
    const remaining = parseFloat(remainingWeight);
    
    if (current === undefined || !remaining || remaining <= 0 || remaining > 100) return null;
    
    // Calculate required score for different letter grades
    const grades = [
      { letter: 'A', minPercent: 94 },
      { letter: 'A-', minPercent: 90 },
      { letter: 'B+', minPercent: 87 },
      { letter: 'B', minPercent: 83 },
      { letter: 'B-', minPercent: 80 },
      { letter: 'C+', minPercent: 77 },
      { letter: 'C', minPercent: 73 },
    ];
    
    const completedWeight = 100 - remaining;
    const currentWeightedPoints = current * (completedWeight / 100);
    
    return grades.map(g => {
      const needed = (g.minPercent - currentWeightedPoints) / (remaining / 100);
      return {
        ...g,
        required: Math.max(0, Math.ceil(needed)),
        achievable: needed <= 100
      };
    });
  };

  const targetResult = calculateRequiredGrade();
  const scoreResults = calculateRequiredScore();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl border border-border/50 overflow-hidden"
    >
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-4 sm:p-6 flex items-center justify-between bg-gradient-to-r from-secondary/10 to-tertiary/10 hover:from-secondary/15 hover:to-tertiary/15 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-secondary/20 flex items-center justify-center">
            <Calculator className="w-5 h-5 text-secondary" />
          </div>
          <div className="text-left">
            <h3 className="font-semibold text-sm sm:text-base">What-If Calculator</h3>
            <p className="text-xs text-muted-foreground">Explore grade scenarios</p>
          </div>
        </div>
        <ChevronDown className={`w-5 h-5 text-muted-foreground transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="p-4 sm:p-6 space-y-4">
              {/* Scenario Toggle */}
              <div className="flex gap-2 p-1 bg-muted/50 rounded-lg">
                <button
                  onClick={() => setScenario('target')}
                  className={`flex-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    scenario === 'target' 
                      ? 'bg-background text-foreground shadow-sm' 
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  Target GPA
                </button>
                <button
                  onClick={() => setScenario('course')}
                  className={`flex-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    scenario === 'course' 
                      ? 'bg-background text-foreground shadow-sm' 
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  Course Grade
                </button>
              </div>

              {scenario === 'target' ? (
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground flex items-start gap-2">
                    <HelpCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    What GPA do you need in upcoming courses to reach your target?
                  </p>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs text-muted-foreground block mb-1.5">Target GPA</label>
                      <input
                        type="number"
                        value={targetGPA}
                        onChange={(e) => setTargetGPA(e.target.value)}
                        placeholder="3.5"
                        min="0"
                        max="4"
                        step="0.01"
                        className="w-full px-3 py-2 rounded-lg bg-muted/50 border border-border/50 text-foreground focus:outline-none focus:border-primary/50 text-sm"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-muted-foreground block mb-1.5">New Credits</label>
                      <input
                        type="number"
                        value={newCredits}
                        onChange={(e) => setNewCredits(e.target.value)}
                        placeholder="15"
                        min="1"
                        className="w-full px-3 py-2 rounded-lg bg-muted/50 border border-border/50 text-foreground focus:outline-none focus:border-primary/50 text-sm"
                      />
                    </div>
                  </div>

                  {targetResult && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`p-4 rounded-xl ${
                        targetResult.achievable 
                          ? 'bg-primary/10 border border-primary/20' 
                          : 'bg-destructive/10 border border-destructive/20'
                      }`}
                    >
                      <div className="flex items-start gap-2">
                        <Lightbulb className={`w-5 h-5 mt-0.5 ${targetResult.achievable ? 'text-primary' : 'text-destructive'}`} />
                        <div>
                          {targetResult.achievable ? (
                            <>
                              <p className="font-medium text-sm">
                                {targetResult.message || `You need a ${targetResult.required.toFixed(2)} GPA`}
                              </p>
                              <p className="text-xs text-muted-foreground mt-1">
                                in your next {newCredits} credits to reach {targetGPA}
                              </p>
                            </>
                          ) : (
                            <>
                              <p className="font-medium text-sm text-destructive">Not achievable</p>
                              <p className="text-xs text-muted-foreground mt-1">
                                Would require a {targetResult.required.toFixed(2)} GPA, which is above 4.0
                              </p>
                            </>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground flex items-start gap-2">
                    <HelpCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    What score do you need on remaining work to get your desired grade?
                  </p>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs text-muted-foreground block mb-1.5">Current Grade (%)</label>
                      <input
                        type="number"
                        value={currentCourseGrade}
                        onChange={(e) => setCurrentCourseGrade(e.target.value)}
                        placeholder="85"
                        min="0"
                        max="100"
                        className="w-full px-3 py-2 rounded-lg bg-muted/50 border border-border/50 text-foreground focus:outline-none focus:border-primary/50 text-sm"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-muted-foreground block mb-1.5">Remaining Weight (%)</label>
                      <input
                        type="number"
                        value={remainingWeight}
                        onChange={(e) => setRemainingWeight(e.target.value)}
                        placeholder="30"
                        min="1"
                        max="100"
                        className="w-full px-3 py-2 rounded-lg bg-muted/50 border border-border/50 text-foreground focus:outline-none focus:border-primary/50 text-sm"
                      />
                    </div>
                  </div>

                  {scoreResults && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-2"
                    >
                      {scoreResults.slice(0, 5).map((result) => (
                        <div
                          key={result.letter}
                          className={`flex items-center justify-between p-3 rounded-lg ${
                            result.achievable 
                              ? 'bg-muted/50' 
                              : 'bg-destructive/5 text-muted-foreground'
                          }`}
                        >
                          <span className="font-medium text-sm">For {result.letter}:</span>
                          <span className={`text-sm ${result.achievable ? '' : 'line-through'}`}>
                            {result.achievable ? `Need ${result.required}%` : 'Not possible'}
                          </span>
                        </div>
                      ))}
                    </motion.div>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default WhatIfCalculator;
