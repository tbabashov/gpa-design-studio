import { motion } from 'framer-motion';
import { Trophy } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AchievementBadge } from './AchievementBadge';
import { useAchievements } from '@/hooks/useAchievements';
import { Skeleton } from '@/components/ui/skeleton';

export function AchievementsSection() {
  const { achievements, userAchievements, loading, markAsSeen } = useAchievements();

  const getUnlockedData = (achievementId: string) => {
    return userAchievements.find(ua => ua.achievement_id === achievementId);
  };

  const unlockedCount = userAchievements.length;
  const totalCount = achievements.length;

  if (loading) {
    return (
      <Card id="achievements">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-primary" />
            Achievements
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {Array.from({ length: 12 }).map((_, i) => (
              <Skeleton key={i} className="h-40 rounded-xl" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card id="achievements">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-primary" />
              Achievements
            </CardTitle>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span className="font-semibold text-foreground">{unlockedCount}</span>
              <span>/</span>
              <span>{totalCount}</span>
              <span>unlocked</span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {achievements.map((achievement) => {
              const unlockedData = getUnlockedData(achievement.id);
              const isUnlocked = !!unlockedData;
              const isNew = unlockedData && !unlockedData.seen;

              return (
                <AchievementBadge
                  key={achievement.id}
                  achievement={achievement}
                  unlocked={isUnlocked}
                  unlockedAt={unlockedData?.unlocked_at}
                  isNew={isNew}
                  onClick={() => {
                    if (isNew) {
                      markAsSeen(achievement.id);
                    }
                  }}
                />
              );
            })}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
