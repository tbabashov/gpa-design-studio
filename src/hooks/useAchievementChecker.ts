import { useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useAchievements } from './useAchievements';

export function useAchievementChecker() {
  const { user } = useAuth();
  const { unlockAchievement, hasAchievement } = useAchievements();

  const checkAchievements = useCallback(async () => {
    if (!user) return;

    try {
      // Fetch all calculations for the user
      const { data: calculations, error: calcError } = await supabase
        .from('gpa_calculations')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: true });

      if (calcError) throw calcError;

      // Fetch profile
      const { data: profile } = await supabase
        .from('profiles')
        .select('display_name')
        .eq('user_id', user.id)
        .maybeSingle();

      const calcCount = calculations?.length || 0;

      // Check calculation-based achievements
      if (calcCount >= 1 && !hasAchievement('first_calculation')) {
        await unlockAchievement('first_calculation');
      }
      if (calcCount >= 5 && !hasAchievement('five_calculations')) {
        await unlockAchievement('five_calculations');
      }
      if (calcCount >= 10 && !hasAchievement('ten_calculations')) {
        await unlockAchievement('ten_calculations');
      }

      // Check GPA-based achievements
      if (calculations && calculations.length > 0) {
        const gpas = calculations.map(c => Number(c.gpa));
        const maxGpa = Math.max(...gpas);

        if (maxGpa >= 3.0 && !hasAchievement('gpa_3_0')) {
          await unlockAchievement('gpa_3_0');
        }
        if (maxGpa >= 3.5 && !hasAchievement('gpa_3_5')) {
          await unlockAchievement('gpa_3_5');
        }
        if (maxGpa >= 4.0 && !hasAchievement('gpa_4_0')) {
          await unlockAchievement('gpa_4_0');
        }

        // Check improvement achievement
        if (calculations.length >= 2) {
          for (let i = 1; i < calculations.length; i++) {
            if (Number(calculations[i].gpa) > Number(calculations[i - 1].gpa)) {
              if (!hasAchievement('improvement')) {
                await unlockAchievement('improvement');
              }
              break;
            }
          }
        }

        // Check semester named achievement
        const hasNamedSemester = calculations.some(c => c.semester_name && c.semester_name.trim() !== '');
        if (hasNamedSemester && !hasAchievement('semester_named')) {
          await unlockAchievement('semester_named');
        }

        // Check streak achievement (3 days in a row)
        if (calculations.length >= 3) {
          const dates = calculations.map(c => new Date(c.created_at).toDateString());
          const uniqueDates = [...new Set(dates)];
          
          for (let i = 0; i < uniqueDates.length - 2; i++) {
            const d1 = new Date(uniqueDates[i]);
            const d2 = new Date(uniqueDates[i + 1]);
            const d3 = new Date(uniqueDates[i + 2]);
            
            const diff1 = Math.abs((d2.getTime() - d1.getTime()) / (1000 * 60 * 60 * 24));
            const diff2 = Math.abs((d3.getTime() - d2.getTime()) / (1000 * 60 * 60 * 24));
            
            if (diff1 <= 1 && diff2 <= 1 && !hasAchievement('streak_3')) {
              await unlockAchievement('streak_3');
              break;
            }
          }
        }
      }

      // Check profile achievement
      if (profile?.display_name && profile.display_name.trim() !== '' && !hasAchievement('first_profile')) {
        await unlockAchievement('first_profile');
      }

      // Check early bird achievement (joined within first month - January 2026)
      const joinDate = new Date(user.created_at);
      const launchDate = new Date('2026-01-01');
      const oneMonthLater = new Date('2026-02-01');
      if (joinDate >= launchDate && joinDate < oneMonthLater && !hasAchievement('early_bird')) {
        await unlockAchievement('early_bird');
      }

    } catch (error) {
      console.error('Error checking achievements:', error);
    }
  }, [user, unlockAchievement, hasAchievement]);

  return { checkAchievements };
}
