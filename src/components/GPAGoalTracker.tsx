import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Target, TrendingUp, Edit2, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface GPAGoalTrackerProps {
  currentGPA: number;
  targetGPA: number | null;
  onSetTarget: (target: number | null) => void;
}

const GPAGoalTracker = ({ currentGPA, targetGPA, onSetTarget }: GPAGoalTrackerProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState(targetGPA?.toString() || '');

  useEffect(() => {
    setInputValue(targetGPA?.toString() || '');
  }, [targetGPA]);

  const progress = targetGPA ? Math.min((currentGPA / targetGPA) * 100, 100) : 0;
  const remaining = targetGPA ? Math.max(targetGPA - currentGPA, 0) : 0;
  const isGoalMet = targetGPA && currentGPA >= targetGPA;

  const handleSave = () => {
    const value = parseFloat(inputValue);
    if (value && value >= 0 && value <= 4) {
      onSetTarget(value);
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setInputValue(targetGPA?.toString() || '');
    setIsEditing(false);
  };

  const handleClear = () => {
    onSetTarget(null);
    setInputValue('');
    setIsEditing(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl p-4 sm:p-6 border border-border/50"
      style={{
        background: isGoalMet 
          ? 'linear-gradient(135deg, hsl(var(--primary) / 0.15) 0%, hsl(var(--secondary) / 0.1) 100%)'
          : 'linear-gradient(135deg, hsl(var(--muted)) 0%, hsl(var(--card)) 100%)'
      }}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
            isGoalMet ? 'bg-primary/30' : 'bg-muted'
          }`}>
            <Target className={`w-5 h-5 ${isGoalMet ? 'text-primary' : 'text-muted-foreground'}`} />
          </div>
          <div>
            <h3 className="font-semibold text-sm sm:text-base">GPA Goal</h3>
            <p className="text-xs text-muted-foreground">
              {isGoalMet ? '🎉 Goal achieved!' : targetGPA ? `${remaining.toFixed(2)} points to go` : 'Set a target'}
            </p>
          </div>
        </div>

        {!isEditing ? (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsEditing(true)}
            className="text-muted-foreground hover:text-foreground"
          >
            <Edit2 className="w-4 h-4" />
          </Button>
        ) : null}
      </div>

      {isEditing ? (
        <div className="flex items-center gap-2">
          <input
            type="number"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="e.g. 3.5"
            min="0"
            max="4"
            step="0.01"
            className="flex-1 px-3 py-2 rounded-lg bg-background border border-border text-foreground focus:outline-none focus:border-primary/50 text-sm"
            autoFocus
          />
          <Button size="sm" onClick={handleSave} className="bg-primary hover:bg-primary/90">
            <Check className="w-4 h-4" />
          </Button>
          <Button size="sm" variant="ghost" onClick={handleCancel}>
            <X className="w-4 h-4" />
          </Button>
          {targetGPA && (
            <Button size="sm" variant="destructive" onClick={handleClear} className="text-xs">
              Clear
            </Button>
          )}
        </div>
      ) : (
        <>
          {targetGPA ? (
            <>
              <div className="flex items-baseline gap-2 mb-3">
                <span className="text-2xl sm:text-3xl font-bold gradient-text">{targetGPA.toFixed(2)}</span>
                <span className="text-muted-foreground text-sm">target</span>
              </div>
              
              {/* Progress bar */}
              <div className="relative h-3 bg-muted rounded-full overflow-hidden mb-2">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.8, ease: 'easeOut' }}
                  className={`absolute inset-y-0 left-0 rounded-full ${
                    isGoalMet 
                      ? 'bg-gradient-to-r from-primary to-secondary' 
                      : 'bg-gradient-to-r from-primary/70 to-secondary/70'
                  }`}
                />
              </div>
              
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Current: {currentGPA.toFixed(2)}</span>
                <span>{progress.toFixed(0)}%</span>
              </div>
            </>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="w-full py-3 rounded-xl border-2 border-dashed border-border/50 text-muted-foreground hover:border-primary/50 hover:text-foreground transition-colors text-sm"
            >
              + Set a GPA Goal
            </button>
          )}
        </>
      )}
    </motion.div>
  );
};

export default GPAGoalTracker;
