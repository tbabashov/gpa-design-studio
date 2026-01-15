import { Trophy, Star, Target, Award, Crown, Flame, BookOpen, GraduationCap, Sparkles, Medal, TrendingUp, Camera, Users, UserPlus, Heart } from 'lucide-react';

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: typeof Trophy;
  color: string;
  bgColor: string;
}

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first_calculation',
    name: 'Getting Started',
    description: 'Save your first GPA calculation',
    icon: Star,
    color: 'text-yellow-500',
    bgColor: 'bg-yellow-500/10',
  },
  {
    id: 'five_calculations',
    name: 'Consistent Tracker',
    description: 'Save 5 GPA calculations',
    icon: Target,
    color: 'text-blue-500',
    bgColor: 'bg-blue-500/10',
  },
  {
    id: 'ten_calculations',
    name: 'Dedicated Scholar',
    description: 'Save 10 GPA calculations',
    icon: BookOpen,
    color: 'text-purple-500',
    bgColor: 'bg-purple-500/10',
  },
  {
    id: 'gpa_3_0',
    name: 'Solid Foundation',
    description: 'Achieve a GPA of 3.0 or higher',
    icon: Medal,
    color: 'text-orange-500',
    bgColor: 'bg-orange-500/10',
  },
  {
    id: 'gpa_3_5',
    name: "Dean's List",
    description: 'Achieve a GPA of 3.5 or higher',
    icon: Award,
    color: 'text-emerald-500',
    bgColor: 'bg-emerald-500/10',
  },
  {
    id: 'gpa_4_0',
    name: 'Perfect Score',
    description: 'Achieve a perfect 4.0 GPA',
    icon: Crown,
    color: 'text-amber-500',
    bgColor: 'bg-amber-500/10',
  },
  {
    id: 'improvement',
    name: 'On The Rise',
    description: 'Improve your GPA from a previous calculation',
    icon: TrendingUp,
    color: 'text-green-500',
    bgColor: 'bg-green-500/10',
  },
  {
    id: 'streak_3',
    name: 'Hat Trick',
    description: 'Save calculations 3 days in a row',
    icon: Flame,
    color: 'text-red-500',
    bgColor: 'bg-red-500/10',
  },
  {
    id: 'consistent',
    name: 'Consistent',
    description: 'Log your GPA for 7 days total',
    icon: Target,
    color: 'text-teal-500',
    bgColor: 'bg-teal-500/10',
  },
  {
    id: 'profile_pro',
    name: 'Profile Pro',
    description: 'Set up your profile picture',
    icon: Camera,
    color: 'text-pink-500',
    bgColor: 'bg-pink-500/10',
  },
  {
    id: 'goal_setter',
    name: 'Goal Setter',
    description: 'Set a GPA goal in the calculator',
    icon: Target,
    color: 'text-cyan-500',
    bgColor: 'bg-cyan-500/10',
  },
  {
    id: 'semester_named',
    name: 'Organized Mind',
    description: 'Name a semester in your calculation',
    icon: GraduationCap,
    color: 'text-indigo-500',
    bgColor: 'bg-indigo-500/10',
  },
  {
    id: 'first_friend',
    name: 'First Friend',
    description: 'Add your first friend',
    icon: UserPlus,
    color: 'text-violet-500',
    bgColor: 'bg-violet-500/10',
  },
  {
    id: 'social_butterfly',
    name: 'Social Butterfly',
    description: 'Have 3 friends on your list',
    icon: Users,
    color: 'text-rose-500',
    bgColor: 'bg-rose-500/10',
  },
  {
    id: 'popular',
    name: 'Popular',
    description: 'Have 5 friends on your list',
    icon: Heart,
    color: 'text-fuchsia-500',
    bgColor: 'bg-fuchsia-500/10',
  },
];

export const getAchievementById = (id: string): Achievement | undefined => {
  return ACHIEVEMENTS.find(a => a.id === id);
};
