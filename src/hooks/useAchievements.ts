import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { ACHIEVEMENTS, getAchievementById, Achievement } from '@/lib/achievements';
import { toast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

interface UserAchievement {
  id: string;
  achievement_id: string;
  unlocked_at: string;
  seen: boolean;
}

export function useAchievements() {
  const { user } = useAuth();
  const [userAchievements, setUserAchievements] = useState<UserAchievement[]>([]);
  const [loading, setLoading] = useState(true);
  const [newAchievement, setNewAchievement] = useState<Achievement | null>(null);

  const fetchAchievements = useCallback(async () => {
    if (!user) {
      setUserAchievements([]);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('user_achievements')
        .select('*')
        .eq('user_id', user.id);

      if (error) throw error;
      setUserAchievements(data || []);
    } catch (error) {
      console.error('Error fetching achievements:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchAchievements();
  }, [fetchAchievements]);

  const unlockAchievement = useCallback(async (achievementId: string) => {
    if (!user) return false;

    // Check if already unlocked
    const alreadyUnlocked = userAchievements.some(a => a.achievement_id === achievementId);
    if (alreadyUnlocked) return false;

    try {
      const { error } = await supabase
        .from('user_achievements')
        .insert({
          user_id: user.id,
          achievement_id: achievementId,
          seen: false,
        });

      if (error) {
        // Ignore duplicate key errors (already unlocked)
        if (error.code === '23505') return false;
        throw error;
      }

      const achievement = getAchievementById(achievementId);
      if (achievement) {
        setNewAchievement(achievement);
        
        // Show toast notification
        toast({
          title: "🏆 Achievement Unlocked!",
          description: `${achievement.name} - ${achievement.description}`,
        });
      }

      // Refresh achievements list
      await fetchAchievements();
      return true;
    } catch (error) {
      console.error('Error unlocking achievement:', error);
      return false;
    }
  }, [user, userAchievements, fetchAchievements]);

  const markAsSeen = useCallback(async (achievementId: string) => {
    if (!user) return;

    try {
      await supabase
        .from('user_achievements')
        .update({ seen: true })
        .eq('user_id', user.id)
        .eq('achievement_id', achievementId);

      setUserAchievements(prev =>
        prev.map(a =>
          a.achievement_id === achievementId ? { ...a, seen: true } : a
        )
      );
    } catch (error) {
      console.error('Error marking achievement as seen:', error);
    }
  }, [user]);

  const clearNewAchievement = useCallback(() => {
    setNewAchievement(null);
  }, []);

  const hasAchievement = useCallback((achievementId: string) => {
    return userAchievements.some(a => a.achievement_id === achievementId);
  }, [userAchievements]);

  const getUnseenCount = useCallback(() => {
    return userAchievements.filter(a => !a.seen).length;
  }, [userAchievements]);

  return {
    achievements: ACHIEVEMENTS,
    userAchievements,
    loading,
    newAchievement,
    unlockAchievement,
    markAsSeen,
    clearNewAchievement,
    hasAchievement,
    getUnseenCount,
    refetch: fetchAchievements,
  };
}
