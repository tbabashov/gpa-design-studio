import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { motion } from 'framer-motion';
import { ArrowLeft, User, Calendar, Users, Trophy } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import Navbar from '@/components/Navbar';
import { AchievementBadge } from '@/components/AchievementBadge';
import { ACHIEVEMENTS, getAchievementById } from '@/lib/achievements';

interface FriendProfile {
  user_id: string;
  display_name: string | null;
  avatar_url: string | null;
  created_at: string;
}

interface GpaCalc {
  gpa: number;
  semester_name: string | null;
  created_at: string;
}

interface UserAchievement {
  achievement_id: string;
  unlocked_at: string;
}

const FriendProfilePage = () => {
  const { userId } = useParams<{ userId: string }>();
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<FriendProfile | null>(null);
  const [gpaHistory, setGpaHistory] = useState<GpaCalc[]>([]);
  const [achievements, setAchievements] = useState<UserAchievement[]>([]);
  const [friendCount, setFriendCount] = useState(0);
  const [isFriend, setIsFriend] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    if (user && userId) {
      fetchFriendData();
    }
  }, [user, userId]);

  const fetchFriendData = async () => {
    if (!user || !userId) return;
    setLoadingProfile(true);

    try {
      // Check if they are actually friends
      const { data: friendship } = await supabase
        .from('friends')
        .select('id')
        .eq('status', 'accepted')
        .or(`and(user_id.eq.${user.id},friend_id.eq.${userId}),and(user_id.eq.${userId},friend_id.eq.${user.id})`);

      if (!friendship || friendship.length === 0) {
        setIsFriend(false);
        setLoadingProfile(false);
        return;
      }
      setIsFriend(true);

      // Fetch profile, GPA history, achievements, friend count in parallel
      const [profileRes, gpaRes, achievementsRes, friendCountRes] = await Promise.all([
        supabase.from('profiles').select('user_id, display_name, avatar_url, created_at').eq('user_id', userId).maybeSingle(),
        supabase.from('gpa_calculations').select('gpa, semester_name, created_at').eq('user_id', userId).order('created_at', { ascending: true }),
        supabase.from('user_achievements').select('achievement_id, unlocked_at').eq('user_id', userId),
        supabase.from('friends').select('id', { count: 'exact', head: true }).eq('status', 'accepted').or(`user_id.eq.${userId},friend_id.eq.${userId}`),
      ]);

      setProfile(profileRes.data);
      setGpaHistory(gpaRes.data || []);
      setAchievements(achievementsRes.data || []);
      setFriendCount(friendCountRes.count || 0);
    } catch (error) {
      console.error('Error fetching friend profile:', error);
    } finally {
      setLoadingProfile(false);
    }
  };

  const handleNavigate = (section: string) => {
    if (section === 'home') navigate('/');
    else if (section === 'calculator') navigate('/calculator');
    else if (section === 'features') navigate('/features');
    else if (section === 'contact') navigate('/contact');
  };

  const getInitials = (name: string | null) => {
    if (!name) return '?';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  if (loading || loadingProfile) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) return null;

  if (!isFriend) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar onNavigate={handleNavigate} />
        <main className="container mx-auto px-6 pt-24 pb-12 max-w-4xl text-center">
          <p className="text-muted-foreground text-lg">You can only view profiles of your friends.</p>
          <Button onClick={() => navigate('/friends')} className="mt-4">Go to Friends</Button>
        </main>
      </div>
    );
  }

  const latestGpa = gpaHistory.length > 0 ? gpaHistory[gpaHistory.length - 1].gpa : null;
  const averageGpa = gpaHistory.length > 0
    ? (gpaHistory.reduce((sum, c) => sum + Number(c.gpa), 0) / gpaHistory.length).toFixed(2)
    : null;

  const chartData = gpaHistory.slice(-10).map((calc, index) => ({
    name: calc.semester_name || `Calc ${index + 1}`,
    gpa: Number(calc.gpa),
  }));

  const unlockedAchievements = achievements
    .map(a => ({ ...getAchievementById(a.achievement_id)!, unlocked_at: a.unlocked_at }))
    .filter(a => a.id);

  return (
    <div className="min-h-screen bg-background">
      <Navbar onNavigate={handleNavigate} />

      <main className="container mx-auto px-6 pt-24 pb-12 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Button variant="ghost" onClick={() => navigate('/friends')} className="mb-6 gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Friends
          </Button>

          {/* Profile Header */}
          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="flex items-center gap-5">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={profile?.avatar_url || undefined} />
                  <AvatarFallback className="text-2xl">{getInitials(profile?.display_name || null)}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h1 className="text-2xl font-bold text-foreground">{profile?.display_name || 'Anonymous'}</h1>
                  <div className="flex flex-wrap gap-4 mt-2 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      Joined {profile?.created_at ? new Date(profile.created_at).toLocaleDateString() : 'N/A'}
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      {friendCount} friend{friendCount !== 1 ? 's' : ''}
                    </span>
                    <span className="flex items-center gap-1">
                      <Trophy className="w-4 h-4" />
                      {achievements.length} achievement{achievements.length !== 1 ? 's' : ''}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Stats */}
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Latest GPA</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-4xl font-bold text-primary">
                  {latestGpa !== null ? Number(latestGpa).toFixed(2) : '-'}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Average GPA</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-4xl font-bold text-primary">
                  {averageGpa ?? '-'}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* GPA Chart */}
          {chartData.length > 0 && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>GPA Trend</CardTitle>
                <CardDescription>Last {chartData.length} calculations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                      <XAxis dataKey="name" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
                      <YAxis domain={[0, 4]} tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'hsl(var(--card))',
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px',
                        }}
                        labelStyle={{ color: 'hsl(var(--foreground))' }}
                      />
                      <Line type="monotone" dataKey="gpa" stroke="hsl(var(--primary))" strokeWidth={2} dot={{ fill: 'hsl(var(--primary))' }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Achievements */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="w-5 h-5" />
                Achievements ({unlockedAchievements.length}/{ACHIEVEMENTS.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {unlockedAchievements.length === 0 ? (
                <p className="text-muted-foreground text-center py-6">No achievements unlocked yet.</p>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {unlockedAchievements.map((a) => (
                    <div key={a.id} className={`flex flex-col items-center gap-2 p-3 rounded-lg ${a.bgColor}`}>
                      <a.icon className={`w-8 h-8 ${a.color}`} />
                      <span className="text-xs font-medium text-center text-foreground">{a.name}</span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </main>
    </div>
  );
};

export default FriendProfilePage;
