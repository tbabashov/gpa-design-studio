import { motion } from 'framer-motion';
import { Achievement } from '@/lib/achievements';
import { cn } from '@/lib/utils';
import { Lock } from 'lucide-react';

interface AchievementBadgeProps {
  achievement: Achievement;
  unlocked: boolean;
  unlockedAt?: string;
  isNew?: boolean;
  onClick?: () => void;
}

export function AchievementBadge({ 
  achievement, 
  unlocked, 
  unlockedAt,
  isNew,
  onClick 
}: AchievementBadgeProps) {
  const Icon = achievement.icon;

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={cn(
        "relative p-4 rounded-xl border cursor-pointer transition-all duration-300",
        unlocked 
          ? "bg-card border-border hover:border-primary/50 shadow-sm" 
          : "bg-muted/30 border-border/50 opacity-60"
      )}
      onClick={onClick}
    >
      {isNew && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs font-bold px-2 py-0.5 rounded-full"
        >
          NEW
        </motion.div>
      )}
      
      <div className="flex flex-col items-center text-center gap-3">
        <div className={cn(
          "w-14 h-14 rounded-full flex items-center justify-center",
          unlocked ? achievement.bgColor : "bg-muted"
        )}>
          {unlocked ? (
            <Icon className={cn("w-7 h-7", achievement.color)} />
          ) : (
            <Lock className="w-6 h-6 text-muted-foreground" />
          )}
        </div>
        
        <div>
          <h4 className={cn(
            "font-semibold text-sm",
            unlocked ? "text-foreground" : "text-muted-foreground"
          )}>
            {achievement.name}
          </h4>
          <p className="text-xs text-muted-foreground mt-1">
            {achievement.description}
          </p>
        </div>

        {unlocked && unlockedAt && (
          <p className="text-xs text-muted-foreground">
            {new Date(unlockedAt).toLocaleDateString()}
          </p>
        )}
      </div>
    </motion.div>
  );
}
