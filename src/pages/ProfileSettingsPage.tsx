import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { motion } from 'framer-motion';
import { User, Mail, Calendar, Settings, Save, ArrowLeft, Moon, Sun, Monitor } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useTheme } from '@/components/ThemeProvider';
import Navbar from '@/components/Navbar';
import { toast } from '@/hooks/use-toast';

const ProfileSettingsPage = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();
  const [displayName, setDisplayName] = useState('');
  const [saving, setSaving] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('display_name')
        .eq('user_id', user?.id)
        .maybeSingle();

      if (error) throw error;
      if (data?.display_name) {
        setDisplayName(data.display_name);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoadingProfile(false);
    }
  };

  const handleSaveProfile = async () => {
    if (!user) return;
    
    setSaving(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .upsert({
          user_id: user.id,
          display_name: displayName,
          updated_at: new Date().toISOString(),
        }, {
          onConflict: 'user_id'
        });

      if (error) throw error;

      toast({
        title: "Profile updated",
        description: "Your profile has been saved successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleNavigate = (section: string) => {
    if (section === 'home') navigate('/');
    else if (section === 'calculator') navigate('/calculator');
    else if (section === 'features') navigate('/features');
    else if (section === 'contact') navigate('/contact');
  };

  if (loading || loadingProfile) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background">
      <Navbar onNavigate={handleNavigate} />
      
      <main className="container mx-auto px-6 pt-24 pb-12 max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Button
            variant="ghost"
            onClick={() => navigate('/dashboard')}
            className="mb-6 gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Button>

          <h1 className="text-3xl font-bold text-foreground mb-8 flex items-center gap-3">
            <Settings className="w-8 h-8" />
            Profile Settings
          </h1>
          
          {/* Profile Info Card */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Personal Information
              </CardTitle>
              <CardDescription>Manage your profile details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="displayName">Display Name</Label>
                <Input
                  id="displayName"
                  placeholder="Enter your display name"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-2 text-muted-foreground">
                  <Mail className="w-4 h-4" />
                  Email
                </Label>
                <p className="text-sm text-foreground bg-muted/50 p-3 rounded-lg">
                  {user.email}
                </p>
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="w-4 h-4" />
                  Member Since
                </Label>
                <p className="text-sm text-foreground bg-muted/50 p-3 rounded-lg">
                  {new Date(user.created_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>

              <Button
                onClick={handleSaveProfile}
                disabled={saving}
                className="w-full gap-2"
              >
                <Save className="w-4 h-4" />
                {saving ? 'Saving...' : 'Save Changes'}
              </Button>
            </CardContent>
          </Card>

          {/* Appearance Card */}
          <Card>
            <CardHeader>
              <CardTitle>Appearance</CardTitle>
              <CardDescription>Customize how EasyGPA looks</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Label>Theme</Label>
                <div className="grid grid-cols-3 gap-3">
                  <Button
                    variant={theme === 'light' ? 'default' : 'outline'}
                    onClick={() => setTheme('light')}
                    className="flex flex-col gap-2 h-auto py-4"
                  >
                    <Sun className="w-5 h-5" />
                    <span className="text-xs">Light</span>
                  </Button>
                  <Button
                    variant={theme === 'dark' ? 'default' : 'outline'}
                    onClick={() => setTheme('dark')}
                    className="flex flex-col gap-2 h-auto py-4"
                  >
                    <Moon className="w-5 h-5" />
                    <span className="text-xs">Dark</span>
                  </Button>
                  <Button
                    variant={theme === 'system' ? 'default' : 'outline'}
                    onClick={() => setTheme('system')}
                    className="flex flex-col gap-2 h-auto py-4"
                  >
                    <Monitor className="w-5 h-5" />
                    <span className="text-xs">System</span>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </main>
    </div>
  );
};

export default ProfileSettingsPage;
